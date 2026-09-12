import './soul-cursor.js?v=silent-159';

function showPage() {
  const id = location.hash.slice(1);
  const project = id.startsWith('project-') ? document.getElementById(id) : null;
  const current = document.querySelector('[data-panel]:not([hidden])')?.dataset.panel || 'home';
  const page = id === 'projects' || project?.classList.contains('proj') ? 'projects' : id === 'work-with-me' ? current : id.startsWith('contact') ? 'contact' : 'home';
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
}
window.addEventListener('hashchange', showPage);
showPage();

const dot = document.querySelector('.secret-dot');
const themeButton = document.querySelector('.theme-toggle');
const root = document.documentElement;
function themeLabel() {
 const light = root.dataset.theme === 'light';
 themeButton.title = light ? 'Switch to dark mode' : 'Switch to light mode';
 document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f4f3ed' : '#0b0e14');
 themeButton.setAttribute('aria-label', themeButton.title);
 themeButton.querySelector('.theme-label').textContent = '';
 themeButton.querySelector('.sun-icon').innerHTML = '<svg class="jigokucho" viewBox="0 0 40 40" aria-hidden="true"><g class="butterfly-wings" fill="var(--butterfly-wing)" stroke="var(--butterfly-edge)" stroke-width=".7" stroke-linejoin="round"><path d="M19 19C15 10 7 4 3 6 1 11 4 19 12 22 5 21 6 29 10 29l1 5 3-4c3-1 5-6 5-11Z"/><path d="M21 19C25 10 33 4 37 6c2 5-1 13-9 16 7-1 6 7 2 7l-1 5-3-4c-3-1-5-6-5-11Z"/><g fill="none" stroke="var(--butterfly-vein)" stroke-width="1.2"><path d="M18 20 6 9m11 12-9-5m10 7-6 5M22 20 34 9m-11 12 9-5m-10 7 6 5"/></g><path d="m9 25 3 1 2-2m17 1-3 1-2-2" fill="none" stroke="var(--butterfly-mark)" stroke-width="1.3"/></g><path d="M20 15v15m-1-14c0-5-2-6-4-7m6 7c0-5 2-6 4-7" fill="none" stroke="var(--butterfly-body)" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="20" cy="18" rx="1.5" ry="4" fill="var(--butterfly-body)"/></svg>';
}
themeLabel();
let requestedTheme = root.dataset.theme === 'light' ? 'light' : 'dark';
let activeReveal = null;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function applyTheme() {
 root.dataset.theme = requestedTheme;
 try { localStorage.setItem('vasu-theme', requestedTheme); } catch {}
 themeLabel();
}
function clearReveal() {
 if(!activeReveal)return;
 const previous=activeReveal;activeReveal=null;
 previous.skipTransition?.();
}
themeButton.addEventListener('click', () => {
 requestedTheme = requestedTheme === 'light' ? 'dark' : 'light';
 // Repeated activation always honors the newest choice, without stacked overlays.
 if(activeReveal){clearReveal();applyTheme();return;}
 if(reducedMotion.matches || !document.startViewTransition){applyTheme();return;}
 try {
  const transition=document.startViewTransition(applyTheme);
  activeReveal=transition;
  transition.ready.catch(()=>{});
  transition.finished.then(()=>{if(activeReveal===transition)activeReveal=null;},()=>{if(activeReveal===transition)activeReveal=null;});
 } catch {clearReveal();applyTheme();}
});
window.addEventListener('resize',clearReveal,{passive:true});
window.addEventListener('pagehide',clearReveal);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)clearReveal();});

