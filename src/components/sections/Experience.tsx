import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { ExperienceModal } from '../ui/ExperienceModal';

const HEADLINE_METRICS = [
    { value: '18', label: 'Days, solo' },
    { value: '5', label: 'Integrations' },
    { value: '10×', label: 'Faster sync' },
    { value: '85', label: 'Tests' },
];

const TECH_CHIPS = [
    'Next.js 15',
    'TypeScript',
    'PostgreSQL',
    'Prisma',
    'Tailwind',
    'Vercel',
];

export const Experience = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="experience" className="inverted bg-bg-primary text-fg-primary py-[16vw] md:py-24 relative">
            <Container>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-16"
                >
                    <span className="text-fg-primary/30">01 /</span> Experience
                </motion.h2>

                <motion.article
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6 }}
                    onClick={() => setIsModalOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsModalOpen(true);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Open case study for Internal Finance & P&L Platform"
                    className="group relative border border-border-primary rounded-2xl bg-fg-primary/[0.03] backdrop-blur-sm p-[6vw] md:p-10 cursor-pointer transition-colors hover:bg-fg-primary/[0.06]"
                >
                    {/* Top row: date pill + read-more affordance */}
                    <div className="flex items-start justify-between gap-[4vw] md:gap-6 mb-[6vw] md:mb-8">
                        <div className="flex flex-wrap items-center gap-[2vw] md:gap-3">
                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary">
                                Mar → Apr 2026
                            </span>
                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                Freelance · Sole engineer
                            </span>
                        </div>
                        <div className="shrink-0 w-[10vw] h-[10vw] md:w-12 md:h-12 rounded-full border border-border-primary flex items-center justify-center transition-all duration-500 group-hover:bg-fg-primary group-hover:text-bg-primary group-hover:rotate-45">
                            <ArrowUpRight className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                        </div>
                    </div>

                    {/* Title block */}
                    <h3 className="font-display font-black text-[9vw] md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter uppercase mb-[3vw] md:mb-4">
                        Full-Stack Engineer
                    </h3>
                    <p className="font-mono text-[3vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-8">
                        Internal Finance &amp; P&amp;L Platform
                    </p>

                    {/* Short brief */}
                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed mb-[8vw] md:mb-10 max-w-3xl">
                        End-to-end build of a Next.js 15 / PostgreSQL financial reporting
                        platform: unified ingestion across five live platforms, accurate
                        multi-currency P&amp;L, and a dashboard that loads in sub-second.
                        Shipped to production on day 18 at full scope.
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-4 mb-[6vw] md:mb-8">
                        {HEADLINE_METRICS.map((m) => (
                            <div
                                key={m.label}
                                className="p-[4vw] md:p-5 rounded-xl border border-border-primary bg-fg-primary/[0.04]"
                            >
                                <div className="font-display font-black text-[8vw] md:text-4xl leading-none mb-[1vw] md:mb-2">
                                    {m.value}
                                </div>
                                <div className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                    {m.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tech chips + CTA hint */}
                    <div className="flex flex-wrap items-center justify-between gap-[3vw] md:gap-4">
                        <div className="flex flex-wrap gap-[2vw] md:gap-2">
                            {TECH_CHIPS.map((t) => (
                                <span
                                    key={t}
                                    className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-fg-primary/[0.03] text-fg-secondary"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                        <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary group-hover:text-fg-primary transition-colors">
                            Open case study →
                        </span>
                    </div>
                </motion.article>
            </Container>

            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};
