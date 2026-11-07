import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { evaluateLead, type Lead } from '../lab/jhmGate';
import fixture from '../lab/jhm-gate-parity.json';

// JustHireMe's lead quality gate, running in the page. Presets are the synthetic postings from the parity test.
const DAY = 86_400_000;
const AGES = [['today', 0], ['2 days ago', 2], ['10 days ago', 10], ['30 days ago', 30], ['no date', -1]] as const;
const PRESETS: { label: string; name: string; age: number }[] = [
  { label: 'A real role', name: 'good', age: 2 },
  { label: 'Unpaid gig', name: 'unpaid', age: 1 },
  { label: 'Senior, beginner feed', name: 'senior-for-junior', age: 0 },
  { label: 'A month old', name: 'stale', age: 30 },
  { label: 'Scraper junk', name: 'boilerplate', age: 1 },
];
const SOURCE = 'https://github.com/vasu-devs/JustHireMe/blob/v1.7.0/backend/discovery/quality_gate.py';

type Form = { title: string; company: string; description: string; url: string; age: number; beginner: boolean };
const fromPreset = (name: string, age: number): Form => {
  const c = fixture.cases.find((x) => x.name === name)!;
  return { title: c.lead.title ?? '', company: c.lead.company ?? '', description: c.lead.description ?? '', url: c.lead.url ?? '', age, beginner: c.target === 'junior' };
};

export function GateLab() {
  const [form, setForm] = useState<Form>(() => fromPreset('good', 2));
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
  const verdict = useMemo(() => {
    const lead: Lead = { title: form.title, company: form.company, description: form.description, url: form.url,
      posted_date: form.age < 0 ? undefined : new Date(Date.now() - form.age * DAY).toISOString() };
    return evaluateLead(lead, { targetLevel: form.beginner ? 'junior' : 'any' });
  }, [form]);

  // The score counts to its new value instead of jumping.
  const scoreEl = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  useEffect(() => {
    const t = gsap.to(shown.current, { v: verdict.score, duration: 0.6, ease: 'power3.out', onUpdate: () => { scoreEl.current!.textContent = String(Math.round(shown.current.v)); } });
    return () => { t.kill(); };
  }, [verdict.score]);

  return (
    <section className="gate">
      <header className="gate-head">
        <p className="mono">JustHireMe / lead quality gate</p>
        <h1>Would it make the list?</h1>
        <p>Paste any job post. This is the gate JustHireMe runs before a lead reaches you, running here in your browser.</p>
      </header>

      <div className="gate-grid">
        <form className="gate-form" onSubmit={(e) => e.preventDefault()}>
          <div className="gate-presets" role="group" aria-label="Example postings">
            {PRESETS.map((p) => <button key={p.name} type="button" onClick={() => setForm(fromPreset(p.name, p.age))}>{p.label}</button>)}
          </div>
          <label>Title<input value={form.title} onChange={(e) => set({ title: e.target.value })} /></label>
          <label>Company<input value={form.company} onChange={(e) => set({ company: e.target.value })} /></label>
          <div className="gate-row">
            <label>Posted
              <select value={form.age} onChange={(e) => set({ age: Number(e.target.value) })}>
                {AGES.map(([l, v]) => <option key={l} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="gate-check"><input type="checkbox" checked={form.beginner} onChange={(e) => set({ beginner: e.target.checked })} />Beginner-focused feed</label>
          </div>
          <label>Description<textarea rows={7} value={form.description} onChange={(e) => set({ description: e.target.value })} /></label>
          <label>Apply URL<input value={form.url} onChange={(e) => set({ url: e.target.value })} /></label>
        </form>

        <div className={`gate-out ${verdict.accepted ? 'is-in' : 'is-out'}`} aria-live="polite">
          <div className="gate-score">
            <span ref={scoreEl} className="gate-num">0</span>
            <span className="gate-verdict">{verdict.accepted ? 'Makes the list' : 'Filtered out'}</span>
          </div>
          <div className="gate-bar" style={{ ['--s' as string]: verdict.score, ['--b' as string]: verdict.bar }}>
            <i /><b><span className="mono">bar {verdict.bar}</span></b>
          </div>
          <ol className="gate-ledger">
            {verdict.ledger.map((s) => (
              <li key={s.label} className={s.delta < 0 ? 'neg' : 'pos'}>
                <span className="mono">{s.delta > 0 ? '+' : '−'}{Math.abs(s.delta)}</span>{s.label}
              </li>
            ))}
          </ol>
          <p className="gate-reason"><span className="mono">What the app shows</span>{verdict.reason}</p>
        </div>
      </div>

      <p className="gate-foot mono">
        Ported line for line from <a href={SOURCE} target="_blank" rel="noreferrer">quality_gate.py</a> (v1.7.0) and checked against the Python on 10 postings: same verdict, score and reason.
      </p>
    </section>
  );
}
