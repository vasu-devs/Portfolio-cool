import { Link } from 'react-router-dom';
import experience from '../data/experience.json' with { type: 'json' };
import { work } from '../data/work';
import { projectLink } from './ProjectOverlay';

export type Role = (typeof experience)[number];
// One accent per role, so each case study reads as its own page.
export const ROLE_COLOR: Record<number, string> = { 1: '#c6ff2e', 2: '#2bb8ff', 4: '#7c5cff' };
export const roles = experience;

/** A role as a case study: Vasu's own description and highlights, verbatim, plus the projects that came out of it. */
export function ExperienceBody({ r }: { r: Role }) {
  const paras = r.description.split(/\n\n+/);
  const related = r.related_projects.map((id) => work.find((w) => w.id === id)).filter((w) => !!w);
  return (
    <>
      <header className="case-hero" style={{ ['--field' as string]: ROLE_COLOR[r.id] }}>
        <p className="mono case-back">Experience · {r.display_date}</p>
        <h2 className="case-title">{r.company}</h2>
        <p className="case-line"><b>{r.title}.</b> {r.summary}</p>
      </header>
      <div className="case-body">
        <section className="case-sec"><h3>The work</h3><div className="case-prose">{paras.slice(1, -1).map((p) => <p key={p}>{p}</p>)}</div></section>
        {r.highlights.length > 0 && <section className="case-sec"><h3>Highlights</h3><ul className="case-list">{r.highlights.map((h) => <li key={h}>{h}</li>)}</ul></section>}
        {related.length > 0 && (
          <section className="case-sec"><h3>Projects</h3>
            <ul className="case-related">{related.map((w) => <li key={w.slug}><Link to={projectLink(w.slug)}>{w.title} →</Link></li>)}</ul>
          </section>
        )}
        <section className="case-sec"><h3>Stack</h3><ul className="chips">{r.skills.map((s) => <li key={s}>{s}</li>)}</ul></section>
      </div>
    </>
  );
}
