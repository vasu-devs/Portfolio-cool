// Interface sound design for the portfolio.
//
// Every interaction has its own voice, synthesised live with the Web Audio API (no
// audio files). Voices are tuned to one D-major pentatonic scale so overlapping
// sounds never clash, panned to where the element sits on screen, and sent through
// a small generated room reverb and a compressor so layered sounds stay soft.
//
// Browsers only allow audio after a user gesture, so the engine wakes on the first
// click, tap or key press. Sound is on by default; the speaker button in the nav
// (or the M key) mutes it and the choice is remembered.

const STORAGE_KEY = 'vasu-sound';
const MASTER_LEVEL = 0.55;
const MAX_VOICES = 16;
const HOVER_GAP_MS = 32; // minimum spacing between hover sounds
const PAGES = ['home', 'projects', 'about', 'contact'];

// D major pentatonic (D E F# A B), expressed as semitones above D.
const PENTATONIC = [0, 2, 4, 7, 9];
const D4 = 293.66;
const note = (degree, octave = 0) => {
  const steps = PENTATONIC[((degree % 5) + 5) % 5] + 12 * (octave + Math.floor(degree / 5));
  return D4 * 2 ** (steps / 12);
};

let enabled = true;
try { enabled = localStorage.getItem(STORAGE_KEY) !== 'off'; } catch {}

let ctx = null;
let bus = null; // { input, reverbSend }
let voices = 0;
let lastHoverAt = 0;
let hovered = null;

/* ---------- engine ---------- */

function buildImpulse(context, seconds = 1.3) {
  // A short, dark stereo room: decaying noise, gently low-passed by the decay curve.
  const rate = context.sampleRate;
  const length = Math.floor(rate * seconds);
  const impulse = context.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let smooth = 0;
    for (let i = 0; i < length; i++) {
      smooth = smooth * 0.6 + (Math.random() * 2 - 1) * 0.4;
      data[i] = smooth * (1 - i / length) ** 3.2;
    }
  }
  return impulse;
}

function wake() {
  if (!ctx) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    ctx = new Context({ latencyHint: 'interactive' });
    const master = ctx.createGain();
    master.gain.value = MASTER_LEVEL;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.2;
    const reverb = ctx.createConvolver();
    reverb.buffer = buildImpulse(ctx);
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.22;
    reverbSend.connect(reverb).connect(master);
    const input = ctx.createGain();
    input.connect(master);
    master.connect(compressor).connect(ctx.destination);
    bus = { input, reverbSend };
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

const live = () => enabled && ctx && ctx.state === 'running' && voices < MAX_VOICES;

// Stereo position from the element's place on screen (-0.55 left .. 0.55 right).
function panFor(element) {
  if (!element || !element.getBoundingClientRect) return 0;
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / Math.max(1, innerWidth);
  return Math.max(-0.55, Math.min(0.55, (x - 0.5) * 1.1));
}

function output(pan, wet) {
  const panner = ctx.createStereoPanner();
  panner.pan.value = pan;
  panner.connect(bus.input);
  if (wet > 0) {
    const send = ctx.createGain();
    send.gain.value = wet;
    panner.connect(send).connect(bus.reverbSend);
  }
  return panner;
}

function track(node, stopAt) {
  voices++;
  node.onended = () => { voices = Math.max(0, voices - 1); };
  node.stop(stopAt);
}

// One oscillator voice with an attack/decay envelope and optional pitch glide.
function tone({ freq, type = 'sine', at = 0, attack = 0.004, decay = 0.2, gain = 0.1, pan = 0, wet = 0.2, glide, filter }) {
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, start + attack + decay * 0.8);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  let chain = osc.connect(env);
  if (filter) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = filter;
    chain = chain.connect(lp);
  }
  chain.connect(output(pan, wet));
  osc.start(start);
  track(osc, start + attack + decay + 0.05);
}

