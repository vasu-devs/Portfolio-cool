import { swarmVisit } from './swarm';

// The opening counter plays once per tab session; the hero waits for it so its own entrance is seen.
// A swarm visit skips it: the swarm is the opening.
let pending = typeof window !== 'undefined'
  && !swarmVisit
  && !sessionStorage.getItem('intro-seen')
  && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const waiters: (() => void)[] = [];

export const introPending = () => pending;
export const whenIntroDone = (fn: () => void) => (pending ? waiters.push(fn) : fn());
export function finishIntro() {
  if (!pending) return;
  pending = false;
  sessionStorage.setItem('intro-seen', '1');
  waiters.splice(0).forEach((fn) => fn());
}
