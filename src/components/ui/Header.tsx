import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
    { href: '#experience', label: 'experience' },
    { href: '#projects', label: 'work' },
    { href: '#skills', label: 'stack' },
    { href: '#open-source', label: 'open source' },
    { href: '#contact', label: 'contact' },
];

const WORDMARK_SECRET_THRESHOLD = 5;

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const wordmarkClicks = useRef(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Easter egg: clicking the wordmark repeatedly fires a toast via EasterEggs.
    const handleWordmarkClick = () => {
        wordmarkClicks.current += 1;
        if (wordmarkClicks.current >= WORDMARK_SECRET_THRESHOLD) {
            wordmarkClicks.current = 0;
            window.dispatchEvent(new CustomEvent('egg:wordmark'));
        }
        window.scrollTo({ top: 0 });
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-bg-primary/90 backdrop-blur-md border-b border-border-primary'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <div className="max-w-[1100px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={handleWordmarkClick}
                    aria-label="Back to top"
                    className="font-mono text-sm font-semibold tracking-tight cursor-pointer"
                >
                    <span className="text-accent">~/</span>vasu-devs
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="font-mono text-xs text-fg-secondary hover:text-fg-primary transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <a
                    href="https://cal.com/vasu-devs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md bg-accent text-white font-mono text-xs font-medium hover:opacity-90 transition-opacity"
                >
                    book a call
                    <ArrowUpRight size={12} />
                </a>
            </div>
        </header>
    );
};
