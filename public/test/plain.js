import './soul-cursor.js?v=selection-30';

function showPage() {
  const id = location.hash.slice(1);
  const project = id.startsWith('project-') ? document.getElementById(id) : null;
  const page = id === 'projects' || project?.classList.contains('project') ? 'projects' : 'home';
  document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== page; });
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if(project?.classList.contains('project')) { project.open = true; requestAnimationFrame(() => project.scrollIntoView({block:'start'})); }
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
 themeButton.querySelector('.sun-icon').innerHTML = light
  ? '<svg viewBox="0 0 32 32" aria-hidden="true"><g class="realm-wings" fill="currentColor"><path d="M15 15C9 2 1 3 3 12c1 4 6 6 10 5-9 0-9 10-4 10 4 0 6-6 6-10Z"/><path d="M17 15C23 2 31 3 29 12c-1 4-6 6-10 5 9 0 9 10 4 10-4 0-6-6-6-10Z"/></g><path d="M16 10v15m0-14-3-5m3 5 3-5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="m6 10 5 3m15-3-5 3" stroke="var(--page)" stroke-width="1.2"/></svg>'
  : '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 5 16 3l8 2 3 8-3 11-8 5-8-5-3-11Z" fill="currentColor"/><g fill="var(--surface)"><path d="m8 12 6 2-1 4-5-2Zm16 0-6 2 1 4 5-2Z"/><path d="m16 17-2 4h4Z"/></g><path d="m17 4-2 5 3 2-2 4m-5 8v3m5-3v4m5-4v3" fill="none" stroke="var(--surface)" stroke-width="1.3" stroke-linecap="round"/></svg>';
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
avatar.replaceChildren(...['seireitei','hueco'].map(id=>{
 const img=document.createElement('img');img.className='avatar-slide';img.dataset.realm=id;
 img.width=112;img.height=112;img.alt=`Vasudev — ${id==='seireitei'?'Seireitei daylight':'Hueco Mundo moonlight'} anime portrait`;
 img.src=`/test/avatars/vasu-${id}-v1.webp`;return img;
}));
avatarPause.hidden=true;
avatar.title='View themed portraits';avatar.setAttribute('aria-label','View themed portraits');
avatar.addEventListener('click',()=>{location.href='/test/tybw.html';});
