// Build step: makes every page readable without JavaScript, for search engines and AI agents.
// For /, /projects, /about and each /projects/<slug> it writes an HTML file with its own title, description,
// canonical URL, Open Graph tags, JSON-LD, and the page's text (hidden once JavaScript runs; the app replaces it).
// Also writes llms.txt, llms-full.txt, projects/<slug>.md and sitemap.xml. All text comes from src/lib/markdown.ts.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { esc, mdToHtml } from './md-html.ts';
import { aboutMd, allWork, llmsTxt, projectListMd, projectMd, siteMd } from '../src/lib/markdown.ts';
import { person } from '../src/content.ts';
import type { Work } from '../src/data/work.ts';

const ORIGIN = 'https://www.siddhvasudev.com';
// The link-preview card (public/og.png, from scripts/og-card.html): the hero's look at 1200 × 630.
const IMAGE_ALT = 'Vasu-Devs: Vasudev Siddh, AI engineer. I build AI agents and voice AI that actually ship.';
const clip = (s: string, n = 158) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n - 1))}…`);
type Page = { path: string; title: string; description: string; md: string; work?: Work };

export function seo(): Plugin {
  let base = '/';
  let outDir = 'dist';
  return {
    name: 'seo',
    apply: 'build',
    configResolved(c) { base = c.base; outDir = resolve(c.root, c.build.outDir); },
    closeBundle() {
      const root = ORIGIN + base;
      const shell = readFileSync(join(outDir, 'index.html'), 'utf8');
      const me = {
        '@type': 'Person', '@id': `${root}#person`, name: person.name, alternateName: person.handle, url: root, jobTitle: 'AI Engineer',
        description: person.intro, email: `mailto:${person.email}`, sameAs: person.socials.map((s) => s.url), address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      };
      const site = { '@type': 'WebSite', '@id': `${root}#site`, name: person.handle, url: root, author: { '@id': me['@id'] } };
      const pages: Page[] = [
        { path: '', title: 'Vasu-Devs | AI Engineer', description: 'Vasudev Siddh (Vasu-Devs) is an AI engineer building AI agents, voice tools, and useful software. Explore his work and get in touch.', md: llmsTxt(root, '') },
        { path: 'projects', title: 'Projects | Vasu-Devs', description: `${allWork.length} projects by Vasudev Siddh: AI agents, voice AI, developer tools and client work, each with a case study.`, md: `# Projects\n\n${projectListMd(root)}` },
        { path: 'about', title: 'About | Vasu-Devs', description: person.intro, md: aboutMd(root) },
        ...allWork.map((w) => ({ path: `projects/${w.slug}`, title: `${w.title} | Vasu-Devs`, description: clip(w.summary), md: projectMd(w, root), work: w })),
      ];

      for (const p of pages) {
        const url = root + p.path;
        const w = p.work;
        const graph: object[] = [me, site];
        if (w) {
          const code = w.link && /github\.com/.test(w.link);
          graph.push(
            { '@type': code ? 'SoftwareSourceCode' : 'CreativeWork', name: w.title, description: w.summary, url, author: { '@id': me['@id'] }, keywords: w.skills.join(', '), ...(code ? { codeRepository: w.link } : w.link ? { sameAs: w.link } : {}) },
            { '@type': 'BreadcrumbList', itemListElement: [['Home', root], ['Projects', `${root}projects`], [w.title, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
          );
        } else if (p.path === 'about') graph.push({ '@type': 'ProfilePage', url, mainEntity: { '@id': me['@id'] } });
        const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
        const head = [
          `<title>${esc(p.title)}</title>`,
          `<meta name="description" content="${esc(p.description)}" />`,
          `<link rel="canonical" href="${url}" />`,
          `<link rel="alternate" type="text/markdown" href="${w ? `${root}projects/${w.slug}.md` : `${root}llms-full.txt`}" />`,
          `<meta property="og:type" content="${w ? 'article' : 'website'}" />`,
          `<meta property="og:site_name" content="Vasu-Devs" />`,
          `<meta property="og:title" content="${esc(p.title)}" />`,
          `<meta property="og:description" content="${esc(p.description)}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta property="og:image" content="${root}og.png" />`,
          `<meta property="og:image:type" content="image/png" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:alt" content="${esc(IMAGE_ALT)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:site" content="@vasu_devs" />`,
          `<meta name="twitter:creator" content="@vasu_devs" />`,
          `<meta name="twitter:title" content="${esc(p.title)}" />`,
          `<meta name="twitter:description" content="${esc(p.description)}" />`,
          `<meta name="twitter:image" content="${root}og.png" />`,
          `<meta name="twitter:image:alt" content="${esc(IMAGE_ALT)}" />`,
          `<script type="application/ld+json">${ld}</script>`,
        ].join('\n    ');
        const nav = `<nav><a href="${base}">Home</a> · <a href="${base}projects">Projects</a> · <a href="${base}about">About</a> · <a href="${base}llms.txt">llms.txt</a></nav>`;
        const html = shell
          .replace(/<title>.*?<\/title>\s*<meta name="description"[^>]*>/s, head)
          .replace('<div id="root"></div>', `<div id="root"><div class="pre">${nav}\n<main>${mdToHtml(p.md)}</main></div></div>`);
        if (!html.includes('rel="canonical"') || !html.includes('class="pre"')) throw new Error('seo: index.html no longer has the <title>, description or #root this step fills');
        const dir = join(outDir, p.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), html);
        if (w) writeFileSync(join(outDir, 'projects', `${w.slug}.md`), `${p.md}\n`);
      }
      writeFileSync(join(outDir, 'llms.txt'), llmsTxt(root));
      writeFileSync(join(outDir, 'llms-full.txt'), siteMd(root));
      const day = new Date().toISOString().slice(0, 10);
      writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${root + p.path}</loc><lastmod>${day}</lastmod></url>`).join('\n')}\n</urlset>\n`);
      console.log(`seo: ${pages.length} pages, llms.txt, llms-full.txt and sitemap.xml under ${root}`);
    },
  };
}
