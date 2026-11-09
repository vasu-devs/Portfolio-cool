// Every project on the site. Titles and descriptions are Vasu's final public text (src/data/projects.json, synced from
// ~/archive/e by scripts/sync-content.mjs) and are shown verbatim. Facts on featured projects come only from the
// Evidence Ledger (§16) of his content.md.
import raw from './projects.json' with { type: 'json' };

export type Group = 'client' | 'ai' | 'tools' | 'play';
export const GROUPS: { id: Group; label: string; blurb: string }[] = [
  { id: 'client', label: 'Client work', blurb: 'Paid work, shipped. Clients stay confidential; the numbers are what my work changed.' },
  { id: 'ai', label: 'AI products', blurb: 'Agents, voice, retrieval and the products around them.' },
  { id: 'tools', label: 'Developer tools', blurb: 'Things that make engineers and their agents faster.' },
  { id: 'play', label: 'Apps & experiments', blurb: 'Games, visualisers and things I wanted to exist.' },
];

export type Fact = { value: string; label: string };
export type Work = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  paragraphs: string[];
  role: string;
  status: string;
  link?: string;
  skills: string[];
  did: string[];
  domains: string[];
  group: Group;
  color: string;
  diagram?: string;
  facts?: Fact[];
  featured?: boolean;
  shown?: boolean;
};

// Projects shown first, in order: JustHireMe, Svara, Odeon, the H200 GPU kernels, then the visual search client build.
const FEATURED = [1, 11, 13, 88, 4];
// The Projects index: the work worth a visitor's time (stars, measured results, live demos, paid clients), in this
// order. Everything else still opens by direct link and the Ask agent knows it; it is just not listed.
const INDEX = [...FEATURED, 9, 16, 14, 7, 18, 34, 3, 10, 12, 8, 15, 23, 29, 66, 67, 71, 74, 75, 21, 22];
const SLUG: Record<number, string> = { 1: 'justhireme', 11: 'svara', 13: 'odeon', 3: 'fintech-pnl', 4: 'visual-search', 9: 'vaani', 14: 'branchgpt', 15: 'mapmyrepo', 58: 'justhireme-ios', 88: 'gpu-kernels' };
const DIAGRAM: Record<number, string> = { 1: 'justhireme', 11: 'svara', 13: 'odeon', 3: 'fintech', 9: 'vaani', 14: 'branchgpt', 15: 'mapmyrepo', 88: 'gpukernels', 4: 'visualsearch' };
const COLOR: Record<number, string> = { 1: '#ff5a1f', 11: '#c6ff2e', 13: '#2bb8ff', 88: '#7c5cff', 4: '#ffc400' };
const FACTS: Record<number, Fact[]> = {
  1: [{ value: '2,272', label: 'GitHub stars' }, { value: '380.6K', label: 'launch views' }],
  11: [{ value: '54 ms', label: 'to first word (Linux, CPU)' }, { value: '5.56%', label: 'word error rate' }],
  3: [{ value: '~4,500×', label: 'faster attribution' }, { value: '641', label: 'orphaned orders recovered' }],
  88: [{ value: '1.77×', label: 'faster attention decode than SGLang' }, { value: '316 / 822', label: 'competition rank' }],
  4: [{ value: '3.48M', label: 'vectors indexed' }, { value: '~15–21 ms', label: 'retrieval' }],
};
const AI = ['AI Agents', 'Voice AI', 'RAG', 'Speech AI', 'Computer Vision', 'Document AI', 'Multilingual AI', 'Legal Tech', 'HR Tech', 'Job Tech', 'Research Automation', 'Multi-Agent Systems', 'Evaluation', 'AI Apps', 'Knowledge Management', 'Vector Search', 'Retrieval', 'Machine Learning', 'AI Infrastructure', 'GPU Computing'];
const TOOLS = ['Developer Tools', 'AI Tooling', 'Static Analysis', 'Automation'];
const palette = ['#ff5a1f', '#c6ff2e', '#ff4f9a', '#2bb8ff', '#ffc400', '#7c5cff'];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');
const groupOf = (p: (typeof raw)[number]): Group =>
  p.confidential ? 'client' : p.domains.some((d) => AI.includes(d)) ? 'ai' : p.domains.some((d) => TOOLS.includes(d)) ? 'tools' : 'play';

export const work: Work[] = raw.map((p, i) => {
  const paragraphs = p.description.split(/\n\n+/);
  return {
    id: p.id, slug: SLUG[p.id] ?? slugify(p.title), title: p.title, summary: paragraphs[0], paragraphs: paragraphs.slice(1),
    role: p.role, status: p.status, link: p.link || undefined, skills: p.skills, did: p.what_i_did, domains: p.domains,
    group: groupOf(p), color: COLOR[p.id] ?? palette[i % palette.length], diagram: DIAGRAM[p.id], facts: FACTS[p.id],
    featured: FEATURED.includes(p.id), shown: INDEX.includes(p.id),
  };
});
export const featuredWork: Work[] = FEATURED.map((id) => work.find((w) => w.id === id)!);
export const shownWork: Work[] = INDEX.map((id) => work.find((w) => w.id === id)!);
export const bySlug = (slug: string) => work.find((w) => w.slug === slug);
export const linkLabel = (url: string) => (/github\.com/.test(url) ? 'Code' : /youtu/.test(url) ? 'Watch' : 'Open');
