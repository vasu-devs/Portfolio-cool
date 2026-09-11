import './soul-cursor.js?v=real-attacks-68';

function showPage() {
  const id = location.hash.slice(1);
  const project = id.startsWith('project-') ? document.getElementById(id) : null;
  const page = id === 'projects' || project?.classList.contains('project') ? 'projects' : 'home';
  document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== page; });
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if(project?.classList.contains('project')) { requestAnimationFrame(() => {project.dispatchEvent(new CustomEvent('open-detail'));}); }
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

// One shared reading dialog; move the original content to retain its links and state.
const readingDialog=document.createElement('dialog');
readingDialog.className='resume-modal detail-modal';
readingDialog.setAttribute('aria-labelledby','detail-title');
readingDialog.innerHTML='<div class="resume-toolbar"><div><span class="modal-kicker">PROJECT / PROFILE</span><h2 id="detail-title"></h2></div><button type="button" aria-label="Close details">Close ×</button></div><div class="resume-content"><div class="detail-body"></div></div>';
document.body.append(readingDialog);
let detailSource=null,detailOpener=null,detailNodes=[];
function openDetail(source,opener){
 if(readingDialog.open)return;
 const summary=source.querySelector(':scope > summary');
 detailSource=source;detailOpener=opener||summary;
 const title=source.classList.contains('archive-detail')?source.closest('.archive-item').querySelector('h3').textContent:source.classList.contains('role')?[...summary.querySelectorAll('h3,.role-name')].map(n=>n.textContent).join(' · '):source.classList.contains('project')?summary.querySelector('h3').textContent:summary.textContent;
 readingDialog.querySelector('#detail-title').textContent=title.trim();
 readingDialog.querySelector('.modal-kicker').textContent=source.classList.contains('role')?'EXPERIENCE / CASE STUDY':'PROJECT / PROFILE';
 detailNodes=[...source.children].filter(n=>n!==summary);
 readingDialog.querySelector('.detail-body').append(...detailNodes);
 source.open=false;readingDialog.showModal();document.documentElement.classList.add('detail-open');
 readingDialog.scrollTop=0;readingDialog.querySelector('button').focus();
}
for(const source of document.querySelectorAll('details.project,details.role,details.background,details.archive-detail')){
 const summary=source.querySelector(':scope > summary');summary.setAttribute('aria-haspopup','dialog');
 summary.addEventListener('click',event=>{event.preventDefault();openDetail(source);});
 source.addEventListener('open-detail',()=>openDetail(source));
}
// In-page project links open a reading layer without changing page or scroll.
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href^="#project-"]');
 if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const source=document.getElementById(link.getAttribute('href').slice(1));
 if(!source?.classList.contains('project'))return;
 event.preventDefault();openDetail(source,link);
});
readingDialog.querySelector('button').addEventListener('click',()=>readingDialog.close());
readingDialog.addEventListener('click',event=>{if(event.target!==readingDialog)return;const r=readingDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)readingDialog.close();});
readingDialog.addEventListener('close',()=>{detailSource?.append(...detailNodes);detailNodes=[];document.documentElement.classList.remove('detail-open');detailOpener?.focus({preventScroll:true});});
// Project films stay in context; remove the player on close so playback stops.
const filmDialog=document.createElement('dialog');
filmDialog.className='resume-modal film-modal';filmDialog.setAttribute('aria-labelledby','film-title');
filmDialog.innerHTML='<div class="resume-toolbar"><div><span class="modal-kicker">PROJECT WALKTHROUGH</span><h2 id="film-title"></h2></div><button type="button" aria-label="Close video">Close ×</button></div><div class="film-body"><div class="film-player"></div><div class="resume-content film-description"></div></div>';
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

for(const button of document.querySelectorAll('.archive-open'))button.addEventListener('click',()=>openDetail(button.closest('.archive-item').querySelector('.archive-detail')));

// Open the sixth showcase case study without leaving the showcase grid.
document.querySelector('.video-link[href="#project-0"]')?.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();document.getElementById('project-0')?.dispatchEvent(new CustomEvent('open-detail'));
});

// Native swipe/trackpad scrolling plus keyboard-accessible project navigation.
const buildTrack=document.querySelector('.video-work .video-list');
if(buildTrack){
 const cards=[...buildTrack.querySelectorAll('.video-link')];
 const nav=document.createElement('nav');nav.className='build-navigation';nav.setAttribute('aria-label','Project walkthroughs');
 const previous=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
 previous.type=next.type='button';previous.textContent='Previous';next.textContent='Next';
 let current=0;
 const update=()=>{current=cards.reduce((best,c,i)=>Math.abs(c.offsetLeft-cards[0].offsetLeft-buildTrack.scrollLeft)<Math.abs(cards[best].offsetLeft-cards[0].offsetLeft-buildTrack.scrollLeft)?i:best,0);count.textContent=`${current+1} / ${cards.length}`;previous.disabled=current===0;next.disabled=current===cards.length-1;};
 const move=direction=>{const target=cards[Math.max(0,Math.min(cards.length-1,current+direction))];buildTrack.scrollTo({left:target.offsetLeft-cards[0].offsetLeft});};
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 nav.append(previous,count,next);buildTrack.after(nav);buildTrack.addEventListener('scroll',update,{passive:true});update();
}

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
