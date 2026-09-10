import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(readFileSync(resolve(root, `src/data/${name}.json`), 'utf8'));
const resume = read('resume');
const roles = read('experience').roles;
const catalog = read('projects').projects;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const arrow = '<span aria-hidden="true">↗</span>';
const section = item => `<section><h4>${escape(item.title)}</h4>${item.body ? `<p>${escape(item.body)}</p>` : ''}${item.bullets ? `<ul>${item.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}</section>`;
const hire = resume.projects.find(p => p.name === 'JustHireMe');
const odeon = resume.projects.find(p => p.name === 'Odeon');
const projects = [
  { name: 'JustHireMe', category: 'AI systems', label: 'Open source · Desktop', summary: 'Job discovery, explainable matching, and application drafts in a local-first desktop workbench.', tech: ['Tauri', 'Python', 'React', 'Graph + vector retrieval'], url: hire.url, details: [
    { title: 'The problem', body: 'Job search scatters research, matching, and application preparation across disconnected tools. I built a workbench that keeps the process understandable and gives the candidate control over generated materials.' },
    { title: 'What I built', bullets: hire.bullets },
    { title: 'How it works', body: 'A Tauri desktop shell connects a React interface to a Python FastAPI sidecar. Source adapters normalize leads, deterministic checks filter them, and graph and vector retrieval support explainable matching. Career data is stored locally; optional external AI providers process requests when configured.' },
    { title: 'Current status', body: 'Open-source desktop software with 2,200+ GitHub stars and Windows, macOS, and Linux release workflows. Generated applications remain reviewable. The native iOS edition is a separate project still in development.' }
  ]},
  ...['Svara', 'Dreamer', 'Deep Researcher', 'Ori no Michi', 'JustHireMe iOS', 'LearnAI', 'EstimateIO'].map(name => {
    const p = catalog.find(p => p.name === name);
    return {...p, category: ['Ori no Michi', 'JustHireMe iOS', 'LearnAI', 'EstimateIO'].includes(name) ? 'Interfaces' : 'AI systems', label: name === 'Svara' ? 'Open source · Voice' : ['Ori no Michi','LearnAI','EstimateIO'].includes(name) ? 'Personal · Interactive' : name === 'JustHireMe iOS' ? 'In development · Native' : 'Personal · AI systems'};
  }),
  { name: 'Odeon', category: 'AI systems', label: 'Open source · Evaluation', summary: 'An evaluation loop for conversational agents, with adversarial simulations, prompt revisions, and inspectable results.', tech: ['Python', 'FastAPI', 'WebSockets', 'React'], url: odeon.url, details: [
    {title:'The problem', body:'Prompt changes are difficult to assess from a few hand-picked conversations. I wanted a repeatable way to simulate difficult interactions and inspect what changed between runs.'},
    {title:'What I built', bullets:odeon.bullets},
    {title:'Engineering decisions', body:'Separate simulation, model-based judging, and prompt revision. Stream progress over WebSockets and retain run history and word-level diffs so the optimization process is inspectable.'},
    {title:'Current status', body:'An open-source evaluation prototype. Simulated conversations and LLM-judge scores help compare behavior, but do not substitute for human review or measured performance with real users.'}
  ]}
];
const shortDescriptions = {
  'JustHireMe': 'Local-first job intelligence. 2,200+ GitHub stars.',
  'Svara': 'On-device dictation, wherever you work.',
  'Dreamer': 'An idea vault with durable research agents.',
  'Deep Researcher': 'Research you can trace back to its sources.',
  'Ori no Michi': 'Learn origami through interactive 3D folds.',
  'JustHireMe iOS': 'A native job-search companion. In development.',
  'LearnAI': 'Applied AI, explained through interactive lessons.',
  'EstimateIO': 'A playful way to build an intuition for scale.',
  'Odeon': 'Adversarial simulations for conversational agents.'
};
const projectMarkup = projects.map((p, i) => `<details class="project" name="project-studies" data-category="${p.category}" id="project-${i}">
  <summary><span class="project-number">${String(i + 1).padStart(2,'0')}</span><div class="project-title"><h3>${escape(p.name)}</h3></div><p class="project-intro">${escape(shortDescriptions[p.name])}</p><span class="expand" aria-hidden="true">+</span><span class="sr-only">Read case study</span></summary>
  <div class="case-body"><p class="case-label mono">${escape(p.label)}</p><div class="case-stack">${p.tech.map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="case-sections">${p.details.map(section).join('')}</div>${p.url ? `<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository ${arrow}</a>` : '<p class="private-note">Personal project · Source kept private</p>'}</div>
</details>`).join('');
const roleMarkup = roles.map(r => `<details class="role"><summary><h3>${escape(r.company)}</h3><p class="role-name">${escape(r.role)}</p><span class="role-date mono">${escape(r.dateLabel)}</span><span class="role-hint">Details +</span></summary><div class="role-body"><p>${escape(r.summary)}</p>${r.sections ? r.sections.map(section).join('') : ''}</div></details>`).join('');
const replacements = {
  PROJECTS: projectMarkup,
  ROLES: roleMarkup,
  SKILLS: resume.skills.map(s => `<dt>${escape(s.label)}</dt><dd>${escape(s.text)}</dd>`).join(''),
  EDUCATION: escape(`${resume.education.institution} · ${resume.education.dates} · ${resume.education.detail}`),
  EMAIL: escape(resume.email)
};
replacements.WAVE = Array.from({length: 47}, (_, i) => `<i style="--height:${14 + Math.sin(i * 1.7) ** 2 * 100 * Math.sin((i + 1) / 48 * Math.PI)}px;--delay:${-i * .12}s"></i>`).join('');
const template = readFileSync(resolve(root, 'scripts/plain-portfolio.template.html'), 'utf8');
const page = template.replace(/@@([A-Z]+)@@/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Unknown template field: ${key}`);
  return replacements[key];
});
mkdirSync(resolve(root, 'public/test'), {recursive:true});
writeFileSync(resolve(root, 'public/test/index.html'), page);
console.log('Generated plain /test portfolio from approved public content.');
