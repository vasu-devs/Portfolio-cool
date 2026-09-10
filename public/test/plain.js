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
 document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f7f7f7' : '#121212');
 themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
 themeButton.querySelector('.theme-label').textContent = light ? 'dark' : 'light';
 themeButton.querySelector('.sun-icon').textContent = light ? '☾' : '☼';
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
 if (!activeReveal) return;
 const previous = activeReveal;
 activeReveal = null;
 previous.animation?.cancel();
 previous.frame.remove();
 root.style.removeProperty('--reveal-base');
 root.classList.remove('theme-revealing');
}
themeButton.addEventListener('click', () => {
 requestedTheme = requestedTheme === 'light' ? 'dark' : 'light';
 if (activeReveal) { clearReveal(); applyTheme(); return; }
 if (reducedMotion.matches) { applyTheme(); return; }
 const rect = themeButton.querySelector('.sun-icon').getBoundingClientRect();
 const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
 const radius = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y)) + 2;
 const oldColor = getComputedStyle(root).getPropertyValue('--page');
 applyTheme();
 const color = getComputedStyle(root).getPropertyValue('--page');
 const layer = document.createElement('div');
 layer.className = 'theme-wave';
 layer.setAttribute('aria-hidden', 'true');
 // Percentage anchors stay aligned at browser zoom and every viewport width.
 layer.style.left = `${x / innerWidth * 100}%`;
 layer.style.top = `${y / innerHeight * 100}%`;
 layer.style.width = layer.style.height = `${radius * 2}px`;
 layer.style.background = color;
 root.style.setProperty('--reveal-base', oldColor);
 root.classList.add('theme-revealing');
 const frame = document.createElement('div');
 frame.className = 'theme-wave-frame';
 frame.setAttribute('aria-hidden', 'true');
 frame.append(layer);
 document.body.append(frame);
 const reveal = {frame, animation:null};
 activeReveal = reveal;
 try {
  reveal.animation = layer.animate([{transform:'translate(-50%, -50%) scale(0)'},{transform:'translate(-50%, -50%) scale(1)'}], {duration:500,easing:'cubic-bezier(.4,0,.2,1)'});
  reveal.animation.finished.then(() => { if(activeReveal === reveal) clearReveal(); }, () => { if(activeReveal === reveal) clearReveal(); });
 } catch { clearReveal(); }
});
window.addEventListener('resize', clearReveal, {passive:true});
window.addEventListener('pagehide', clearReveal);

const avatar = document.querySelector('.avatar-rotator');
const slides = [...avatar.querySelectorAll('.avatar-slide')];
let avatarIndex = 0, avatarTimer = null, avatarPaused = reducedMotion.matches;
function stopAvatars() { clearTimeout(avatarTimer); avatarTimer = null; }
function scheduleAvatar() {
 stopAvatars();
 if (avatarPaused || document.hidden) return;
 avatarTimer = setTimeout(async () => {
  const next = (avatarIndex + 1) % slides.length;
  try { await slides[next].decode(); } catch { scheduleAvatar(); return; }
  if (avatarPaused || document.hidden) return;
  slides[avatarIndex].classList.remove('is-visible');
  slides[next].classList.add('is-visible');
  avatarIndex = next; scheduleAvatar();
 }, 6000);
}
function avatarLabel() {
 const label = avatarPaused ? 'Resume avatar rotation' : 'Pause avatar rotation';
 avatar.setAttribute('aria-label', label); avatar.title = label;
 avatar.classList.toggle('is-paused', avatarPaused);
 avatar.querySelector('.avatar-control').textContent = avatarPaused ? '▶' : 'Ⅱ';
}
avatar.addEventListener('click', () => { avatarPaused = !avatarPaused; avatarLabel(); scheduleAvatar(); });
reducedMotion.addEventListener('change', () => { avatarPaused = reducedMotion.matches; avatarLabel(); scheduleAvatar(); });
document.addEventListener('visibilitychange', scheduleAvatar);
window.addEventListener('pagehide', stopAvatars);
window.addEventListener('pageshow', scheduleAvatar);
avatarLabel(); scheduleAvatar();
