// Scene covers: the approved realm paintings, a title card set in the page's own
// fonts, and one glowing ink motif per project. Rendered in a real browser so
// Bleach Display and Geist are used, then saved as WebP.
//
//   PLAYWRIGHT_MODULE=<path to playwright> node scripts/build-scene-covers.mjs
//
import {createRequire} from 'node:module';
import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {projects, COVER_VERSION} from './test-portfolio-content.mjs';

const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const url = rel => pathToFileURL(root + rel).href;

// Realm palettes for type and ink. Hueco: white ink on night. Seireitei: navy ink on daylight.
const realms = {
  hueco: {ink:'#f4f3ee', dim:'rgba(244,243,238,.72)', glow:'rgba(214,232,255,.55)', scrim:'linear-gradient(180deg,rgba(8,9,10,.05) 30%,rgba(8,9,10,.72) 100%),linear-gradient(90deg,rgba(8,9,10,.55),rgba(8,9,10,0) 55%)'},
  seireitei: {ink:'#172d45', dim:'rgba(23,45,69,.72)', glow:'rgba(255,255,255,.9)', scrim:'linear-gradient(180deg,rgba(244,246,245,.0) 35%,rgba(244,246,245,.78) 100%),linear-gradient(90deg,rgba(244,246,245,.62),rgba(244,246,245,0) 58%)'}
};

// One backdrop crop per project so no two covers share the same sky.
// pos = object-position, zoom = scale. Seireitei has one painting, so crops vary more.
const scenes = {
  justhireme:      {hueco:['hueco-mundo-palace-v16', '50% 60%', 1.05], sei:['30% 40%', 1.15], tint:'#2f6f68'},
  svara:           {hueco:['hueco-reference-moon-v27', '70% 30%', 1.1], sei:['60% 10%', 1.3], tint:'#3d5c7a'},
  odeon:           {hueco:['hueco-mundo-crescent-v11', '60% 45%', 1.05], sei:['80% 50%', 1.25], tint:'#8a5a24'},
  dreamer:         {hueco:['hueco-mundo-night-v4', '40% 55%', 1.05], sei:['20% 25%', 1.35], tint:'#4a3f7a'},
  'deep-researcher':{hueco:['hueco-mundo-quartz-v18', '75% 55%', 1.05], sei:['90% 60%', 1.4], tint:'#2d5a6b'},
  waldo:           {hueco:['hueco-mundo-night-v2', '60% 50%', 1.05], sei:['50% 70%', 1.5], tint:'#6b4a2d'},
  socratis:        {hueco:['hueco-mundo-side-v17', '65% 50%', 1.05], sei:['70% 30%', 1.2], tint:'#5a2d3f'},
  forge:           {hueco:['hueco-charcoal-v24', '70% 60%', 1.05], sei:['15% 60%', 1.45], tint:'#5c4a1f'},
  'justhireme-ios':{hueco:['hueco-mundo-anime-v19', '80% 50%', 1.05], sei:['85% 20%', 1.3], tint:'#2f6f68'},
  vaani:           {hueco:['hueco-night-sky-v25', '60% 40%', 1.05], sei:['40% 15%', 1.5], tint:'#6b2d33'},
  branchgpt:       {hueco:['hueco-mundo-soft-clouds-v14', '50% 50%', 1.05], sei:['55% 35%', 1.2], tint:'#3f2f6b'},
  mapmyrepo:       {hueco:['hueco-mundo-petrol-v12', '55% 55%', 1.05], sei:['10% 20%', 1.6], tint:'#2d5a4a'},
  leetbot:         {hueco:['hueco-mundo-night-v10', '45% 60%', 1.1], sei:['65% 55%', 1.35], tint:'#3d5c7a'},
  sss:             {hueco:['hueco-mundo-silver-v8', '55% 55%', 1.05], sei:['25% 75%', 1.5], tint:'#4a4a4a'},
  'ori-no-michi':  {hueco:['hueco-mundo-custom-v6', '40% 55%', 1.05], sei:['45% 45%', 1.1], tint:'#7a3f4a'},
  learnai:         {hueco:['hueco-mundo-petrol-v13', '65% 45%', 1.05], sei:['75% 65%', 1.4], tint:'#2d4a7a'},
  estimateio:      {hueco:['hueco-mundo-night-v3', '50% 65%', 1.1], sei:['5% 45%', 1.55], tint:'#5c5a1f'},
  reiatsu:         {hueco:['hueco-mundo-tybw-v7', '60% 50%', 1.05], sei:['60% 40%', 1.2], tint:'#1f5c4a'},
  asciirealtime:   {hueco:['hueco-mundo-anime-v5', '50% 55%', 1.05], sei:['35% 60%', 1.45], tint:'#3f6b2d'},
  pixelforge:      {hueco:['hueco-mundo-crescent-v20', '55% 50%', 1.05], sei:['95% 40%', 1.5], tint:'#6b3f2d'},
  gitart:          {hueco:['hueco-mundo-final-v15', '60% 55%', 1.05], sei:['30% 5%', 1.4], tint:'#2d6b3f'},
  habiturtle:      {hueco:['hueco-mundo-portrait-v9', '50% 60%', 1.05], sei:['50% 85%', 1.6], tint:'#3f6b4a'},
  'maze-pathfinder':{hueco:['hueco-clear-sky-v26', '50% 50%', 1.05], sei:['70% 80%', 1.5], tint:'#6b5a2d'},
  holeemall:       {hueco:['hueco-mundo-night-v1', '55% 55%', 1.05], sei:['20% 50%', 1.3], tint:'#6b2d5a'}
};

