import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams, type Location } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Agent } from './components/Agent';
import { Home } from './pages/Home';
import { WorkPage } from './pages/Work';
import { ProjectOverlay } from './components/ProjectOverlay';
import { Loader } from './components/Loader';
import { AboutPage } from './pages/About';
import { NotFound } from './pages/NotFound';
import { GateLab } from './pages/GateLab';
import { lenis, useSmooth } from './lib/smooth';
import { stopSwarm, swarmPage } from './lib/swarm';

const titleFor = (path: string) =>
  path === '/' ? 'Home' : path === '/projects' ? 'Projects' : path === '/about' ? 'About' : 'Vasu-Devs';

export default function App() {
  useSmooth();
  const location = useLocation();
  const [shown, setShown] = useState<Location>(location);
  const shownPath = useRef(location.pathname);
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  // Route changes play a curtain that names the destination, swap the page underneath, then lift.
  // Depends on location only: swapping the page mid-timeline must not cancel the lift.
  useEffect(() => {
    if (location.pathname === shownPath.current) return;
    const swap = () => {
      stopSwarm(); // the old page is leaving: its run ends here
      shownPath.current = location.pathname;
      setShown(location);
      lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      // Under the curtain: on a swarm visit the new page is blanked now, and the cursors start as the curtain clears.
      requestAnimationFrame(() => { ScrollTrigger.refresh(); swarmPage(location.pathname, 750); });
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
    label.current!.textContent = titleFor(location.pathname);
    const tl = gsap.timeline();
    tl.set(curtain.current, { yPercent: 100, autoAlpha: 1 })
      .to(curtain.current, { yPercent: 0, duration: 0.55, ease: 'expo.inOut' })
      .add(swap)
      .to(curtain.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', delay: 0.12 });
    return () => { tl.progress(1); };
  }, [location]);

  useEffect(() => swarmPage(shownPath.current), []); // the router's path (no /new prefix)

  useEffect(() => {
    document.title = `${titleFor(shown.pathname)} · Vasudev Siddh, AI engineer`;
  }, [shown.pathname]);

  return (
    <>
      <Nav />
      <div className="curtain" ref={curtain} aria-hidden="true" data-swarm-skip><span ref={label} /></div>
      <main>
        <Routes location={shown}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<WorkPage />} />
          <Route path="/projects/:slug" element={<OldCase />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Old /work links keep working. */}
          <Route path="/work" element={<Navigate to="/projects" replace />} />
          <Route path="/work/:slug" element={<OldCase />} />
          <Route path="/lab/gate" element={<GateLab />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Agent />
      <ProjectOverlay />
      <Loader />
    </>
  );
}

function OldCase() {
  const { slug } = useParams();
  // Project pages are now an overlay on the projects list.
  return <Navigate to={{ pathname: '/projects', search: `?p=${slug}` }} replace />;
}
