#!/usr/bin/env node
// Scrapes the README of every project already listed in src/data/projects.json
// and merges three enrichment fields into each entry:
//   summary     — first clean prose paragraph from the README (≤ ~320 chars)
//   highlights  — bullet points found under a "## Features"-type heading
//   tech        — detected tech-stack keywords found anywhere in the README
//
// Usage:
//   node scripts/fetch-readmes.mjs
//   GITHUB_TOKEN=ghp_xxx node scripts/fetch-readmes.mjs   (recommended)
//
// Existing fields are preserved; only these three new fields are updated.

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '..', 'src', 'data', 'projects.json');

const token = process.env.GITHUB_TOKEN;
const headers = {
    Accept: 'application/vnd.github.raw',
    'User-Agent': 'portfolio-fetch-readmes',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

// Ordered by popularity — longer/more specific names first so we don't
// match "C" inside "C++". Case-insensitive; word-boundary enforced.
const TECH_VOCAB = [
    'Next.js', 'Nuxt.js', 'Node.js', 'React Native', 'React', 'Vue', 'Svelte',
    'Angular', 'Astro', 'Vite', 'Webpack', 'Turbopack',
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Kotlin', 'Swift',
    'Java', 'Ruby', 'PHP', 'C++', 'C#', 'Lua', 'Solidity',
    'Tailwind', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion',
    'Express', 'FastAPI', 'Flask', 'Django', 'NestJS', 'Spring Boot',
    'Prisma', 'Drizzle', 'TypeORM', 'SQLAlchemy',
    'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
    'Docker', 'Kubernetes', 'AWS', 'Vercel', 'Cloudflare',
    'GraphQL', 'tRPC', 'WebSockets', 'WebRTC',
    'Stripe', 'PayPal', 'Shopify',
    'LiveKit', 'Deepgram', 'Groq', 'ElevenLabs', 'Cartesia',
    'OpenAI', 'Anthropic', 'Claude', 'Gemini', 'Mistral',
    'LangChain', 'LangGraph', 'LlamaIndex',
    'Ollama', 'LLaMA', 'GPT-4', 'Whisper',
    'PyTorch', 'TensorFlow', 'Hugging Face', 'Transformers',
    'Three.js', 'D3', 'Chart.js', 'Recharts',
    'Zustand', 'Redux', 'Jotai', 'React Query',
    'PyQt5', 'Tkinter', 'Electron',
    'Playwright', 'Puppeteer', 'Selenium',
    'pgvector', 'FAISS', 'Pinecone', 'Weaviate', 'Qdrant', 'ChromaDB',
];

function stripMarkdown(md) {
    let t = md;
    // Strip HTML blocks entirely (multi-line)
    t = t.replace(/<[^>]*?>[\s\S]*?<\/[^>]+>/g, '');
    // Strip inline HTML tags
    t = t.replace(/<[^>]+>/g, '');
    // Strip badge+link combos: [![alt](img)](link)
    t = t.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '');
    // Strip plain images
    t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    // Strip fenced code blocks
    t = t.replace(/```[\s\S]*?```/g, '');
    // Strip inline code
    t = t.replace(/`([^`]+)`/g, '$1');
    // Convert links [text](url) -> text
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Remove residual emphasis markers
    t = t.replace(/\*\*|__|~~/g, '');
    // Collapse whitespace within lines
    t = t.replace(/[ \t]+/g, ' ');
    return t;
}

function extractSummary(md) {
    const cleaned = stripMarkdown(md);
    const lines = cleaned.split('\n').map((l) => l.trim());

    const paragraph = [];
    let started = false;

    for (const line of lines) {
        if (!line) {
            if (started) break;
            continue;
        }
        // Skip headings, bullets, blockquotes, tables, HR, anchor tags
        if (
            line.startsWith('#') ||
            /^[-*+]\s/.test(line) ||
            /^\d+\.\s/.test(line) ||
            line.startsWith('>') ||
            line.startsWith('|') ||
            line.startsWith('---') ||
            line.startsWith('===')
        ) {
            if (started) break;
            continue;
        }
        paragraph.push(line);
        started = true;
    }

    let summary = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (summary.length > 320) {
        summary = summary.slice(0, 317).replace(/[,;:\s]+\S*$/, '') + '…';
    }
    return summary;
}

function extractHighlights(md) {
    const re = /^#{2,3}\s+(features|highlights|capabilities|what\s+it\s+does|what\s+does\s+it\s+do|key\s+features)/im;
    const m = md.match(re);
    if (!m) return [];

    const rest = md.slice(m.index + m[0].length);
    const endMatch = rest.match(/^#{1,3}\s/m);
    const section = endMatch ? rest.slice(0, endMatch.index) : rest;

    const bullets = section
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^[-*+]\s/.test(l))
        .map((l) =>
            l
                .replace(/^[-*+]\s+/, '')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\*\*|__|~~/g, '')
                .trim()
        )
        .filter((l) => l.length > 4 && l.length < 220);

    return bullets.slice(0, 4);
}

function extractTech(md) {
    const found = new Set();
    for (const term of TECH_VOCAB) {
        const escaped = term.replace(/[.+#]/g, (c) => '\\' + c);
        // word boundary before, and either word boundary or end after
        const re = new RegExp(`(^|[^\\w])${escaped}(?![\\w])`, 'i');
        if (re.test(md)) found.add(term);
    }
    return [...found];
}

async function fetchReadme(user, name) {
    const url = `https://api.github.com/repos/${user}/${name}/readme`;
    const res = await fetch(url, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText} for ${name}`);
    }
    return await res.text();
}

async function main() {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data.projects) || data.projects.length === 0) {
        console.error('projects.json is empty — run `npm run fetch-repos` first.');
        process.exit(1);
    }

    console.log(
        `Scraping READMEs for ${data.projects.length} projects ${token ? '(authenticated)' : '(unauthenticated, 60/hr limit)'}`
    );

    let ok = 0;
    let missing = 0;
    let failed = 0;

    for (const p of data.projects) {
        process.stdout.write(`  ${p.name.padEnd(28)} … `);
        try {
            const md = await fetchReadme(data.user, p.name);
            if (!md) {
                p.summary = '';
                p.highlights = [];
                p.tech = [];
                missing++;
                console.log('no README');
                continue;
            }
            p.summary = extractSummary(md);
            p.highlights = extractHighlights(md);
            p.tech = extractTech(md);
            // Transient: truncated raw markdown for smarter offline processing.
            // This field is removed once a human/model writes back cleaner data.
            p.readmeRaw = md.length > 8000 ? md.slice(0, 8000) + '\n\n[…truncated…]' : md;
            ok++;
            console.log(
                `ok (summary: ${p.summary.length}c, highlights: ${p.highlights.length}, tech: ${p.tech.length}, raw: ${p.readmeRaw.length}c)`
            );
        } catch (err) {
            failed++;
            console.log(`FAILED (${err.message})`);
        }
        // Be polite to the API even when authenticated.
        await new Promise((r) => setTimeout(r, 50));
    }

    data.readmesFetchedAt = new Date().toISOString();

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
    console.log(`\nDone: ${ok} enriched, ${missing} with no README, ${failed} failed.`);
    console.log(`Wrote ${DATA_PATH}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
