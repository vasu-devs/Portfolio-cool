import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

// Lenis drives scroll; GSAP's ticker drives Lenis so ScrollTrigger and smooth scroll share one frame.
export function useSmooth() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    // In-page links glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      scrollToId(a.getAttribute('href')!.slice(1));
    };
    document.addEventListener('click', onClick);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
