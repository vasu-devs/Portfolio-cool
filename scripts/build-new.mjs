// Builds the v3 site (its own Vite app in v3/) into dist/new/, so it is live at /new while / stays the
// current portfolio. Runs after the main build (postbuild); Vercel's install step only covers the root app.
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';

const v3 = new URL('../v3/', import.meta.url);
const run = (cmd) => execSync(cmd, { cwd: v3, stdio: 'inherit' });
if (!existsSync(new URL('node_modules/', v3))) run('npm ci --no-audit --no-fund');
run('npm run build -- --base /new/ --outDir ../dist/new --emptyOutDir');
// Agents look for llms.txt at the domain root; the v3 one describes Vasu and links every page.
copyFileSync(new URL('../dist/new/llms.txt', import.meta.url), new URL('../dist/llms.txt', import.meta.url));
console.log('Published the v3 site at /new/.');
