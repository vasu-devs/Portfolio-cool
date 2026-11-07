// Interface sounds: a soft press on clicks, a faint tick on hover (mouse only), and open/close for sheets and panels.
// Browsers allow audio only after the first interaction, so nothing plays before the visitor does something.
// Muting is remembered per visitor (localStorage); the nav has the toggle.
import { asset } from './asset';

type Sound = 'press' | 'hover' | 'open' | 'close';
const VOLUME: Record<Sound, number> = { press: 0.35, hover: 0.12, open: 0.4, close: 0.35 };

let ctx: AudioContext | null = null;
const buffers = new Map<Sound, AudioBuffer>();
let muted = (() => { try { return localStorage.getItem('sound-off') === '1'; } catch { return false; } })();

export const soundOn = () => !muted;

export function setSound(on: boolean) {
  muted = !on;
  try { localStorage.setItem('sound-off', on ? '0' : '1'); } catch { /* private mode: just not remembered */ }
  window.dispatchEvent(new CustomEvent('sound:change', { detail: on }));
  if (on) play('press');
}

/** Decode the files once, on the first interaction (when the browser lets audio start). */
function wake() {
  if (ctx) return;
  ctx = new AudioContext();
  for (const name of Object.keys(VOLUME) as Sound[]) {
    fetch(asset(`sfx/${name}.mp3`))
      .then((r) => r.arrayBuffer())
      .then((data) => ctx!.decodeAudioData(data))
      .then((buffer) => buffers.set(name, buffer))
      .catch(() => { /* a missing sound just stays silent */ });
  }
}

export function play(name: Sound) {
  if (muted || !ctx) return;
  const buffer = buffers.get(name);
  if (!buffer) return;
  if (ctx.state === 'suspended') void ctx.resume();
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  gain.gain.value = VOLUME[name];
  src.buffer = buffer;
  src.connect(gain).connect(ctx.destination);
  src.start();
}

let started = false;
/** Clicks and hovers on anything interactive, site-wide (one listener each, no per-component wiring). */
export function startSound() {
  if (started) return;
  started = true;
  const interactive = (t: EventTarget | null) => (t as Element | null)?.closest?.('a, button, [role="tab"]');
  addEventListener('pointerdown', (e) => {
    wake();
    if (interactive(e.target)) play('press');
  }, { passive: true, capture: true });
  addEventListener('keydown', wake, { once: true });
  let last: Element | null = null;
  let lastAt = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  addEventListener('pointerover', (e) => {
    const el = interactive(e.target);
    if (!el || el === last || !fine.matches) return;
    last = el;
    const now = performance.now();
    if (now - lastAt < 70) return; // sweeping across a row of links stays a light patter, not a buzz
    lastAt = now;
    play('hover');
  }, { passive: true });
}