let noiseBuffer = null;
function noise({ at = 0, duration = 0.12, from = 1200, to = from, q = 1.2, type = 'bandpass', gain = 0.05, pan = 0, wet = 0.15, attack = 0.006 }) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const start = ctx.currentTime + at;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(env).connect(output(pan, wet));
  source.start(start, Math.random() * 0.5);
  track(source, start + duration + 0.05);
}

// FM bell: inharmonic partials for glassy shimmer or a metallic blade ring.
function bell({ freq, ratio = 3.5, index = 2.2, at = 0, decay = 0.9, gain = 0.06, pan = 0, wet = 0.4 }) {
  const start = ctx.currentTime + at;
  const carrier = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const depth = ctx.createGain();
  carrier.frequency.value = freq;
  modulator.frequency.value = freq * ratio;
  depth.gain.setValueAtTime(freq * index, start);
  depth.gain.exponentialRampToValueAtTime(freq * 0.05, start + decay);
  modulator.connect(depth).connect(carrier.frequency);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.003);
  env.gain.exponentialRampToValueAtTime(0.0001, start + decay);
  carrier.connect(env).connect(output(pan, wet));
  modulator.start(start);
  carrier.start(start);
  modulator.stop(start + decay + 0.05);
  track(carrier, start + decay + 0.05);
}

// Marimba-ish mallet: fundamental plus a fast-decaying 4th partial.
function mallet(freq, { at = 0, gain = 0.07, pan = 0, decay = 0.32, wet = 0.2 } = {}) {
  tone({ freq, at, decay, gain, pan, wet });
  tone({ freq: freq * 4.01, at, decay: decay * 0.22, gain: gain * 0.35, pan, wet: 0 });
}

/* ---------- the palette: one sound per kind of interaction ---------- */

