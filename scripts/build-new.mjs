// Builds the v3 site (its own Vite app in v3/) into the root of dist/, so it is the live site at /. Runs after the main
// build and promote-portfolio.mjs (postbuild), which keep the earlier designs at /old, /old2, /old3 and /bleach.
// dist/ is outside v3/, so Vite adds its files without emptying the folder; index.html, favicon.ico and sitemap.xml
// are replaced by v3's. Vercel's install step only covers the root app.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const v3 = new URL('../v3/', import.meta.url);
const run = (cmd) => execSync(cmd, { cwd: v3, stdio: 'inherit' });
if (!existsSync(new URL('node_modules/', v3))) run('npm ci --no-audit --no-fund');
run('npm run build -- --base / --outDir ../dist');
if (!readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8').includes('rel="canonical" href="https://www.siddhvasudev.com/"')) {
  throw new Error('dist/index.html is not the v3 home page after the v3 build.');
}
console.log('Published the v3 site at /.');
