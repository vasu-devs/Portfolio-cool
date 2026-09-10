import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // Initialize Lenis smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Recursive animation frame for smooth updates
        let rafId = 0;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        // Handle anchor links for smooth scrolling
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');
            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && href.length > 1) {
                    const targetElement = document.getElementById(href.slice(1));
                    if (targetElement) {
                        e.preventDefault();
                        history.replaceState(null, '', href);
                        lenis.scrollTo(targetElement as HTMLElement, {
                            offset: 0,
                            duration: 1.5,
                            onComplete: () => {
                                if (!targetElement.hasAttribute('tabindex')) targetElement.setAttribute('tabindex', '-1');
                                targetElement.focus({ preventScroll: true });
                            },
                        });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('click', handleAnchorClick);
            lenis.destroy();
        };
    }, []);

    return lenisRef;
};
