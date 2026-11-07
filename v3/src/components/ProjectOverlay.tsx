import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { bySlug, featuredWork, work, GROUPS } from '../data/work';
import { lenis } from '../lib/smooth';
import { ProjectBody } from './ProjectBody';
import { ExperienceBody, ROLE_COLOR, roles } from './ExperienceBody';

/** Link targets that open a project (?p=slug) or a role (?x=id) over the current page, so it never reloads. */
export const projectLink = (slug: string) => ({ search: `?p=${slug}` });
export const roleLink = (id: number) => ({ search: `?x=${id}` });

type Item = { key: string; title: string; color: string };

/** The open project as a sheet over the page. Arrows (or ←/→) move to the neighbouring project, Esc closes. */
export function ProjectOverlay() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const w = bySlug(params.get('p') ?? '');
  const role = !w ? roles.find((r) => String(r.id) === params.get('x')) : undefined;
  const param = w ? 'p' : 'x';
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const nextEl = useRef<HTMLButtonElement>(null);
  const lastSlug = useRef<string | null>(null);
  const dir = useRef(0);
  const switchedAt = useRef(0);

  // Neighbours come from the list the item belongs to: the selected five, its group, or the roles.
  const pool: Item[] = w
    ? (w.featured ? featuredWork : work.filter((x) => x.group === w.group)).map((x) => ({ key: x.slug, title: x.title, color: x.color }))
    : role ? roles.map((r) => ({ key: String(r.id), title: r.company, color: ROLE_COLOR[r.id] })) : [];
  const current = w?.slug ?? (role ? String(role.id) : null);
  const i = pool.findIndex((x) => x.key === current);
  const go = (step: number) => {
    if (!current) return;
    dir.current = step;
    navigate({ pathname, search: `?${param}=${pool[(i + step + pool.length) % pool.length].key}` }, { replace: true });
  };
  const close = () => {
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
      scroller.current!.scrollTop = 0;
      if (!reduced) gsap.fromTo(scroller.current, { y: dir.current > 0 ? 60 : -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // After Landberg: when the next project's panel has fully scrolled into view, it takes over.
  useEffect(() => {
    if (!current || !nextEl.current) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      // A short cooldown after each switch stops one long flick from skipping several projects.
      if (e.intersectionRatio > 0.97 && performance.now() - switchedAt.current > 1200) timer = window.setTimeout(() => go(1), 450);
    }, { root: scroller.current, threshold: [0.5, 0.97, 1] });
    io.observe(nextEl.current);
    return () => { io.disconnect(); clearTimeout(timer); };
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
  const label = w ? (w.featured ? 'Selected work' : GROUPS.find((g) => g.id === w.group)!.label) : 'Experience';
  const next = pool[(i + 1) % pool.length];
  return (
    <div className="ov" ref={root} role="dialog" aria-modal="true" aria-label={pool[i].title}>
      <div className="ov-backdrop" onClick={close} />
      <div className="ov-sheet" ref={sheet}>
        <div className="ov-bar">
          <span className="mono">{label} · {i + 1} / {pool.length}</span>
          <div className="ov-actions">
            <button type="button" onClick={() => go(-1)} aria-label="Previous project">←</button>
            <button type="button" onClick={() => go(1)} aria-label="Next project">→</button>
            <button type="button" ref={closeBtn} onClick={close} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="ov-scroll" ref={scroller} data-lenis-prevent>
          {w ? <ProjectBody w={w} /> : <ExperienceBody r={role!} />}
          <button type="button" className="ov-next" ref={nextEl} onClick={() => go(1)} style={{ ['--field' as string]: next.color }}>
            <span className="mono">Next · keep scrolling</span>
            <strong>{next.title}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
