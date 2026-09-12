// Paint each project's real interface inside its realm, through the Codex CLI image tool.
// Where public/test/covers/ui/<slug>-ref.png exists it is attached as the visual reference and the
// prompt asks for a faithful reproduction of that screen. Otherwise the interface is described.
// Output: public/test/covers/ui/<slug>-<realm>.png   Usage: node scripts/codex-ui-covers.mjs [concurrency] [slug...]
import {spawn} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {projects} from './test-portfolio-content.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = root + 'public/test/covers/ui/';
mkdirSync(dir, {recursive: true});

const realm = {
  hueco: 'A Bleach TYBW-style anime scene set in Hueco Mundo: white mineral desert at night under a black-teal sky with a thin white crescent moon, pale quartz spires on the horizon. The screen emits soft white reiatsu light onto the sand.',
  seireitei: 'A Bleach TYBW-style anime scene set in the Seireitei in bright daylight: a white-walled courtyard with dark tiled roofs stepping down a hill, big blue sky with soft clouds, a tall white tower far away. The screen catches the daylight and casts a soft glow on the stone floor.'
};

// For projects with no captured screen, describe the real interface from the codebase.
const described = {
  branchgpt: 'a dark chat web app for branching AI conversations: a left sidebar showing a conversation tree with a main thread and two forked branches drawn as connected nodes, a centre chat thread with user and assistant messages, and a "Merge branch" button that summarises a branch back into the main thread',
  'deep-researcher': 'a dark web dashboard for a research engine: a left column listing research runs with progress bars, a centre report with a title and paragraphs carrying small numbered citation chips, and a right-hand "claim ledger" panel where each claim shows a quoted passage, its source page, and a verified checkmark',
  waldo: 'a split web app: on the left a PDF page viewer showing a document with a data table and a bar chart, on the right a chat panel with a user question and an answer that cites "Table 2, page 4" and shows a thumbnail of the chart',
  socratis: 'a coding-interview web app: a dark code editor on the left with a JavaScript function and line numbers, a right rail with a glowing voice-agent orb, a live transcript, and a small radar chart of interview scores',
  forge: 'a terminal window running a Claude Code session: monospace lines showing forge skills chaining "understand → brainstorm → architect → plan → tdd → debug → review → verify → ship", a failing test printed in red then passing in green, and a small side panel with a code dependency graph',
  sss: 'a desktop tool with a grid of screenshot thumbnails, each tagged with a category label like anime, tech, hiring, finance, learning, and a right-hand markdown notes panel listing links extracted from one selected image',
  habiturtle: 'a small PyQt desktop window: a list of daily habits with checkboxes, streak counters with flame icons, and a cute cartoon turtle mascot in the corner that looks happy',
  'maze-pathfinder': 'a Pygame window with a grid maze: walls in dark blocks, cells explored by BFS in blue, DFS in red, Dijkstra in green, A* in yellow, and the final shortest path in orange, with a small legend',
  holeemall: 'a Pygame arcade window: a dark playfield with a large round black hole in the middle, small pale orbs scattered around, a countdown "00:27" top right and a score top left',
  gitart: 'a web page with a GitHub-style contribution grid canvas (7 rows of small squares, some painted in shades of green forming a shape), a colour picker for the shades, and a "Download repo.zip" button',
  learnai: 'a documentation website: a left sidebar of AI topics, a centre lesson about embeddings with a paragraph of text, an interactive scatter-plot playground of word points, a short quiz card, and an audio lesson player bar',
  estimateio: 'a playful browser game: a flat cartoon bus and an enormous whale silhouette standing on a shared baseline, a size slider, a prompt "How big is a blue whale next to a bus?", and a score chip showing the percentage error',
  asciirealtime: 'a browser page where a live webcam feed of a person is rendered entirely as ASCII characters in green-white monospace text, with palette toggle buttons (Basic, Extended, Blocks, Emoji) and a background-segmentation switch'
};

const style = 'Render the interface as clean anime-style UI with legible shapes and crisp panels. The screen is a large, slightly angled screen standing in the scene, centred a little right, filling about sixty percent of the frame, with the realm visible around it. No characters, no people, no extra text beyond what belongs to the interface, no logos, no lens flare, no photoreal render. Landscape 1536x1024.';

const args = process.argv.slice(2);
const concurrency = Number(args[0]) || 3;
const only = args.slice(1);
const jobs = [];
for (const p of projects) for (const r of ['hueco', 'seireitei']) {
  if (only.length && !only.includes(p.slug)) continue;
  const file = `${p.slug}-${r}.png`;
  if (existsSync(dir + file) || existsSync(dir + file.replace(/\.png$/, '.webp'))) continue;
  const ref = existsSync(dir + `${p.slug}-ref.png`) ? `public/test/covers/ui/${p.slug}-ref.png` : null;
  if (!ref && !described[p.slug]) throw new Error(`No reference or description for ${p.slug}`);
  const subject = ref
    ? 'The subject is the software interface in the attached screenshot, reproduced faithfully: same layout, same panels, same cards and rows, same colours and proportions. Do not invent a different app.'
    : `The subject is ${described[p.slug]}.`;
  jobs.push({file, ref, prompt: `${realm[r]} ${subject} ${style}`});
}
console.log(`${jobs.length} UI covers to generate, ${concurrency} at a time.`);

function run(job) {
  return new Promise(resolve => {
    const instruction = `Use your built-in image generation tool${job.ref ? ', with the attached screenshot as the visual reference,' : ''} to create ONE image and save it as public/test/covers/ui/${job.file}. Do not write code and do not edit any other file. Image prompt: ${job.prompt} When done, reply with just the saved file path.`;
    const argv = ['exec', '--skip-git-repo-check', '-C', JSON.stringify(root), '-s', 'workspace-write', '-m', 'gpt-5.5', '--enable', 'image_generation'];
    if (job.ref) argv.push('-i', job.ref);
    argv.push('-');
    const child = spawn('codex', argv, {cwd: root, shell: true, stdio: ['pipe', 'pipe', 'pipe']});
    child.stdin.end(instruction);
    let out = '';
    child.stdout.on('data', d => out += d);
    child.stderr.on('data', d => out += d);
    child.on('close', () => {
      const ok = existsSync(dir + job.file);
      console.log(`${ok ? 'done' : 'FAILED'}  ${job.file}${ok ? '' : '\n' + out.split('\n').filter(l => /ERROR/.test(l)).slice(0, 3).join('\n')}`);
      resolve(ok);
    });
  });
}

let index = 0, failed = 0;
async function worker() { while (index < jobs.length) { if (!(await run(jobs[index++]))) failed++; } }
await Promise.all(Array.from({length: Math.min(concurrency, jobs.length)}, worker));
console.log(`Finished. ${jobs.length - failed} generated, ${failed} failed.`);
process.exit(failed ? 1 : 0);
