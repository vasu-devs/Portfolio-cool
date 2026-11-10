import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { bySlug, featuredWork, work, GROUPS } from '../data/work';
import { lenis } from '../lib/smooth';
import { ProjectBody } from './ProjectBody';
import { ExperienceBody, ROLE_COLOR, roles } from './ExperienceBody';
import { ResumeBody } from './ResumeBody';
import { ScrollDot } from './ScrollDot';
import { play } from '../lib/sound';
import { projectMd, roleMd } from '../lib/markdown';
import { CopyButton, siteRoot } from './CopyButton';
import { asset } from '../lib/asset';

/** Link targets that open a project (?p=slug) or a role (?x=id) over the current page, so it never reloads. */
export const projectLink = (slug: string) => ({ search: `?p=${slug}` });
export const roleLink = (id: number) => ({ search: `?x=${id}` });
/** ?resume opens the résumé in the same sheet. */
export const resumeLink = '?resume';

type Item = { key: string; title: string; color: string };

/** The open project as a sheet over the page. Arrows (or ←/→) move to the neighbouring project, Esc closes. */
export function ProjectOverlay() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const w = bySlug(params.get('p') ?? '');
  const role = !w ? roles.find((r) => String(r.id) === params.get('x')) : undefined;
  const resume = !w && !role && params.has('resume');
  const param = w ? 'p' : 'x';
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const nextEl = useRef<HTMLButtonElement>(null);
  const lastSlug = useRef<string | null>(null);
  const switchedAt = useRef(0);
  const fromColor = useRef(''); // the colour on screen when a switch starts: the new hero blends from it
  const fromPanel = useRef(false); // switched by scrolling into the full-height next panel

  // Neighbours come from the list the item belongs to: the selected five, its group, or the roles.
  const pool: Item[] = w
    ? (w.featured ? featuredWork : work.filter((x) => x.group === w.group && (x.shown || x === w))).map((x) => ({ key: x.slug, title: x.title, color: x.color }))
    : role ? roles.map((r) => ({ key: String(r.id), title: r.company, color: ROLE_COLOR[r.id] })) : [];
  const current = w?.slug ?? (role ? String(role.id) : resume ? 'resume' : null);
  const i = pool.findIndex((x) => x.key === current);
  const go = (step: number, scrolled = false) => {
    if (i < 0) return; // nothing open, or the résumé (it has no neighbours)
    const to = pool[(i + step + pool.length) % pool.length];
    // Scrolled into the next panel: it is already the new colour on screen. Arrows: blend from the old one.
    fromColor.current = scrolled ? to.color : pool[i].color;
    fromPanel.current = scrolled;
    navigate({ pathname, search: `?${param}=${to.key}` }, { replace: true });
  };
  const close = () => {
    play('close');
    const done = () => navigate({ pathname, search: '' });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
    gsap.to(root.current!.querySelector('.ov-backdrop'), { autoAlpha: 0, duration: 0.35 });
    gsap.to(sheet.current, { yPercent: 100, duration: 0.45, ease: 'power3.in', onComplete: done });
  };

  // Open: lock the page, slide the sheet up. Switching projects: slide the content sideways instead.
  useEffect(() => {
    if (!current) { lastSlug.current = null; return; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lastSlug.current === null) {
      play('open');
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      const opener = document.activeElement as HTMLElement | null;
      closeBtn.current?.focus();
      if (!reduced) {
        gsap.fromTo(root.current!.querySelector('.ov-backdrop'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        gsap.fromTo(sheet.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
      }
      lastSlug.current = current;
      return () => {
        lenis?.start();
        document.documentElement.style.overflow = '';
        opener?.focus?.();
      };
    }
    if (lastSlug.current !== current) {
      lastSlug.current = current;
      switchedAt.current = performance.now();
      const sc = scroller.current!;
      sc.scrollTop = 0;
      const hero = sc.querySelector<HTMLElement>('.case-hero');
      if (!reduced && hero) {
        // The colour field stays put (or blends from the last one); only the words rise in, so nothing blinks.
        gsap.fromTo(hero, { backgroundColor: fromColor.current }, { backgroundColor: getComputedStyle(hero).backgroundColor, duration: 0.5, ease: 'power2.out', clearProps: 'backgroundColor' });
        // From the panel: the full-height field settles into the hero's height, uncovering the page below.
        if (fromPanel.current) gsap.from(hero, { height: sc.clientHeight, duration: 0.85, ease: 'expo.inOut', clearProps: 'height' });
        gsap.fromTo(hero.children, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity,visibility' });
        gsap.fromTo([...sc.children].filter((el) => el !== hero), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 0.2, clearProps: 'opacity,visibility' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // After Landberg: the next panel fills the sheet. Once it is mostly in view it glides the rest of the way,
  // and when it covers the sheet it becomes the next page (same colour, so the hand-off is seamless).
  useEffect(() => {
    if (!current || !nextEl.current) return;
    const sc = scroller.current!;
    let gliding = false;
    const io = new IntersectionObserver(([e]) => {
      // A short cooldown after each switch stops one long flick from skipping several projects.
      if (performance.now() - switchedAt.current < 900) return;
      if (e.intersectionRatio >= 0.98) go(1, true);
      else if (e.intersectionRatio >= 0.55 && !gliding && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gliding = true;
        sc.scrollTo({ top: sc.scrollTop + nextEl.current!.getBoundingClientRect().top - sc.getBoundingClientRect().top, behavior: 'smooth' });
      } else if (e.intersectionRatio < 0.4) gliding = false;
    }, { root: sc, threshold: [0.3, 0.55, 0.98, 1] });
    io.observe(nextEl.current);
    return () => io.disconnect();
  });

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  if (!current) return null;
  const label = w ? (w.featured ? 'Selected work' : GROUPS.find((g) => g.id === w.group)!.label) : role ? 'Experience' : 'Résumé';
  const next = pool[(i + 1) % pool.length];
  return (
    <div className="ov" ref={root} role="dialog" aria-modal="true" aria-label={pool[i]?.title ?? 'Résumé'}>
      <div className="ov-backdrop" onClick={close} />
      <div className="ov-sheet" ref={sheet}>
        <div className="ov-bar">
          <span className="mono">{label}{i >= 0 && ` · ${i + 1} / ${pool.length}`}</span>
          <div className="ov-actions">
            {resume ? <a className="ov-copy" href={asset('resume.pdf')} download="Vasudev-Siddh-Resume.pdf">Download PDF</a> : <>
              <CopyButton className="ov-copy" label="Copy" text={() => (w ? projectMd(w, siteRoot()) : roleMd(role!))} />
              <button type="button" onClick={() => go(-1)} aria-label="Previous project">←</button>
              <button type="button" onClick={() => go(1)} aria-label="Next project">→</button>
            </>}
            <button type="button" ref={closeBtn} onClick={close} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="ov-scroll" ref={scroller} data-lenis-prevent>
          {resume ? <ResumeBody /> : <>
            {w ? <ProjectBody w={w} /> : <ExperienceBody r={role!} />}
            <button type="button" className="ov-next" ref={nextEl} onClick={() => go(1)} style={{ ['--field' as string]: next.color }}>
              <span className="mono">Next · keep scrolling</span>
              <strong>{next.title}</strong>
            </button>
          </>}
        </div>
        <ScrollDot target={scroller} />
      </div>
    </div>
  );
}
