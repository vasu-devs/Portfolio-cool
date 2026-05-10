import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Globe2, X } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { fetchCachedRepoStats, type GitHubRepoStats } from '../../lib/github';

interface JustHireMeExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PerfWin {
    metric: string;
    desc: string;
}

interface Section {
    title: string;
    body?: string;
    bullets?: string[];
    perf?: PerfWin[];
}

const SECTIONS: Section[] = [
    {
        title: 'Context',
        body: 'The job-search flow is noisy, repetitive, and hard to trust. Candidates spend hours sorting through stale posts, duplicated listings, irrelevant roles, senior-only openings, and low-context descriptions. Most AI tools either scrape too broadly, rank opportunities like a black box, or jump straight to automation before the user has enough control.',
    },
    {
        title: 'Product idea',
        bullets: [
            'Built JustHireMe as a local-first desktop workbench for job intelligence instead of blind auto-apply.',
            'Designed the workflow around a candidate-owned profile, explainable filtering, role scoring, and human review.',
            'Made the supported open-source core contributor-friendly: source adapters, ranking logic, matching, customization, docs, and packaging.',
            'Kept browser automation as an experimental lab area, disabled by default, so the product promise stays focused on trustworthy discovery and decision support.',
        ],
    },
    {
        title: 'Workflow',
        bullets: [
            'Import resume and profile data, then convert career history, skills, projects, and evidence into local profile context.',
            'Discover leads from configured sources and normalize them before they enter the candidate pipeline.',
            'Run a quality gate that rejects stale, thin, spammy, senior-only, unpaid, or low-context roles with visible reasons.',
            'Score accepted roles against seniority, stack coverage, location constraints, project evidence, source signal, and semantic profile similarity.',
            'Generate tailored resume PDFs, cover letter PDFs, cold emails, LinkedIn notes, keyword coverage summaries, and selected-project rationale for user review.',
        ],
    },
    {
        title: 'Architecture',
        bullets: [
            'Tauri desktop shell wraps a React + TypeScript workbench and launches a Python FastAPI sidecar.',
            'SQLite stores the local CRM pipeline, lead history, notes, settings, and generated application context.',
            'KuzuDB models the professional profile graph so roles can be evaluated against skills, projects, experience, and evidence relationships.',
            'LanceDB stores skill, project, and job vectors for semantic matching that goes beyond keyword overlap.',
            'FastAPI and WebSockets connect the UI to scraper agents, the quality gate, ranker/evaluator, customizer, and local data layer.',
        ],
    },
    {
        title: 'Trust model',
        body: 'The core product principle is that career data should not have to live on someone else\'s server by default. Resumes, career history, API keys, job leads, notes, graph data, vectors, and generated documents are treated as local-first data. AI output is presented as a draft with explanations, not as an invisible decision maker.',
    },
    {
        title: 'Open-source launch',
        bullets: [
            'Open-sourced the alpha publicly at github.com/vasu-devs/JustHireMe and launched the live project at justhireme.ai.',
            'The launch post reached 379.7K views, 3.2K likes, 338 reposts, and 98 replies, validating that developers and job seekers feel the pain this project targets.',
            'The repository attracted early open-source attention, including hundreds of stars, forks, and active pull requests.',
            'Positioned the project for contributors across agentic AI, source adapters, ranking algorithms, GraphRAG, semantic search, resume parsing, document generation, testing, docs, and UI/UX.',
        ],
    },
    {
        title: 'What I shipped',
        perf: [
            { metric: 'Local', desc: 'Desktop architecture where profile data, lead tracking, graph data, vectors, settings, and generated documents stay on the user machine by default.' },
            { metric: 'Graph', desc: 'Professional profile modeling with KuzuDB so fit can be explained through skills, projects, experience, and evidence relationships.' },
            { metric: 'Vector', desc: 'Semantic matching with LanceDB to compare jobs against profile context instead of relying on brittle keyword matching alone.' },
            { metric: 'Gate', desc: 'Deterministic lead quality filters that reject weak postings before they pollute the pipeline, with reasons the user can inspect.' },
            { metric: 'Drafts', desc: 'Tailored resume, cover letter, cold email, and LinkedIn outreach generation built around human-in-the-loop review.' },
            { metric: 'OSS', desc: 'A public alpha with docs, contribution surfaces, source-adapter opportunities, and a roadmap for packaging and local keychain storage.' },
        ],
    },
];

const FALLBACK_REPO_STATS: GitHubRepoStats = {
    stars: 479,
    forks: 92,
    openPullRequests: 18,
};

const TECH_STACK = [
    'Tauri 2',
    'React 19',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Python 3.13',
    'FastAPI',
    'WebSockets',
    'SQLite',
    'KuzuDB',
    'LanceDB',
    'Playwright',
];

