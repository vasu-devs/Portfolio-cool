import resume from '../../../src/data/resume.json' with { type: 'json' };

/** The résumé as a case study. Same data (src/data/resume.json) as the plain one-page PDF behind "Download PDF",
 *  which scripts/generate-resume.py builds for applicant-tracking systems. */
export function ResumeBody() {
  const r = resume;
  return (
    <>
      {/* The colour of the Résumé tile in the hero's contact card. */}
      <header className="case-hero" style={{ ['--field' as string]: '#2bb8ff' }}>
        <p className="mono case-back">Résumé · updated {r.updated}</p>
        <h2 className="case-title">{r.name}</h2>
        <p className="case-line"><b>{r.headline}.</b> {r.summary}</p>
        <p className="mono case-status">{r.location} · <a href={`mailto:${r.email}`}>{r.email}</a></p>
      </header>
      <div className="case-body">
        <section className="case-sec"><h3>Experience</h3>
          <div className="rs-items">{r.experience.map((e) => (
            <article className="rs-item" key={e.company}>
              <h4>{e.role} <span>· {e.company}</span></h4>
              <p className="mono">{e.dates}</p>
              <ul className="case-list">{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              <ul className="chips">{e.tech.split(', ').map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}</div>
        </section>
        <section className="case-sec"><h3>Projects</h3>
          <div className="rs-items">{r.projects.map((p) => (
            <article className="rs-item" key={p.name}>
              <h4>{p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.name} ↗</a> : p.name} <span>· {p.label}</span></h4>
              <ul className="case-list">{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              <ul className="chips">{p.tech.split(', ').map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}</div>
        </section>
        <section className="case-sec"><h3>Skills</h3>
          <div className="rs-items">{r.skills.map((s) => <div className="rs-item" key={s.label}><h4>{s.label}</h4><p className="case-text">{s.text}</p></div>)}</div>
        </section>
        <section className="case-sec"><h3>Education</h3>
          <div className="rs-item">
            <h4>{r.education.degree}</h4>
            <p className="mono">{r.education.institution} · {r.education.dates} · {r.education.detail}</p>
            <p className="case-text">{r.recognition}</p>
          </div>
        </section>
      </div>
    </>
  );
}
