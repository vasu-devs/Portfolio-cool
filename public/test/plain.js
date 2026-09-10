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
const folds = [
  ['M10 10 L50 10 L50 50 L10 50 Z', 'M10 10 L50 50', ''],
  ['M10 10 L50 50 L10 50 Z', 'M10 50 L30 30', 'One fold. Keep going.'],
  ['M30 8 L51 46 L30 36 L9 46 Z', 'M30 8 L30 36', 'Two folds. Almost there.'],
  ['M3 28 L25 24 L39 7 L34 27 L57 20 L39 38 L27 32 L17 49 L20 32 Z', 'M3 28 L27 32 L39 7 M27 32 L57 20', 'A tiny paper bird. Ori no Michi started with folds, too.']
];
let fold = 0;
const paper = document.querySelector('.paper-toy');
paper.addEventListener('click', () => {
  fold = (fold + 1) % folds.length;
  document.querySelector('.paper-shape').setAttribute('d', folds[fold][0]);
  document.querySelector('.paper-crease').setAttribute('d', folds[fold][1]);
  document.querySelector('.fold-note').textContent = folds[fold][2];
  paper.setAttribute('aria-label', fold === 3 ? 'Unfold the paper bird' : 'Fold a little paper');
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
 if(changingTheme) return;
 changingTheme = true;
 const rect = themeButton.getBoundingClientRect();
 const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
 const radius = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y));
 const change = () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('vasu-theme', root.dataset.theme); } catch {}
  themeLabel();
 };
 let beams;
 try {
  if(!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { change(); return; }
  const transition = document.startViewTransition(change);
  await transition.ready;
  beams = document.createElement('div'); beams.className = 'sunbeams'; beams.setAttribute('aria-hidden','true');
  beams.style.setProperty('--sun-x', `${x}px`); beams.style.setProperty('--sun-y', `${y}px`);document.body.append(beams);
  await root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]}, {duration:850,easing:'cubic-bezier(.2,.65,.25,1)',pseudoElement:'::view-transition-new(root)'}).finished;
  await transition.finished;
 } catch { /* The theme remains usable if the visual transition is interrupted. */ }
 finally { beams?.remove(); changingTheme = false; }
});
