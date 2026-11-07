import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { finishIntro, introPending } from '../lib/intro';
import { lenis } from '../lib/smooth';

/** Opening (after Lallé and Voyce): a cobalt screen counts 0 → 100 in giant type, then lifts off the hero. Click skips. */
export function Loader() {
  const [on, setOn] = useState(introPending);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!on) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const n = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setOn(false) });
    tl.to(n, { v: 100, duration: 2.2, ease: 'power2.inOut', onUpdate: () => { num.current!.textContent = String(Math.round(n.v)).padStart(3, '0'); } })
      .to(root.current!.querySelectorAll('.ld-line > *'), { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.04 })
      .add(() => { document.documentElement.style.overflow = ''; lenis?.start(); finishIntro(); })
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1');
    const skip = () => tl.progress() < 0.7 && tl.seek(2.2);
    addEventListener('pointerdown', skip);
    addEventListener('keydown', skip);
    return () => {
      removeEventListener('pointerdown', skip);
      removeEventListener('keydown', skip);
      tl.kill();
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="ld" ref={root} aria-hidden="true">
      <p className="ld-line mono ld-top"><span>Vasudev Siddh / AI engineer</span></p>
      <p className="ld-line ld-num"><span ref={num}>000</span></p>
    </div>
  );
}
