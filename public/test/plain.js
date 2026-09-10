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
themeButton.addEventListener('click', () => {
 root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
 try { localStorage.setItem('vasu-theme', root.dataset.theme); } catch {}
 themeLabel();
});
