import { Link } from 'react-router-dom';
import { useRef, type KeyboardEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Rail } from '../components/Rail';
import { Heatmap } from '../components/Heatmap';
import { swarmWillBuild } from '../lib/swarm';
import { featuredWork } from '../data/work';
import experience from '../data/experience.json';
import { resumeLink, roleLink } from '../components/ProjectOverlay';
import { person } from '../content';
import { asset } from '../lib/asset';
import { useTraffic } from '../lib/traffic';

const n = (x: number) => x.toLocaleString('en-US');
// Every way to reach me, one list for the hero row and the "Let's talk" card. Each takes a project colour in turn
// (the footer letters' order), shown as the tile behind its icon on hover.
const CONTACTS = [
  { label: 'Email', icon: 'Email', url: `mailto:${person.email}`, handle: person.email },
  { label: 'Book a call', icon: 'Call', url: person.call, handle: 'cal.com/vasu-devs' },
  ...person.socials.map((x) => ({ label: x.label, icon: x.label, url: x.url, handle: x.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '') })),
  { label: 'Résumé', icon: 'Résumé', url: resumeLink, handle: 'one page' },
].map((c, i) => ({ ...c, color: featuredWork[i % featuredWork.length].color, ext: c.url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {} }));
/** Escape closes a hero pop-over (they open on hover or focus). */
const blurOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') (document.activeElement as HTMLElement | null)?.blur(); };

gsap.registerPlugin(ScrollTrigger);


export function Home() {
  const root = useRef<HTMLDivElement>(null);
  const traffic = useTraffic(); // the site-wide counter, shared with the paper portfolio

  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const q = gsap.utils.selector(root);
    const rise = gsap.from(q('.h-stack .h-line > span'), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05, delay: 0.25 });
    if (swarmWillBuild('/')) rise.progress(1); // the swarm rebuilds the finished hero
    // The hero holds still and settles back into a card while the next section slides up over it.
    gsap.to(q('.h-hero'), {
      scale: 0.9, borderRadius: 32, ease: 'none',
      scrollTrigger: { trigger: q('.h-hero')[0], start: 'top top', end: 'bottom top', pin: true, pinSpacing: false, scrub: true, refreshPriority: 1 },
    });
    // Experience rows rise in once as the list arrives; nothing is pinned or scrubbed here.
    gsap.from(q('.exp-list li'), { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: q('.exp-list')[0], start: 'top 75%' } });
  }, { scope: root });

  return (
    <div className="home" ref={root}>
      <section className="h-hero">
        <p className="mono h-meta"><img src={asset('img/mascot.webp')} alt="" width={640} height={618} /><span className="h-who">{person.name} · AI engineer</span> <span className="h-status h-pop" onKeyDown={blurOnEscape}>
          {/* Hover, focus or tap: every way to reach me (the black-and-white site's "Let's talk" panel). */}
          <button type="button" className="h-pop-btn" aria-controls="h-contact"><i className="h-dot" />Open to freelance</button>
          <span className="h-card h-contact" id="h-contact" role="group" aria-label="Contact" data-swarm-skip>
            <b>Let’s talk</b>
            <span className="h-contact-lead">Freelance builds, AI engineering and full-stack roles.</span>
            {CONTACTS.map((c) => <Link key={c.url} to={c.url} {...c.ext} style={{ ['--c' as string]: c.color }}><i><Icon k={c.icon} /></i><span>{c.label}</span><em>{c.handle}</em></Link>)}
          </span>
        </span></p>
        <h1 className="h-stack" aria-label="Vasu-Devs">
          <span className="h-line">{'VASU'.split('').map((c, i) => <span key={i}>{c}</span>)}</span>
          <span className="h-line">{'DEVS'.split('').map((c, i) => <span key={i}>{c}</span>)}</span>
        </h1>
        <dl className="h-facts">
          <div><dt className="mono">Now</dt><dd>AI Engineering Intern at withlayer.ai</dd></div>
          <div><dt className="mono">Contact</dt><dd className="h-icons">
            {CONTACTS.map((c) => <Link key={c.url} to={c.url} {...c.ext} aria-label={c.label} data-tip={c.label} style={{ ['--c' as string]: c.color }}><Icon k={c.icon} size={22} /></Link>)}
          </dd></div>
          <div><dt className="mono">Based in</dt><dd>India, working your hours</dd></div>
          {traffic && (
            <div className="h-visitors"><dt className="mono">Visitors</dt><dd className="h-pop" onKeyDown={blurOnEscape}>
              {/* Hover, focus or tap for the full numbers. */}
              <button type="button" className="h-pop-btn" aria-describedby="h-vis-card">
                {traffic.activeNow > 0 && <i className="h-dot" />}
                {traffic.visitorNumber ? `You're #${n(traffic.visitorNumber)}` : `${n(traffic.totalViews)} views`}
                {traffic.activeNow > 0 && ` · ${n(traffic.activeNow)} here now`}
              </button>
              <div className="h-card h-vis-card" id="h-vis-card" role="tooltip" data-swarm-skip>
                <p className="mono h-vis-live"><i className="h-dot" />{n(traffic.activeNow)} here now</p>
                <dl>
                  {traffic.visitorNumber && <div><dt>You</dt><dd>#{n(traffic.visitorNumber)}</dd></div>}
                  <div><dt>Visitors</dt><dd>{n(traffic.uniqueVisitors)}</dd></div>
                  <div><dt>Views</dt><dd>{n(traffic.totalViews)}</dd></div>
                </dl>
              </div>
            </dd></div>
          )}
        </dl>
        <div className="h-side">
          <p className="h-line-copy">I build AI agents and voice AI that <em>actually ship.</em></p>
          <div className="h-cta">
            <a className="btn btn--solid" href={person.call} target="_blank" rel="noreferrer">Book a call</a>
            <Link className="btn" to="/projects">See the work</Link>
          </div>
        </div>
      </section>

      <section className="h-exp">
        <header className="sec-head">
          <h2>Experience</h2>
          <Link className="link" to="/about">About →</Link>
        </header>
        <ol className="exp-list">
          {experience.map((e) => (
            <li key={e.id}>
              <Link to={roleLink(e.id)} className="exp-row">
                <span className="mono exp-date">{e.display_date}</span>
                <div><h3>{e.company}</h3><p className="exp-role">{e.title}</p></div>
                <p className="exp-sum">{e.summary}</p>
                <span className="exp-open">Case study →</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="h-work">
        <header className="sec-head">
          <h2>Selected work</h2>
          <Link className="link" to="/projects">All projects →</Link>
        </header>
        <Rail items={featuredWork} />
      </section>

      <section className="h-about">
        <div>
          <h2>Shipping, every day.</h2>
          <Link className="link" to="/about">About →</Link>
        </div>
        <Heatmap />
      </section>
    </div>
  );
}

// Contact icons: 2px line icons like the site's borders; X is the one solid mark (it has no line version).
const FILLED: Record<string, string> = {
  X: 'M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2.1l8.2-9.4L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.5 4H4.7L17.8 20Z',
};
const LINES: Record<string, string> = {
  GitHub: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2',
  Email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  Call: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm11-2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01',
  LinkedIn: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4',
  YouTube: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17m7.5-2 5-3-5-3z',
  Instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9 9.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37ZM17.5 6.5h.01',
  'Résumé': 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Zm-.5 0v6h6M16 13H8M16 17H8M10 9H8',
};
function Icon({ k, size = 16 }: { k: string; size?: number }) {
  return FILLED[k]
    ? <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d={FILLED[k]} fill="currentColor" /></svg>
    : <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={LINES[k]} /></svg>;
}
