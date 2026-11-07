import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Work } from '../data/work';
import { diagrams } from '../data/diagrams';
import { Pipeline } from './Pipeline';
import { projectLink } from './ProjectOverlay';

gsap.registerPlugin(ScrollTrigger);

/** Selected work: the section pins and scrolling down carries the cards sideways. Reduced motion gets a plain scroller. */
export function Rail({ items }: { items: Work[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { wrap.current!.classList.add('rail--native'); return; }
    const dist = () => Math.max(0, track.current!.scrollWidth - wrap.current!.clientWidth);
    gsap.to(track.current, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: wrap.current!.closest('section'), start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
  }, { scope: wrap });

  return (
    <div className="rail" ref={wrap}>
      <div className="rail-track" ref={track}>
        {items.map((w, i) => (
          <Link key={w.slug} to={projectLink(w.slug)} className="rail-card" style={{ ['--field' as string]: w.color }}>
            <div className="rail-top">
              <span className="mono">{String(i + 1).padStart(2, '0')} / {w.group === 'client' ? 'Client work' : w.role}</span>
            </div>
            <h3>{w.title}</h3>
            <p>{w.summary}</p>
            {w.diagram && <div className="rail-diagram"><Pipeline id={`rail-${w.slug}`} d={diagrams[w.diagram]} caption={false} /></div>}
            <dl>
              {w.facts?.slice(0, 2).map((f) => (
                <div key={f.label}><dd>{f.value}</dd><dt>{f.label}</dt></div>
              ))}
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}
