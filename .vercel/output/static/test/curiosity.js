const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('motion-toggle');
let paused = false;
function syncMotion() {
  const off = paused || reduced.matches;
  document.body.classList.toggle('motion-paused', off);
  document.documentElement.style.scrollBehavior = off ? 'auto' : '';
  motionButton.disabled = reduced.matches;
  motionButton.setAttribute('aria-pressed', String(off));
  motionButton.textContent = reduced.matches ? 'Reduced motion on' : off ? 'Resume motion ▷' : 'Pause motion Ⅱ';
}
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
reduced.addEventListener('change', syncMotion); syncMotion();
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));

const projects = [...document.querySelectorAll('.project')];
function filterProjects(category) {
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  projects.forEach(project => { project.hidden = category !== 'All' && project.dataset.category !== category; });
  document.getElementById('project-count').textContent = projects.filter(project => !project.hidden).length + ' projects';
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function openProject(id) {
  const project = document.getElementById(id);
  if (!project?.classList.contains('project')) return;
  filterProjects('All'); project.open = true;
}
document.querySelectorAll('[data-open-project]').forEach(link => link.addEventListener('click', () => openProject(link.dataset.openProject)));
window.addEventListener('hashchange', () => openProject(location.hash.slice(1)));
openProject(location.hash.slice(1));

const machine = document.getElementById('idea-machine');
const ticket = document.getElementById('idea-ticket');
const ticketLink = document.getElementById('ticket-link');
const experiments = [
  {name:'Svara',description:'Speak naturally. Keep working. On-device dictation that follows you between apps.',id:'project-1'},
  {name:'Dreamer',description:'Give an unfinished idea somewhere to grow. Research agents explore; you review.',id:'project-2'},
  {name:'Ori no Michi',description:'A little geometry, a little patience. Learn origami through interactive 3D folds.',id:'project-4'},
  {name:'JustHireMe',description:'A local-first workbench for finding opportunities and understanding why they fit.',id:'project-0'}
];
let nextExperiment = 0;
function pullIdea() {
  const experiment = experiments[nextExperiment];
  document.getElementById('ticket-name').textContent = experiment.name;
  document.getElementById('ticket-description').textContent = experiment.description;
  document.getElementById('ticket-number').textContent = String(nextExperiment + 1).padStart(2,'0') + ' / 04';
  ticketLink.href = '#' + experiment.id; ticketLink.dataset.openProject = experiment.id;
  document.getElementById('machine-status').textContent = experiment.name + '. ' + experiment.description;
  ticket.hidden = false;
  machine.setAttribute('aria-expanded','true');
  machine.classList.remove('dispensing');
  // Restart a short, user-triggered animation without a timer or render loop.
  if (!paused && !reduced.matches) { void machine.offsetWidth; machine.classList.add('dispensing'); }
  nextExperiment = (nextExperiment + 1) % experiments.length;
}
machine.addEventListener('click', pullIdea);
document.getElementById('ticket-next').addEventListener('click', pullIdea);
machine.addEventListener('animationend', () => machine.classList.remove('dispensing'));
function closeTicket() { ticket.hidden = true; machine.setAttribute('aria-expanded','false'); machine.focus({preventScroll:true}); }
document.getElementById('ticket-close').addEventListener('click', closeTicket);
ticketLink.addEventListener('click', () => { ticket.hidden = true; machine.setAttribute('aria-expanded','false'); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && !ticket.hidden) closeTicket(); });
machine.setAttribute('aria-expanded','false');

// Gentle parallax is limited to the artwork, with no scroll interception.
const art = document.querySelector('.hero-art');
art.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || paused || reduced.matches) return;
  const rect = art.getBoundingClientRect();
  art.style.setProperty('--tilt-x', ((event.clientY - rect.top) / rect.height - .5) * -5 + 'deg');
  art.style.setProperty('--tilt-y', ((event.clientX - rect.left) / rect.width - .5) * 7 + 'deg');
});
art.addEventListener('pointerleave', () => { art.style.setProperty('--tilt-x','0deg'); art.style.setProperty('--tilt-y','0deg'); });
new IntersectionObserver(entries => art.classList.toggle('offscreen', !entries[0].isIntersecting)).observe(art);
