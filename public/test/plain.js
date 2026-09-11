import './soul-cursor.js?v=walk-home-28';

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
 themeButton.title = light ? 'Seireitei · sunlit stone and slate. Enter Hueco Mundo.' : 'Hueco Mundo · white sands beneath an endless night. Enter Seireitei.';
 document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f4f3ed' : '#0b0e14');
 themeButton.setAttribute('aria-label', `Switch to ${light ? 'Hueco Mundo (dark)' : 'Seireitei (light)'} mode`);
 themeButton.querySelector('.theme-label').textContent = light ? 'Seireitei' : 'Hueco Mundo';
 themeButton.querySelector('.sun-icon').textContent = light ? '☼' : '☾';
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
const avatarPause = document.querySelector('.avatar-pause');
let preferredAvatar='';
try {preferredAvatar=localStorage.getItem('vasu-tybw-avatar')||'';}catch{}
const portraitChoices=['warm','cool'].includes(preferredAvatar)?[preferredAvatar]:['warm','cool'];
avatar.replaceChildren(...portraitChoices.map((id,index)=>{const img=document.createElement('img');img.className='avatar-slide'+(index===0?' is-visible':'');img.width=112;img.height=112;img.alt='Vasudev — Bleach-inspired anime portrait';img.src=`/test/avatars/tybw-${id}-v5.webp`;return img;}));
avatarPause.hidden=portraitChoices.length===1;
const slides = [...avatar.querySelectorAll('.avatar-slide')];
let avatarIndex = 0, avatarTimer = null, avatarPaused = reducedMotion.matches;
let avatarAnimation = null, avatarBusy = false;
function stopAvatars() { clearTimeout(avatarTimer); avatarTimer = null; }
function scheduleAvatar() {
 stopAvatars();
 if (slides.length<2 || avatarPaused || document.hidden) return;
 avatarTimer = setTimeout(nextAvatar, 6000);
}
async function nextAvatar() {
 if (avatarBusy) return;
 avatarBusy = true; stopAvatars();
 const next = (avatarIndex + 1) % slides.length;
 try {
  await slides[next].decode();
  const old = slides[avatarIndex], incoming = slides[next];
  old.classList.remove('is-visible'); incoming.classList.add('is-visible');
  avatarIndex = next;
  if (!reducedMotion.matches) {
   const options = {duration:550,easing:'cubic-bezier(.22,1,.36,1)'};
   const outgoing = old.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-12px) scale(.96)'}],options);
   avatarAnimation = incoming.animate([{opacity:0,transform:'translateY(14px) scale(1.04)'},{opacity:1,transform:'translateY(0) scale(1)'}],options);
   await Promise.allSettled([outgoing.finished,avatarAnimation.finished]);
  }
 } catch { /* Keep the current avatar when an asset fails to load. */ }
 finally { avatarAnimation = null; avatarBusy = false; scheduleAvatar(); }
}
function avatarLabel() {
 const label = avatarPaused ? 'Resume avatar rotation' : 'Pause avatar rotation';
 avatarPause.setAttribute('aria-label', label); avatarPause.title = label;
 avatarPause.textContent = avatarPaused ? '▶' : 'Ⅱ';
}
avatar.addEventListener('click',()=>{if(slides.length===1)location.href='/test/tybw.html';else nextAvatar();});
avatarPause.addEventListener('click', () => { avatarPaused = !avatarPaused; avatarLabel(); scheduleAvatar(); });
reducedMotion.addEventListener('change', () => { avatarPaused = reducedMotion.matches; avatarAnimation?.finish(); avatarLabel(); scheduleAvatar(); });
document.addEventListener('visibilitychange', scheduleAvatar);
window.addEventListener('pagehide', stopAvatars);
window.addEventListener('pageshow', scheduleAvatar);
avatarLabel(); scheduleAvatar();
