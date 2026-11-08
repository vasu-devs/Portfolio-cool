// Interface and swarm sounds, synthesised live with Web Audio (no files): a mouse button's click and clack on
// presses, a faint tick on hover (mouse only), a two-note chime for sheets opening and closing, and the cursor agents'
// work, each sound on the frame its motion happens: a quick swish as it sets off, the same mouse click as it lands and
// presses, a key tick per letter typed, a marker swipe for exactly as long as it drags a frame, a pop as media drops
// in, and a swish as it leaves. Browsers allow audio only after the first interaction, so nothing plays before the
// visitor does something (a swarm already running becomes audible on the first click). Muting is remembered per
// visitor (localStorage); the nav has the toggle.

export type Sound = 'press' | 'release' | 'hover' | 'open' | 'close' | 'arrive' | 'tap' | 'key' | 'draw' | 'drop' | 'leave';
/** pan: -1 (left) to 1 (right), e.g. from a cursor's x; dur: seconds the motion lasts (a flight, a drag, an exit). */
type Opts = { pan?: number; dur?: number };

// Minimum ms between two of the same sound across all cursors: short, so every visible action is heard, but 60
// cursors landing on one frame still don't stack into a roar.
const GAP: Partial<Record<Sound, number>> = { hover: 70, arrive: 45, leave: 45, tap: 20, key: 12, draw: 30, drop: 30 };

let ctx: AudioContext | null = null;
let out: GainNode;
let noise: AudioBuffer;
const lastAt = new Map<Sound, number>();
let muted = (() => { try { return localStorage.getItem('sound-off') === '1'; } catch { return false; } })();

export const soundOn = () => !muted;

export function setSound(on: boolean) {
  muted = !on;
  try { localStorage.setItem('sound-off', on ? '0' : '1'); } catch { /* private mode: just not remembered */ }
  window.dispatchEvent(new CustomEvent('sound:change', { detail: on }));
  if (on) play('press');
}

