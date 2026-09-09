import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { JustHireMeExperienceModal } from '../ui/JustHireMeExperienceModal';
import { StealthExperienceModal } from '../ui/StealthExperienceModal';
import experienceData from '../../data/experience.json';

interface ClientRoleMetric {
    value: string;
    label: string;
}

interface ClientRole {
    id: string;
    company: string;
    role: string;
    dateLabel: string;
    track: string;
    contribution: string;
    summary: string;
    metrics?: ClientRoleMetric[];
    tech: string[];
    links?: { label: string; href: string }[];
}

// Compact client/contract engagements — the Stealth role gets its own hero
// card above, so it's excluded here.
const CLIENT_ROLES = (experienceData.roles as unknown as ClientRole[]).filter(
    (r) => r.track === 'Freelance'
);

const JUSTHIREME_METRICS = [
    { value: '380.6K', label: 'Launch views' },
    { value: '3.2K', label: 'Likes' },
    { value: '339', label: 'Reposts' },
    { value: '98', label: 'Replies' },
];

const JUSTHIREME_CHIPS = [
    'Tauri',
    'React',
    'TypeScript',
    'FastAPI',
    'SQLite',
    'KuzuDB',
    'LanceDB',
    'Playwright',
];

const STEALTH_METRICS = experienceData.roles[0].metrics ?? [];

const STEALTH_CHIPS = experienceData.roles[0].tech;



