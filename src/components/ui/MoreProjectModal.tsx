import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, GitFork, Calendar, Mail, ExternalLink } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DetailSections, DetailSection } from './DetailSections';

interface RepoProject {
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics: string[];
    updatedAt: string;
    summary?: string;
    details?: DetailSection[];
    highlights?: string[];
    tech?: string[];
}

interface MoreProjectModalProps {
    project: RepoProject | null;
    onClose: () => void;
}

const LANG_COLOR: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572a5',
    Rust: '#dea584',
    Go: '#00add8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
};

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
        });
    } catch {
        return '';
    }
}

export const MoreProjectModal = ({ project, onClose }: MoreProjectModalProps) => {
    useEffect(() => {
        if (!project) return;

        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', onKey);
        };
    }, [project, onClose]);

    return createPortal(
        <AnimatePresence>
            {project && (
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
                        className="relative w-full max-w-[900px] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        {/* Sticky header */}
                        <div className="flex justify-between items-start gap-4 px-[6vw] md:px-8 py-[4vw] md:py-5 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md z-10">
                            <div className="min-w-0 flex-1">
                                <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[1vw] md:mb-1.5">
                                    Project
                                </span>
                                <h2 className="font-display font-black text-[6vw] md:text-3xl leading-tight tracking-tight truncate">
                                    {project.name}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <CopyButton contentId="more-project-modal-content" className="flex" />
                                <button
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <X className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable body */}
                        <div
                            id="more-project-modal-content"
                            className="overflow-y-auto flex-1 overscroll-contain"
                            data-lenis-prevent
                        >
                            <div className="px-[6vw] md:px-8 py-[6vw] md:py-8">
                                {/* Stat row */}
                                <div className="flex flex-wrap items-center gap-[4vw] md:gap-6 font-mono text-[2.8vw] md:text-sm uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-8 pb-[4vw] md:pb-5 border-b border-border-primary/60">
                                    {project.language && (
                                        <span className="flex items-center gap-[1vw] md:gap-2">
                                            <span
                                                className="w-[2.5vw] h-[2.5vw] md:w-2.5 md:h-2.5 rounded-full"
                                                style={{
                                                    background: LANG_COLOR[project.language] ?? '#71717a',
                                                }}
                                            />
                                            {project.language}
                                        </span>
                                    )}
                                    {project.stars > 0 && (
                                        <span className="flex items-center gap-[1vw] md:gap-1.5">
                                            <Star className="w-[3vw] h-[3vw] md:w-3.5 md:h-3.5" />
                                            {project.stars}
                                        </span>
                                    )}
                                    {project.forks > 0 && (
                                        <span className="flex items-center gap-[1vw] md:gap-1.5">
                                            <GitFork className="w-[3vw] h-[3vw] md:w-3.5 md:h-3.5" />
                                            {project.forks}
                                        </span>
                                    )}
                                    {project.updatedAt && (
                                        <span className="flex items-center gap-[1vw] md:gap-1.5">
                                            <Calendar className="w-[3vw] h-[3vw] md:w-3.5 md:h-3.5" />
                                            Updated {formatDate(project.updatedAt)}
                                        </span>
                                    )}
                                </div>

                                {/* Summary — lead paragraph */}
                                {(project.summary || project.description) && (
                                    <p className="text-[4vw] md:text-xl text-fg-primary leading-relaxed mb-[6vw] md:mb-8 font-medium">
                                        {project.summary || project.description}
                                    </p>
                                )}

                                {/* Details — sectioned */}
                                {project.details && project.details.length > 0 && (
                                    <div className="mb-[10vw] md:mb-12">
                                        <DetailSections sections={project.details} />
                                    </div>
                                )}

                                {/* Highlights */}
                                {project.highlights && project.highlights.length > 0 && (
                                    <div className="mb-[8vw] md:mb-10">
                                        <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                            Highlights
                                        </span>
                                        <ul className="space-y-[2vw] md:space-y-2.5">
                                            {project.highlights.map((h, i) => (
                                                <li
                                                    key={i}
                                                    className="relative pl-[5vw] md:pl-6 text-[3.5vw] md:text-base leading-relaxed text-fg-secondary before:content-[''] before:absolute before:left-[1vw] md:before:left-2 before:top-[2.2vw] md:before:top-3 before:w-[2vw] md:before:w-2 before:h-px before:bg-fg-primary/40"
                                                >
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tech */}
                                {project.tech && project.tech.length > 0 && (
                                    <div className="mb-[8vw] md:mb-10">
                                        <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                            Stack
                                        </span>
                                        <div className="flex flex-wrap gap-[2vw] md:gap-2">
                                            {project.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-bg-secondary/40 text-fg-secondary"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-[3vw] md:gap-3 pt-[4vw] md:pt-6 border-t border-border-primary/60">
                                    <a
                                        href="mailto:siddhvasudev1402@gmail.com"
                                        className="inline-flex items-center gap-[2vw] md:gap-2 px-[5vw] md:px-6 py-[3vw] md:py-3 rounded-full bg-fg-primary text-bg-primary font-mono text-[2.8vw] md:text-sm uppercase tracking-widest font-bold hover:scale-105 transition-transform"
                                    >
                                        <Mail className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                        Drop Me a Mail
                                    </a>
                                    {project.homepage && (
                                        <a
                                            href={project.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-[2vw] md:gap-2 px-[5vw] md:px-6 py-[3vw] md:py-3 rounded-full border border-border-primary font-mono text-[2.8vw] md:text-sm uppercase tracking-widest font-bold hover:bg-bg-secondary transition-colors"
                                        >
                                            <ExternalLink className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                            Live Demo
                                        </a>
                                    )}
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
