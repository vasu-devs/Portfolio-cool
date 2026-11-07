// The swarm opening: the page blanks and a crowd of named cursors rebuilds it (engine: swarm-engine.ts).
// It is the site's opening: it plays on every load and refresh; the footer can start it again.

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

export async function startSwarm(waitMs = 0) {
  if (running || !swarmSupported()) return;
  running = true;
  try {
    const [{ runSwarm }] = await Promise.all([
      import('./swarm-engine'), // split out: most visitors never download it
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]), // measure final text, not fallback fonts
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
