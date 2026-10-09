// Interface sound design for the portfolio.
//
// Crisp, clicky ASMR: clicky key switches that press and release separately, pen
// clicks, bubble-wrap pops, light switches, latches, crisp paper, and blade clashes.
// All synthesised live with the Web Audio API (no audio files) from band-passed noise
// clicks and tiny high resonances, with random variation on every sound, panned to
// where the element sits on screen. The master chain cuts everything under ~320 Hz
// (no bass) and lifts the top end slightly before a short room and a compressor.
//
// Browsers only allow audio after a user gesture, so the engine wakes on the first
// click, tap or key press. Sound is on by default; the speaker button in the nav
// (or the M key) mutes it and the choice is remembered.

const STORAGE_KEY = 'vasu-sound';
const MASTER_LEVEL = 0.7;
const MAX_VOICES = 16;
const HOVER_GAP_MS = 32; // minimum spacing between hover sounds
const PAGES = ['home', 'projects', 'about', 'contact'];

let enabled = true;
try { enabled = localStorage.getItem(STORAGE_KEY) !== 'off'; } catch {}

let ctx = null;
let bus = null; // { input, reverbSend }
let voices = 0;
let lastHoverAt = 0;
let hovered = null;

/* ---------- engine ---------- */

function buildImpulse(context, seconds = 0.9) {
  // A short, dark stereo room: decaying noise, gently low-passed by the decay curve.
  const rate = context.sampleRate;
  const length = Math.floor(rate * seconds);
  const impulse = context.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let smooth = 0;
    for (let i = 0; i < length; i++) {
      smooth = smooth * 0.85 + (Math.random() * 2 - 1) * 0.15; // darker, softer tail
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
    reverbSend.gain.value = 0.14; // close and intimate, not a hall
    reverbSend.connect(reverb).connect(master);
    const input = ctx.createGain();
    input.connect(master);
    // No bass: a steep high-pass under ~320 Hz, and a gentle lift above 5 kHz for crispness.
    const lowCut = ctx.createBiquadFilter();
    lowCut.type = 'highpass';
    lowCut.frequency.value = 320;
    lowCut.Q.value = 0.9;
    const air = ctx.createBiquadFilter();
    air.type = 'highshelf';
    air.frequency.value = 5000;
    air.gain.value = 2.5;
    master.connect(lowCut).connect(air).connect(compressor).connect(ctx.destination);
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

/* ---------- the palette: crisp, clicky, tactile ASMR (no melodies, no bass) ---------- */

// Tiny random variation so a repeated click never sounds like a sample on loop.
const vary = (value, amount = 0.06) => value * (1 + (Math.random() * 2 - 1) * amount);

// A click: a very short burst of band-passed noise. Every switch, tap and latch is built from these.
function click({ at = 0, freq = 4200, q = 1.6, duration = 0.007, gain = 0.06, pan = 0, wet = 0.02 } = {}) {
  noise({ at, duration: vary(duration, 0.1), from: vary(freq), q, type: 'bandpass', gain: vary(gain, 0.1), pan, wet, attack: 0.0006 });
}

// A tiny high resonance: the small plastic shell a click happens in (kept well above bass).
function shell({ at = 0, freq = 1000, duration = 0.018, gain = 0.02, pan = 0 } = {}) {
  const f = vary(freq, 0.06);
  tone({ freq: f, glide: f * 0.85, at, attack: 0.001, decay: duration, gain, pan, wet: 0.01 });
}

// Crisp paper: band-passed noise sweeping through the upper mids.
function paper({ at = 0, duration = 0.14, from = 2000, to = 4500, gain = 0.028, pan = 0, attack = 0.03, wet = 0.04 } = {}) {
  noise({ at, duration, from: vary(from, 0.1), to: vary(to, 0.1), type: 'bandpass', q: 0.8, gain, pan, wet, attack });
}

// Mechanical key switch (clicky), pressed and released separately.
function keyDown(pan = 0, weight = 1) {
  click({ freq: 5600, q: 1.3, duration: 0.005, gain: 0.07 * weight, pan });
  click({ at: 0.003, freq: 3200, q: 2.6, duration: 0.009, gain: 0.045 * weight, pan });
  shell({ at: 0.002, freq: 1150, duration: 0.016, gain: 0.018 * weight, pan });
}
function keyUp(pan = 0, weight = 1) {
  click({ freq: 4600, q: 2, duration: 0.005, gain: 0.045 * weight, pan });
  click({ at: 0.004, freq: 7200, q: 2.5, duration: 0.004, gain: 0.025 * weight, pan });
}

// Bubble wrap: a sharp crack with a tiny collapsing air pocket.
function pop({ at = 0, gain = 0.06, pan = 0 } = {}) {
  click({ at, freq: 4200, q: 1, duration: 0.005, gain, pan });
  const f = vary(2000, 0.15);
  tone({ freq: f, glide: f * 0.45, at, attack: 0.0008, decay: 0.014, gain: gain * 0.35, pan, wet: 0.01 });
}

const sounds = {
  // Hover: the faint tick of a fingertip on a keycap.
  tick(el, { soft = false } = {}) {
    click({ freq: 6200, q: 3, duration: 0.004, gain: soft ? 0.02 : 0.03, pan: panFor(el) });
  },
  navHover(el) {
    click({ freq: 5000, q: 2.5, duration: 0.005, gain: 0.034, pan: panFor(el) });
  },
  // Skill tiles: crisp typewriter taps, each tile a slightly different key.
  skill(el) {
    const pan = panFor(el);
    click({ freq: 3800 + Math.random() * 2400, q: 2.8, duration: 0.006, gain: 0.04, pan });
    shell({ freq: 1300 + Math.random() * 400, duration: 0.012, gain: 0.012, pan });
  },
  // Icons: a retractable pen, clicked.
  icon(el) {
    const pan = panFor(el);
    click({ freq: 6400, q: 3.5, duration: 0.004, gain: 0.04, pan });
    click({ at: 0.026, freq: 5400, q: 3.5, duration: 0.004, gain: 0.03, pan });
  },
  // Cards: a fingertip flicking across the edge of a page.
  card(el) {
    paper({ duration: 0.12, from: 2400, to: 5200, gain: 0.026, pan: panFor(el), attack: 0.03 });
  },
  portraitHover(el) {
    paper({ duration: 0.09, from: 3600, to: 2600, gain: 0.02, pan: panFor(el), attack: 0.02 });
  },
  bladeHover(el) {
    click({ freq: 7600, q: 8, duration: 0.01, gain: 0.02, pan: panFor(el) });
  },
  keyDown(el) { keyDown(panFor(el)); },
  keyUp(el) { keyUp(panFor(el)); },
  // Keyboard activation (Enter/Space) has no separate pointer down/up, so play both.
  press(el) {
    const pan = panFor(el);
    keyDown(pan);
    setTimeout(() => live() && keyUp(pan), 60);
  },
  cardPress(el) {
    const pan = panFor(el);
    keyUp(pan, 1.2);
    paper({ at: 0.015, duration: 0.08, from: 3000, to: 1800, gain: 0.022, pan, attack: 0.015 });
  },
  // External links: two quick pen clicks.
  depart(el) {
    const pan = panFor(el);
    click({ freq: 6000, q: 3.5, duration: 0.004, gain: 0.045, pan });
    click({ at: 0.055, freq: 5200, q: 3.5, duration: 0.004, gain: 0.04, pan });
  },
  // Email: an envelope flap folding and pressing shut.
  mail(el) {
    const pan = panFor(el);
    paper({ duration: 0.08, from: 3200, to: 2200, gain: 0.026, pan, attack: 0.02 });
    click({ at: 0.08, freq: 3600, q: 2, duration: 0.008, gain: 0.04, pan });
  },
  // Page change: a crisp rocker switch, one side or the other.
  navigate(direction) {
    const pan = direction >= 0 ? 0.15 : -0.15;
    click({ freq: 3400, q: 1.6, duration: 0.008, gain: 0.06, pan });
    shell({ at: 0.002, freq: direction >= 0 ? 1100 : 950, duration: 0.02, gain: 0.02, pan });
    click({ at: 0.03, freq: 6600, q: 3, duration: 0.004, gain: 0.035, pan });
  },
  jump() {
    paper({ duration: 0.1, from: 3000, to: 1800, gain: 0.02, attack: 0.02 });
  },
  // Theme: a wall light switch, flicked up (light) or down (dark).
  themeLight() {
    click({ freq: 4200, q: 1.4, duration: 0.008, gain: 0.07 });
    shell({ at: 0.002, freq: 1250, duration: 0.02, gain: 0.02 });
    click({ at: 0.016, freq: 7000, q: 2.5, duration: 0.004, gain: 0.04 });
  },
  themeDark() {
    click({ freq: 3400, q: 1.4, duration: 0.009, gain: 0.07 });
    shell({ at: 0.002, freq: 950, duration: 0.022, gain: 0.02 });
    click({ at: 0.018, freq: 6000, q: 2.5, duration: 0.004, gain: 0.035 });
  },
  // Dialogs: a latch unclipping and a lid lifting; closing, the lid settles and clicks shut.
  dialogOpen() {
    click({ freq: 5200, q: 2.5, duration: 0.005, gain: 0.05 });
    click({ at: 0.028, freq: 4000, q: 2.5, duration: 0.006, gain: 0.04 });
    paper({ at: 0.035, duration: 0.14, from: 1800, to: 4200, gain: 0.02, attack: 0.05 });
  },
  dialogClose() {
    paper({ duration: 0.09, from: 3800, to: 2000, gain: 0.02, attack: 0.02 });
    click({ at: 0.09, freq: 3600, q: 1.8, duration: 0.008, gain: 0.06 });
    click({ at: 0.1, freq: 6400, q: 3, duration: 0.004, gain: 0.03 });
  },
  // Details: the crisp double flick of a page being turned.
  pageFlip(open) {
    paper({ duration: 0.06, from: open ? 2600 : 2200, to: open ? 4800 : 1800, gain: 0.03, attack: 0.01 });
    paper({ at: 0.05, duration: 0.08, from: open ? 3600 : 2600, to: 2000, gain: 0.024, attack: 0.012 });
  },
  // Secret dot: a satisfying run of bubble-wrap pops.
  sparkle() {
    for (let i = 0; i < 6; i++) pop({ at: i * 0.06 + Math.random() * 0.025, gain: 0.055, pan: (Math.random() - 0.5) * 0.8 });
  },
  portraitPress(el) {
    pop({ pan: panFor(el), gain: 0.07 });
  },
  // Bleach layer: a katana guard clicking free of the sheath.
  shing(el) {
    const pan = panFor(el);
    click({ freq: 7400, q: 9, duration: 0.018, gain: 0.04, pan });
    click({ at: 0.01, freq: 4800, q: 6, duration: 0.012, gain: 0.025, pan });
  },
  // Attacks: a fast, bright blade swish, then a crisp double clash-ring, pitched per character.
  slash(character = '') {
    const seed = [...character].reduce((n, c) => n + c.charCodeAt(0), 0);
    const ring = 5200 + (seed % 7) * 260;
    const pan = ((seed % 5) - 2) * 0.12;
    paper({ duration: 0.09, from: 2600, to: 8000, gain: 0.05, pan: pan - 0.2, attack: 0.012 });
    click({ at: 0.07, freq: ring, q: 12, duration: 0.05, gain: 0.05, pan });
    click({ at: 0.085, freq: ring * 1.34, q: 14, duration: 0.04, gain: 0.03, pan: pan + 0.15 });
    click({ at: 0.07, freq: 8200, q: 1.5, duration: 0.004, gain: 0.05, pan });
  },
  // Character entrance: a quick flash-step: two taps and a swish.
  arrive() {
    click({ freq: 5600, q: 3, duration: 0.004, gain: 0.03 });
    click({ at: 0.05, freq: 6200, q: 3, duration: 0.004, gain: 0.025 });
    paper({ at: 0.06, duration: 0.1, from: 2400, to: 6000, gain: 0.025, attack: 0.02 });
  },
  // GitHub heatmap: each square is a bead under your fingertip; busier days click
  // brighter and louder, so sweeping across the graph lets you hear the activity.
  heatCell(el, level) {
    click({ freq: 3000 + level * 850, q: 3 + level * 0.4, duration: 0.003 + level * 0.0012, gain: 0.012 + level * 0.009, pan: panFor(el), wet: 0.01 });
    if (level >= 3) click({ at: 0.002, freq: 7600, q: 3, duration: 0.003, gain: 0.012 * level, pan: panFor(el), wet: 0 });
  },
  // When the heatmap first scrolls into view: a crisp zipper of ticks sweeping left to right.
  heatZip() {
    for (let i = 0; i < 26; i++) {
      const t = 0.3 * (1 - (1 - i / 26) ** 1.6); // accelerates, then settles
      click({ at: t, freq: 3200 + i * 110, q: 3, duration: 0.004, gain: 0.018 + (i % 4 === 0 ? 0.012 : 0), pan: -0.5 + i / 26, wet: 0.01 });
    }
  },
  // Sound on: three quick crisp key taps.
  soundOn() {
    [0, 0.08, 0.16].forEach((t) => click({ at: t, freq: 5200, q: 2, duration: 0.005, gain: 0.05 }));
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

// GitHub heatmap squares: their own fast lane (finer throttle than other hovers).
const HEAT_GAP_MS = 12;
let lastHeatAt = 0;
function heatHover(cell) {
  const now = performance.now();
  if (now - lastHeatAt < HEAT_GAP_MS) return;
  lastHeatAt = now;
  const level = Number((cell.getAttribute('fill') || '').match(/heat-(\d)/)?.[1] || 0);
  play('heatCell', cell, level);
}

document.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'touch') return;
  if (event.target instanceof SVGRectElement && event.target.closest('.github-activity')) {
    heatHover(event.target);
    return;
  }
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

// Key switches: the "down" click on press; the release (or the element's own sound) on click.
const SELF_VOICED = '.sound-toggle, .theme-toggle';
document.addEventListener('pointerdown', (event) => {
  wake();
  if (event.button !== 0 || !(event.target instanceof Element)) return;
  const el = interactiveFrom(event.target);
  if (el && !el.closest(SELF_VOICED)) play('keyDown', el);
}, { capture: true, passive: true });
document.addEventListener('keydown', wake, { capture: true });

document.addEventListener('click', (event) => {
  wake();
  if (!(event.target instanceof Element)) return;
  const el = interactiveFrom(event.target);
  if (!el) return;
  const fromPointer = event.detail > 0; // 0 means Enter/Space, which had no pointer down
  const sound = pressSound(el);
  // No press sound means the result is voiced elsewhere (page switch, dialog latch,
  // page flip); that sound doubles as the key's release, so nothing more here.
  if (!sound) return;
  if (sound[0] === 'press') {
    play(fromPointer ? 'keyUp' : 'press', el);
  } else {
    play(...sound);
  }
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

const heatmap = document.querySelector('.github-activity svg');
if (heatmap && 'IntersectionObserver' in window) {
  const zipper = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || !live()) return;
    play('heatZip');
    zipper.disconnect();
  }, { threshold: 0.6 });
  zipper.observe(heatmap);
}

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
