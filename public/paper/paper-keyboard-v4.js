// Page shortcuts leave browser combinations, typing and open overlays alone.
const guide = document.createElement('dialog');
guide.className = 'contact-dialog keyboard-guide';
guide.setAttribute('aria-labelledby', 'keyboard-title');
guide.innerHTML = `<header><h2 id="keyboard-title">Keyboard shortcuts</h2><button type="button" aria-label="Close shortcuts" autofocus>×</button></header><dl><div><dt><kbd>H</kbd> / <kbd>W</kbd> / <kbd>A</kbd> / <kbd>C</kbd></dt><dd>Home / Work / About / Contact</dd></div><div><dt><kbd>J</kbd> / <kbd>K</kbd></dt><dd>Scroll down / up</dd></div><div><dt><kbd>Home</kbd> / <kbd>End</kbd></dt><dd>Top / bottom of page</dd></div><div><dt><kbd>]</kbd> / <kbd>[</kbd></dt><dd>Next / previous section</dd></div><div><dt><kbd>?</kbd></dt><dd>Show this guide</dd></div><div><dt><kbd>Esc</kbd></dt><dd>Close a dialog</dd></div></dl><label><input type="checkbox" checked> Enable letter-key shortcuts</label>`;
document.body.append(guide);
const trigger = document.createElement('button');
trigger.className = 'keyboard-help';
trigger.textContent = 'Keyboard shortcuts ?';
trigger.setAttribute('aria-haspopup', 'dialog');
document.querySelector('.footer-bottom')?.append(trigger);
let opener;
function openGuide() { opener = document.activeElement; guide.showModal(); }
trigger.addEventListener('click', openGuide);
guide.querySelector('button').addEventListener('click', () => guide.close());
guide.addEventListener('close', () => opener?.focus({preventScroll:true}));
const enabled = guide.querySelector('input');
try { enabled.checked = localStorage.getItem('vasu-keyboard') !== 'off'; } catch {}
enabled.addEventListener('change', () => { try { localStorage.setItem('vasu-keyboard', enabled.checked ? 'on' : 'off'); } catch {} });
const behavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
document.addEventListener('keydown', event => {
 if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing || event.repeat) return;
 if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="slider"],[role="combobox"]')) return;
 if (document.querySelector('dialog[open]')) return;
 if (!enabled.checked) return;
 const key = event.key.toLowerCase();
 const pages = {h:'home',w:'projects',a:'about',c:'contact'};
 let action;
 if (pages[key]) action = () => { location.hash = pages[key]; };
 else if (key === '?') action = openGuide;
 else if (key === 'j' || key === 'k') action = () => window.scrollBy({top: innerHeight * .65 * (key === 'j' ? 1 : -1), behavior:behavior()});
 else if (key === 'home' || key === 'end') action = () => window.scrollTo({top:key === 'home' ? 0 : document.documentElement.scrollHeight, behavior:behavior()});
 else if (key === '[' || key === ']') action = () => {
  const sections = [...document.querySelectorAll('[data-panel]:not([hidden]) > header,[data-panel]:not([hidden]) > section,[data-panel]:not([hidden]) > .intro,.work-with-me,.site-footer')].filter(el => el.getClientRects().length);
  const positions = sections.map(el => el.getBoundingClientRect().top + scrollY).sort((a,b) => a-b);
  const top = key === ']' ? positions.find(y => y > scrollY + 24) ?? document.documentElement.scrollHeight : positions.reverse().find(y => y < scrollY - 24) ?? 0;
  window.scrollTo({top,behavior:behavior()});
 };
 if (action) { event.preventDefault(); action(); }
});
