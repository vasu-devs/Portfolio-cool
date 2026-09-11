import './soul-cursor.js?v=navbar-36';

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
 themeButton.querySelector('.sun-icon').innerHTML = '<svg class="jigokucho" viewBox="0 0 40 40" aria-hidden="true"><g class="butterfly-wings" fill="var(--butterfly-wing)" stroke="var(--butterfly-edge)" stroke-width=".7" stroke-linejoin="round"><path d="M19 19C15 10 7 4 3 6 1 11 4 19 12 22 5 21 6 29 10 29l1 5 3-4c3-1 5-6 5-11Z"/><path d="M21 19C25 10 33 4 37 6c2 5-1 13-9 16 7-1 6 7 2 7l-1 5-3-4c-3-1-5-6-5-11Z"/><g fill="none" stroke="var(--butterfly-vein)" stroke-width="1.2"><path d="M18 20 6 9m11 12-9-5m10 7-6 5M22 20 34 9m-11 12 9-5m-10 7 6 5"/></g><path d="m9 25 3 1 2-2m17 1-3 1-2-2" fill="none" stroke="#93637f" stroke-width="1.3"/></g><path d="M20 15v15m-1-14c0-5-2-6-4-7m6 7c0-5 2-6 4-7" fill="none" stroke="var(--butterfly-body)" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="20" cy="18" rx="1.5" ry="4" fill="var(--butterfly-body)"/></svg>';
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
