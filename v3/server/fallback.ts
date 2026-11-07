// Instant answers for predictable questions (no model needed). One or two lines each, written from content.md and resume.md.
type Intent = { keys: string[]; answer: string };

const intents: Intent[] = [
  { keys: ['help', 'hire', 'build for', 'work with', 'services', 'project for', 'client', 'company', 'business', 'owner', 'founder', 'startup', 'freelance', 'contract', 'agency', 'can he', 'can you', 'offer'],
    answer: 'Voice AI, AI agents, LLM reliability and full-stack MVPs. Engagements run from a 3–5 day diagnostic to a 3–6 week MVP. [[go:/projects/fintech-pnl]]' },
  { keys: ['withlayer', 'layer', 'intern', 'job', 'current', 'now', 'working on'],
    answer: 'AI Engineering Intern at withlayer.ai: real-time voice, LLM agent workflows and full-stack features. [[go:/about]]' },
  { keys: ['fintech', 'p&l', 'pnl', 'finance', 'stripe', 'shopify', '18 days'],
    answer: 'Solo, 18 days, in production: 5 integrations, ~4,500× faster attribution, 641 orphaned orders recovered, zero post-handoff bugs. [[go:/projects/fintech-pnl]]' },
  { keys: ['justhireme', 'job search', 'stars', 'viral', 'launch'],
    answer: 'A local-first AI job-search desktop app: 380.6K launch views, 2,272 GitHub stars, 1,926 backend tests at v1.7.0. [[go:/projects/justhireme]]' },
  { keys: ['voice', 'call', 'phone', 'latency', 'vaani', 'svara', 'dictation', 'livekit', 'speech', 'realtime', 'real-time'],
    answer: 'Real-time voice agents with barge-in and turn detection. Svara, his on-device dictation, reaches 54 ms to first word. [[go:/projects/svara]]' },
  { keys: ['odeon', 'eval', 'test', 'prompt', 'quality', 'gym'],
    answer: 'Odeon simulates hard callers, judges each run per metric, and rewrites the prompt until every threshold passes. [[go:/projects/odeon]]' },
  { keys: ['branchgpt', 'branch', 'chat', 'context'],
    answer: 'Chat that branches like Git: fork, explore, merge back only what matters. [[go:/projects/branchgpt]]' },
  { keys: ['mapmyrepo', 'codebase', 'repo', 'graph'],
    answer: 'Any codebase as a graph you can question. [[go:/projects/mapmyrepo]]' },
  { keys: ['stack', 'tech', 'language', 'python', 'typescript', 'tools', 'skills'],
    answer: 'Python, TypeScript, Rust and Swift. FastAPI, Next.js, Postgres, LangGraph, LiveKit, AWS. [[go:/about]]' },
  { keys: ['price', 'cost', 'rate', 'budget', 'available', 'availability', 'when', 'timeline', 'how fast', 'contact', 'email', 'reach'],
    answer: 'Depends on scope. A 20-minute call settles it: cal.com/vasu-devs' },
  { keys: ['open source', 'contribut', 'oss'],
    answer: '8 merged PRs across 5 external repos. [[go:/about]]' },
  { keys: ['who', 'about', 'education', 'student', 'college', 'background'],
    answer: 'Vasudev Siddh, an AI and full-stack engineer in India. AI Engineering Intern at withlayer.ai, creator of JustHireMe. [[go:/about]]' },
];

/** The best-matching instant answer, or null when nothing matches. */
export function matchAnswer(question: string): string | null {
  const q = question.toLowerCase();
  // Keywords match at word starts, so "hire" does not fire inside "justhireme".
  const has = (k: string) => new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&')}`).test(q);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    // Count matched keywords; on a tie the earlier (more specific) intent wins.
    const score = intent.keys.reduce((n, k) => n + (has(k) ? 1 : 0), 0);
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  return best?.answer ?? null;
}

export const fallbackAnswer = (question: string) =>
  matchAnswer(question) ?? 'Ask about the work, services or availability. Or book a call: cal.com/vasu-devs';
