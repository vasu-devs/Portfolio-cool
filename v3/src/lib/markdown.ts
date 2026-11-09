// The site as Markdown, for the copy buttons and for agents (llms.txt, llms-full.txt, projects/<slug>.md at build).
// It says exactly what the pages show, from the same data, so nothing here can drift from the site.
import { GROUPS, work, shownWork, linkLabel, type Work } from '../data/work.ts';
import { diagrams } from '../data/diagrams.ts';
import { person, principles, openSource } from '../content.ts';
import experience from '../data/experience.json' with { type: 'json' };

type Role = (typeof experience)[number];
const list = (items: string[]) => items.map((s) => `- ${s}`).join('\n');
/** Listed projects first, in the site's order, then the rest. */
export const allWork = shownWork.concat(work.filter((w) => !w.shown));

/** One project's case study. `root` is the site's absolute URL, ending in '/'. */
export function projectMd(w: Work, root: string) {
  const d = w.diagram ? diagrams[w.diagram] : undefined;
  const label = Object.fromEntries(d?.nodes.map((n) => [n.id, n.label]) ?? []);
  return [
    `# ${w.title}`,
    `${GROUPS.find((g) => g.id === w.group)!.label} · ${w.role} · ${w.status}`,
    w.summary,
    w.facts && list(w.facts.map((f) => `**${f.value}** ${f.label}`)),
    w.link && `${linkLabel(w.link)}: ${w.link}`,
    d && `## How it works\n\n${d.caption}\n\n${list(d.edges.map(([a, b]) => `${label[a]} → ${label[b]}`))}`,
    w.paragraphs.length && `## The detail\n\n${w.paragraphs.join('\n\n')}`,
    w.did.length && `## What I did\n\n${list(w.did)}`,
    `## Stack\n\n${w.skills.join(', ')}`,
    `Case study: ${root}projects/${w.slug}`,
  ].filter(Boolean).join('\n\n');
}

/** One role, as its case study shows it (the description's first and last paragraphs are the summary and the stack). */
export function roleMd(r: Role) {
  return [
    `### ${r.company}: ${r.title} (${r.display_date})`,
    r.summary,
    ...r.description.split(/\n\n+/).slice(1, -1),
    r.highlights.length && list(r.highlights),
    `Stack: ${r.skills.join(', ')}`,
  ].filter(Boolean).join('\n\n');
}

const intro = (root: string) => [
  `# ${person.name} (${person.handle}): AI engineer`,
  `> ${person.intro.slice(0, person.intro.indexOf('. ') + 1)} ${person.about}`, // the intro's first line, then the About text
  'Open to work: AI engineering roles and freelance builds. Based in India (IST), works your hours.',
  list([`Site: ${root}`, `Email: ${person.email}`, `Book a call: ${person.call}`, ...person.socials.map((s) => `${s.label}: ${s.url}`)]),
].join('\n\n');

/** llms.txt: who he is, then a link per project (the shortlist first). `ext` '.md' links the Markdown copies. */
export function llmsTxt(root: string, ext = '.md') {
  return [
    intro(root),
    `## Pages\n\n${list([`[Home](${root})`, `[Projects](${root}projects)`, `[About](${root}about)`, `[The whole site in one file](${root}llms-full.txt)`])}`,
    projectListMd(root, ext),
  ].join('\n\n') + '\n';
}

/** Every project as a linked line: the shortlist, then the rest under "Optional" (the llms.txt convention). */
export function projectListMd(root: string, ext = '') {
  const line = (w: Work) => `- [${w.title}](${root}projects/${w.slug}${ext}): ${w.summary.split(/(?<=\.)\s/)[0]}`;
  return `## Projects\n\n${shownWork.map(line).join('\n')}\n\n## Optional\n\n${work.filter((w) => !w.shown).map(line).join('\n')}`;
}

/** The About page: who he is, his roles, how he works and his open source. */
export const aboutMd = (root: string) => [
  intro(root),
  `## Experience\n\n${experience.map(roleMd).join('\n\n')}`,
  `## How I work\n\n${list(principles.map((p) => `**${p.title}.** ${p.text}`))}`,
  `## Open source\n\n${openSource.headline}\n\n${list(openSource.items.map((o) => `[${o.repo}](${o.url}) (${o.count}): ${o.text}`))}`,
].join('\n\n');

/** The whole site in one document (project headings drop two levels to sit under "Projects"). */
export function siteMd(root: string) {
  return [
    aboutMd(root),
    `## Projects\n\n${allWork.map((w) => projectMd(w, root).replace(/^#/gm, '###')).join('\n\n---\n\n')}`,
  ].join('\n\n') + '\n';
}
