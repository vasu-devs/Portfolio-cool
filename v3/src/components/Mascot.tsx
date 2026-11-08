import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { asset } from '../lib/asset';
import { ARROW, COLORS, NAMES, fgFor } from '../lib/cursor';
import { MOODS } from '../lib/moods';
import { play } from '../lib/sound';
const src = (m: string) => asset(m === 'mascot' ? 'img/mascot.webp' : `img/mood/${m}.webp`);

/** Vasu's mascot. Click it and a cursor agent flies in, selects the picture and swaps in another mood. */
export function Mascot() {
  const [mood, setMood] = useState('mascot');
  const wrap = useRef<HTMLButtonElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const run = useRef<gsap.core.Timeline | null>(null);
  const shown = useRef('mascot'); // the mood on screen now (state lags a render behind)

  // Load every mood up front so the swap is instant.
  useEffect(() => { for (const m of MOODS) new Image().src = src(m); }, []);
  useEffect(() => () => { run.current?.progress(1); }, []); // leaving the page mid-swap: finish and clean up

  const swap = () => {
    run.current?.progress(1); // a click mid-swap finishes that one at once, so every click answers
    const others = MOODS.filter((m) => m !== shown.current);
    const next = others[Math.floor(Math.random() * others.length)];
    const show = () => { shown.current = next; setMood(next); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return show();

    // One named agent, drawn like the swarm's: arrow + tag, and a selection box with live dimensions.
    const k = Math.floor(Math.random() * NAMES.length); // a different agent each time
    const color = COLORS[k % COLORS.length];
    const fg = fgFor(color);
    const root = document.createElement('div');
    root.className = 'sw';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `<div class="sw-sel" style="--c:${color};--fg:${fg}"><i></i><i></i><i></i><i></i><span></span></div>`
      + `<div class="sw-cur" style="--c:${color};--fg:${fg};color:${color}">${ARROW}<span class="sw-tag">${NAMES[k % NAMES.length]}</span></div>`;
    document.body.append(root);
    const sel = root.firstElementChild as HTMLElement;
    const cur = root.lastElementChild as HTMLElement;
    const dims = sel.querySelector('span')!;
    const box = () => img.current!.getBoundingClientRect();
    const fromLeft = Math.random() < 0.5;
    const edge = () => ({ x: fromLeft ? -40 : innerWidth + 40, y: box().top + box().height * (0.2 + Math.random() * 0.6) });
    const p = { ...edge(), w: 0, h: 0 };
    const draw = () => {
      const b = box();
      cur.style.transform = `translate(${p.x}px, ${p.y}px)`;
      sel.style.transform = `translate(${b.left}px, ${b.top}px)`;
      sel.style.width = `${p.w}px`;
      sel.style.height = `${p.h}px`;
      dims.textContent = `${Math.round(p.w)} × ${Math.round(p.h)}`;
    };
    draw();
    // Fast and exact: lands on the picture's top-left corner, drags to its bottom-right, swaps (~0.5 s), leaves.
    play('arrive', { pan: fromLeft ? -0.6 : 0.6, dur: 0.3 });
    run.current = gsap.timeline({ onUpdate: draw, onComplete: () => root.remove() })
      .to(p, { x: () => box().left, y: () => box().top, duration: 0.3, ease: 'power3.out' })
      .add(() => { cur.classList.add('tap'); sel.classList.add('on'); play('tap'); play('draw', { dur: 0.2 }); })
      .to(p, { x: () => box().right, y: () => box().bottom, w: () => box().width, h: () => box().height, duration: 0.2, ease: 'power2.inOut' })
      .add(() => { show(); play('drop'); })
      .fromTo(wrap.current, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(2.2)', clearProps: 'scale' })
      .add(() => { cur.classList.remove('tap'); sel.classList.remove('on'); }, '-=0.25')
      .add(() => play('leave', { pan: fromLeft ? 0.6 : -0.6, dur: 0.35 }), '-=0.2')
      .to(p, { x: () => (fromLeft ? innerWidth + 40 : -40), y: () => p.y - 100, duration: 0.35, ease: 'power2.in' }, '<');
  };

  return (
    <button type="button" className="mascot" ref={wrap} onClick={swap} aria-label="Change Vasu's mood">
      <img ref={img} src={src(mood)} alt={mood === 'mascot' ? "Vasu's mascot" : `Vasu's mascot, ${mood}`} width={640} height={618} draggable={false} />
      <span className="mono mascot-hint">Click me for a new mood</span>
    </button>
  );
}