/** Build the audio graph once; resume it on any interaction (a no-op until the browser allows it). */
function wake() {
  if (!ctx) {
    try { ctx = new AudioContext(); } catch { return; }
    const limiter = ctx.createDynamicsCompressor(); // many cursors at once never clip
    limiter.threshold.value = -16;
    limiter.ratio.value = 8;
    out = ctx.createGain();
    out.gain.value = 0.7;
    out.connect(limiter).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** A note gliding from f0 to f1 with a quick attack and an exponential tail. */
function tone(dest: AudioNode, t: number, f0: number, f1: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Band-passed noise. "hit" is a click or tick; "swell" peaks mid-way, like an eased motion at full speed. */
function air(dest: AudioNode, t: number, f0: number, f1: number, dur: number, vol: number, q = 1, env: 'hit' | 'swell' = 'hit') {
  const s = ctx!.createBufferSource();
  const f = ctx!.createBiquadFilter();
  const g = ctx!.createGain();
  s.buffer = noise;
  f.type = 'bandpass';
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  if (env === 'hit') {
    g.gain.exponentialRampToValueAtTime(vol, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  } else {
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.5);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
  }
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

/** A quick swish of air as a cursor sets off: low-passed noise (no resonance, so no whistle), short whatever the
 *  flight's length, rising fast and tailing off smoothly, its brightness opening (arrive) or closing (leave). */
const SWISH = Float32Array.from({ length: 32 }, (_, i) => {
  const x = i / 31;
  return Math.max(0.0001, x < 0.25 ? Math.sin((Math.PI / 2) * (x / 0.25)) : Math.cos((Math.PI / 2) * ((x - 0.25) / 0.75)));
});
function swish(dest: AudioNode, t: number, f0: number, f1: number, dur: number, vol: number) {
  const d = Math.min(0.13, Math.max(0.08, dur));
  const s = ctx!.createBufferSource();
  const f = ctx!.createBiquadFilter();
  const g = ctx!.createGain();
  s.buffer = noise;
  s.loop = true; // a long exit must not run off the end of the 1 s noise buffer
  f.type = 'lowpass';
  f.Q.value = 0.2;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + d);
  g.gain.setValueCurveAtTime(SWISH.map((v) => v * vol), t, d);
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + d + 0.02);
}

/** One mouse-button switch: a sharp plastic transient and a short body ring. `k` shifts its pitch, `v` its level. */
function mouse(dest: AudioNode, t: number, k: number, v: number) {
  const j = k * rnd(0.98, 1.02);
  air(dest, t, 4200 * j, 4200 * j, 0.004, 0.26 * v, 1.1); // the switch snapping
  tone(dest, t, 1350 * j, 1100 * j, 0.012, 0.07 * v); // the shell's body
  air(dest, t + 0.0025, 7000 * j, 7000 * j, 0.002, 0.1 * v, 2); // its edge
}

export function play(name: Sound, { pan = 0, dur = 0.2 }: Opts = {}) {
  if (muted || document.hidden) return;
  wake();
  // Not allowed to sound yet: drop it rather than queue a burst for the first click.
  if (!ctx || ctx.state !== 'running') return;
  const now = performance.now();
  const gap = GAP[name];
  if (gap && now - (lastAt.get(name) ?? -1e9) < gap) return;
  lastAt.set(name, now);

  let dest: AudioNode = out;
  if (pan) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan)) * 0.7;
    p.connect(out);
    dest = p;
  }
  const t = ctx.currentTime + 0.005;
  switch (name) {
    case 'press': // a mouse button going down: a crisp micro-switch click with a little plastic body
      mouse(dest, t, 1, 1);
      break;
    case 'release': // and coming back up: lighter and a touch higher
      mouse(dest, t, 1.18, 0.55);
      break;
    case 'hover':
      tone(dest, t, 2300, 2150, 0.025, 0.045);
      break;
    case 'open': // two rising glassy notes
      tone(dest, t, 587, 587, 0.22, 0.1, 'triangle');
      tone(dest, t + 0.06, 880, 880, 0.3, 0.08, 'triangle');
      air(dest, t, 700, 2800, 0.14, 0.03, 1, 'swell');
      break;
    case 'close':
      tone(dest, t, 880, 880, 0.18, 0.07, 'triangle');
      tone(dest, t + 0.05, 587, 587, 0.24, 0.08, 'triangle');
      air(dest, t, 2800, 700, 0.12, 0.025, 1, 'swell');
      break;
    case 'arrive': // a quick swish as it sets off
      swish(dest, t, 500, 2200, dur, 0.07);
      break;
    case 'tap': // a cursor agent clicks: the same mouse button, down then up, quieter
      mouse(dest, t, 1, 0.5);
      mouse(dest, t + 0.075, 1.18, 0.28);
      break;
    case 'key': // one letter typed
      air(dest, t, rnd(2400, 4200), rnd(2400, 4200), 0.009, rnd(0.05, 0.085), 3);
      tone(dest, t, rnd(700, 950), 600, 0.014, 0.025);
      break;
    case 'draw': // a marker dragging a frame open, as long as the drag
      air(dest, t, 500, 2200, dur, 0.045, 1.4, 'swell');
      break;
    case 'drop': // media pops into place
      tone(dest, t, 520, 240, 0.09, 0.14);
      air(dest, t, 1800, 1800, 0.01, 0.06, 1.5);
      break;
    case 'leave': // a quick swish as it goes
      swish(dest, t, 2200, 500, dur, 0.055);
      break;
  }
}

let started = false;
/** Clicks and hovers on anything interactive, site-wide (one listener each, no per-component wiring). */
export function startSound() {
  if (started) return;
  started = true;
  const interactive = (t: EventTarget | null) => (t as Element | null)?.closest?.('a, button, [role="tab"]');
  // A mouse button: click on the way down, clack on the way up (only if the press was on something interactive).
  let pressed = false;
  addEventListener('pointerdown', (e) => {
    wake();
    pressed = !!interactive(e.target);
    if (pressed) play('press');
  }, { passive: true, capture: true });
  addEventListener('pointerup', () => { if (pressed) play('release'); pressed = false; }, { passive: true, capture: true });
  // Taps on phones unlock audio on release, not on press.
  for (const ev of ['keydown', 'pointerup', 'touchend']) addEventListener(ev, wake, { passive: true });
  let last: Element | null = null;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  addEventListener('pointerover', (e) => {
    const el = interactive(e.target);
    if (!el || el === last || !fine.matches) return;
    last = el;
    play('hover');
  }, { passive: true });
}
