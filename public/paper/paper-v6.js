import './paper-keyboard-v4.js';
let navigationRequested=false;
function showPage() {
  const id = location.hash.slice(1);
  const project = id.startsWith('project-') ? document.getElementById(id) : null;
  const current = document.querySelector('[data-panel]:not([hidden])')?.dataset.panel || 'home';
  const page = id === 'projects' || project?.classList.contains('proj') ? 'projects' : id === 'work-with-me' ? current : id.startsWith('contact') ? 'contact' : 'home';
  document.title=page==='home'?'Vasu-Devs — AI Engineer':(page==='projects'?'Work':'Contact')+' — Vasu-Devs';
  const fromNavigation=navigationRequested||document.activeElement?.closest('.navigation');navigationRequested=false;
  document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== page; });
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === (id==='about'?'about':id==='work-with-me'?'contact':page)) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if(id==='projects'||id==='home'||id.startsWith('contact'))requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
  if(id.startsWith('contact'))document.dispatchEvent(new CustomEvent('contact-page',{detail:{tab:id==='contact/call'?'call':'message'}}));
  if(id==='about')requestAnimationFrame(()=>document.getElementById('about').scrollIntoView({behavior:'instant',block:'start'}));
  // Contact lives below both panels; keep the current panel and scroll to it.
  if(id==='work-with-me')requestAnimationFrame(()=>document.getElementById('work-with-me').scrollIntoView({behavior:'smooth',block:'start'}));
  if(project?.classList.contains('proj')) { requestAnimationFrame(() => {project.dispatchEvent(new CustomEvent('open-detail'));}); }
  if(fromNavigation&&!project)requestAnimationFrame(()=>{const heading=document.querySelector('[data-panel="'+page+'"] h1,[data-panel="'+page+'"] h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}});
}
window.addEventListener('hashchange', showPage);
document.querySelector('.navigation')?.addEventListener('click',event=>{const link=event.target.closest('a[data-page]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;navigationRequested=true;if(link.hash===location.hash)queueMicrotask(showPage)},true);
showPage();
document.querySelector('.skip')?.addEventListener('click',event=>{event.preventDefault();document.querySelector('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})});


const resumeModal=document.querySelector('.resume-modal');
if(resumeModal){
 let resumeOpener=null;
 document.querySelectorAll('a[href="/resume.html"]').forEach(link=>{
  link.removeAttribute('target');link.setAttribute('aria-haspopup','dialog');
  link.addEventListener('click',event=>{event.preventDefault();resumeOpener=link;resumeModal.showModal();document.documentElement.classList.add('resume-open');});
 });
 resumeModal.querySelector('[data-resume-close]').addEventListener('click',()=>resumeModal.close());
 resumeModal.querySelector('[data-resume-print]').addEventListener('click',()=>window.print());
 resumeModal.addEventListener('click',event=>{if(event.target!==resumeModal)return;const r=resumeModal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)resumeModal.close();});
 resumeModal.addEventListener('close',()=>{document.documentElement.classList.remove('resume-open');resumeOpener?.focus();});
}

// One shared reading dialog; content is moved in from the source so links keep working.
const readingDialog=document.createElement('dialog');
readingDialog.className='resume-modal detail-modal';
readingDialog.setAttribute('aria-labelledby','detail-title');
readingDialog.innerHTML='<div class="resume-toolbar"><div><span class="modal-kicker">Project</span><h2 id="detail-title"></h2><p class="detail-role"></p></div><button type="button" aria-label="Close details">Close ×</button></div><div class="resume-content"><div class="detail-cover realm-covers" hidden></div><div class="detail-layout"><aside class="detail-meta" hidden><p class="detail-status"></p><p class="detail-stack"></p><div class="detail-links"></div></aside><div class="detail-main"><p class="detail-deck"></p><div class="detail-body"></div></div></div></div>';
document.body.append(readingDialog);
let detailSource=null,detailOpener=null,detailNodes=[];
const q=(sel)=>readingDialog.querySelector(sel);
function openDetail(source,opener){
 if(readingDialog.open)return;
 const isRole=source.classList.contains('role');
 const summary=isRole?source.querySelector(':scope > summary'):null;
 detailSource=source;detailOpener=opener||summary||source.querySelector('.proj-open');
 const title=isRole?summary.querySelector('h3').textContent:source.querySelector('h3').textContent;
 q('#detail-title').textContent=title.trim();
 q('.detail-role').textContent=isRole?summary.querySelector('.role-name').textContent:'';
 q('.modal-kicker').textContent=isRole?'Experience':(source.dataset.kicker||'Project');
 q('.detail-deck').textContent=isRole?(summary.querySelector('.role-preview')?.textContent||''):(source.dataset.deck||'');
 // Cover strip and side rail only exist for projects.
 const cover=q('.detail-cover'),meta=q('.detail-meta');
 cover.replaceChildren();meta.hidden=true;cover.hidden=true;
 if(!isRole){
  const art=source.querySelector('.proj-art');
  let videoId;
  for(const link of source.querySelectorAll('.proj-actions a[href]')){
   try{const url=new URL(link.href);const id=url.hostname==='youtu.be'?url.pathname.slice(1):['www.youtube.com','youtube.com'].includes(url.hostname)?url.searchParams.get('v'):null;if(id&&/^[\w-]{11}$/.test(id)){videoId=id;break;}}catch{}
  }
  cover.classList.toggle('has-video',Boolean(videoId));
  if(videoId){
   const frame=document.createElement('iframe');
   frame.title=`${title.trim()} — project demo`;
   frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
   frame.allowFullscreen=true;
   frame.referrerPolicy='strict-origin-when-cross-origin';
   // Request audible playback after opening; native player controls remain available if autoplay is blocked.
   frame.src=`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&rel=0`;
   cover.append(frame);cover.hidden=false;
  }else if(art){const copy=art.cloneNode(true);copy.removeAttribute('aria-hidden');cover.append(copy);cover.hidden=false;}
  q('.detail-status').textContent=source.dataset.status||'';
  const techRow=source.querySelector(':scope > .study .study-tech');q('.detail-stack').replaceChildren();if(techRow)q('.detail-stack').append(techRow.firstElementChild.cloneNode(true));
  const links=q('.detail-links');links.replaceChildren();
  for(const a of source.querySelectorAll('.proj-actions a')){const copy=a.cloneNode(true);copy.removeAttribute('title');copy.classList.add('icon-action');links.append(copy);}
  meta.hidden=false;
  const study=source.querySelector(':scope > .study');
  detailNodes=[...study.children];
 }else{
  detailNodes=[...source.children].filter(n=>n!==summary);
 }
 q('.detail-body').append(...detailNodes);
 q('.detail-deck').hidden=isRole&&q('.detail-body p')?.textContent.trim()===q('.detail-deck').textContent.trim();
 if(isRole)source.open=false;
 readingDialog.showModal();document.documentElement.classList.add('detail-open');
 readingDialog.scrollTop=0;q('.resume-content').scrollTop=0;q('button').focus({preventScroll:true});
}
for(const source of document.querySelectorAll('details.role')){
 const summary=source.querySelector(':scope > summary');summary.setAttribute('aria-haspopup','dialog');
 summary.addEventListener('click',event=>{event.preventDefault();openDetail(source);});
}
for(const source of document.querySelectorAll('.proj')){
 source.addEventListener('open-detail',()=>openDetail(source));
}
document.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const button=event.target.closest('.proj-open,[data-open]');
 if(button){const source=button.closest('.proj');if(source)openDetail(source,button);return;}
 // Anywhere else on a project card or selected item opens the case study; real links and buttons keep their own job.
 if(event.target.closest('a,button,summary,input,select,textarea'))return;
 const card=event.target.closest('.proj');
 if(card){event.preventDefault();openDetail(card,card.querySelector('.proj-open'));return;}
 const item=event.target.closest('.selected-item,.featured-card');
 if(item){const link=item.querySelector('h3 a[href^="#project-"]');const source=link&&document.getElementById(link.getAttribute('href').slice(1));if(source){event.preventDefault();openDetail(source,link);}}
});
// In-page project links open a reading layer without changing page or scroll.
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href^="#project-"]');
 if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const source=document.getElementById(link.getAttribute('href').slice(1));
 if(!source?.classList.contains('proj'))return;
 event.preventDefault();openDetail(source,link);
});
readingDialog.querySelector('button').addEventListener('click',()=>readingDialog.close());
readingDialog.addEventListener('click',event=>{if(event.target!==readingDialog)return;const r=readingDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)readingDialog.close();});
readingDialog.addEventListener('close',()=>{
 q('.detail-cover').replaceChildren();q('.detail-cover').classList.remove('has-video');
 if(detailSource?.classList.contains('proj'))detailSource.querySelector(':scope > .study').append(...detailNodes);
 else detailSource?.append(...detailNodes);
 detailNodes=[];document.documentElement.classList.remove('detail-open');detailOpener?.focus({preventScroll:true});
});
// Project films stay in context; remove the player on close so playback stops.
const filmDialog=document.createElement('dialog');
filmDialog.className='resume-modal film-modal';filmDialog.setAttribute('aria-labelledby','film-title');
filmDialog.innerHTML='<div class="resume-toolbar"><div><span class="modal-kicker">Walkthrough</span><h2 id="film-title"></h2></div><button type="button" aria-label="Close video">Close ×</button></div><div class="film-body"><div class="film-player"></div><div class="resume-content film-description"></div></div>';
document.body.append(filmDialog);
let filmOpener;
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href]');if(!link||filmDialog.contains(link)||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 let url;try{url=new URL(link.href);}catch{return;}
 if(!['www.youtube.com','youtube.com','youtu.be'].includes(url.hostname))return;
 const id=url.hostname==='youtu.be'?url.pathname.slice(1):url.searchParams.get('v');
 if(!id||!/^[\w-]{11}$/.test(id))return;
 const template=document.getElementById(`film-${id}`);if(!template)return;
 event.preventDefault();filmOpener=link;
 const body=filmDialog.querySelector('.film-description');body.replaceChildren(template.content.cloneNode(true));const filmName=body.querySelector('h2').textContent;filmDialog.querySelector('#film-title').textContent=filmName;body.querySelector('h2').remove();
 const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=0&playsinline=1&rel=0`;iframe.title=`${filmName} project walkthrough`;iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
 filmDialog.querySelector('.film-player').replaceChildren(iframe);
 const fallback=document.createElement('a');fallback.href=url.href;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.className='film-fallback';fallback.textContent='Watch on YouTube';body.append(fallback);
 filmDialog.showModal();filmDialog.scrollTop=0;document.documentElement.classList.add('film-open');filmDialog.querySelector('button').focus();
});
filmDialog.querySelector('button').addEventListener('click',()=>filmDialog.close());
filmDialog.addEventListener('click',event=>{if(event.target!==filmDialog)return;const r=filmDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)filmDialog.close();});
filmDialog.addEventListener('close',()=>{filmDialog.querySelector('.film-player').replaceChildren();document.documentElement.classList.remove('film-open');filmOpener?.focus({preventScroll:true});});

// Navigation belongs to the viewport, outside the content stacking context.
const bottomNavigation=document.querySelector('.navigation');
for(const close of document.querySelectorAll('[aria-label="Close details"],[aria-label="Close video"],[data-resume-close]')){close.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';}


// Share the main portfolio's counters and visitor identity; never invent numbers.
const traffic=document.querySelector('.traffic-stats');
if(traffic){
 let tracked=false,busy=false,timer;
 const local=['localhost','127.0.0.1'].includes(location.hostname);
 async function refreshTraffic(){
  if(document.hidden||busy)return;busy=true;
  const trackView=!tracked&&!local;let trackUnique=false;
  try{trackUnique=trackView&&localStorage.getItem('portfolio:traffic:unique-tracked')!=='1';}catch{}
  // A failed response may still have counted: retries are read-only.
  tracked=true;
  try{
   const response=await fetch('/api/traffic',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({trackView,trackUnique}),signal:AbortSignal.timeout(8000)});
   if(!response.ok)throw Error('Traffic unavailable');const stats=await response.json();
   if(!['totalViews','uniqueVisitors','activeNow'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0))throw Error('Invalid traffic data');
   for(const node of traffic.querySelectorAll('[data-traffic]'))node.textContent=stats[node.dataset.traffic].toLocaleString();
   traffic.dataset.state='available';traffic.querySelector('.traffic-status').textContent='Portfolio activity';
   if(trackUnique)try{localStorage.setItem('portfolio:traffic:unique-tracked','1');}catch{}
  }catch{traffic.dataset.state='unavailable';traffic.querySelector('.traffic-status').textContent='Views unavailable';traffic.title=local?'Live view counts are not connected in this local preview':'Activity temporarily unavailable';}
  finally{busy=false;}
 }
 const schedule=()=>{clearInterval(timer);if(!document.hidden){void refreshTraffic();timer=setInterval(refreshTraffic,60000);}};
 document.addEventListener('visibilitychange',schedule);window.addEventListener('pagehide',()=>clearInterval(timer));schedule();
}

const contactDialog=document.querySelector('.contact-dialog'),contactTrigger=document.querySelector('[data-open-contact]');
if(contactDialog&&contactTrigger){
 contactTrigger.addEventListener('click',()=>{contactDialog.showModal();});
 contactDialog.querySelector('[data-close-contact]').addEventListener('click',()=>contactDialog.close());
 contactDialog.addEventListener('click',event=>{if(event.target!==contactDialog)return;const r=contactDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)contactDialog.close();});
 contactDialog.addEventListener('close',()=>contactTrigger.focus({preventScroll:true}));
}

// Isolated typography comparison, enabled only by the local preview query.
const typePreview=new URLSearchParams(location.search).get('type-preview');
if(['humanist','condensed','editorial'].includes(typePreview)){
 document.documentElement.dataset.typePreview=typePreview;
 requestAnimationFrame(()=>document.querySelector('#project-justhireme')?.dispatchEvent(new Event('open-detail')));
}

// Copy the email address; the button confirms briefly, then resets.
const contactEmail=document.querySelector('#contact .contact-directory a[href^="mailto:"]');
if(contactEmail){const copy=document.createElement('button');copy.type='button';copy.className='copy-mail';copy.dataset.copy=decodeURIComponent(contactEmail.getAttribute('href').slice(7));copy.textContent='Copy';copy.setAttribute('aria-label','Copy email address');contactEmail.parentElement.classList.add('directory-email-row');contactEmail.after(copy)}
const copyFeedback=document.createElement('span');copyFeedback.className='sr-only';copyFeedback.setAttribute('role','status');copyFeedback.setAttribute('aria-live','polite');document.body.append(copyFeedback);
for(const button of document.querySelectorAll('.copy-mail')){
 button.addEventListener('click',async()=>{
  button.classList.remove('is-done');copyFeedback.textContent='';
  try{await navigator.clipboard.writeText(button.dataset.copy);button.textContent='Copied';button.classList.add('is-done');}
  catch{const link=button.closest('li')?.querySelector('.directory-address')||button.previousElementSibling;const range=document.createRange();range.selectNodeContents(link);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);button.textContent='Selected';}
  copyFeedback.textContent=button.classList.contains('is-done')?'Email address copied.':'Email address selected. Use your device’s copy command.';
  setTimeout(()=>{button.textContent='Copy';button.classList.remove('is-done');copyFeedback.textContent='';},1800);
 });
}
