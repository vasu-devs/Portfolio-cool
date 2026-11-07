import { useEffect, useRef, type RefObject } from 'react';

/** Stands in for the hidden scrollbar: a small dot down the right edge that follows the scroll position.
 *  It inverts against whatever is behind it, so it reads on blue, paper and dark sections alike.
 *  Without `target` it follows the page; with one it follows that scroller (the project sheet). */
export function ScrollDot({ target }: { target?: RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = target?.current ?? null;
    const source: HTMLElement | Window = el ?? window;
    let raf = 0;
    let idle = 0;
    const place = () => {
      raf = 0;
      const top = el ? el.scrollTop : scrollY;
      const max = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - innerHeight;
      const room = track.current!.clientHeight - dot.current!.offsetHeight;
      dot.current!.style.transform = `translateY(${max > 0 ? (top / max) * room : 0}px)`;
      track.current!.hidden = max <= 0; // nothing to scroll: no dot
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
      track.current!.classList.add('on');
      clearTimeout(idle);
      idle = window.setTimeout(() => track.current?.classList.remove('on'), 900);
    };
    place();
    source.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      source.removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(idle);
    };
  }, [target]);

  return <div className="scroll-dot" ref={track} aria-hidden="true"><i ref={dot} /></div>;
}
