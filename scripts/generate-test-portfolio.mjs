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
import {projects as content, groups, pageCopy, archiveNames, coverPath} from './test-portfolio-content.mjs';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const socialIcons={Email:Mail,GitHub:Github,LinkedIn:Linkedin,YouTube:Youtube,Instagram:Instagram,'Book a call':CalendarDays,'Résumé':FileText};
const socialIcon=label=>label==='X'?'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2.1l8.2-9.4L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.5 4H4.7L17.8 20Z"/></svg>':renderToStaticMarkup(createElement(socialIcons[label],{size:20,strokeWidth:1.6,'aria-hidden':true}));
const section = item => `<section><h4>${escape(item.title)}</h4>${item.body ? `<p>${escape(item.body)}</p>` : ''}${item.bullets ? `<ul>${item.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}</section>`;

// Every project: voice copy from the content module, facts from src/data.
const projects = content.map(p => {
  const archiveEntry = archive.find(a => a.name === archiveNames[p.slug]);
  const sections = p.sections || archiveEntry?.details || [];
  const tech = p.tech?.length ? p.tech : (archiveEntry?.tech || []);
  return {...p, tech, sections, demo: p.demo || archiveEntry?.demo || null, deck: p.deck || p.hook};
});
const bySlug = slug => projects.find(p => p.slug === slug);
const covers = (p, alt='') => `<span class="realm-covers proj-art" ${alt?`role="img" aria-label="${escape(alt)}"`:'aria-hidden="true"'}>${['seireitei','hueco'].map(realm=>`<img class="project-cover" data-cover-realm="${realm}" src="${coverPath(p.slug,realm)}" alt="" loading="lazy" width="480" height="270">`).join('')}</span>`;
const studyBody = p => `<div class="study" hidden><p class="case-label">${escape(p.status)}</p><div class="case-sections">${p.sections.map(section).join('')}</div>${p.url ? `<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>` : '<p class="private-note">Source kept private for now.</p>'}${p.demo ? `<a class="text-link" href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer">Watch the demo</a>` : ''}</div>`;
const actions = p => `<div class="proj-actions">${p.sections.length ? `<button type="button" class="proj-open" aria-haspopup="dialog">Case study</button>` : ''}${p.url ? `<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Source</a>` : ''}${p.demo ? `<a href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}</div>`;
const projectCard = p => `<article class="proj proj--card" id="project-${p.slug}" data-group="${p.group}" data-kicker="${escape(p.kind)}" data-status="${escape(p.status)}" data-deck="${escape(p.deck)}"><button type="button" class="proj-open proj-art-button" aria-haspopup="dialog" aria-label="Open ${escape(p.name)} case study">${covers(p)}</button><div class="proj-copy"><p class="proj-kicker">${escape(p.kind)}</p><h3><button type="button" class="proj-open">${escape(p.name)}</button></h3><p class="proj-hook">${escape(p.hook)}</p><p class="proj-stack">${p.tech.slice(0,5).map(escape).join(' · ')}</p>${actions(p)}</div>${studyBody(p)}</article>`;
const projectRow = p => `<article class="proj proj--row" id="project-${p.slug}" data-group="${p.group}" data-kicker="${escape(p.kind)}" data-status="${escape(p.status)}" data-deck="${escape(p.deck)}"><button type="button" class="proj-open proj-art-button" aria-haspopup="dialog" aria-label="Open ${escape(p.name)} case study">${covers(p)}</button><div class="proj-copy"><h3><button type="button" class="proj-open">${escape(p.name)}</button></h3><p class="proj-hook">${escape(p.hook)}</p><p class="proj-stack">${p.tech.slice(0,4).map(escape).join(' · ')}<span class="proj-kicker">${escape(p.kind)}</span></p>${actions(p)}</div>${studyBody(p)}</article>`;
const workGroups = Object.entries(groups).map(([key, g]) => {
  const items = projects.filter(p => p.group === key);
  const cards = items.filter(p => p.featured), rows = items.filter(p => !p.featured);
  return `<section class="work-group" data-group="${key}" aria-labelledby="group-${key}"><header class="work-group-head"><h2 id="group-${key}" class="display">${escape(g.title)}</h2><p>${escape(g.lead)}</p><span class="work-group-count">${items.length} ${items.length===1?'project':'projects'}</span></header>${cards.length ? `<div class="proj-grid">${cards.map(projectCard).join('')}</div>` : ''}${rows.length ? `<div class="proj-rows">${rows.map(projectRow).join('')}</div>` : ''}</section>`;
}).join('');
const roleMarkup = roles.map(r => `<details class="role"><summary><h3>${escape(r.company)}</h3><p class="role-name">${escape(r.role)}</p><span class="role-date mono">${escape(r.dateLabel)}</span><p class="role-preview">${escape(r.summary.split('. ').slice(0,2).join('. '))}</p><span class="role-hint">Read about this role <span aria-hidden="true">+</span></span></summary><div class="role-body"><p>${escape(r.summary)}</p>${r.sections ? r.sections.map(section).join('') : ''}</div></details>`).join('');
const featuredMarkup = ['justhireme','svara','odeon'].map(slug=>{
 const p=bySlug(slug);
 return `<article class="featured-card"><a class="featured-preview" href="#project-${p.slug}" aria-label="Read ${escape(p.name)} case study">${covers(p, `${p.name} product preview`)}</a><div class="featured-copy"><div class="featured-title"><h3><a href="#project-${p.slug}">${escape(p.name)}</a></h3>${p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.name)} source on GitHub">${socialIcon('GitHub')}</a>`:''}</div><p>${escape(p.hook)}</p><p class="proj-stack">${p.tech.slice(0,4).map(escape).join(' · ')}</p><a class="card-study" href="#project-${p.slug}">Read case study</a></div></article>`;
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
    const p=projects.find(p=>p.name===v.name);
    const original=originalFor(v.name);
    const details=p.sections.length?p.sections:(original?.details||[]);
    const id=v.url.startsWith('#')?null:new URL(v.url).searchParams.get('v');
    return `<a class="video-link" href="${escape(v.url)}" aria-haspopup="dialog">${covers(p, `${p.name} product preview`)}<span><strong>${escape(p.name)}</strong><small>${escape(p.hook)}</small><span class="study-cta">Watch the walkthrough</span></span></a>${id?`<template id="film-${id}"><h2>${escape(p.name)}</h2><p class="film-summary">${escape(p.deck)}</p><div class="case-stack">${p.tech.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="case-sections">${details.map(section).join('')}</div>${p.url?`<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>`:''}</template>`:''}`;
  }).join(''),
  WORKGROUPS: workGroups,
  WORKINTRO: escape(pageCopy.intro),
  WORKEYEBROW: escape(pageCopy.eyebrow),
  VIDEOSLEAD: escape(pageCopy.videosLead),
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
