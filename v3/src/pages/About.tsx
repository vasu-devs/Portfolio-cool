import { Heatmap } from '../components/Heatmap';
import { Mascot } from '../components/Mascot';
import { Link } from 'react-router-dom';
import { openSource, person, principles } from '../content';
import { roleLink } from '../components/ProjectOverlay';
import experience from '../data/experience.json';

export function AboutPage() {
  return (
    <div className="about">
      <section className="ab-hero">
        <div>
          <h1>About</h1>
          <p className="ab-lede">I'm Vasu, an AI and full-stack engineer based in India.</p>
          <p>{person.about}</p>
        </div>
        <Mascot />
      </section>
      <section className="ab-sec"><h2>On GitHub</h2><Heatmap /></section>
      <section className="ab-sec">
        <h2>Experience</h2>
        <ol className="ab-roles">{experience.map((r) => <li key={r.id}><Link to={roleLink(r.id)}><p className="mono">{r.display_date}</p><h3>{r.company}<span>{r.title}</span></h3><p>{r.summary}</p><b className="exp-open">Case study →</b></Link></li>)}</ol>
      </section>
      <section className="ab-sec">
        <h2>How I work</h2>
        <ul className="ab-principles">{principles.map((p) => <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}</ul>
      </section>
      <section className="ab-sec">
        <h2>Open source</h2>
        <p className="ab-note">{openSource.headline}</p>
        <ul className="ab-oss">{openSource.items.map((o) => <li key={o.repo}><a href={o.url} target="_blank" rel="noreferrer"><b>{o.repo}</b><span>{o.text}</span><em className="mono">{o.count}</em></a></li>)}</ul>
      </section>
    </div>
  );
}
