import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Globe2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ExperienceModal } from '../ui/ExperienceModal';
import { JustHireMeExperienceModal } from '../ui/JustHireMeExperienceModal';

interface EntryProps {
    date: string;
    role: string;
    title: string;
    brief: string;
    metrics: { value: string; label: string }[];
    chips: string[];
    onOpen: () => void;
    links?: { icon: React.ReactNode; href: string; label: string }[];
}

const ExperienceCard = ({ date, role, title, brief, metrics, chips, onOpen, links }: EntryProps) => (
    <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={onOpen}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen();
            }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Open case study for ${title}`}
        className="group border border-border-primary rounded-xl bg-bg-primary p-6 md:p-7 cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]"
    >
        <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                <p className="font-mono text-[11px] text-fg-secondary mb-2">
                    {date} · {role}
                </p>
                <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {links?.map((l) => (
                    <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={l.label}
                        className="w-8 h-8 rounded-md border border-border-primary flex items-center justify-center text-fg-secondary hover:text-fg-primary hover:border-fg-primary/40 transition-colors"
                    >
                        {l.icon}
                    </a>
                ))}
                <span className="w-8 h-8 rounded-md border border-border-primary flex items-center justify-center text-fg-secondary transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
                    <ArrowUpRight size={14} />
                </span>
            </div>
        </div>

        <p className="text-sm md:text-[15px] text-fg-secondary leading-relaxed mb-5">
            {brief}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-primary border border-border-primary rounded-lg overflow-hidden mb-5">
            {metrics.map((m) => (
                <div key={m.label} className="bg-bg-secondary/60 px-4 py-2.5">
                    <div className="font-display font-semibold text-lg leading-none mb-1 tabular-nums">{m.value}</div>
                    <div className="font-mono text-[10px] text-fg-secondary">{m.label}</div>
                </div>
            ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
                {chips.map((t) => (
                    <span key={t} className="font-mono text-[11px] text-fg-secondary bg-bg-secondary border border-border-primary rounded px-2 py-0.5">
                        {t}
                    </span>
                ))}
            </div>
            <span className="font-mono text-[11px] text-fg-secondary group-hover:text-accent transition-colors shrink-0">
                read case study →
            </span>
        </div>
    </motion.article>
);

export const Experience = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJustHireMeModalOpen, setIsJustHireMeModalOpen] = useState(false);

    return (
        <section id="experience" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="01"
                    label="experience"
                    title="Shipped, not just built"
                    sub="Production systems with real users, real money, and real constraints — full case studies behind each card."
                />

                <div className="flex flex-col gap-5">
                    <ExperienceCard
                        date="May 2026"
                        role="Open source founder"
                        title="JustHireMe — agentic job-search workbench"
                        brief="Local-first desktop app that ingests a candidate profile, builds a professional graph, discovers and scores job leads, and generates tailored resumes, cover letters and outreach. The launch thread went viral; the product is live at justhireme.ai."
                        metrics={[
                            { value: '380.6K', label: 'launch views' },
                            { value: '3.2K', label: 'likes' },
                            { value: '339', label: 'reposts' },
                            { value: '98', label: 'replies' },
                        ]}
                        chips={['Tauri', 'React', 'TypeScript', 'FastAPI', 'KuzuDB', 'LanceDB']}
                        onOpen={() => setIsJustHireMeModalOpen(true)}
                        links={[
                            { icon: <Github size={14} />, href: 'https://github.com/vasu-devs/JustHireMe', label: 'JustHireMe on GitHub' },
                            { icon: <Globe2 size={14} />, href: 'https://justhireme.ai', label: 'JustHireMe live site' },
                        ]}
                    />

                    <ExperienceCard
                        date="Mar → Apr 2026"
                        role="Freelance · sole engineer"
                        title="Internal Finance & P&L Platform"
                        brief="End-to-end build of a production fintech platform: unified transaction ingestion across 5 live payment/ad platforms, accurate multi-currency P&L with processor-level deduplication, and a sub-second dashboard. Shipped at full scope on day 18 — zero post-handoff bug reports."
                        metrics={[
                            { value: '18', label: 'days, solo' },
                            { value: '5', label: 'integrations' },
                            { value: '10×', label: 'faster sync' },
                            { value: '85', label: 'tests' },
                        ]}
                        chips={['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'Vercel']}
                        onOpen={() => setIsModalOpen(true)}
                    />
                </div>
            </Container>

            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <JustHireMeExperienceModal
                isOpen={isJustHireMeModalOpen}
                onClose={() => setIsJustHireMeModalOpen(false)}
            />
        </section>
    );
};
