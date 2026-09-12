import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Mail, Github, Linkedin, Youtube, Instagram, CalendarDays, FileText } from 'lucide-react';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(readFileSync(resolve(root, `src/data/${name}.json`), 'utf8'));
const resume = read('resume');
const roles = read('experience').roles;
const catalog = read('projects').projects;
const archive = read('work-archive').items;
const socials=read('socials'),videos=read('videos');
const originals=read('main-portfolio-studies');
const originalFor=name=>originals.find(p=>p.title===name);
const updatedCovers = new Set(["Vaani", "Odeon", "BranchGPT", "JustHireMe"]);
const coverFor=(name,realm)=>updatedCovers.has(name)?`/test/covers/${name.toLowerCase()}-workflow-${realm}-v9.svg`:`/test/covers/${name.toLowerCase()}-${realm}-v2.webp`;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const socialIcons={Email:Mail,GitHub:Github,LinkedIn:Linkedin,YouTube:Youtube,Instagram:Instagram,'Book a call':CalendarDays,'Résumé':FileText};
const socialIcon=label=>label==='X'?'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2.1l8.2-9.4L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.5 4H4.7L17.8 20Z"/></svg>':renderToStaticMarkup(createElement(socialIcons[label],{size:20,strokeWidth:1.6,'aria-hidden':true}));
const arrow = '<span aria-hidden="true"></span>';
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
for (const name of ['Socratis','Waldo','Forge']) {
 const p=catalog.find(p=>p.name===name);
 projects.push({...p,category:'AI systems',label:'Public source · Prototype'});
}
const shortDescriptions = {
 'JustHireMe': 'Find jobs, compare them with your experience, and draft applications in one desktop app.',
 'Svara': 'Speak instead of typing. Dictation runs on your device.',
 'Dreamer': 'A place to save ideas and research them without losing the thread.',
 'Deep Researcher': 'Ask a question, explore the sources, and follow how the answer came together.',
 'Ori no Michi': 'Learn origami by following folds in an interactive 3D model.',
 'JustHireMe iOS': 'Bringing the job-search workflow to iPhone. Still in development.',
 'LearnAI': 'Explore AI concepts through lessons you can interact with.',
 'EstimateIO': 'Practice estimating scale with short, interactive challenges.',
 'Odeon': 'Put a voice agent through difficult conversations and see where it breaks.',
 'Socratis': 'Practice a coding interview with a voice agent that can follow your code.',
 'Waldo': 'Ask questions about PDFs, including their tables and figures.',
 'Forge': 'Build and run AI agent workflows.'
};
const hobbyProjects = new Set(["Ori no Michi", "LearnAI", "EstimateIO"]);
const projectCards = projects.map((p, i) => `<article class="work-card"><details class="project" name="project-studies" data-category="${p.category}" id="project-${i}">
  <summary>${['JustHireMe','Odeon'].includes(p.name)?`<span class="work-art realm-covers" aria-hidden="true">${['seireitei','hueco'].map(realm=>`<img class="project-cover" data-cover-realm="${realm}" src="${coverFor(p.name,realm)}" loading="lazy" width="480" height="270" alt="">`).join('')}</span>`:''}<span class="project-number">${String(i + 1).padStart(2,'0')}</span><div class="project-title"><h3>${escape(p.name)}</h3></div><p class="project-intro">${escape(shortDescriptions[p.name] || p.summary)}</p><span class="card-tech">${p.tech.slice(0,4).map(t=>`<span>${escape(t)}</span>`).join('')}</span><span class="expand study-cta">Read case study</span></summary>
  <div class="case-body"><p class="case-label mono">${escape(p.label)}</p><div class="case-stack">${p.tech.map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="case-sections">${p.details.map(section).join('')}</div>${p.url ? `<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository ${arrow}</a>` : '<p class="private-note">Personal project · Source kept private</p>'}</div>
</details><div class="card-actions">${p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Source</a>`:''}${p.demo?`<a href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer">Demo</a>`:''}<span>${escape(p.label)}</span></div></article>`);
const projectMarkup = [0,8,...projects.map((_,i)=>i).filter(i=>i!==0&&i!==8)].filter(i=>!hobbyProjects.has(projects[i].name)).map(i=>projectCards[i]).join('');
const hobbyMarkup = projectCards.filter((_,i)=>hobbyProjects.has(projects[i].name)).join('');
const roleMarkup = roles.map(r => `<details class="role"><summary><h3>${escape(r.company)}</h3><p class="role-name">${escape(r.role)}</p><span class="role-date mono">${escape(r.dateLabel)}</span><p class="role-preview">${escape(r.summary.split('. ').slice(0,2).join('. '))}</p><span class="role-hint">Read about this role <span aria-hidden="true">+</span></span></summary><div class="role-body"><p>${escape(r.summary)}</p>${r.sections ? r.sections.map(section).join('') : ''}</div></details>`).join('');
const toolNames = ['Vaani','BranchGPT','MapMyRepo','LeetBot','SSS'];
const funNames = ['Reiatsu','ASCIIRealTime','PixelForge','GitArt','habiTurtle','Maze-Pathfinder-Visualizer','HoleEmAll'];
const archiveCards = names => names.map(name=>archive.find(p=>p.name===name)).filter(Boolean).map(p=>`<article class="archive-item" data-work-category="${escape(p.category)}"><div class="archive-item-heading"><h3><button type="button" class="archive-open" aria-haspopup="dialog">${escape(p.name)}</button></h3><span>${escape(p.category)}</span></div><p>${escape(p.summary)}</p><div class="card-tech">${p.tech.slice(0,4).map(t=>`<span>${escape(t)}</span>`).join('')}</div>${p.url?`<a class="archive-source" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Source</a>`:''}${p.details?.length?`<details class="archive-detail"><summary>Read case study <span aria-hidden="true"></span></summary><p class="archive-study-summary">${escape(p.summary)}</p><p class="case-label">${escape(p.status)}</p><div class="case-stack">${p.tech.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="case-sections">${(originalFor(p.name)?.details||p.details).map(section).join('')}</div>${p.url?`<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>`:''}${p.demo?`<a class="text-link" href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer">Watch the demo</a>`:''}</details>`:''}</article>`).join('');
const featuredMarkup = ['JustHireMe','Odeon'].map(name=>{
 const p=projects.find(p=>p.name===name),i=projects.indexOf(p);
 return `<article class="featured-card"><a class="featured-preview realm-covers" href="#project-${i}" aria-label="Read ${escape(name)} case study">${['seireitei','hueco'].map(realm=>`<img class="project-cover" data-cover-realm="${realm}" src="${coverFor(name,realm)}" alt="${escape(name)} project illustration" loading="lazy" width="480" height="270">`).join('')}</a><div class="featured-copy"><div class="featured-title"><h3><a href="#project-${i}">${escape(name)}</a></h3><a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(name)} source on GitHub">${socialIcon('GitHub')}</a></div><p>${escape(shortDescriptions[name])}</p><div class="card-tech">${p.tech.map(t=>`<span>${escape(t)}</span>`).join('')}</div><a class="card-study" href="#project-${i}">Read case study</a></div></article>`;
}).join('');
const replacements = {
 FEATURED: featuredMarkup,
 CONTACTOPTIONS: ['Email','Book a call','LinkedIn'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(s=>`<a href="${escape(s.url)}" ${s.url.startsWith('https')?'target="_blank" rel="noopener noreferrer"':''}>${socialIcon(s.label)}<span><strong>${escape(s.label==='Email'?'Email me':s.label==='LinkedIn'?'Message on LinkedIn':s.label)}</strong><small>${escape(s.label==='Email'?resume.email:s.label==='Book a call'?'Choose a time on my calendar':'Connect or send me a message')}</small></span></a>`).join(''),
  RESUME: `<header><h2 id="resume-title">${escape(resume.name)}</h2><p>${escape(resume.headline)}</p><a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a></header><p>${escape(resume.summary)}</p><h3>Experience</h3>${resume.experience.map(r=>`<section><h4>${escape(r.role)} · ${escape(r.company)}</h4><small>${escape(r.dates)}</small><ul>${r.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul></section>`).join('')}<h3>Selected projects</h3>${resume.projects.map(p=>`<section><h4>${escape(p.name)}</h4><ul>${p.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul>${p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Repository</a>`:''}</section>`).join('')}<h3>Skills</h3><dl>${resume.skills.map(s=>`<dt>${escape(s.label)}</dt><dd>${escape(s.text)}</dd>`).join('')}</dl><h3>Education</h3><p>${escape(resume.education.institution)} · ${escape(resume.education.dates)}<br>${escape(resume.education.detail)}</p>`,
  CONTACTS: (()=>{
    const link=s=>`<a href="${escape(s.url)}" data-social="${escape(s.label.toLowerCase().replaceAll(' ','-'))}" aria-label="${escape(s.label)}" title="${escape(s.label)}"${s.url.startsWith('mailto:')?'':' target="_blank" rel="noopener noreferrer"'}>${socialIcon(s.label)}<span class="contact-label">${escape(s.label)}</span></a>`;
    return `<div class="social-icon-row">${['X','GitHub','LinkedIn','Email','YouTube','Instagram'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(link).join('')}</div><div class="contact-utilities">${['Résumé','Book a call'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(link).join('')}</div>`;
  })(),
  VIDEOS: ['Vaani','Odeon','BranchGPT'].map(name=>videos.find(v=>v.name===name)).map(v=>{
    const base=projects.find(p=>p.name===v.name)||catalog.find(p=>p.name===v.name)||archive.find(p=>p.name===v.name);
    const original=originalFor(v.name);const p={...base,details:original?.details||base?.details};
    const id=v.url.startsWith('#')?null:new URL(v.url).searchParams.get('v');
    return `<a class="video-link" href="${escape(v.url)}" aria-haspopup="dialog"><span class="realm-covers" role="img" aria-label="${escape(v.name)} project illustration">${['seireitei','hueco'].map(realm=>`<img class="project-cover" data-cover-realm="${realm}" src="${escape(coverFor(v.name,realm))}" alt="" aria-hidden="true" loading="lazy" width="480" height="270">`).join('')}</span><span><strong>${escape(v.name)}</strong><small>${escape(original?.description||base?.summary||v.summary)}</small><span class="study-cta">Explore case study</span></span></a>${id?`<template id="film-${id}"><h2>${escape(v.name)}</h2><p class="film-summary">${escape(p?.summary||v.summary)}</p>${p?.tech?`<div class="case-stack">${p.tech.map(t=>`<span>${escape(t)}</span>`).join('')}</div>`:''}<div class="case-sections">${(p?.details||[]).map(section).join('')}</div>${p?.url?`<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>`:''}</template>`:''}`;
  }).join(''),
  PROJECTS: projectMarkup,
  ARCHIVE: archiveCards(toolNames),
  HOBBIES: hobbyMarkup,
  EXPERIMENTS: archiveCards(funNames),
  WORKCOUNT: String(projects.length+archive.filter(p=>!projects.some(feature=>feature.name===p.name)).length),
  HEATMAP: (()=>{
    const data=read('github-contributions'),days=data.days,start=Date.parse(days[0].date),weeks=Math.ceil(days.length/7),total=days.reduce((n,d)=>n+d.count,0);
    const cells=days.map(d=>{const index=Math.round((Date.parse(d.date)-start)/86400000);return `<rect x="${Math.floor(index/7)*13}" y="${index%7*13+20}" width="10" height="10" rx="2" fill="var(--heat-${d.level})"><title>${d.date}: ${d.count} contributions</title></rect>`;}).join('');
    const months=days.filter(d=>d.date.endsWith('-01')).map(d=>`<text x="${Math.floor((Date.parse(d.date)-start)/86400000/7)*13}" y="11">${new Date(d.date+'T12:00:00Z').toLocaleString('en',{month:'short',timeZone:'UTC'})}</text>`).join('');
    return `<section class="github-activity" aria-labelledby="github-title"><h2 id="github-title">Building in public</h2><p>${total.toLocaleString('en')} contributions in this GitHub snapshot.</p><svg viewBox="0 0 ${weeks*13} 113" role="img" aria-label="GitHub contribution activity from ${days[0].date} to ${days.at(-1).date}">${months}${cells}</svg><div class="heatmap-footer"><a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer">View GitHub activity</a><span>Updated ${data.updated}</span><span class="heat-legend">Less ${[0,1,2,3,4].map(n=>`<i style="background:var(--heat-${n})"></i>`).join('')} More</span></div></section>`;
  })(),
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
