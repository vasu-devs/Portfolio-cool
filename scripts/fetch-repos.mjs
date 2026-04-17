#!/usr/bin/env node
// Fetches all public non-fork repos from github.com/vasu-devs and writes a
// trimmed JSON file for the MoreProjects section to consume.
//
// Usage:
//   node scripts/fetch-repos.mjs
//   GITHUB_TOKEN=ghp_xxx node scripts/fetch-repos.mjs   (authenticated, 5000/hr)
//
// Featured projects (already in Work section) are excluded so the section
// only shows the long tail.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'vasu-devs';
const PER_PAGE = 100;

// Keep these in sync with the `projects` array in src/App.tsx.
// Compared case-insensitively against GitHub repo names.
const FEATURED = new Set(
    ['BranchGPT', 'Vaani', 'Odeon', 'MapMyRepo', 'PolySEE'].map((n) => n.toLowerCase())
);

const token = process.env.GITHUB_TOKEN;
const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-fetch-repos',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function fetchAllRepos() {
    const all = [];
    for (let page = 1; page < 20; page++) {
        const url = `https://api.github.com/users/${USER}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`;
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`GitHub API ${res.status} ${res.statusText}\n${body}`);
        }
        const batch = await res.json();
        if (!Array.isArray(batch) || batch.length === 0) break;
        all.push(...batch);
        if (batch.length < PER_PAGE) break;
    }
    return all;
}

function normalise(repo) {
    return {
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language || null,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
    };
}

function shouldKeep(repo) {
    if (repo.fork) return false;
    if (repo.archived) return false;
    if (repo.private) return false;
    if (FEATURED.has(repo.name.toLowerCase())) return false;
    // Skip user/profile readme repo (e.g. vasu-devs/vasu-devs)
    if (repo.name.toLowerCase() === USER.toLowerCase()) return false;
    return true;
}

async function main() {
    console.log(`Fetching repos for ${USER}… ${token ? '(authenticated)' : '(unauthenticated, 60/hr limit)'}`);
    const all = await fetchAllRepos();
    console.log(`  Got ${all.length} total repos`);

    const filtered = all.filter(shouldKeep).map(normalise);
    filtered.sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    console.log(`  Keeping ${filtered.length} after filtering forks/archived/featured`);

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const out = resolve(__dirname, '..', 'src', 'data', 'projects.json');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify({ fetchedAt: new Date().toISOString(), user: USER, projects: filtered }, null, 2) + '\n');

    console.log(`  Wrote ${out}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
