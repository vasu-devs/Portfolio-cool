#!/usr/bin/env node
// Fetches READMEs for the featured projects listed in App.tsx so they can be
// hand-curated into structured detail sections. Writes each README to
// `.cache/featured-readmes/{name}.md` — gitignored, transient, meant to be
// read by a model or a human once and then discarded.
//
// Usage:
//   node scripts/fetch-featured-readmes.mjs
//   GITHUB_TOKEN=ghp_xxx node scripts/fetch-featured-readmes.mjs   (recommended)

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(__dirname, '..', '.cache', 'featured-readmes');

// Keep in sync with the projects array in src/App.tsx.
const FEATURED = [
    { user: 'vasu-devs', name: 'BranchGPT' },
    { user: 'vasu-devs', name: 'Vaani' },
    { user: 'vasu-devs', name: 'Odeon' },
    { user: 'vasu-devs', name: 'MapMyRepo' },
    { user: 'vasu-devs', name: 'PolySEE' },
];

const token = process.env.GITHUB_TOKEN;
const headers = {
    Accept: 'application/vnd.github.raw',
    'User-Agent': 'portfolio-fetch-featured-readmes',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function fetchReadme(user, name) {
    const url = `https://api.github.com/repos/${user}/${name}/readme`;
    const res = await fetch(url, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText} for ${name}\n${body}`);
    }
    return await res.text();
}

async function main() {
    console.log(
        `Fetching READMEs for ${FEATURED.length} featured projects ${token ? '(authenticated)' : '(unauthenticated, 60/hr limit)'}`
    );

    await mkdir(CACHE_DIR, { recursive: true });

    for (const { user, name } of FEATURED) {
        process.stdout.write(`  ${name.padEnd(20)} … `);
        try {
            const md = await fetchReadme(user, name);
            if (!md) {
                console.log('no README');
                continue;
            }
            const path = join(CACHE_DIR, `${name}.md`);
            await writeFile(path, md);
            console.log(`ok (${md.length} chars)`);
        } catch (err) {
            console.log(`FAILED (${err.message})`);
        }
        await new Promise((r) => setTimeout(r, 50));
    }

    console.log(`\nDone. READMEs in ${CACHE_DIR}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
