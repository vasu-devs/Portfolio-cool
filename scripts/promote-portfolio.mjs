import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const output = new URL('../dist/', import.meta.url);
const current = readFileSync(new URL('index.html', output), 'utf8');
if (!current.includes('id="root"')) throw new Error('Expected the built legacy portfolio before promotion.');
mkdirSync(new URL('old/', output), { recursive: true });
const legacy = current.replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="https://www.siddhvasudev.com/old/" />').replace('</head>', '<meta name="robots" content="noindex,follow" /></head>');
writeFileSync(new URL('old/index.html', output), legacy);
const paper = readFileSync(new URL('paper/index.html', output), 'utf8');
const bleach = readFileSync(new URL('bleach/index.html', output), 'utf8');
if (!paper.includes('/paper/paper-v4.css') || !paper.includes('/paper/paper-v6.js')) throw new Error('Paper portfolio assets are missing.');
if (!bleach.includes('/test/hollow-theme.css') || !bleach.includes('/test/plain.js')) throw new Error('The preserved Bleach portfolio is missing.');
writeFileSync(new URL('index.html', output), paper);
// Snapshot of the paper portfolio, kept reachable after / moves to the next design.
mkdirSync(new URL('old2/', output), { recursive: true });
writeFileSync(new URL('old2/index.html', output), paper.replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="https://www.siddhvasudev.com/old2/" />').replace('</head>', '<meta name="robots" content="noindex,follow" /></head>'));
// The paper portfolio as it was live at / until v3 replaced it (Nov 2026); build-new.mjs then puts v3 at /.
mkdirSync(new URL('old3/', output), { recursive: true });
const old3 = paper.replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="https://www.siddhvasudev.com/old3/" />').replace('</head>', '<meta name="robots" content="noindex,follow" /></head>');
writeFileSync(new URL('old3/index.html', output), old3);
writeFileSync(new URL('paper/index.html', output), old3); // its source copy at /paper/ must not claim / either
console.log('Published the paper portfolio at /old2/ and /old3/, preserved Bleach at /bleach/ and the legacy React portfolio at /old/.');