// Motifs: a few strokes each, drawn in the realm ink with a soft glow. viewBox 0 0 480 480.
const motifs = {
  justhireme: `<g transform="rotate(-8 240 240)"><rect x="90" y="120" width="220" height="140" rx="14"/><rect x="130" y="170" width="220" height="140" rx="14"/><rect x="170" y="220" width="220" height="140" rx="14"/></g><circle cx="380" cy="150" r="46"/><path d="M356 150l16 16 34-36"/>`,
  svara: `<path d="M60 240h30M110 240v-40M140 240v-110M170 240v-60M200 240v-150M230 240v-90M260 240v-170M290 240v-50M320 240v-120M350 240v-30M380 240v-80M410 240v-20"/><path d="M60 240h380" opacity=".45"/><path d="M110 240v40M140 240v110M170 240v60M200 240v150M230 240v90M260 240v170M290 240v50M320 240v120M350 240v30M380 240v80" opacity=".5"/>`,
  odeon: `<path d="M340 110A150 150 0 1 1 120 310"/><path d="M120 310l-30-6M120 310l8-30"/><circle cx="340" cy="110" r="16"/><circle cx="395" cy="270" r="16"/><circle cx="160" cy="380" r="16"/>`,
  dreamer: `<path d="M130 80h170l60 60v260H130z"/><path d="M300 80v60h60"/><path d="M170 190h140M170 230h140M170 270h90"/><path d="M290 330l60-60 24 24-60 60-34 10z"/>`,
  'deep-researcher': `<path d="M120 110h240v300H120z"/><path d="M160 170h160M160 210h160M160 250h100"/><circle cx="330" cy="330" r="60"/><path d="M372 372l50 50"/><path d="M300 330l20 20 40-44"/>`,
  waldo: `<path d="M110 90h200l60 60v260H110z"/><path d="M150 200h160v120H150z"/><path d="M150 240h160M150 280h160M203 200v120M257 200v120"/><path d="M200 380h50v-40M270 380h50v-70"/>`,
  socratis: `<path d="M90 130h300v220H90z"/><path d="M130 180l-25 30 25 30M170 180l25 30-25 30"/><path d="M220 210h90M220 240h60"/><circle cx="240" cy="410" r="24"/><path d="M200 380q40-30 80 0"/>`,
  forge: `<path d="M70 300h60l20-40 20 80 20-120 20 120 20-80 20 40h60" /><path d="M90 200h300" opacity=".4"/><path d="M200 120l40 40 40-40M240 160v60"/>`,
  'justhireme-ios': `<rect x="150" y="60" width="180" height="360" rx="36"/><path d="M210 90h60"/><rect x="180" y="140" width="120" height="60" rx="12"/><rect x="180" y="220" width="120" height="60" rx="12"/><rect x="180" y="300" width="120" height="60" rx="12"/><path d="M280 155l8 8 16-18"/>`,
  vaani: `<path d="M140 330c-40-60-20-140 40-170M300 330c40-60 20-140-40-170" /><rect x="205" y="120" width="70" height="140" rx="35"/><path d="M240 260v90M200 350h80"/><path d="M60 240h40M380 240h40M80 200h30M370 200h30" opacity=".6"/>`,
  branchgpt: `<path d="M60 300h360"/><path d="M160 300c60 0 40-120 100-120h100"/><path d="M160 300c60 0 40 90 100 90h60"/><circle cx="160" cy="300" r="12"/><circle cx="360" cy="180" r="12"/><circle cx="320" cy="390" r="12"/><circle cx="420" cy="300" r="12"/>`,
  mapmyrepo: `<circle cx="240" cy="240" r="30"/><circle cx="120" cy="140" r="18"/><circle cx="360" cy="130" r="18"/><circle cx="400" cy="300" r="18"/><circle cx="140" cy="360" r="18"/><circle cx="300" cy="400" r="18"/><path d="M240 240L120 140M240 240l120-110M240 240l160 60M240 240l-100 120M240 240l60 160"/>`,
  leetbot: `<path d="M120 100h240v280H120z"/><path d="M160 150h160M160 190h100"/><circle cx="240" cy="290" r="50"/><path d="M240 265v25l18 18"/><path d="M190 230l-20-20M290 230l20-20"/>`,
  sss: `<rect x="90" y="120" width="110" height="90" rx="10"/><rect x="220" y="120" width="110" height="90" rx="10"/><rect x="90" y="230" width="110" height="90" rx="10"/><rect x="220" y="230" width="110" height="90" rx="10"/><circle cx="360" cy="330" r="60"/><path d="M402 372l40 40"/>`,
  'ori-no-michi': `<path d="M90 320L240 90l150 230z"/><path d="M240 90v230"/><path d="M165 205l75 25 75-25" stroke-dasharray="10 12"/><path d="M90 320h300" opacity=".5"/>`,
  learnai: `<path d="M110 120h120a30 30 0 0 1 30 30v240a30 30 0 0 0-30-30H110z"/><path d="M370 120H250a30 30 0 0 0-30 30v240a30 30 0 0 1 30-30h120z"/><path d="M150 180h50M150 220h50M280 180h50M280 220h50"/><circle cx="330" cy="290" r="14"/>`,
  estimateio: `<path d="M60 340h360"/><rect x="110" y="230" width="90" height="110" rx="8"/><path d="M230 340c30-90 120-110 190-30" /><path d="M230 340c20-40 60-60 110-50" stroke-dasharray="8 12"/><path d="M60 380h360M120 372v16M240 372v16M360 372v16" opacity=".6"/>`,
  reiatsu: `<path d="M60 200c60-60 120 60 180 0s120-60 180 0"/><path d="M60 260c60-60 120 60 180 0s120-60 180 0" opacity=".7"/><path d="M60 320c60-60 120 60 180 0s120-60 180 0" opacity=".45"/><circle cx="360" cy="120" r="34"/>`,
  asciirealtime: `<circle cx="240" cy="200" r="90"/><path d="M110 400c30-70 230-70 260 0"/><path d="M180 200h20M280 200h20M210 240q30 20 60 0" opacity=".8"/><path d="M60 120h30M60 150h50M60 180h20M390 300h30M370 330h50M400 360h20" opacity=".7"/>`,
  pixelforge: `<rect x="100" y="120" width="120" height="120"/><rect x="220" y="120" width="60" height="60"/><rect x="280" y="180" width="60" height="60"/><rect x="220" y="240" width="60" height="60"/><rect x="100" y="240" width="60" height="60"/><rect x="340" y="120" width="40" height="40"/><path d="M100 380h280" opacity=".6"/>`,
  gitart: `<g>${Array.from({length:7},(_,r)=>Array.from({length:9},(_,c)=>{const on=[[1,1],[1,3],[2,1],[2,2],[2,3],[3,1],[3,3],[1,5],[2,5],[3,5],[1,6],[1,7],[3,6],[3,7],[5,2],[5,3],[5,4],[5,5],[5,6]].some(([a,b])=>a===r&&b===c);return on?`<rect x="${90+c*36}" y="${110+r*36}" width="28" height="28" rx="6"/>`:`<rect x="${90+c*36}" y="${110+r*36}" width="28" height="28" rx="6" opacity=".25"/>`}).join('')).join('')}</g>`,
  habiturtle: `<ellipse cx="230" cy="260" rx="110" ry="80"/><path d="M150 230q80-60 160 0M170 300q60 40 120 0"/><circle cx="360" cy="230" r="34"/><path d="M130 320l-30 30M330 320l30 30M150 190l-30-30" opacity=".7"/>`,
  'maze-pathfinder': `<path d="M90 90h300v300H90z"/><path d="M150 90v120h60v60h-60v120M210 150h120v-60M330 210v60h-60v120M270 330h-60"/><path d="M120 120v240h60v-60h60v-60h60v120" stroke-dasharray="6 10" opacity=".8"/>`,
  holeemall: `<circle cx="240" cy="260" r="80"/><circle cx="240" cy="260" r="46" opacity=".6"/><circle cx="120" cy="120" r="14"/><circle cx="380" cy="150" r="20"/><circle cx="400" cy="380" r="12"/><circle cx="100" cy="360" r="18"/>`
};