const sounds = {
  tick(el, { soft = false } = {}) {
    const pan = panFor(el);
    const pitch = 2100 + (Math.random() - 0.5) * 160;
    tone({ freq: pitch, decay: 0.035, gain: soft ? 0.018 : 0.03, pan, wet: 0.05 });
    noise({ duration: 0.02, from: 6000, type: 'highpass', gain: soft ? 0.006 : 0.01, pan, wet: 0 });
  },
  navHover(el) {
    const items = [...el.parentElement.children];
    mallet(note(items.indexOf(el) + 5), { gain: 0.035, pan: panFor(el), decay: 0.22 });
  },
  // Skill tiles play the scale: group picks the octave, position picks the note,
  // so sweeping across the grid plays a melody.
  skill(el) {
    const group = el.closest('.skill-group');
    const groups = [...document.querySelectorAll('.skills-groups .skill-group')];
    const index = [...group.querySelectorAll('.skill')].indexOf(el);
    const g = Math.max(0, groups.indexOf(group));
    mallet(note(index + (g % 2) * 2, 1 + Math.floor(g / 3)), { gain: 0.05, pan: panFor(el) });
  },
  icon(el) {
    const index = [...el.parentElement.children].indexOf(el);
    mallet(note(index, 2), { gain: 0.04, pan: panFor(el), decay: 0.25 });
  },
  // Cards: a sheet of paper sliding, with a soft low body.
  card(el) {
    const pan = panFor(el);
    noise({ duration: 0.2, from: 700, to: 2600, q: 0.9, gain: 0.05, pan, wet: 0.1, attack: 0.04 });
    tone({ freq: 146.8, decay: 0.16, gain: 0.03, pan, wet: 0.1 });
  },
  portraitHover(el) {
    noise({ duration: 0.16, from: 2400, to: 1400, q: 1.5, gain: 0.04, pan: panFor(el), attack: 0.02 });
  },
  bladeHover(el) {
    bell({ freq: 1760, ratio: 2.76, index: 0.6, decay: 0.25, gain: 0.02, pan: panFor(el), wet: 0.3 });
  },
  press(el) {
    const pan = panFor(el);
    tone({ freq: 540, glide: 250, decay: 0.08, gain: 0.1, pan, wet: 0.08 });
    noise({ duration: 0.025, from: 3000, type: 'highpass', gain: 0.03, pan, wet: 0 });
  },
  cardPress(el) {
    const pan = panFor(el);
    tone({ freq: 220, glide: 180, decay: 0.12, gain: 0.08, pan, wet: 0.15 });
    noise({ duration: 0.06, from: 1800, q: 0.8, gain: 0.04, pan });
  },
  // Leaving the site: a rising glide and a breath of air.
  depart(el) {
    const pan = panFor(el);
    tone({ freq: 392, glide: 1175, decay: 0.24, gain: 0.05, pan, wet: 0.3 });
    noise({ duration: 0.3, from: 500, to: 4000, q: 0.7, gain: 0.03, pan, attack: 0.08 });
  },
  mail(el) {
    const pan = panFor(el);
    mallet(note(3, 1), { gain: 0.06, pan });
    mallet(note(0, 2), { at: 0.11, gain: 0.06, pan });
  },
  navigate(direction) {
    const first = direction >= 0 ? note(0, 1) : note(3, 1);
    const second = direction >= 0 ? note(3, 1) : note(0, 1);
    mallet(first, { gain: 0.06 });
    mallet(second, { at: 0.085, gain: 0.07 });
  },
  jump() {
    noise({ duration: 0.22, from: 900, to: 300, q: 0.8, gain: 0.03, attack: 0.05 });
    mallet(note(1, 1), { gain: 0.04 });
  },
  // Light mode: a bright rising arpeggio. Dark mode: a slow falling dusk.
  themeLight() {
    [0, 2, 4, 5, 7].forEach((d, i) => bell({ freq: note(d, 1), ratio: 2, index: 0.8, at: i * 0.055, decay: 0.7, gain: 0.035, pan: -0.3 + i * 0.15, wet: 0.45 }));
    noise({ duration: 0.45, from: 3000, to: 9000, type: 'highpass', gain: 0.012, attack: 0.2 });
  },
  themeDark() {
    [7, 4, 0].forEach((d, i) => tone({ freq: note(d, 0), type: 'triangle', at: i * 0.09, attack: 0.02, decay: 0.9, gain: 0.045, filter: 1400, pan: 0.3 - i * 0.3, wet: 0.5 }));
    tone({ freq: note(0, -1), attack: 0.08, decay: 1.2, gain: 0.04, wet: 0.4 });
  },
  dialogOpen() {
    noise({ duration: 0.28, from: 400, to: 3200, q: 0.8, gain: 0.04, attack: 0.1 });
    bell({ freq: note(3, 1), ratio: 2, index: 0.7, at: 0.12, decay: 0.8, gain: 0.04, wet: 0.45 });
  },
  dialogClose() {
    noise({ duration: 0.22, from: 2600, to: 400, q: 0.8, gain: 0.035, attack: 0.03 });
    tone({ freq: note(0, 0), at: 0.05, decay: 0.3, gain: 0.04, wet: 0.3 });
  },
  // Details sections: two quick flicks of a page.
  pageFlip(open) {
    noise({ duration: 0.05, from: open ? 2200 : 1600, q: 1.4, gain: 0.05 });
    noise({ at: 0.045, duration: 0.07, from: open ? 3000 : 1200, q: 1.4, gain: 0.04 });
  },
  sparkle() {
    for (let i = 0; i < 6; i++) bell({ freq: note(Math.floor(Math.random() * 5) + i, 2), ratio: 2.01, index: 0.5, at: i * 0.05, decay: 0.5, gain: 0.025, pan: Math.random() - 0.5, wet: 0.5 });
  },
  portraitPress(el) {
    const pan = panFor(el);
    tone({ freq: 330, glide: 440, decay: 0.12, gain: 0.07, pan, wet: 0.2 });
    noise({ duration: 0.08, from: 1600, q: 1, gain: 0.03, pan });
  },
  // Bleach layer: a blade drawn from its sheath, a strike, a flash-step arrival.
  shing(el) {
    const pan = panFor(el);
    noise({ duration: 0.18, from: 9000, to: 3000, type: 'highpass', gain: 0.02, pan, attack: 0.02 });
    bell({ freq: 1244, ratio: 2.76, index: 1.2, at: 0.03, decay: 0.7, gain: 0.03, pan, wet: 0.5 });
  },
  slash(character = '') {
    const seed = [...character].reduce((n, c) => n + c.charCodeAt(0), 0);
    noise({ duration: 0.16, from: 7000, to: 700, q: 0.9, gain: 0.07, attack: 0.004 });
    tone({ freq: 80 + (seed % 5) * 12, glide: 45, decay: 0.35, gain: 0.07, wet: 0.35 });
    bell({ freq: note(seed % 5, 1), ratio: 2.76, index: 1.5, at: 0.02, decay: 0.45, gain: 0.02, wet: 0.5 });
  },
  arrive() {
    noise({ duration: 0.25, from: 300, to: 5000, q: 0.7, gain: 0.04, attack: 0.12 });
    bell({ freq: note(3, 2), ratio: 2.76, index: 0.9, at: 0.18, decay: 0.6, gain: 0.025, wet: 0.5 });
  },
  soundOn() {
    mallet(note(0, 1), { gain: 0.05 });
    mallet(note(3, 1), { at: 0.07, gain: 0.05 });
    mallet(note(0, 2), { at: 0.14, gain: 0.05 });
  },
};

