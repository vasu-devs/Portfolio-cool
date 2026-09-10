const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project')];
function filterProjects(category) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  projects.forEach(project => { project.hidden = category !== 'All' && project.dataset.category !== category; });
  document.getElementById('project-count').textContent = String(projects.filter(project => !project.hidden).length).padStart(2, '0') + ' projects';
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function revealProject(id) {
  const project = document.getElementById(id);
  if (!project?.classList.contains('project')) return;
  filterProjects('All');
  project.open = true;
}
document.querySelectorAll('[data-open-project]').forEach(link => link.addEventListener('click', () => revealProject(link.dataset.openProject)));
window.addEventListener('hashchange', () => revealProject(location.hash.slice(1)));
revealProject(location.hash.slice(1));

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.dataset.panel).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motion = document.querySelector('.motion-button');
const sculpture = document.querySelector('.sculpture');
let manualPause = false;
function syncMotion() {
  const paused = manualPause || reduced.matches;
  document.body.classList.toggle('motion-paused', paused);
  document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
  motion.disabled = reduced.matches;
  motion.setAttribute('aria-pressed', String(paused));
  motion.setAttribute('aria-label', reduced.matches ? 'Animations off: reduced-motion preference' : paused ? 'Enable animations' : 'Pause animations');
  motion.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  motion.querySelector('.motion-label').textContent = paused ? 'Motion off' : 'Motion on';
  if (paused) resetTilt();
}
function resetTilt() { sculpture.style.setProperty('--rx', '0deg'); sculpture.style.setProperty('--ry', '0deg'); }
motion.addEventListener('click', () => { manualPause = !manualPause; syncMotion(); });
reduced.addEventListener('change', syncMotion);
syncMotion();
sculpture.addEventListener('pointermove', event => {
  if (manualPause || reduced.matches || !finePointer.matches) return;
  const bounds = sculpture.getBoundingClientRect();
  sculpture.style.setProperty('--ry', ((event.clientX - bounds.left) / bounds.width - .5) * 9 + 'deg');
  sculpture.style.setProperty('--rx', -((event.clientY - bounds.top) / bounds.height - .5) * 7 + 'deg');
});
sculpture.addEventListener('pointerleave', resetTilt);
let sculptureVisible = true;
function syncVisibility() {
  document.body.classList.toggle('page-hidden', document.hidden);
  sculpture.querySelector('img').style.animationPlayState = sculptureVisible && !document.hidden ? '' : 'paused';
}
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('seen'); reveals.unobserve(entry.target); }
  }), {threshold: .05});
  document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
  document.body.classList.add('motion-ready');
  const visibility = new IntersectionObserver(entries => {
    sculptureVisible = entries[0].isIntersecting;
    syncVisibility();
  });
  visibility.observe(sculpture);
}
document.addEventListener('visibilitychange', syncVisibility);
