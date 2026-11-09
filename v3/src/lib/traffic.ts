// Live visitor numbers from the site-wide counter (api/traffic.js, Upstash), shared with the paper portfolio at /:
// the same browser keys, so a visitor is never counted twice across the two designs.
import { useSyncExternalStore } from 'react';

export type Traffic = { totalViews: number; uniqueVisitors: number; activeNow: number; visitorNumber: number | null };

const ID_KEY = 'portfolio:visitor-id';
const UNIQUE_KEY = 'portfolio:traffic:unique-tracked';
const local = ['localhost', '127.0.0.1'].includes(location.hostname); // never count development visits
let tracked = false; // one view per page load; later check-ins only keep the visitor in "here now"

// crypto.randomUUID needs HTTPS and a 2022+ browser; getRandomValues works everywhere. Without this fallback a
// missing randomUUID threw while this module loaded and took the whole app down with it.
const uuid = (): string => crypto.randomUUID?.()
  ?? '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));

/** This browser's visitor ID: kept in localStorage, so every later visit gets the same visitor number.
 *  Without storage it lasts for this page load only (one number per load, never one per check-in). */
const visitorId = (() => {
  let id: string | null = null;
  try {
    id = localStorage.getItem(ID_KEY);
    if (!/^[a-f0-9-]{36}$/i.test(id ?? '')) localStorage.setItem(ID_KEY, (id = uuid()));
  } catch { /* storage blocked */ }
  return id && /^[a-f0-9-]{36}$/i.test(id) ? id : uuid();
})();
const viewId = uuid();

async function check(): Promise<Traffic> {
  const trackView = !tracked && !local;
  let trackUnique = trackView;
  try { trackUnique = trackView && localStorage.getItem(UNIQUE_KEY) !== '1'; } catch { /* storage blocked */ }
  const res = await fetch('/api/traffic', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ trackView, trackUnique, viewId, visitorId: local ? undefined : visitorId, heartbeat: !local }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`traffic ${res.status}`);
  const t = (await res.json()) as Traffic;
  if (![t.totalViews, t.uniqueVisitors, t.activeNow].every((n) => Number.isFinite(n) && n >= 0)) throw new Error('traffic: bad shape');
  tracked = true;
  if (trackUnique) try { localStorage.setItem(UNIQUE_KEY, '1'); } catch { /* storage blocked */ }
  return t;
}

// One poller for the whole visit, started by the app (so every page checks in and counts as "here now");
// the hero only reads the latest numbers.
let current: Traffic | null = null;
const listeners = new Set<() => void>();

/** Check in now and every 30 s while the tab is visible. A failed check keeps the last numbers. */
export function startTraffic() {
  let timer = 0;
  const tick = () => {
    if (document.hidden) return;
    check().then((t) => { current = t; listeners.forEach((l) => l()); }, (e) => console.warn('[traffic] unavailable', e.message));
  };
  const schedule = () => { clearInterval(timer); if (!document.hidden) { tick(); timer = setInterval(tick, 30_000); } };
  schedule();
  document.addEventListener('visibilitychange', schedule);
  return () => { clearInterval(timer); document.removeEventListener('visibilitychange', schedule); };
}

/** The latest counts, or null until the first answer. */
export const useTraffic = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current);