function play(name, ...args) {
  if (!live()) return;
  if (window.__vasuSoundLog) window.__vasuSoundLog.push(name); // test hook, unused in normal browsing
  try { sounds[name](...args); } catch { /* a missing node or closed context should never break the page */ }
}

/* ---------- mapping elements to sounds ---------- */

const INTERACTIVE = 'a[href],button,summary,[role="button"],label[for],input,select,textarea,.avatar-rotator';
const CARD = '.proj, .selected-item';

// The element an interaction belongs to. A whole project card counts as one element,
// so moving between its cover and its text doesn't retrigger the sound.
function interactiveFrom(target) {
  return target.closest(CARD) || target.closest(INTERACTIVE) || target.closest('.skills-groups .skill');
}

// Hover voice for an element, most specific first.
function hoverSound(el) {
  if (el.matches('.skills-groups .skill')) return ['skill', el];
  if (el.closest('.skills-groups')) return ['skill', el.closest('.skill')];
  if (el.matches('.hero-contacts a, .hero-contacts button, .footer-links a')) return ['icon', el];
  if (el.closest('.proj, .selected-item, .selected-art')) return ['card', el.closest('.proj, .selected-item, .selected-art')];
  if (el.matches('.navigation > a')) return ['navHover', el];
  if (el.closest('.character-card, .character-roster, .soul-controls, .bleach-menu, .soul-toggle')) return ['bladeHover', el];
  if (el.closest('.avatar-rotator')) return ['portraitHover', el];
  return ['tick', el];
}

// Click voice, or null when another listener already voices the result
// (page changes, dialogs, theme, details and the mute button itself).
function pressSound(el) {
  if (el.closest('.sound-toggle, .theme-toggle, summary')) return null;
  if (el.closest('[data-open-contact], [data-close-contact], [data-resume-close], a[href="/resume.html"]')) return null;
  const link = el.closest('a[href]');
  if (link && link.getAttribute('href').startsWith('#')) return null;
  if (el.closest('.secret-dot')) return ['sparkle'];
  if (el.closest('.character-roster button, .character-prev, .character-next, .character-card button, .soul-toggle')) return ['shing', el];
  if (el.closest('.avatar-rotator')) return ['portraitPress', el];
  if (link && link.protocol === 'mailto:') return ['mail', el];
  if (link && (link.target === '_blank' || link.host !== location.host)) return ['depart', el];
  if (el.closest('.proj, .selected-item, .selected-art')) return ['cardPress', el];
  return ['press', el];
}

document.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'touch') return;
  const el = event.target instanceof Element ? interactiveFrom(event.target) : null;
  if (!el || el === hovered) return;
  hovered = el;
  const now = performance.now();
  if (now - lastHoverAt < HOVER_GAP_MS) return;
  lastHoverAt = now;
  const [name, target] = hoverSound(el);
  play(name, target);
}, { passive: true });

