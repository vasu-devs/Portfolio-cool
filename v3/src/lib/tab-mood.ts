// The tab icon is the mascot too: its mood changes as the visitor scrolls, switches pages, clicks, and now and
// then on its own while the tab is visible.
import { asset } from './asset';
import { MOODS } from './moods';

const icon = (m: string) => asset(m === 'mascot' ? 'favicon-64.png' : `img/mood/${m}-64.png`);
let link: HTMLLinkElement | null = null;
let current = 0;
let last = 0;

/** Show another mood in the tab (at most about once a second, so a burst of events reads as one change). */
export function nextTabMood() {
  const now = performance.now();
  if (!link || now - last < 900) return;
  last = now;
  current = (current + 1 + Math.floor(Math.random() * (MOODS.length - 1))) % MOODS.length; // never the same twice
  link.href = icon(MOODS[current]);
}

export function startTabMoods() {
  if (link) return;
  link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) return;
  for (const m of MOODS) new Image().src = icon(m);
  let y = scrollY;
  addEventListener('scroll', () => {
    if (Math.abs(scrollY - y) < innerHeight * 0.8) return; // about once per screen scrolled
    y = scrollY;
    nextTabMood();
  }, { passive: true });
  addEventListener('pointerdown', nextTabMood, { passive: true });
  setInterval(() => { if (!document.hidden) nextTabMood(); }, 12_000);
}
