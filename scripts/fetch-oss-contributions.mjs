#!/usr/bin/env node
// Fetches merged PRs authored by vasu-devs in repos owned by OTHER people —
// i.e. real external open-source contributions. Skips own-repo PRs.
//
// Writes to src/data/oss-contributions.json as an array of basic entries.
// The featured ones in OssImpact are then curated by hand from this list.
//
// Usage:
//   node scripts/fetch-oss-contributions.mjs
//   GITHUB_TOKEN=ghp_xxx node scripts/fetch-oss-contributions.mjs   (recommended)

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'vasu-devs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'src', 'data', 'oss-contributions.json');

const token = process.env.GITHUB_TOKEN;
const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-fetch-oss-contributions',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function searchMergedPrs(page) {
    // is:pr is:merged author:USER -user:USER excludes PRs in own repos
    const q = encodeURIComponent(`is:pr is:merged author:${USER} -user:${USER}`);
    const url = `https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}&sort=updated&order=desc`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`GitHub API ${res.status} ${res.statusText}\n${body}`);
    }
    return await res.json();
}

function repoFromUrl(url) {
    // https://api.github.com/repos/OWNER/REPO  → OWNER/REPO
    const m = url.match(/repos\/([^/]+\/[^/]+)$/);
    return m ? m[1] : null;
}

async function main() {
    console.log(
        `Fetching external merged PRs by ${USER} ${token ? '(authenticated, 5000/hr)' : '(unauthenticated, 10/min)'}`
    );

    const all = [];
    for (let page = 1; page <= 10; page++) {
        const data = await searchMergedPrs(page);
        if (!data.items || data.items.length === 0) break;
        all.push(...data.items);
        console.log(`  Page ${page}: ${data.items.length} PRs`);
        if (data.items.length < 100) break;
    }

    const contributions = all
        .map((pr) => ({
            title: pr.title,
            repo: repoFromUrl(pr.repository_url),
            number: pr.number,
            url: pr.html_url,
            state: pr.state,
            mergedAt: pr.pull_request?.merged_at || pr.closed_at,
            createdAt: pr.created_at,
            labels: (pr.labels || []).map((l) => l.name),
        }))
        .filter((pr) => pr.repo)
        .sort((a, b) => new Date(b.mergedAt || 0) - new Date(a.mergedAt || 0));

    const byRepo = {};
    for (const c of contributions) {
        byRepo[c.repo] = (byRepo[c.repo] || 0) + 1;
    }

    console.log(`\nTotal external merged PRs: ${contributions.length}`);
    console.log(`Across ${Object.keys(byRepo).length} repos:`);
    for (const [repo, count] of Object.entries(byRepo).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${count.toString().padStart(3)}  ${repo}`);
    }

    await mkdir(dirname(OUT_PATH), { recursive: true });
    await writeFile(
        OUT_PATH,
        JSON.stringify(
            {
                fetchedAt: new Date().toISOString(),
                user: USER,
                totalPrs: contributions.length,
                byRepo,
                contributions,
            },
            null,
            2
        ) + '\n'
    );

    console.log(`\nWrote ${OUT_PATH}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