document.addEventListener('pointerout', (event) => {
  if (hovered && !(event.relatedTarget instanceof Node && hovered.contains(event.relatedTarget))) hovered = null;
}, { passive: true });

// Keyboard focus gets a quieter tick, so tabbing through the page has a pulse.
document.addEventListener('focusin', (event) => {
  const el = event.target;
  if (el instanceof Element && el.matches(':focus-visible') && el.matches(INTERACTIVE)) play('tick', el, { soft: true });
});

document.addEventListener('pointerdown', wake, { capture: true, passive: true });
document.addEventListener('keydown', wake, { capture: true });

document.addEventListener('click', (event) => {
  wake();
  if (!(event.target instanceof Element)) return;
  const el = interactiveFrom(event.target);
  if (!el) return;
  const sound = pressSound(el);
  if (sound) play(...sound);
}, { capture: true });

// Page changes, however they happen (nav links, keyboard shortcuts, back button).
let currentPage = PAGES.indexOf(location.hash.slice(1));
window.addEventListener('hashchange', () => {
  const next = PAGES.indexOf(location.hash.slice(1));
  if (next >= 0) play('navigate', next - Math.max(0, currentPage));
  else play('jump');
  if (next >= 0) currentPage = next;
});

// Theme, dialogs, details, and the Bleach layer are voiced from what actually
// changes in the DOM, so keyboard shortcuts and Escape sound the same as clicks.
const root = document.documentElement;
let theme = root.dataset.theme;
new MutationObserver(() => {
  if (root.dataset.theme === theme) return;
  theme = root.dataset.theme;
  play(theme === 'light' ? 'themeLight' : 'themeDark');
}).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

new MutationObserver((records) => {
  for (const record of records) {
    const el = record.target;
    if (record.type === 'attributes') {
      const open = el.hasAttribute('open');
      if (open === (record.oldValue !== null)) continue;
      if (el.tagName === 'DIALOG') play(open ? 'dialogOpen' : 'dialogClose');
      else if (el.tagName === 'DETAILS') el.matches('.bleach-menu') ? (open && play('shing', el)) : play('pageFlip', open);
      continue;
    }
    for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches('.soul-effect')) play('slash', node.dataset.effect || '');
      else if (node.matches('.bleach-entrance')) play('arrive');
    }
  }
}).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'], attributeOldValue: true });

document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend().catch(() => {});
  else if (enabled) ctx.resume().catch(() => {});
});

/* ---------- mute control ---------- */

const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L12 5.6v12.8l-4.8-3.9H4z" fill="currentColor"/><path class="sound-wave" d="M15.3 9.2a4 4 0 0 1 0 5.6M17.8 6.8a7.4 7.4 0 0 1 0 10.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L12 5.6v12.8l-4.8-3.9H4z" fill="currentColor"/><path d="m15.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

const toggle = document.createElement('button');
toggle.type = 'button';
toggle.className = 'sound-toggle';
toggle.title = 'Interface sound (M)';

function renderToggle() {
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.setAttribute('aria-label', enabled ? 'Mute interface sounds' : 'Turn interface sounds on');
  toggle.innerHTML = enabled ? ICON_ON : ICON_OFF;
  toggle.classList.toggle('is-muted', !enabled);
}

function setEnabled(value) {
  enabled = value;
  try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch {}
  renderToggle();
  if (enabled) { wake(); setTimeout(() => play('soundOn'), 30); }
}

toggle.addEventListener('click', () => setEnabled(!enabled));
renderToggle();
const nav = document.querySelector('.navigation');
const themeToggle = nav && nav.querySelector('.theme-toggle');
if (nav) nav.insertBefore(toggle, themeToggle || null);

// M toggles sound, with the same guards as the other keyboard shortcuts.
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() !== 'm' || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]')) return;
  try { if (localStorage.getItem('vasu-keyboard') === 'off') return; } catch {}
  setEnabled(!enabled);
});
