import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { person } from '../content';
import { lenis } from '../lib/smooth';
import { featuredWork } from '../data/work';
import { startSwarm, swarmVisit } from '../lib/swarm';
import { siteMd } from '../lib/markdown';
import { CopyButton, siteRoot } from './CopyButton';

const WORD = 'Vasu-Devs';

/** Every page ends with the same ask. The wordmark letters rise in (Wodniack), stretch with scroll speed (Voyce),
 * and fill with a project's colour under the pointer (Karim Saab). */
export function Footer() {
  const mark = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sy = gsap.quickTo(mark.current, 'scaleY', { duration: 0.6, ease: 'power3' });
    let raf = 0;
    const loop = () => { sy(1 + gsap.utils.clamp(0, 0.35, Math.abs(lenis?.velocity ?? 0) / 90)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    // Letters wait below their line and rise the first time the wordmark comes into view.
    // On a swarm visit they are built in place instead: nothing animates before it exists.
    const letters = [...mark.current!.children];
    if (swarmVisit) return () => cancelAnimationFrame(raf);
    gsap.set(letters, { yPercent: 100 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      gsap.to(letters, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05 });
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(mark.current!);
    return () => { cancelAnimationFrame(raf); io.disconnect(); gsap.set(letters, { yPercent: 0 }); };
  }, []);
  return (
    <footer className="foot" id="contact">
      <div className="foot-top">
        <div>
          <h2>Have something to build?</h2>
          <div className="foot-actions">
            <a className="btn btn--solid" href={person.call} target="_blank" rel="noreferrer">Book a call</a>
            <a className="btn" href={`mailto:${person.email}`}>Email me</a>
          </div>
        </div>
        <dl className="foot-sheet">
          <div><dt className="mono">Status</dt><dd><i className="h-dot" />Open to work: AI engineering roles and freelance builds</dd></div>
          <div><dt className="mono">Based in</dt><dd>India · <IstClock /> IST, works your hours</dd></div>
          <div><dt className="mono">Email</dt><dd><a href={`mailto:${person.email}`}>{person.email}</a></dd></div>
          <div><dt className="mono">Elsewhere</dt><dd className="foot-links">
            {person.socials.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}
            <a href={person.resume}>Résumé ↗</a>
          </dd></div>
        </dl>
      </div>
      <p className="foot-copy mono">© 2026 Vasu-Devs · <CopyButton className="foot-md" label="Copy this site as Markdown" text={() => siteMd(siteRoot())} /><span className="foot-rebuild"> · <button type="button" className="foot-swarm" onClick={rebuild}>Watch this page build ↺</button></span></p>
      <p className="foot-mark" ref={mark} aria-hidden="true">
        {[...WORD].map((ch, i) => <span key={i} style={{ ['--c' as string]: featuredWork[i % featuredWork.length].color }}>{ch}</span>)}
      </p>
    </footer>
  );
}

/** Back to the top, then the swarm rebuilds the page from there. */
function rebuild() {
  lenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
  setTimeout(startSwarm, 50); // after this click, which would otherwise count as "skip"
}

/** Vasu's local time, so a visitor can see when he is awake. */
function IstClock() {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 30_000); return () => clearInterval(id); }, []);
  return <time>{t}</time>;
}