function page(p, realm) {
  const r = realms[realm], sc = scenes[p.slug];
  const [bgName, hPos, hZoom] = sc.hueco;
  // A Codex-painted backdrop (scripts/codex-generate-covers.mjs) wins over the shared realm painting.
  const painted = `public/test/covers/gen/${p.slug}-${realm}.webp`;
  const hasPainted = existsSync(root + painted);
  const bgSrc = hasPainted ? url(painted) : url('public/test/backgrounds/' + (realm === 'hueco' ? bgName : 'seireitei-day-v1') + '.webp');
  const [pos, zoom] = hasPainted ? ['50% 50%', 1] : realm === 'hueco' ? [hPos, hZoom] : sc.sei;
  const tagline = p.hook.split(/(?<=[.!?])\s/)[0];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Bleach Display';src:url('${url('public/test/fonts/bleach-display.ttf')}');}
@font-face{font-family:Geist;src:url('${url('public/test/fonts/geist-variable.ttf')}');font-weight:100 900;}
@font-face{font-family:'JetBrains Mono';src:url('${url('public/test/fonts/jetbrains-mono-variable.ttf')}');font-weight:100 800;}
html,body{margin:0;width:1200px;height:675px;overflow:hidden;background:#000}
.cover{position:relative;width:1200px;height:675px;overflow:hidden}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};transform:scale(${zoom});transform-origin:${pos}}
.tint{position:absolute;inset:0;background:${sc.tint};mix-blend-mode:${realm==='hueco'?'soft-light':'multiply'};opacity:${hasPainted?(realm==='hueco'?'.3':'.1'):(realm==='hueco'?'.55':'.18')}}
.scrim{position:absolute;inset:0;background:${r.scrim}}
.grain{position:absolute;inset:0;opacity:${realm==='hueco'?'.16':'.10'};background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");mix-blend-mode:${realm==='hueco'?'screen':'multiply'}}
.motif{position:absolute;right:64px;top:50%;width:400px;height:400px;transform:translateY(-52%);overflow:visible}
.motif svg{width:100%;height:100%;overflow:visible;fill:none;stroke:${r.ink};stroke-width:5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 10px ${r.glow}) drop-shadow(0 0 28px ${r.glow})}
.card{position:absolute;left:64px;bottom:56px;max-width:640px;color:${r.ink}}
.kicker{font:400 15px/1.4 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:${r.dim};margin:0 0 14px}
h1{font:400 104px/.92 'Bleach Display','Arial Narrow',sans-serif;letter-spacing:.01em;text-transform:uppercase;margin:0 0 18px;text-shadow:0 0 24px ${r.glow},0 2px 0 rgba(0,0,0,.15)}
p.tag{font:400 24px/1.35 Geist,Arial,sans-serif;letter-spacing:-.01em;margin:0;max-width:26ch;text-wrap:balance;color:${r.ink};opacity:.92}
.rule{position:absolute;left:64px;top:56px;width:52px;height:3px;background:${r.ink};opacity:.85}
.realm{position:absolute;right:64px;top:52px;font:400 13px/1.4 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase;color:${r.dim}}
</style></head><body><div class="cover">
<img class="bg" src="${bgSrc}">
<div class="tint"></div><div class="scrim"></div><div class="grain"></div>
${hasPainted ? '' : `<div class="motif"><svg viewBox="0 0 480 480">${motifs[p.slug]}</svg></div>`}
<div class="rule"></div><div class="realm">${realm==='hueco'?'Hueco Mundo':'Seireitei'}</div>
<div class="card"><p class="kicker">${p.kind}</p><h1>${p.name}</h1><p class="tag">${tagline}</p></div>
</div></body></html>`;
}

const outDir = root + 'public/test/covers/';
{ const {execFileSync} = await import('node:child_process'); execFileSync('python', [root + 'scripts/png-to-webp.py', root + 'public/test/covers/gen/', '-'], {stdio: 'inherit'}); }
mkdirSync(outDir, {recursive: true});
const tmp = root + 'public/test/covers/.scene-tmp.html';
const browser = await chromium.launch();
try {
  const pg = await browser.newPage({viewport: {width: 1200, height: 675}, deviceScaleFactor: 1});
  let n = 0;
  for (const p of projects) {
    if (!scenes[p.slug] || !motifs[p.slug]) throw new Error(`Missing scene or motif for ${p.slug}`);
    for (const realm of ['hueco', 'seireitei']) {
      writeFileSync(tmp, page(p, realm));
      await pg.goto(pathToFileURL(tmp).href);
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForTimeout(60);
      await pg.screenshot({path: `${outDir}${p.slug}-scene-${realm}-${COVER_VERSION}.png`, type: 'png'});
      n++;
    }
  }
  console.log(`Rendered ${n} scene covers as PNG; converting to WebP.`);
  const {execFileSync} = await import('node:child_process');
  execFileSync('python', [root + 'scripts/png-to-webp.py', outDir, `-scene-`], {stdio: 'inherit'});
} finally {
  await browser.close();
  try { (await import('node:fs')).unlinkSync(tmp); } catch {}
}
