import { useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredWork, GROUPS, work, type Group } from '../data/work';
import { diagrams } from '../data/diagrams';
import { Pipeline } from '../components/Pipeline';
import { projectLink } from '../components/ProjectOverlay';

// Selected projects as big colour tiles, then every project as a scannable index. Everything opens the overlay.
export function WorkPage() {
  const [group, setGroup] = useState<Group | 'all'>('all');
  const rest = work.filter((w) => !w.featured && (group === 'all' || w.group === group));
  return (
    <section className="pj">
      <header className="pj-head">
        <h1>Projects<sup className="mono">{work.length}</sup></h1>
        <p>Most of this is AI tooling and desktop software, built end to end by me. The ones with a source link are public.</p>
      </header>

      <div className="pj-tiles">
        {featuredWork.map((w, i) => (
          <Link key={w.slug} to={projectLink(w.slug)} className={`pj-tile${i < 2 ? ' is-big' : ''}`} style={{ ['--field' as string]: w.color }}>
            <span className="mono">{String(i + 1).padStart(2, '0')} · {w.domains.slice(0, 2).join(' · ')}</span>
            <h2>{w.title}</h2>
            {i < 2 && <p>{w.summary}</p>}
            {w.diagram && <div className="pj-diagram"><Pipeline id={`pj-${w.slug}`} d={diagrams[w.diagram]} caption={false} /></div>}
            {w.facts && <p className="pj-fact"><b>{w.facts[0].value}</b> {w.facts[0].label}</p>}
          </Link>
        ))}
      </div>

      <div className="pj-bar">
        <h2>Everything</h2>
        <div className="pj-filters" role="tablist" aria-label="Filter projects">
          {[{ id: 'all' as const, label: 'All' }, ...GROUPS].map((g) => (
            <button key={g.id} role="tab" aria-selected={group === g.id} onClick={() => setGroup(g.id)}>
              {g.label}<span>{work.filter((w) => !w.featured && (g.id === 'all' || w.group === g.id)).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="pj-index">
        <div className="pj-row pj-row--head mono"><span>№</span><span>Project</span><span>Domain</span><span>Built with</span><span>Status</span></div>
        {rest.map((w, i) => (
          <Link key={w.slug} to={projectLink(w.slug)} className="pj-row" style={{ ['--field' as string]: w.color }}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="pj-title">{w.title}</span>
            <span className="mono pj-dim">{w.domains.slice(0, 2).join(' · ')}</span>
            <span className="mono pj-dim">{w.skills.slice(0, 3).join(', ')}</span>
            <span className="mono">{w.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
