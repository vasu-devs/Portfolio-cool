// The swarm opening: the page blanks and a crowd of named cursors rebuilds it (engine: swarm-engine.ts).
// It is the site's opening: it plays on every load and refresh; the footer can start it again.

import gsap from 'gsap';
import { ARROW, COLORS, NAMES, fgFor } from './cursor';
import { play } from './sound';

export const swarmSupported = () => typeof window !== 'undefined'
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && 'highlights' in CSS; // untyped text is hidden with a CSS highlight, so layout never shifts

/** Read once at load: every load and refresh is a swarm visit (not inside an iframe, or without browser support).
 *  On a swarm visit the hero shows finished, so the swarm rebuilds the real page. */
export const swarmVisit = swarmSupported() && window.self === window.top;
// Keep the page blank from the first paint until the engine takes over.
if (swarmVisit) document.documentElement.classList.add('swarming');

// On a swarm visit every page is built the first time it is shown; Skip (or Escape) ends that for the visit.
let session = swarmVisit;
const built = new Set<string>();
let running = false;
let stopRun: (() => void) | null = null;

let building: string | null = null;

/** Whether the page at `path` is being or about to be built (so its own entrance should start finished). */
export const swarmWillBuild = (path: string) => session && (!built.has(path) || building === path);

/** Build this page if this visit is a swarm visit and it hasn't been built yet. `waitMs`: blank now, build after. */
export function swarmPage(path: string, waitMs = 0) {
  if (!session || built.has(path)) return;
  built.add(path);
  building = path;
  void startSwarm(waitMs).finally(() => { if (building === path) building = null; });
}

/** End the current run at once, page shown as it is (a route change: the next page gets its own run). */
export function stopSwarm() {
  stopRun?.();
}

// The first build of a visit waits for one press: it starts the build and lets the browser play its sound.
let gated = !swarmVisit;
function gate() {
  if (gated) return;
  gated = true;
  return new Promise<void>((go) => {
    const g = document.createElement('div');
    g.className = 'sw-gate';
    g.innerHTML = `<button type="button" aria-label="Build">${[...'Build'].map((c) => `<span>${c}</span>`).join('')}</button>`;
    document.body.append(g);
    const b = g.querySelector('button')!;
    const run = buildGate(g, b);
    const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); } };
    const start = () => {
      for (const ev of ['wheel', 'touchmove']) removeEventListener(ev, start);
      removeEventListener('keydown', key);
      run.kill();
      g.remove();
      go();
    };
    b.addEventListener('click', start);
    // Scrolling is never blocked: it starts the build too (without sound, which needs a click or a key).
    for (const ev of ['wheel', 'touchmove']) addEventListener(ev, start, { passive: true });
    addEventListener('keydown', key);
  });
}

/** One agent flies in, drags out the button's box, types its word, then leaves. */
function buildGate(g: HTMLElement, b: HTMLButtonElement) {
  const k = Math.floor(Math.random() * NAMES.length);
  const color = COLORS[k % COLORS.length];
  const fg = fgFor(color);
  const letters = [...b.children] as HTMLElement[];
  const sw = document.createElement('div');
  sw.className = 'sw';
  sw.innerHTML = `<div class="sw-sel" style="--c:${color};--fg:${fg}"><i></i><i></i><i></i><i></i><span></span></div><div class="sw-caret" style="--c:${color}"></div>`
    + `<div class="sw-cur" style="--c:${color};--fg:${fg};color:${color}">${ARROW}<span class="sw-tag">${NAMES[k]}</span></div>`;
  g.append(sw);
  const [sel, caret, cur] = [...sw.children] as HTMLElement[];
  const dims = sel.querySelector('span')!;
  const box = () => b.getBoundingClientRect();
  const p = { x: -40, y: innerHeight * 0.62, w: 0, h: 0 };
  b.style.clipPath = 'inset(0 100% 100% 0)';
  const draw = () => {
    const r = box();
    cur.style.transform = `translate(${p.x}px, ${p.y}px)`;
    sel.style.transform = `translate(${r.left}px, ${r.top}px)`;
    sel.style.width = `${p.w}px`;
    sel.style.height = `${p.h}px`;
    dims.textContent = `${Math.round(p.w)} × ${Math.round(p.h)}`;
    if (p.w) b.style.clipPath = `inset(0 ${r.width - p.w}px ${r.height - p.h}px 0)`;
  };
  const caretAt = (i: number) => { // just after letter i (-1: before the first)
    const l = letters[Math.max(i, 0)].getBoundingClientRect();
    caret.style.transform = `translate(${i < 0 ? l.left : l.right}px, ${l.top + l.height * 0.12}px)`;
    caret.style.height = `${l.height * 0.7}px`;
  };
  draw();
  const tl = gsap.timeline({ delay: 0.2, onUpdate: draw })
    .add(() => play('arrive', { pan: -0.6, dur: 0.3 }))
    .to(p, { x: () => box().left, y: () => box().top, duration: 0.4, ease: 'power3.out' })
    .add(() => { cur.classList.add('tap'); sel.classList.add('on'); play('tap'); play('draw', { dur: 0.35 }); })
    .to(p, { x: () => box().right, y: () => box().bottom, w: () => box().width, h: () => box().height, duration: 0.3, ease: 'power2.inOut' })
    .add(() => { cur.classList.remove('tap'); sel.classList.remove('on'); b.style.clipPath = ''; caretAt(-1); caret.classList.add('on'); })
    .to(p, { x: () => letters[0].getBoundingClientRect().left, y: () => box().bottom - 6, duration: 0.2, ease: 'power2.inOut' });
  letters.forEach((l, i) => tl.add(() => { l.style.opacity = '1'; caretAt(i); play('key'); }, `+=${i ? 0.06 : 0.03}`));
  tl.add(() => { caret.classList.remove('on'); play('leave', { pan: 0.6, dur: 0.35 }); }, '+=0.15')
    .to(p, { x: () => innerWidth + 60, y: () => p.y - 120, duration: 0.4, ease: 'power2.in' }) // job done, it leaves
    .add(() => sw.remove());
  return tl;
}

export async function startSwarm(waitMs = 0) {
  if (running || !swarmSupported()) return;
  running = true;
  try {
    const [{ runSwarm }] = await Promise.all([
      import('./swarm-engine'), // split out: most visitors never download it
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]), // measure final text, not fallback fonts
      gate(),
    ]);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); // let GSAP settle the page first
    const run = runSwarm(waitMs);
    stopRun = run.stop;
    if ((await run.done) === 'skipped') session = false;
  } catch (e) {
    console.error('[swarm] failed, showing the page', e);
  } finally {
    document.documentElement.classList.remove('swarming');
    stopRun = null;
    running = false;
  }
}
