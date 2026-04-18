import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { DetailSections, DetailSection } from "./DetailSections";

interface Project {
    title: string;
    category: string;
    description: string;
    videoUrl?: string;
    repoUrl?: string;
    liveUrl?: string;
    summary?: string;
    details?: DetailSection[];
    highlights?: string[];
    tech?: string[];
}

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return null;
};

export const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setVideoLoaded(false);
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onClose]);

    if (!project) return null;

    return (
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
                        className="relative w-full max-w-[1320px] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:h-[88vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start gap-4 px-[6vw] md:px-8 py-[4vw] md:py-5 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md shrink-0">
                            <div className="min-w-0 flex-1">
                                <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[1vw] md:mb-1.5">
                                    {project.category}
                                </span>
                                <h2 className="font-display font-black text-[6vw] md:text-3xl leading-tight tracking-tight truncate">
                                    {project.title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="shrink-0 p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                            >
                                <X className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Body — stacked on mobile, side-by-side on desktop */}
                        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden" data-lenis-prevent>
                            {/* Video column */}
                            <div className="md:w-[58%] md:shrink-0 bg-black flex items-center justify-center md:border-r md:border-border-primary">
                                <div className="relative w-full aspect-video overflow-hidden">
                                    {project.videoUrl ? (
                                        getYouTubeEmbedUrl(project.videoUrl) ? (
                                            <>
                                                {!videoLoaded && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
                                                        <div className="w-8 h-8 border-4 border-fg-primary/20 border-t-fg-primary rounded-full animate-spin" />
                                                    </div>
                                                )}
                                                <iframe
                                                    src={getYouTubeEmbedUrl(project.videoUrl)!}
                                                    title={`${project.title} demo video`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full border-0 z-10"
                                                    onLoad={() => setVideoLoaded(true)}
                                                />
                                            </>
                                        ) : (
                                            <video
                                                src={project.videoUrl}
                                                controls
                                                autoPlay
                                                className="absolute inset-0 w-full h-full object-contain"
                                            />
                                        )
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            <p className="text-zinc-500 font-mono text-[3.5vw] md:text-sm">
                                                No video available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text column — scrollable on desktop */}
                            <div className="md:flex-1 md:overflow-y-auto md:overscroll-contain">
                                <div className="px-[6vw] md:px-8 py-[6vw] md:py-8">
                                    {/* Lead paragraph */}
                                    <p className="text-[4vw] md:text-lg text-fg-primary leading-relaxed mb-[6vw] md:mb-8 font-medium">
                                        {project.summary || project.description}
                                    </p>

                                    {/* Sectioned details */}
                                    {project.details && project.details.length > 0 && (
                                        <div className="mb-[10vw] md:mb-10">
                                            <DetailSections sections={project.details} />
                                        </div>
                                    )}

                                    {/* Highlights */}
                                    {project.highlights && project.highlights.length > 0 && (
                                        <div className="mb-[8vw] md:mb-8">
                                            <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                                Highlights
                                            </span>
                                            <ul className="space-y-[2vw] md:space-y-2.5">
                                                {project.highlights.map((h, i) => (
                                                    <li
                                                        key={i}
                                                        className="relative pl-[5vw] md:pl-6 text-[3.5vw] md:text-sm leading-relaxed text-fg-secondary before:content-[''] before:absolute before:left-[1vw] md:before:left-2 before:top-[2.2vw] md:before:top-2.5 before:w-[2vw] md:before:w-2 before:h-px before:bg-fg-primary/40"
                                                    >
                                                        {h}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Tech */}
                                    {project.tech && project.tech.length > 0 && (
                                        <div className="mb-[8vw] md:mb-8">
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
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-[2vw] md:gap-2 px-[5vw] md:px-5 py-[3vw] md:py-2.5 rounded-full bg-fg-primary text-bg-primary font-mono text-[2.8vw] md:text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform"
                                            >
                                                <ExternalLink className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                                Live Demo
                                            </a>
                                        )}
                                        {project.repoUrl && (
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-[2vw] md:gap-2 px-[5vw] md:px-5 py-[3vw] md:py-2.5 rounded-full border border-border-primary font-mono text-[2.8vw] md:text-xs uppercase tracking-widest font-bold hover:bg-bg-secondary transition-colors"
                                            >
                                                <Github className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                                Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
