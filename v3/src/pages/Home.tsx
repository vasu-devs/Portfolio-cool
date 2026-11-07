import { Link } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Rail } from '../components/Rail';
import { Heatmap } from '../components/Heatmap';
import { swarmWillBuild } from '../lib/swarm';
import { featuredWork } from '../data/work';
import experience from '../data/experience.json';
import { roleLink } from '../components/ProjectOverlay';
import { person } from '../content';
import { asset } from '../lib/asset';

gsap.registerPlugin(ScrollTrigger);


export function Home() {
  const root = useRef<HTMLDivElement>(null);

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
        <p className="mono h-meta"><img src={asset('img/mascot.webp')} alt="" width={640} height={618} /><span className="h-who">{person.name} · AI engineer</span> <span className="h-status"><i className="h-dot" />Open to work</span></p>
        <h1 className="h-stack" aria-label="Vasu-Devs">
          <span className="h-line">{'VASU'.split('').map((c, i) => <span key={i}>{c}</span>)}</span>
          <span className="h-line">{'DEVS'.split('').map((c, i) => <span key={i}>{c}</span>)}</span>
        </h1>
        <dl className="h-facts">
          <div><dt className="mono">Now</dt><dd>AI Engineering Intern at withlayer.ai</dd></div>
          <div><dt className="mono">Building</dt><dd>JustHireMe and Svara</dd></div>
          <div><dt className="mono">Based in</dt><dd>India, working your hours</dd></div>
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
