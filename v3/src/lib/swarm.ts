// The swarm opening: the page blanks and a crowd of named cursors rebuilds it (engine: swarm-engine.ts).
// Plays by itself for visitors sent from X or an AI assistant, or with ?swarm; anyone can start it from the footer.
const SOURCES = ['x.com', 't.co', 'twitter.com', 'chatgpt.com', 'openai.com', 'claude.ai', 'perplexity.ai', 'gemini.google.com', 'copilot.microsoft.com', 'grok.com', 'deepseek.com', 'meta.ai', 'chat.mistral.ai', 'phind.com'];
const UTM = ['x', 'twitter', 'chatgpt', 'openai', 'claude', 'perplexity', 'gemini', 'copilot', 'grok', 'deepseek', 'mistral', 'phind'];

const hostOf = (url: string) => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } };

export const swarmSupported = () => typeof window !== 'undefined'
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && 'highlights' in CSS; // untyped text is hidden with a CSS highlight, so layout never shifts

function wanted() {
  if (!swarmSupported() || window.self !== window.top) return false;
  const q = new URLSearchParams(location.search);
  if (q.has('swarm')) return true;
  if (sessionStorage.getItem('swarm-seen')) return false; // once per tab session
  const utm = q.get('utm_source')?.trim().toLowerCase() ?? '';
  const host = hostOf(document.referrer);
  return UTM.includes(utm) || SOURCES.some((s) => host === s || host.endsWith(`.${s}`));
}

/** Read once at load. On a swarm visit the counter intro is skipped and the hero shows finished, so the swarm rebuilds the real page. */
export const swarmVisit = wanted();
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
  sessionStorage.setItem('swarm-seen', '1');
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
