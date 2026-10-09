import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, Github } from 'lucide-react';
import { Container } from '../ui/Container';

interface HeroProps {
    onResumeClick?: () => void;
    stats: { stars: number; commits: number; prs: number };
    isStatsLoading?: boolean;
}

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

const TERMINAL_LINES: { prompt?: string; out?: string; accent?: boolean }[] = [
    { prompt: 'whoami' },
    { out: 'vasu-devs — AI engineer · India (UTC+5:30)' },
    { prompt: 'cat focus.txt' },
    { out: 'voice agents · multi-agent systems · agentic RAG' },
    { prompt: 'current --project' },
    { out: 'justhireme.ai — local-first job intelligence' },
    { prompt: 'status' },
    { out: '[ok] open to work — remote, worldwide', accent: true },
];

export const Hero = ({ onResumeClick, stats, isStatsLoading }: HeroProps) => {
    const metric = (v: number) => (isStatsLoading || v === 0 ? '—' : v.toLocaleString());

    return (
        <section id="hero" className="relative pt-32 md:pt-40 pb-16 md:pb-20 dot-grid">
            {/* fade the dot grid out toward the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

            <Container className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left: pitch */}
                    <div className="lg:col-span-7">
                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-3 py-1 mb-6"
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span className="font-mono text-[11px] text-fg-secondary">
                                open to work — remote, worldwide
                            </span>
                        </motion.div>

                        <motion.h1
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.08 }}
                            className="font-display font-bold text-4xl md:text-5xl lg:text-[3.4rem] tracking-tight leading-[1.08] mb-5"
                        >
                            AI engineer building{' '}
                            <span className="text-accent">voice agents</span> and
                            agentic systems that ship to production.
                        </motion.h1>

                        <motion.p
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.16 }}
                            className="text-base md:text-lg text-fg-secondary leading-relaxed max-w-xl mb-8"
                        >
                            I'm Vasu DevS. I design and build real-time voice AI,
                            multi-agent pipelines, and full-stack products — sub-500ms
                            voice latency, measurable evals, and production deploys, not
                            demos.
                        </motion.p>

                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.24 }}
                            className="flex flex-wrap items-center gap-3 mb-10"
                        >
                            <a
                                href="https://cal.com/vasu-devs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-fg-primary text-bg-primary font-mono text-sm font-medium hover:bg-accent hover:text-white transition-colors"
                            >
                                book a call
                                <ArrowUpRight size={14} />
                            </a>
                            <button
                                type="button"
                                onClick={onResumeClick}
                                className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-border-primary bg-bg-primary font-mono text-sm text-fg-primary hover:border-fg-primary/40 transition-colors cursor-pointer"
                            >
                                <FileText size={14} />
                                resume
                            </button>
                            <a
                                href="https://github.com/vasu-devs"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub profile"
                                className="inline-flex items-center justify-center h-11 w-11 rounded-md border border-border-primary bg-bg-primary text-fg-primary hover:border-fg-primary/40 transition-colors"
                            >
                                <Github size={16} />
                            </a>
                        </motion.div>

                        {/* Live metrics strip */}
                        <motion.dl
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.32 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-primary border border-border-primary rounded-lg overflow-hidden max-w-xl"
                        >
                            {[
                                { label: 'github stars', value: metric(stats.stars) },
                                { label: 'contributions /yr', value: metric(stats.commits) },
                                { label: 'pull requests', value: metric(stats.prs) },
                                { label: 'launch views', value: '380.6K' },
                            ].map((m) => (
                                <div key={m.label} className="bg-bg-primary px-4 py-3">
                                    <dt className="font-mono text-[10px] text-fg-secondary mb-1">{m.label}</dt>
                                    <dd className="font-display font-semibold text-lg tabular-nums leading-none">{m.value}</dd>
                                </div>
                            ))}
                        </motion.dl>
                    </div>

                    {/* Right: terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-5"
                    >
                        <div className="terminal rounded-xl border border-fg-primary/20 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.35)] overflow-hidden">
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                <span className="ml-3 text-[11px] dim">vasu@dev: ~</span>
                            </div>
                            <div className="px-4 py-4 text-[12.5px] leading-relaxed">
                                {TERMINAL_LINES.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + i * 0.18, duration: 0.25 }}
                                        className="whitespace-pre-wrap break-words"
                                    >
                                        {line.prompt !== undefined ? (
                                            <span>
                                                <span className="prompt">$ </span>
                                                {line.prompt}
                                            </span>
                                        ) : (
                                            <span className={line.accent ? 'text-emerald-400' : 'dim'}>
                                                {line.out}
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + TERMINAL_LINES.length * 0.18 }}
                                >
                                    <span className="prompt">$ </span>
                                    <span className="cursor-blink">▌</span>
                                </motion.div>
                            </div>
                        </div>

                        <p className="font-mono text-[11px] text-fg-secondary mt-3 text-center">
                            psst — try the konami code, or type{' '}
                            <span className="text-accent">hire</span> anywhere
                        </p>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};
