// Generate painted realm backdrops for every project through the Codex CLI's
// built-in image generation. Output: public/test/covers/gen/<slug>-<realm>.png
// Skips files that already exist. Usage: node scripts/codex-generate-covers.mjs [concurrency] [slug...]
import {spawn} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {projects} from './test-portfolio-content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = root + 'public/test/covers/gen/';
mkdirSync(outDir, {recursive: true});

const realmPrompt = {
  hueco: 'Bleach TYBW-style anime background painting of Hueco Mundo: endless white mineral desert under a black-teal night sky, a thin white crescent moon high right, pale quartz towers or a domed palace far on the horizon, one dead white tree allowed. Palette: charcoal, silver, bone white, one cold accent.',
  seireitei: 'Bleach TYBW-style anime background painting of the Seireitei in bright daylight: white plaster walls and dark tiled roofs stepping down a hill, a big blue sky with soft cumulus clouds, a tall white tower far away. Palette: white, sky blue, navy, one warm accent.'
};

// One focal object per project. It stands for the product; the realm stays the realm.
const focal = {
  justhireme: 'three paper job cards fanned on a stone plinth, the top one lit from within, thin glowing white threads connecting them like spirit energy',
  svara: 'a long sound wave carved as a glowing ridge in the sand, rising and falling like a heartbeat, with a single brush-ink cursor mark at its end',
  odeon: 'a ring of standing stones forming a loop with three lit markers, a faint circular path worn into the ground between them',
  dreamer: 'an open scroll on a low wooden table, a second translucent glowing page hovering above it with an ink brush resting beside',
  'deep-researcher': 'a heavy ledger book open on a rock, glowing quotation marks rising from its pages like sparks',
  waldo: 'a tall stack of paper documents, one page with a table and a small bar chart pulled out and lit from within',
  socratis: 'a paper shoji screen with a single brush-ink code glyph on it, beside a small floating orb of light shaped like a voice',
  forge: 'nine small stone lanterns in a chain along a path, the fifth one brighter than the rest',
  'justhireme-ios': 'a single tall paper talisman shaped like a phone standing upright in the sand, three small cards glowing inside it',
  vaani: 'a black jigokucho hell butterfly resting on an old white telephone handset, faint sound rings in the air around it',
  branchgpt: 'a bare white tree whose trunk splits into two branches that curve back and rejoin above',
  mapmyrepo: 'a constellation of small stones on the ground connected by thin glowing lines, one larger stone at the centre',
  leetbot: 'a paper lantern hanging from a post, a small glowing diagram of nodes showing through its paper',
  sss: 'a grid of small framed pictures laid flat on the ground, one of them lit by a circle of light',
  'ori-no-michi': 'a large white paper crane mid-fold on a stone, its crease lines glowing faintly',
  learnai: 'an open book with two facing pages on a stone step, a small orb of light hovering above one page',
  estimateio: 'a tiny toy bus beside an enormous whale silhouette drawn in glowing light across the dune',
  reiatsu: 'drifting ribbons of pale light flowing low over the ground, a single bright disc of light hovering above',
  asciirealtime: 'a hanging cloth banner with a face rendered entirely out of tiny glyph-like marks',
  pixelforge: 'a mosaic of square stone tiles half assembled into a picture, loose tiles scattered beside it',
  gitart: 'a field of small square stones laid in a grid, some of them glowing to form a simple shape',
  habiturtle: 'a small turtle on a flat rock, a streak of lit stepping stones trailing behind it',
  'maze-pathfinder': 'a stone maze seen from a raised angle with one path glowing through it',
  holeemall: 'a perfectly round black hole in the sand swallowing small pale orbs that drift toward it'
};

const rules = 'Focal object right of centre and at most a third of the frame. Cel-shaded shapes, painted gradients, subtle white reiatsu glow where the object meets the ground. No characters, no people, no text, no letters, no numbers, no UI screenshots, no logos, no watermark, no lens flare, no photoreal render. Keep the bottom-left third of the frame quiet and empty for a title. Landscape 1536x1024.';

const args = process.argv.slice(2);
const concurrency = Number(args[0]) || 3;
const only = args.slice(1);
const jobs = [];
for (const p of projects) for (const realm of ['hueco', 'seireitei']) {
  if (only.length && !only.includes(p.slug)) continue;
  const file = `${p.slug}-${realm}.png`;
  if (existsSync(outDir + file) || existsSync(outDir + file.replace(/\.png$/, '.webp'))) continue;
  if (!focal[p.slug]) throw new Error(`No focal object for ${p.slug}`);
  jobs.push({slug: p.slug, realm, file, prompt: `${realmPrompt[realm]} Focal object: ${focal[p.slug]}. ${rules}`});
}
console.log(`${jobs.length} covers to generate, ${concurrency} at a time.`);

function run(job) {
  return new Promise(resolve => {
    const rel = `public/test/covers/gen/${job.file}`;
    const instruction = `Use your built-in image generation tool to create ONE image and save it as ${rel}. Do not write code and do not edit any other file. Image prompt: ${job.prompt} When done, reply with just the saved file path.`;
    // The prompt goes over stdin; the argv stays short and shell-safe (the npm shim needs a shell on Windows).
    const child = spawn('codex', ['exec', '--skip-git-repo-check', '-C', JSON.stringify(root), '-s', 'workspace-write', '-m', 'gpt-5.5', '--enable', 'image_generation', '-'], {cwd: root, shell: true, stdio: ['pipe', 'pipe', 'pipe']});
    child.stdin.end(instruction);
    let out = '';
    child.stdout.on('data', d => out += d);
    child.stderr.on('data', d => out += d);
    child.on('close', () => {
      const ok = existsSync(outDir + job.file);
      console.log(`${ok ? 'done' : 'FAILED'}  ${job.file}${ok ? '' : '\n' + out.split('\n').filter(l => l.includes('ERROR')).slice(0, 2).join('\n')}`);
      resolve(ok);
    });
  });
}

let index = 0, failed = 0;
async function worker() {
  while (index < jobs.length) {
    const job = jobs[index++];
    if (!(await run(job))) failed++;
  }
}
await Promise.all(Array.from({length: Math.min(concurrency, jobs.length)}, worker));
console.log(`Finished. ${jobs.length - failed} generated, ${failed} failed.`);
process.exit(failed ? 1 : 0);
