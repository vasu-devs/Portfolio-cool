import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Mail, Linkedin, Youtube, Instagram, CalendarDays, FileText } from 'lucide-react';
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
import {projects as content, groups, pageCopy, archiveNames, coverPath, skillShelves, techIcons} from './test-portfolio-content.mjs';
import * as si from 'react-icons/si';
import * as sic from 'simple-icons';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const socialIcons={Email:Mail,GitHub:null,LinkedIn:Linkedin,YouTube:Youtube,Instagram:Instagram,'Book a call':CalendarDays,'Résumé':FileText};
const socialIcon=label=>label==='GitHub'?siSvg('SiGithub',20):label==='X'?'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2.1l8.2-9.4L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.5 4H4.7L17.8 20Z"/></svg>':renderToStaticMarkup(createElement(socialIcons[label],{size:20,strokeWidth:1.6,'aria-hidden':true}));
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
const studyBody = p => `<div class="study" hidden><div class="study-tech">${techRow(p.tech,12)}</div><p class="case-label">${escape(p.status)}</p><div class="case-sections">${p.sections.map(section).join('')}</div>${p.url ? `<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>` : '<p class="private-note">Source kept private for now.</p>'}${p.demo ? `<a class="text-link" href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer">Watch the demo</a>` : ''}</div>`;
let svgSerial=0;
const deviconSvg=slug=>{const dir=resolve(root,'node_modules/devicon/icons',slug);const file=['-original.svg','-plain.svg','-original-wordmark.svg','-plain-wordmark.svg','-line.svg'].map(x=>resolve(dir,slug+x)).find(f=>{try{readFileSync(f);return true;}catch{return false;}});if(!file)throw new Error(`No devicon for ${slug}`);// Devicon files reuse gradient ids like "a"; give every inline copy its own so a hidden first copy cannot blank the rest.
const uniqueIds=svg=>{const n=++svgSerial;return svg.replace(/id="([^"]+)"/g,(m,id)=>`id="${id}-d${n}"`).replace(/url\(#([^)]+)\)/g,(m,id)=>`url(#${id}-d${n})`).replace(/href="#([^"]+)"/g,(m,id)=>`href="#${id}-d${n}"`);};
return uniqueIds(readFileSync(file,'utf8').replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g,'').replace(/<svg /,'<svg aria-hidden="true" '));};
const siSvg=(name,size=18)=>{const Icon=si[name];if(!Icon)throw new Error(`Unknown icon ${name}`);return renderToStaticMarkup(createElement(Icon,{size,'aria-hidden':true}));};
// simple-icons marks carry the brand hex; near-black or white brands fall back to the realm ink.
const sicSvg=name=>{const icon=sic[name];if(!icon)throw new Error(`Unknown simple-icon ${name}`);const hex=icon.hex.toLowerCase();const [r,g,b]=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));const lum=(r*299+g*587+b*114)/1000;const mono=lum<70||lum>235;return {svg:icon.svg.replace('<svg ',`<svg aria-hidden="true" ${mono?'':`fill="#${hex}"`} `).replace(/<title>[^<]*<\/title>/,''),mono};};
const fileSvg=name=>readFileSync(resolve(root,'public/test/logos',name),'utf8').replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g,'').replace(/<svg /,'<svg aria-hidden="true" ');
// One renderer for every logo source: devicon slug, simple-icons (brand colour), react-icons (ink), inline file, or raster.
const markFor=name=>{const spec=techIcons[name];if(!spec)throw new Error(`No logo for ${name}`);if(typeof spec==='string')return {mark:deviconSvg(spec),cls:''};const [kind,ref]=spec;if(kind==='sic'){const m=sicSvg(ref);return {mark:m.svg,cls:m.mono?' tech--mono':''};}if(kind==='si')return {mark:siSvg(ref,16),cls:' tech--mono'};if(kind==='file')return {mark:fileSvg(ref),cls:''};if(kind==='img')return {mark:`<img src="${escape(ref)}" alt="" width="18" height="18" loading="lazy">`,cls:' tech--img'};throw new Error(`Bad logo spec for ${name}`);};
// Stack as logos with a hover tooltip. Unknown names get a lettermark so nothing silently disappears.
const techMark=name=>{const {mark,cls}=markFor(name);return `<li class="tech${cls}" data-tip="${escape(name)}" tabindex="0">${mark}<span class="sr">${escape(name)}</span></li>`;};
const techRow=(list,limit=6)=>`<ul class="tech-row" aria-label="Built with">${list.slice(0,limit).map(techMark).join('')}${list.length>limit?`<li class="tech tech--more" data-tip="${escape(list.slice(limit).join(', '))}" tabindex="0">+${list.length-limit}<span class="sr">${escape(list.slice(limit).join(', '))}</span></li>`:''}</ul>`;
const ACTION_ICONS={study:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8.5L19 8v12.5H6z" fill="currentColor" opacity=".18"/><path d="M6 3.5h8.5L19 8v12.5H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 3.5V8H19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12h7M9 15.5h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8z" fill="currentColor"/><path d="M10 8.75v6.5L15.5 12z" fill="var(--page)"/></svg>',live:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};
const glyph=(Icon,size=18)=>renderToStaticMarkup(createElement(Icon,{size,strokeWidth:1.75,'aria-hidden':true}));
const iconAction=(tag,attrs,kind,label)=>`<${tag} ${attrs} class="icon-action icon-action--${kind}" aria-label="${escape(label)}" data-tip="${escape(label)}">${kind==='github'?siSvg('SiGithub',20):ACTION_ICONS[kind]}<span class="sr">${escape(label)}</span></${tag}>`;
const actions = p => `<div class="proj-actions">${p.sections.length ? iconAction('button','type="button" data-open aria-haspopup="dialog"','study','Case study') : ''}${p.url ? iconAction('a',`href="${escape(p.url)}" target="_blank" rel="noopener noreferrer"`,'github','Source on GitHub') : ''}${p.demo ? iconAction('a',`href="${escape(p.demo)}" aria-haspopup="dialog"`,'play','Watch walkthrough') : ''}${p.live ? iconAction('a',`href="${escape(p.live)}" target="_blank" rel="noopener noreferrer"`,'live','Open live site') : ''}</div>`;
const projectCard = p => `<article class="proj proj--card" id="project-${p.slug}" data-group="${p.group}" data-kicker="${escape(p.kind)}" data-status="${escape(p.status)}" data-deck="${escape(p.deck)}" data-tech="${escape(p.tech.join('|'))}"><button type="button" class="proj-open proj-art-button" aria-haspopup="dialog" aria-label="Open ${escape(p.name)} case study">${covers(p)}</button><div class="proj-copy"><p class="proj-kicker">${escape(p.kind)}</p><h3><button type="button" class="proj-open">${escape(p.name)}</button></h3><p class="proj-hook">${escape(p.hook)}</p>${techRow(p.tech,6)}${actions(p)}</div>${studyBody(p)}</article>`;
const projectRow = p => `<article class="proj proj--row" id="project-${p.slug}" data-group="${p.group}" data-kicker="${escape(p.kind)}" data-status="${escape(p.status)}" data-deck="${escape(p.deck)}" data-tech="${escape(p.tech.join('|'))}"><button type="button" class="proj-open proj-art-button" aria-haspopup="dialog" aria-label="Open ${escape(p.name)} case study">${covers(p)}</button><div class="proj-copy"><h3><button type="button" class="proj-open">${escape(p.name)}</button></h3><p class="proj-hook">${escape(p.hook)}</p><div class="proj-meta">${techRow(p.tech,6)}<span class="proj-kicker">${escape(p.kind)}</span></div>${actions(p)}</div>${studyBody(p)}</article>`;
const workGroups = Object.entries(groups).map(([key, g]) => {
  const items = projects.filter(p => p.group === key);
  const cards = items.filter(p => p.featured), rows = items.filter(p => !p.featured);
  return `<section class="work-group" data-group="${key}" aria-labelledby="group-${key}"><header class="work-group-head"><h2 id="group-${key}" class="display">${escape(g.title)}</h2><p>${escape(g.lead)}</p><span class="work-group-count">${items.length} ${items.length===1?'project':'projects'}</span></header>${cards.length ? `<div class="proj-grid">${cards.map(projectCard).join('')}</div>` : ''}${rows.length ? `<div class="proj-rows">${rows.map(projectRow).join('')}</div>` : ''}</section>`;
}).join('');
const roleMarkup = roles.map(r => `<details class="role"><summary><h3>${escape(r.company)}</h3><p class="role-name">${escape(r.role)}</p><span class="role-date mono">${escape(r.dateLabel)}</span><p class="role-preview">${escape(r.summary.split('. ').slice(0,2).join('. '))}</p>${r.tech?.length?`<div class="role-tech">${techRow(r.tech,9)}</div>`:''}<span class="role-hint">Read about this role <span aria-hidden="true">+</span></span></summary><div class="role-body"><p>${escape(r.summary)}</p>${r.sections ? r.sections.map(section).join('') : ''}</div></details>`).join('');
const featuredMarkup = ['justhireme','svara','odeon'].map(slug=>{
 const p=bySlug(slug);
 return `<article class="featured-card"><a class="featured-preview" href="#project-${p.slug}" aria-label="Read ${escape(p.name)} case study">${covers(p, `${p.name} product preview`)}</a><div class="featured-copy"><div class="featured-title"><h3><a href="#project-${p.slug}">${escape(p.name)}</a></h3>${p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.name)} source on GitHub">${socialIcon('GitHub')}</a>`:''}</div><p>${escape(p.hook)}</p><p class="proj-stack">${p.tech.slice(0,4).map(escape).join(' · ')}</p><a class="card-study" href="#project-${p.slug}">Read case study</a></div></article>`;
}).join('');
// The message form and inline booking, rendered once on Home and once on the Contact page.
const contactBlock = ns => {
  const by=label=>socials.find(x=>x.label===label);
  const tile=(label,kind)=>{const x=by(label);return x?`<a class="icon-action icon-action--${kind}" href="${escape(x.url)}"${x.url.startsWith('https')?' target="_blank" rel="noopener noreferrer"':''} aria-label="${escape(label)}" data-tip="${escape(label)}">${kind==='github'?siSvg('SiGithub',20):kind==='youtube'?siSvg('SiYoutube',20):kind==='linkedin'?siSvg('SiLinkedin',19):kind==='resume'?ACTION_ICONS.study:socialIcon(label)}<span class="sr">${escape(label)}</span></a>`:'';};
  return `<div class="contact-shell">
<aside class="contact-rail"><div class="contact-who"><img src="/test/avatars/vasu-seireitei-v2.png" alt="" width="56" height="56" class="contact-avatar" data-realm="seireitei"><img src="/test/avatars/vasu-hueco-v4.png" alt="" width="56" height="56" class="contact-avatar" data-realm="hueco"><div><strong>${escape(resume.name)}</strong><span>${escape(resume.headline)}</span></div></div><p class="contact-reply"><i aria-hidden="true"></i>Usually replies within a day</p><div class="contact-mail"><a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a><button type="button" class="copy-mail" data-copy="${escape(resume.email)}">Copy</button></div><div class="contact-socials">${tile('GitHub','github')}${tile('LinkedIn','linkedin')}${tile('X','x')}${tile('YouTube','youtube')}${tile('Résumé','resume')}</div></aside>
<div class="contact-panel-wrap"><div class="contact-switch" role="tablist" aria-label="How to reach me"><button type="button" role="tab" id="${ns}-tab-message" aria-controls="${ns}-panel-message" aria-selected="true">Send a message</button><button type="button" role="tab" id="${ns}-tab-call" aria-controls="${ns}-panel-call" aria-selected="false">Book a call</button></div>
<div class="contact-panels">
<div class="contact-panel" id="${ns}-panel-message" role="tabpanel" aria-labelledby="${ns}-tab-message"><form class="message-form" novalidate><div class="field-row"><label>Your name<input name="name" autocomplete="name" required maxlength="120" placeholder="Ada Lovelace"></label><label>Your email<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com"></label></div><label>Message<textarea name="message" required minlength="10" maxlength="4000" rows="5" placeholder="The role, the project, the problem. A few lines is plenty."></textarea></label><label class="hp" aria-hidden="true">Company<input name="company" tabindex="-1" autocomplete="off"></label><div class="form-foot"><button type="submit" class="button-primary">Send message<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><p class="form-status" role="status" aria-live="polite"></p></div><p class="form-note">Lands in <a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a>. I reply from there.</p></form></div>
<div class="contact-panel" id="${ns}-panel-call" role="tabpanel" aria-labelledby="${ns}-tab-call" hidden><div class="cal-embed" data-cal-link="vasu-devs" data-cal-ns="${ns}" aria-label="Pick a time for a call"><p class="cal-loading">Loading available times…</p></div><p class="form-note">A 30-minute call. The invite goes to both of us the moment you confirm. If the calendar does not load, <a href="https://cal.com/vasu-devs" target="_blank" rel="noopener noreferrer">open it on cal.com</a>.</p></div>
</div></div></div>`;
};
const replacements = {
 FEATURED: featuredMarkup,
 CONTACTOPTIONS: ['Email','Book a call','LinkedIn'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(s=>`<a href="${escape(s.url)}" ${s.url.startsWith('https')?'target="_blank" rel="noopener noreferrer"':''}>${socialIcon(s.label)}<span><strong>${escape(s.label==='Email'?'Email me':s.label==='LinkedIn'?'Message on LinkedIn':s.label)}</strong><small>${escape(s.label==='Email'?resume.email:s.label==='Book a call'?'Choose a time on my calendar':'Connect or send me a message')}</small></span></a>`).join(''),
  CONTACTHERO: (()=>{
    const by=label=>socials.find(s=>s.label===label);
    const ways=[['Book a call','Pick a slot on cal.com'],['LinkedIn','Connect or send a message'],['GitHub','Source for most of this page'],['Résumé','One page, print or save as PDF']].map(([label,note])=>{const s=by(label);return `<li><a href="${escape(s.url)}"${s.url.startsWith('https')?' target="_blank" rel="noopener noreferrer"':''}><span class="way-label">${escape(label)}<span aria-hidden="true">→</span></span><span class="way-note">${escape(note)}</span></a></li>`;}).join('');
    return `<div class="contact-mail"><a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a><button type="button" class="copy-mail" data-copy="${escape(resume.email)}">Copy</button></div><ul class="contact-ways">${ways}</ul>`;
  })(),
  FILMSLOT: '',
  RESUME: `<header><h2 id="resume-title">${escape(resume.name)}</h2><p>${escape(resume.headline)}</p><a href="mailto:${escape(resume.email)}">${escape(resume.email)}</a></header><p>${escape(resume.summary)}</p><h3>Experience</h3>${resume.experience.map(r=>`<section><h4>${escape(r.role)} · ${escape(r.company)}</h4><small>${escape(r.dates)}</small><ul>${r.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul></section>`).join('')}<h3>Selected projects</h3>${resume.projects.map(p=>`<section><h4>${escape(p.name)}</h4><ul>${p.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul>${p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Repository</a>`:''}</section>`).join('')}<h3>Skills</h3><dl>${resume.skills.map(s=>`<dt>${escape(s.label)}</dt><dd>${escape(s.text)}</dd>`).join('')}</dl><h3>Education</h3><p>${escape(resume.education.institution)} · ${escape(resume.education.dates)}<br>${escape(resume.education.detail)}</p>`,
  CONTACTS: (()=>{
    const link=s=>`<a href="${escape(s.url)}" data-social="${escape(s.label.toLowerCase().replaceAll(' ','-'))}" aria-label="${escape(s.label)}" title="${escape(s.label)}"${s.url.startsWith('mailto:')?'':' target="_blank" rel="noopener noreferrer"'}>${socialIcon(s.label)}<span class="contact-label">${escape(s.label)}</span></a>`;
    return `<div class="social-icon-row">${['X','GitHub','LinkedIn','Email','YouTube','Instagram'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(link).join('')}</div><div class="contact-utilities">${['Résumé','Book a call'].map(label=>socials.find(s=>s.label===label)).filter(Boolean).map(link).join('')}</div>`;
  })(),
  FILMS: projects.filter(p=>p.demo).map(p=>{
    let id=null;try{const u=new URL(p.demo);id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');}catch{}
    if(!id)return '';
    const details=p.sections.length?p.sections:(originalFor(p.name)?.details||[]);
    return `<template id="film-${id}"><h2>${escape(p.name)}</h2><p class="film-summary">${escape(p.deck)}</p><div class="case-stack">${p.tech.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="case-sections">${details.map(section).join('')}</div>${p.url?`<a class="text-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Explore the repository</a>`:''}</template>`;
  }).join(''),
  SELECTED: ['justhireme','branchgpt','odeon'].map(slug=>{
    const p=bySlug(slug);
    return `<article class="selected-item"><a class="selected-art featured-preview" href="#project-${p.slug}" aria-label="Read ${escape(p.name)} case study">${covers(p, `${p.name} product preview`)}</a><div class="selected-copy"><p class="proj-kicker">${escape(p.kind)}</p><h3><a href="#project-${p.slug}">${escape(p.name)}</a></h3><p class="selected-summary">${escape(p.deck)}</p>${techRow(p.tech,7)}<div class="proj-actions">${iconAction('a',`href="#project-${p.slug}"`,'study','Case study')}${p.url?iconAction('a',`href="${escape(p.url)}" target="_blank" rel="noopener noreferrer"`,'github','Source on GitHub'):''}${p.demo?iconAction('a',`href="${escape(p.demo)}" aria-haspopup="dialog"`,'play','Watch walkthrough'):''}</div></div></article>`;
  }).join(''),
  SELECTEDLEAD: escape(pageCopy.selectedLead),
  SKILLSGRID: skillShelves.map(([label,names])=>`<div class="skill-group"><h3 class="skill-group-label">${escape(label)}</h3><ul class="skills-grid">${names.map(name=>{const {mark,cls}=markFor(name);return `<li class="skill${cls}"><span class="skill-icon">${mark}</span><span class="skill-name">${escape(name)}</span></li>`;}).join('')}</ul></div>`).join(''),
  HOMECONTACT: contactBlock('home'),
  CONTACTPAGE: (()=>{
    const labels={'Email':['Email','For roles, freelance work, or a question.'],'LinkedIn':['LinkedIn','Connect with me professionally.'],'Book a call':['Book a call','Choose a time on my calendar.'],'GitHub':['GitHub','My code and open-source projects.'],'YouTube':['YouTube','Project demos and things I’m building.'],'X':['X','Updates and conversations.'],'Instagram':['Instagram','Find me on Instagram.'],'Résumé':['Résumé','Read, print, or save my résumé.']};
    const contactLink=label=>{const s=socials.find(s=>s.label===label);if(!s)return '';const [title,note]=labels[label];const address=s.url.startsWith('mailto:')?s.url.slice(7):s.url.startsWith('https://')?s.url.slice(8).replace(/\/$/,''):'View résumé';return `<li><a href="${escape(s.url)}"${s.url.startsWith('https')?' target="_blank" rel="noopener noreferrer"':''}><span class="directory-icon" aria-hidden="true">${socialIcon(label)}</span><span class="directory-copy"><strong>${escape(title)}</strong><span class="directory-address">${escape(address)}</span><small>${escape(note)}</small></span></a></li>`;};
    return `<section id="contact" data-panel="contact" hidden><p class="contact-eyebrow"><i aria-hidden="true"></i>Open to work</p><h1 class="display">Contact</h1><p class="contact-lead">Email me about a role or project, book a call, or find me on the platforms below.</p>
<div class="contact-directory"><section aria-labelledby="reach-title"><h2 id="reach-title">Get in touch</h2><ul>${['Email','LinkedIn','Book a call','Résumé'].map(contactLink).join('')}</ul></section><section aria-labelledby="elsewhere-title"><h2 id="elsewhere-title">Elsewhere</h2><ul>${['GitHub','YouTube','X','Instagram'].map(contactLink).join('')}</ul></section></div>
<div class="contact-details"><dl class="contact-facts"><div><dt>Based in</dt><dd>India · IST (UTC+5:30)</dd></div><div><dt>Looking for</dt><dd>AI engineering and full-stack roles, freelance builds</dd></div><div><dt>Currently</dt><dd>AI Engineering intern at withlayer.ai</dd></div></dl></div></section>`;
  })(),
  WORKGROUPS: workGroups+'@@FILMSINLINE@@',
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
let page = template.replace(/@@([A-Z]+)@@/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Unknown template field: ${key}`);
  return replacements[key];
});
page = page.replace('@@FILMSINLINE@@', replacements.FILMS);
mkdirSync(resolve(root, 'public/test'), {recursive:true});
writeFileSync(resolve(root, 'public/test/index.html'), page);
console.log('Generated plain /test portfolio from approved public content.');
