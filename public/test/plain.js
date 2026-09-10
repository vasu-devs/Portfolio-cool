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
dot.addEventListener('click', () => {
  const active = document.body.classList.toggle('night-note');
  dot.setAttribute('aria-pressed', String(active));
  document.querySelector('.secret-message').textContent = active ? 'You found the quiet corner of the internet. Stay a while.' : '';
});
const themeButton = document.querySelector('.theme-toggle');
const root = document.documentElement;
function themeLabel() {
 const light = root.dataset.theme === 'light';
 themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
 themeButton.querySelector('.theme-label').textContent = light ? 'dark' : 'light';
 themeButton.querySelector('.sun-icon').textContent = light ? '☾' : '☼';
}
themeLabel();
let changingTheme = false;
themeButton.addEventListener('click', async () => {
 if (changingTheme) return;
 changingTheme = true;
 const rect = themeButton.querySelector('.sun-icon').getBoundingClientRect();
 const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
 const originX = x / innerWidth * 100;
 const originY = y / innerHeight * 100;
 const radius = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y));
 const radiusPercent = radius / (Math.hypot(innerWidth, innerHeight) / Math.SQRT2) * 100 + 1;
 const change = () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('vasu-theme', root.dataset.theme); } catch {}
  themeLabel();
 };
 try {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { change(); return; }
  const transition = document.startViewTransition(change);
  await transition.ready;
  await root.animate({clipPath:[`circle(0% at ${originX}% ${originY}%)`, `circle(${radiusPercent}% at ${originX}% ${originY}%)`]}, {duration:850,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'}).finished;
  await transition.finished;
 } catch { /* Theme changes still apply if the reveal is interrupted. */ }
 finally { changingTheme = false; }
});
