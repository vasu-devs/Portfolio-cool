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