const avatar = document.querySelector('.avatar-rotator');
const avatarPause = document.querySelector('.avatar-pause');
let preferredAvatar='';
try {preferredAvatar=localStorage.getItem('vasu-tybw-avatar')||'';}catch{}
avatar.dataset.portraitMode=['seireitei','hueco'].includes(preferredAvatar)?preferredAvatar:'theme';
avatarPause.hidden=true;


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
  if(art){for(const img of art.querySelectorAll('img')){const copy=img.cloneNode();copy.loading='eager';cover.append(copy);}cover.hidden=false;}
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
 const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?rel=0`;iframe.title=`${filmName} project walkthrough`;iframe.allow='encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
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
   traffic.querySelector('.traffic-status').textContent='Portfolio activity';
   if(trackUnique)try{localStorage.setItem('portfolio:traffic:unique-tracked','1');}catch{}
  }catch{traffic.querySelector('.traffic-status').textContent=local?'Activity counts available on the live site':'Activity temporarily unavailable';}
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
for(const button of document.querySelectorAll('.copy-mail')){
 button.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(button.dataset.copy);button.textContent='Copied';button.classList.add('is-done');}
  catch{const link=button.closest('.directory-copy-email')?document.querySelector('.contact-directory .directory-address'):button.previousElementSibling;const range=document.createRange();range.selectNodeContents(link);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);button.textContent='Selected';}
  setTimeout(()=>{button.textContent='Copy';button.classList.remove('is-done');},1800);
 });
}

// Contact blocks (Home and the Contact page): message form posts to /api/contact; the call tab embeds cal.com in place.
let calScriptRequested=false;
function ensureCal(onError){
 if(calScriptRequested)return;calScriptRequested=true;
 (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];const s=d.createElement('script');s.src=A;s.async=true;s.onerror=onError;d.head.appendChild(s);cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==='string'){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,['initNamespace',namespace])}else p(cal,ar);return}p(cal,ar)}})(window,'https://app.cal.com/embed/embed.js','init');
}
const booking=document.createElement('dialog');booking.className='booking-dialog';booking.setAttribute('aria-labelledby','booking-title');
booking.innerHTML='<header><h2 id="booking-title">Book a call</h2><button type="button" aria-label="Close booking">Close ×</button></header><div class="booking-scroll"><div class="cal-embed" data-cal-link="vasu-devs"><p class="cal-loading" role="status">Loading available times…</p></div></div><footer><a href="https://cal.com/vasu-devs" target="_blank" rel="noopener noreferrer" data-booking-external>Open calendar in a new tab</a></footer>';
document.body.append(booking);
let bookingTrigger,bookingReady=false;
function openBooking(trigger){
 if(booking.open)return;bookingTrigger=trigger||document.activeElement;booking.showModal();
 if(bookingReady)return;bookingReady=true;
 const host=booking.querySelector('.cal-embed');
 const fail=()=>{const note=host.querySelector('.cal-loading');if(note)note.textContent='Calendar unavailable here. Open it using the link below.';};
 ensureCal(fail);
 try{window.Cal('init','booking',{origin:'https://app.cal.com'});window.Cal.ns.booking('inline',{elementOrSelector:host,calLink:'vasu-devs',config:{layout:'month_view',theme:document.documentElement.dataset.theme==='light'?'light':'dark'}});}catch{fail();}
}
booking.querySelector('button').addEventListener('click',()=>booking.close());
booking.addEventListener('close',()=>bookingTrigger?.focus({preventScroll:true}));
booking.addEventListener('click',e=>{if(e.target!==booking)return;const r=booking.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)booking.close();});
document.addEventListener('click',e=>{const link=e.target.closest('a[href="https://cal.com/vasu-devs"],a[href="#contact/call"]');if(!link||link.hasAttribute('data-booking-external')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();e.stopImmediatePropagation();openBooking(link);},true);
document.addEventListener('contact-page',e=>{if(e.detail.tab==='call')openBooking();});
if(location.hash==='#contact/call')openBooking();
for(const block of document.querySelectorAll('.contact-panels')){
 const root=block.closest('section');
 const call=root.querySelector('[id$="-tab-call"]');
 if(call){call.removeAttribute('role');call.removeAttribute('aria-selected');call.removeAttribute('aria-controls');call.setAttribute('aria-haspopup','dialog');call.addEventListener('click',()=>openBooking(call));}
 root.querySelector('.contact-switch')?.removeAttribute('role');
 const message=root.querySelector('[id$="-tab-message"]');if(message){message.removeAttribute('role');message.removeAttribute('aria-selected');message.removeAttribute('aria-controls');message.addEventListener('click',()=>block.querySelector('input').focus());}
 block.querySelector('[id$="-panel-call"]')?.remove();
 const form=block.querySelector('.message-form');
 const status=form.querySelector('.form-status');
 const button=form.querySelector('button[type=submit]');
 const buttonContent=button.innerHTML;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  status.textContent='';status.dataset.state='';
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  button.disabled=true;button.textContent='Sending…';
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(result.error||'The message could not be sent.');
   form.reset();status.dataset.state='ok';status.textContent=`Sent. I’ll reply to ${data.email}.`;
  }catch(error){
   status.dataset.state='error';
   const mail=form.querySelector('.form-note a').textContent;
   status.innerHTML=`${error.message} You can also <a href="mailto:${mail}?subject=${encodeURIComponent('Portfolio message from '+data.name)}&body=${encodeURIComponent(data.message)}">send it from your email app</a>.`;
  }finally{button.disabled=false;button.innerHTML=buttonContent;}
 });
}