export const JustHireMeExperienceModal = ({ isOpen, onClose }: JustHireMeExperienceModalProps) => {
    const [repoStats, setRepoStats] = useState<GitHubRepoStats>(FALLBACK_REPO_STATS);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();

        fetchCachedRepoStats('vasu-devs', 'JustHireMe', controller.signal)
            .then((stats) => {
                setRepoStats({
                    stars: stats.stars > 0 ? stats.stars : FALLBACK_REPO_STATS.stars,
                    forks: stats.forks > 0 ? stats.forks : FALLBACK_REPO_STATS.forks,
                    openPullRequests:
                        stats.openPullRequests > 0
                            ? stats.openPullRequests
                            : FALLBACK_REPO_STATS.openPullRequests,
                });
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                console.warn('Failed to fetch JustHireMe GitHub stats:', error);
            });

        return () => controller.abort();
    }, [isOpen]);

    const headlineMetrics = useMemo(
        () => [
            { value: '379.7K', label: 'Launch views' },
            { value: repoStats.stars.toLocaleString(), label: 'GitHub stars' },
            { value: repoStats.forks.toLocaleString(), label: 'Forks' },
            { value: repoStats.openPullRequests.toLocaleString(), label: 'Open PRs' },
        ],
        [repoStats]
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-[3vw] md:p-[2vw]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
                    />

                    <motion.div
                        initial={{ scale: 0.97, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.97, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-[1100px] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        <div className="flex justify-between items-start gap-4 px-[6vw] md:px-10 py-[5vw] md:py-6 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md z-10">
                            <div className="min-w-0">
                                <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[1vw] md:mb-2">
                                    Case study / Open source
                                </span>
                                <h2 className="font-display font-black text-[6vw] md:text-3xl lg:text-4xl leading-tight tracking-tight truncate">
                                    JustHireMe
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <a
                                    href="https://github.com/vasu-devs/JustHireMe"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Open JustHireMe on GitHub"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <Github className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </a>
                                <a
                                    href="https://justhireme.ai"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Open JustHireMe live site"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <Globe2 className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </a>
                                <CopyButton contentId="justhireme-modal-content" className="flex" />
                                <button
                                    onClick={onClose}
                                    aria-label="Close case study"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <X className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        <div
                            id="justhireme-modal-content"
                            className="overflow-y-auto flex-1 overscroll-contain"
                            data-lenis-prevent
                        >
                            <div className="px-[6vw] md:px-10 py-[8vw] md:py-12">
                                <div className="mb-[10vw] md:mb-14 max-w-3xl">
                                    <div className="flex flex-wrap gap-[2vw] md:gap-2 mb-[4vw] md:mb-6">
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            May 2026
                                        </span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Founder / Builder
                                        </span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Local-first AI
                                        </span>
                                    </div>
                                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed">
                                        A privacy-first desktop workbench for making job search more
                                        intelligent, transparent, and user-controlled: scrape better leads,
                                        filter noise, explain fit, match against a local profile graph and
                                        vector store, then generate tailored application materials for review.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-4 mb-[12vw] md:mb-16">
                                    {headlineMetrics.map((m) => (
                                        <div
                                            key={m.label}
                                            className="p-[4vw] md:p-5 rounded-xl border border-border-primary"
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

                                <div className="space-y-[14vw] md:space-y-20">
                                    {SECTIONS.map((section, i) => (
                                        <section key={section.title}>
                                            <div className="flex items-baseline gap-[3vw] md:gap-4 mb-[4vw] md:mb-6">
                                                <span className="font-mono text-[2.5vw] md:text-xs text-fg-secondary tabular-nums">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="h-px flex-1 bg-border-primary" />
                                                <h3 className="font-display font-bold text-[5.5vw] md:text-2xl uppercase tracking-tight">
                                                    {section.title}
                                                </h3>
                                            </div>

                                            {section.body && (
                                                <p className="text-[3.8vw] md:text-lg text-fg-secondary leading-relaxed mb-[5vw] md:mb-8 max-w-3xl">
                                                    {section.body}
                                                </p>
                                            )}

                                            {section.bullets && (
                                                <ul className="space-y-[3vw] md:space-y-4 max-w-3xl">
                                                    {section.bullets.map((b, bi) => (
                                                        <li
                                                            key={bi}
                                                            className="relative pl-[6vw] md:pl-8 text-[3.5vw] md:text-base leading-relaxed text-fg-secondary before:content-[''] before:absolute before:left-[1vw] md:before:left-2 before:top-[2vw] md:before:top-3 before:w-[2vw] md:before:w-2 before:h-px before:bg-fg-primary/40"
                                                        >
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {section.perf && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[3vw] md:gap-4">
                                                    {section.perf.map((w) => (
                                                        <div
                                                            key={w.metric}
                                                            className="p-[4vw] md:p-6 rounded-xl border border-border-primary bg-bg-secondary/40 flex gap-[3vw] md:gap-5 items-start"
                                                        >
                                                            <div className="font-display font-black text-[7vw] md:text-3xl leading-none shrink-0 min-w-[20vw] md:min-w-[90px]">
                                                                {w.metric}
                                                            </div>
                                                            <p className="text-[3.2vw] md:text-sm leading-relaxed text-fg-secondary">
                                                                {w.desc}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    ))}
                                </div>

                                <div className="mt-[14vw] md:mt-20 pt-[6vw] md:pt-8 border-t border-border-primary">
                                    <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                        Stack
                                    </span>
                                    <div className="flex flex-wrap gap-[2vw] md:gap-2">
                                        {TECH_STACK.map((t) => (
                                            <span
                                                key={t}
                                                className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-bg-secondary/40 text-fg-secondary"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