export const Experience = () => {
    const [isJustHireMeModalOpen, setIsJustHireMeModalOpen] = useState(false);
    const [isStealthModalOpen, setIsStealthModalOpen] = useState(false);

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
                    onClick={() => setIsStealthModalOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsStealthModalOpen(true);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Open stealth internship overview"
                    className="group relative border border-border-primary rounded-2xl bg-fg-primary/[0.04] backdrop-blur-sm p-[6vw] md:p-10 mb-[6vw] md:mb-8 overflow-hidden cursor-pointer transition-colors hover:bg-fg-primary/[0.06]"
                >
                    <div className="flex items-start justify-between gap-[4vw] md:gap-6 mb-[6vw] md:mb-8">
                        <div className="flex flex-wrap items-center gap-[2vw] md:gap-3">
                            <span className="inline-flex items-center gap-[2vw] md:gap-2 font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary">
                                <span className="relative flex h-[2vw] w-[2vw] md:h-2 md:w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-[2vw] w-[2vw] md:h-2 md:w-2 bg-emerald-500" />
                                </span>
                                Jun 2026 → Present
                            </span>
                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                AI Engineering Intern · Stealth
                            </span>
                        </div>
                    </div>

                    <h3 className="font-display font-black text-[9vw] md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter uppercase mb-[3vw] md:mb-4">
                        Stealth
                    </h3>
                    <p className="font-mono text-[3vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-8">
                        AI engineering internship
                    </p>

                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed mb-[8vw] md:mb-10 max-w-4xl">
                        {experienceData.roles[0].summary}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-4 mb-[6vw] md:mb-8">
                        {STEALTH_METRICS.map((m) => (
                            <div
                                key={m.label}
                                className="p-[4vw] md:p-5 rounded-xl border border-border-primary bg-fg-primary/[0.04]"
                            >
                                <div className="font-display font-black text-[7vw] md:text-4xl leading-none mb-[1vw] md:mb-2">
                                    {m.value}
                                </div>
                                <div className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                    {m.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-[3vw] md:gap-4">
                        <div className="flex flex-wrap gap-[2vw] md:gap-2">
                            {STEALTH_CHIPS.map((t) => (
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

                <motion.article
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6 }}
                    onClick={() => setIsJustHireMeModalOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsJustHireMeModalOpen(true);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Open case study for JustHireMe"
                    className="group relative border border-border-primary rounded-2xl bg-fg-primary/[0.04] backdrop-blur-sm p-[6vw] md:p-10 mb-[6vw] md:mb-8 overflow-hidden cursor-pointer transition-colors hover:bg-fg-primary/[0.06]"
                >
                    <div className="flex items-start justify-between gap-[4vw] md:gap-6 mb-[6vw] md:mb-8">
                        <div className="flex flex-wrap items-center gap-[2vw] md:gap-3">
                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary">
                                May 2026
                            </span>
                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                Open source founder / Local-first AI
                            </span>
                        </div>
                        <div className="flex items-center gap-[2vw] md:gap-3 shrink-0">
                            <a
                                href="https://github.com/vasu-devs/JustHireMe"
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Open JustHireMe on GitHub"
                                className="w-[10vw] h-[10vw] md:w-12 md:h-12 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 hover:bg-fg-primary hover:text-bg-primary"
                            >
                                <Github className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                            </a>
                            <a
                                href="https://justhireme.ai"
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Open JustHireMe live site"
                                className="w-[10vw] h-[10vw] md:w-12 md:h-12 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 hover:bg-fg-primary hover:text-bg-primary"
                            >
                                <Globe2 className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                            </a>
                        </div>
                    </div>

                    <h3 className="font-display font-black text-[9vw] md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter uppercase mb-[3vw] md:mb-4">
                        JustHireMe
                    </h3>
                    <p className="font-mono text-[3vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-8">
                        Agentic AI desktop app for transparent, privacy-first job search
                    </p>

                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed mb-[8vw] md:mb-10 max-w-4xl">
                        Building and open-sourcing a local-first job intelligence workbench
                        that ingests a candidate profile, builds a professional graph,
                        discovers and filters job leads, explains role fit, and generates
                        tailored resumes, cover letters, cold emails, and LinkedIn outreach.
                        The launch went viral with 380.6K views while the product is live at
                        justhireme.ai.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-4 mb-[6vw] md:mb-8">
                        {JUSTHIREME_METRICS.map((m) => (
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

                    <div className="flex flex-wrap items-center justify-between gap-[3vw] md:gap-4">
                        <div className="flex flex-wrap gap-[2vw] md:gap-2">
                            {JUSTHIREME_CHIPS.map((t) => (
                                <span
                                    key={t}
                                    className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-fg-primary/[0.03] text-fg-secondary"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                        <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                            Open case study &rarr;
                        </span>
                    </div>
                </motion.article>



                {/* Client & contract engagements — compact grid from experience.json.
                    Renders nothing while there are no Client-track roles. */}
                {CLIENT_ROLES.length > 0 && (<>
                <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mt-[12vw] md:mt-20 mb-[6vw] md:mb-10"
                >
                    <span className="text-fg-primary/30">+</span> Freelance
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] md:gap-5">
                    {CLIENT_ROLES.map((r, i) => (
                        <motion.article
                            key={r.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                            className="flex flex-col border border-border-primary rounded-2xl bg-fg-primary/[0.03] backdrop-blur-sm p-[5vw] md:p-8"
                        >
                            <div className="flex items-start justify-between gap-[3vw] md:gap-4 mb-[4vw] md:mb-6">
                                <div className="flex flex-wrap items-center gap-[2vw] md:gap-2">
                                    <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary">
                                        {r.dateLabel}
                                    </span>
                                    <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                        {r.role}
                                    </span>
                                </div>
                                {r.links?.[0] && (
                                    <a
                                        href={r.links[0].href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Open ${r.company} — ${r.links[0].label}`}
                                        className="shrink-0 w-[9vw] h-[9vw] md:w-10 md:h-10 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 hover:bg-fg-primary hover:text-bg-primary"
                                    >
                                        <Globe2 className="w-[4.5vw] h-[4.5vw] md:w-4 md:h-4" />
                                    </a>
                                )}
                            </div>

                            <h4 className="font-display font-black text-[7vw] md:text-3xl leading-[0.95] tracking-tighter uppercase mb-[2vw] md:mb-3">
                                {r.company}
                            </h4>

                            <p className="text-[3.5vw] md:text-base text-fg-secondary leading-relaxed mb-[4vw] md:mb-6 flex-1">
                                {r.summary}
                            </p>

                            {r.metrics && r.metrics.length > 0 && (
                                <div className="flex flex-wrap gap-x-[6vw] gap-y-[2vw] md:gap-x-8 md:gap-y-3 mb-[4vw] md:mb-6">
                                    {r.metrics.slice(0, 3).map((m) => (
                                        <div key={m.label}>
                                            <div className="font-display font-black text-[5.5vw] md:text-2xl leading-none mb-[1vw] md:mb-1">
                                                {m.value}
                                            </div>
                                            <div className="font-mono text-[2.3vw] md:text-[10px] uppercase tracking-widest text-fg-secondary">
                                                {m.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-[2vw] md:gap-2 mb-[3vw] md:mb-4">
                                {r.tech.slice(0, 6).map((t) => (
                                    <span
                                        key={t}
                                        className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-fg-primary/[0.03] text-fg-secondary"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <span className="font-mono text-[2.5vw] md:text-[11px] uppercase tracking-widest text-fg-secondary/70">
                                {r.contribution}
                            </span>
                        </motion.article>
                    ))}
                </div>
                </>)}
            </Container>
            <JustHireMeExperienceModal
                isOpen={isJustHireMeModalOpen}
                onClose={() => setIsJustHireMeModalOpen(false)}
            />
            <StealthExperienceModal
                isOpen={isStealthModalOpen}
                onClose={() => setIsStealthModalOpen(false)}
            />
        </section>
    );
};
