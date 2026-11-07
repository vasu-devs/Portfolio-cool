import { GROUPS, linkLabel, type Work } from '../data/work';
import { diagrams } from '../data/diagrams';
import { Pipeline } from './Pipeline';

/** A project's full write-up: Vasu's own title and description verbatim, what he did, and the stack. */
export function ProjectBody({ w }: { w: Work }) {
  const group = GROUPS.find((g) => g.id === w.group)!;
  return (
    <>
      <header className="case-hero" style={{ ['--field' as string]: w.color }}>
        <p className="mono case-back">{group.label}</p>
        <h2 className={`case-title${w.title.length > 34 ? ' is-long' : ''}`}>{w.title}</h2>
        <p className="case-line">{w.summary}</p>
        <p className="mono case-status">{w.role} · {w.status}</p>
        {w.link && <div className="case-links"><a className="btn btn--ink" href={w.link} target="_blank" rel="noreferrer">{linkLabel(w.link)} ↗</a></div>}
        {w.facts && (
          <dl className="case-facts">
            {w.facts.map((f) => <div key={f.label}><dd>{f.value}</dd><dt>{f.label}</dt></div>)}
          </dl>
        )}
      </header>
      <div className="case-body" style={{ ['--field' as string]: w.color }}>
        {w.diagram && <section className="case-sec case-sec--diagram"><h3>How it works</h3><div className="case-diagram"><Pipeline id={`ov-${w.slug}`} d={diagrams[w.diagram]} /></div></section>}
        {w.paragraphs.length > 0 && <section className="case-sec"><h3>The detail</h3><div className="case-prose">{w.paragraphs.map((p) => <p key={p}>{p}</p>)}</div></section>}
        {w.did.length > 0 && <section className="case-sec"><h3>What I did</h3><ul className="case-list">{w.did.map((d) => <li key={d}>{d}</li>)}</ul></section>}
        <section className="case-sec"><h3>Stack</h3><ul className="chips">{w.skills.map((s) => <li key={s}>{s}</li>)}</ul></section>
      </div>
    </>
  );
}
