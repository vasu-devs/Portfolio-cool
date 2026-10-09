import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

interface FooterProps {
    onResumeClick?: () => void;
}

const EMAIL = 'siddhvasudev1402@gmail.com';

// Easter egg: clicking the version string cycles the accent color.
const ACCENT_CYCLE = [
    { hex: '#2563eb', rgb: '37 99 235' },
    { hex: '#0f9d58', rgb: '15 157 88' },
    { hex: '#d9480f', rgb: '217 72 15' },
    { hex: '#9333ea', rgb: '147 51 234' },
    { hex: '#dc2626', rgb: '220 38 38' },
];

export const Footer = ({ onResumeClick }: FooterProps) => {
    const [copied, setCopied] = useState(false);
    const [accentIdx, setAccentIdx] = useState(0);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    const cycleAccent = () => {
        const next = (accentIdx + 1) % ACCENT_CYCLE.length;
        setAccentIdx(next);
        document.documentElement.style.setProperty('--accent', ACCENT_CYCLE[next].hex);
        document.documentElement.style.setProperty('--accent-rgb', ACCENT_CYCLE[next].rgb);
    };

    return (
        <footer id="contact" className="pt-16 md:pt-24 pb-10">
            <Container>
                <SectionHeading
                    index="07"
                    label="contact"
                    title="Let's build something"
                    sub="Tell me what you're trying to ship — I'll tell you how I'd build it. Usually reply within a day."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
                    {/* Email card with copy */}
                    <button
                        type="button"
                        onClick={copyEmail}
                        className="group flex items-center justify-between gap-3 border border-border-primary rounded-xl bg-bg-primary px-5 py-4 text-left cursor-pointer transition-all duration-300 hover:border-accent/50"
                    >
                        <div className="min-w-0">
                            <p className="font-mono text-[10px] text-fg-secondary mb-1">email — click to copy</p>
                            <p className="font-mono text-[13px] truncate">{EMAIL}</p>
                        </div>
                        {copied
                            ? <Check size={15} className="shrink-0 text-emerald-500" />
                            : <Copy size={15} className="shrink-0 text-fg-secondary group-hover:text-accent transition-colors" />}
                    </button>

                    <a
                        href="https://cal.com/vasu-devs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 border border-border-primary rounded-xl bg-bg-primary px-5 py-4 transition-all duration-300 hover:border-accent/50"
                    >
                        <div>
                            <p className="font-mono text-[10px] text-fg-secondary mb-1">30 min · free</p>
                            <p className="font-mono text-[13px]">cal.com/vasu-devs</p>
                        </div>
                        <ArrowUpRight size={15} className="shrink-0 text-fg-secondary group-hover:text-accent transition-colors" />
                    </a>

                    <button
                        type="button"
                        onClick={onResumeClick}
                        className="group flex items-center justify-between gap-3 border border-border-primary rounded-xl bg-bg-primary px-5 py-4 text-left cursor-pointer transition-all duration-300 hover:border-accent/50"
                    >
                        <div>
                            <p className="font-mono text-[10px] text-fg-secondary mb-1">pdf · 1 page</p>
                            <p className="font-mono text-[13px]">view resume</p>
                        </div>
                        <ArrowUpRight size={15} className="shrink-0 text-fg-secondary group-hover:text-accent transition-colors" />
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center font-mono text-[11px] text-fg-secondary border-t border-border-primary pt-6">
                    <span>
                        © 2026 vasu-devs ·{' '}
                        <button
                            type="button"
                            onClick={cycleAccent}
                            title="what does this do?"
                            className="text-accent cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            v3.0.0
                        </button>
                        {' '}· react + vite + tailwind
                    </span>
                    <div className="flex gap-5">
                        <a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer" className="link-draw hover:text-fg-primary transition-colors">github</a>
                        <a href="https://twitter.com/Vasu_DevS" target="_blank" rel="noopener noreferrer" className="link-draw hover:text-fg-primary transition-colors">twitter</a>
                        <a href="https://www.linkedin.com/in/vasu-devs/" target="_blank" rel="noopener noreferrer" className="link-draw hover:text-fg-primary transition-colors">linkedin</a>
                        <a href="https://buymeacoffee.com/vasu.devs" target="_blank" rel="noopener noreferrer" className="link-draw hover:text-fg-primary transition-colors">coffee</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};
