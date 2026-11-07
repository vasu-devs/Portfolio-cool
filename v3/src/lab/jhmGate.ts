// A line-for-line port of JustHireMe's deterministic lead quality gate (backend/discovery/quality_gate.py and
// signal_quality in lead_intel.py, v1.7.0). Term lists are exported verbatim from the Python modules into
// jhm-gate-terms.json; jhmGate.test.ts checks this port against outputs produced by the Python code itself.
import T from './jhm-gate-terms.json' with { type: 'json' };

export type Lead = { title?: string; company?: string; description?: string; url?: string; posted_date?: string };
export type Step = { label: string; delta: number };
export type Verdict = { accepted: boolean; score: number; reason: string; ledger: Step[]; bar: number };

const clean = (s: string) => (s || '').replace(/\s+/g, ' ').trim();
const matched = (text: string, terms: string[], limit = 5) => terms.filter((t) => text.includes(t)).slice(0, limit);

function budget(text: string) {
  const pats = [
    /\$\s?\d[\d,]*(?:\s*(?:-|to)\s*\$?\s?\d[\d,]*)?(?:\s*\/?\s*(?:hr|hour|day|week|month))?/i,
    /(?:budget|rate|salary)\s*[:-]\s*([^\n.;,]{2,90})/i,
  ];
  for (const p of pats) if (p.test(text || '')) return true;
  return false;
}

export function signalQuality(text: string) {
  const lower = clean(text).toLowerCase();
  const role = matched(lower, T.OCCUPATION_TERMS).length ? matched(lower, T.OCCUPATION_TERMS) : matched(lower, T.EMPLOYMENT_TERMS);
  const tech = matched(lower, T.TECH_TERMS), intent = matched(lower, T.INTENT_TERMS);
  const urgency = matched(lower, T.URGENCY_TERMS), noise = matched(lower, T.NOISE_TERMS);
  const ledger: Step[] = [{ label: 'base signal', delta: 18 }];
  if (role.length) ledger.push({ label: 'role: ' + role.slice(0, 3).join(', '), delta: 22 });
  if (tech.length) ledger.push({ label: 'tech: ' + tech.slice(0, 3).join(', '), delta: 6 });
  if (intent.length) ledger.push({ label: 'intent: ' + intent.slice(0, 3).join(', '), delta: 24 });
  if (budget(text)) ledger.push({ label: 'pay stated', delta: 10 });
  if (urgency.length) ledger.push({ label: 'urgency: ' + urgency.slice(0, 2).join(', '), delta: 12 });
  ledger.push({ label: 'job posting', delta: 6 }); // classify_kind always returns "job" in v1.7.0
  if (/\b(remote|apply|email|dm|reply|proposal)\b/.test(lower)) ledger.push({ label: 'clear next step', delta: 5 });
  if (noise.length) ledger.push({ label: 'noise: ' + noise.slice(0, 2).join(', '), delta: -20 });
  const score = ledger.reduce((n, s) => n + s.delta, 0);
  return { score: Math.max(0, Math.min(100, score)), ledger };
}

function isBoilerplate(text: string) {
  const lower = (text || '').toLowerCase().trim();
  for (const sig of T.BOILERPLATE) {
    const at = lower.indexOf(sig);
    if (at >= 0 && (lower.length < 200 || at < 60)) return true;
  }
  return (lower.match(/[a-z]{40,}/g) ?? []).some((run) => [...run].filter((c) => 'aeiou'.includes(c)).length / run.length < 0.3);
}

function freshness(posted: string | undefined, now: number, maxAge = 7): [boolean, string] {
  const t = posted ? Date.parse(posted) : NaN;
  if (Number.isNaN(t)) return [false, 'no posting date'];
  const age = (now - t) / 1000;
  if (age < -86400) return [false, 'future posting date; treating as unverified'];
  const days = Math.max(0, Math.floor(age / 86400));
  return days > maxAge ? [false, `stale posting: ${days} days old`] : [true, `fresh posting: ${days} days old`];
}

export function evaluateLead(lead: Lead, opts: { targetLevel?: string; now?: number; minQuality?: number } = {}): Verdict {
  const text = clean([lead.title, lead.company, '', lead.description, '', lead.posted_date].map((v) => v ?? '').join('\n') + '\n');
  const sq = signalQuality(text);
  const bar = Math.max(0, Math.min(opts.minQuality ?? T.MIN_QUALITY, 100));
  if (!(lead.url ?? '').trim()) return { accepted: false, score: 0, reason: 'missing source/apply URL', ledger: [{ label: 'no apply URL: instant reject', delta: -100 }], bar };
  if (isBoilerplate(lead.description ?? '')) return { accepted: false, score: 0, reason: 'boilerplate scraped description', ledger: [{ label: 'scraper junk: instant reject', delta: -100 }], bar };
  const ledger = [...sq.ledger];
  const reasons: string[] = [];
  let pen = 0;
  if (text.length < 140) { pen += 18; reasons.push('thin scraped posting'); ledger.push({ label: 'thin posting', delta: -18 }); }
  if (!(lead.company ?? '').trim()) { pen += 8; reasons.push('missing company'); ledger.push({ label: 'no company', delta: -8 }); }
  const [fresh, why] = freshness(lead.posted_date, opts.now ?? Date.now());
  reasons.push(why);
  if (!fresh) { pen += 35; ledger.push({ label: why, delta: -35 }); }
  const lower = text.toLowerCase();
  const red = T.RED_FLAGS.filter((f) => lower.includes(f));
  if (red.length) { pen += Math.min(45, 16 * red.length); reasons.push('red flags: ' + red.slice(0, 3).join(', ')); ledger.push({ label: 'red flags: ' + red.slice(0, 3).join(', '), delta: -Math.min(45, 16 * red.length) }); }
  const level = T.SENIOR_FLAGS.some((f) => lower.includes(f)) ? 'senior' : T.BEGINNER_FLAGS.some((f) => lower.includes(f)) ? 'junior' : 'unknown';
  if (['beginner', 'fresher', 'junior'].includes(opts.targetLevel ?? 'any') && level === 'senior') { pen += 38; reasons.push('senior-only role for beginner-focused feed'); ledger.push({ label: 'senior-only, beginner feed', delta: -38 }); }
  else if (level === 'junior') reasons.push('beginner-friendly seniority signal');
  const score = Math.max(0, Math.min(100, sq.score - pen));
  const accepted = score >= bar;
  if (!accepted) reasons.unshift(`signal score ${score} below the ${bar} quality bar`);
  return { accepted, score, reason: reasons.join('; '), ledger, bar };
}
