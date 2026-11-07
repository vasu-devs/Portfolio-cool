import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { person } from '../content';
import { asset } from '../lib/asset';
import { fallbackAnswer } from '../../server/fallback';
import { setAgentBusy } from '../lib/agent';
import { bySlug, work } from '../data/work';

type Turn = { q: string; a: string };
const suggestions = ['What kind of projects can you build for me?', 'Walk me through the fintech platform', 'What is JustHireMe?', 'How fast are your voice agents?'];
// Destinations the agent may suggest; built the same way as SECTIONS in server/agent.ts.
const ROUTES = new Set(['/', '/projects', '/about', ...work.map((w) => `/projects/${w.slug}`)]);
const MARKER = /\[\[go:([a-z/-]+)\]\]/;
const clean = (t: string) => t.replace(/\[\[go:[a-z/-]*\]\]/g, '').replace(/\[\[[^\]]*$/, '').trim();
const errors: Record<number, string> = {
  503: `The agent is offline right now. Email ${person.email} and Vasu will reply himself.`,
  429: 'Too many questions for now. Try again in a few minutes.',
  400: 'That question is too long. Try a shorter one.',
};

/** A command-bar agent: one input, streamed answers, and a jump to the page it is talking about. */
export function Agent() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setDraft('');
    const prior = turns.flatMap((t) => [{ role: 'user', content: t.q }, { role: 'assistant', content: t.a }]).filter((m) => m.content);
    setTurns((t) => [...t, { q, a: '' }]);
    setBusy(true);
    setAgentBusy(true);
    let answer = '';
    const update = (a: string) => setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, a } : x)));
    try {
      const res = await fetch('/api/agent', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: [...prior, { role: 'user', content: q }].slice(-12) }) });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += value;
        update(answer);
      }
    } catch (e) {
      const code = Number((e as Error).message);
      // The live site is static (no /api/agent yet): answer from the built-in instant answers instead.
      update(code === 404 ? fallbackAnswer(q) : errors[code] ?? 'The agent could not be reached. Check your connection and try again.');
    } finally {
      setBusy(false);
      setAgentBusy(false);
    }
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) setDraft(q);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('agent:open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('agent:open', onOpen); window.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 50); }, [open]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [turns]);

  if (!open) return null;
  return (
    <div className="cmd" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="cmd-panel" role="dialog" aria-modal="true" aria-label="Ask Vasu's agent">
        <form className="cmd-input" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
          <img src={asset('img/mascot.webp')} alt="" width={36} height={35} className={busy ? 'is-busy' : ''} />
          <label htmlFor="cmd-q" className="sr-only">Ask about Vasu's work</label>
          <input id="cmd-q" ref={input} value={draft} maxLength={1200} autoComplete="off" placeholder="Ask about my work, services or availability…" onChange={(e) => setDraft(e.target.value)} />
          <kbd>esc</kbd>
        </form>
        <div className="cmd-body" ref={log} data-lenis-prevent>
          {turns.length === 0 ? (
            <ul className="cmd-suggest">
              {suggestions.map((s) => (
                <li key={s}><button onClick={() => ask(s)}><span>↳</span>{s}</button></li>
              ))}
            </ul>
          ) : (
            turns.map((t, i) => {
              const go = t.a.match(MARKER)?.[1];
              return (
                <article key={i} className="cmd-turn">
                  <p className="cmd-q">{t.q}</p>
                  <p className="cmd-a">{clean(t.a) || <span className="dots" aria-label="Thinking"><i /><i /><i /></span>}</p>
                  {go && ROUTES.has(go) && !(busy && i === turns.length - 1) && (
                    <button className="cmd-go" onClick={() => { setOpen(false); navigate(go); }}>{go === '/' ? 'Go home' : go === '/projects' ? 'See all work' : go === '/about' ? 'About Vasu' : `Open ${bySlug(go.replace('/projects/', ''))?.title ?? 'page'}`} →</button>
                  )}
                </article>
              );
            })
          )}
        </div>
        <p className="cmd-foot">Answers come only from facts about my work. It says so when it doesn’t know.</p>
      </div>
    </div>
  );
}
