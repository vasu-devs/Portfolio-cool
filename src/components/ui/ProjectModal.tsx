import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { useEffect } from "react";

interface Project {
    title: string;
    category: string;
    description: string;
    videoUrl?: string;
    repoUrl?: string;
    liveUrl?: string;
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
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-[4vw] md:p-[2vw]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-[90vw] md:max-w-[70vw] bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-[6vw] md:p-[1.5vw] border-b border-border-primary bg-bg-primary/50 backdrop-blur-md z-10">
                            <div>
                                <span className="font-mono text-[3vw] md:text-[0.8vw] uppercase tracking-widest text-fg-secondary">
                                    Project Demo
                                </span>
                                <h3 className="font-display font-bold text-[6vw] md:text-[1.6vw]">{project.title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-[2vw] md:p-[0.5vw] rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary"
                            >
                                <X className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]" />
                            </button>
                        </div>

                        {/* Video Container */}
                        <div className="relative aspect-video bg-black w-full overflow-hidden flex items-center justify-center">
                            {project.videoUrl ? (
                                <>
                                    {getYouTubeEmbedUrl(project.videoUrl) ? (
                                        <>
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
                                                <div className="w-8 h-8 border-4 border-fg-primary/20 border-t-fg-primary rounded-full animate-spin" />
                                            </div>
                                            <iframe
                                                src={getYouTubeEmbedUrl(project.videoUrl)!}
                                                title={project.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full border-0 shadow-2xl relative z-10"
                                                onLoad={(e) => {
                                                    const loader = e.currentTarget.previousElementSibling;
                                                    if (loader) loader.classList.add('hidden');
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <video
                                            src={project.videoUrl}
                                            controls
                                            autoPlay
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <p className="text-zinc-500 font-mono text-[3.5vw] md:text-[0.9vw]">No Video Available</p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Details */}
                        <div className="p-[8vw] md:p-[2vw] bg-bg-primary overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-[8vw] md:gap-[2vw] justify-between items-start">
                                <div className="max-w-2xl">
                                    <p className="text-fg-secondary leading-relaxed mb-[6vw] md:mb-[1.5vw] text-[4.5vw] md:text-[1.1vw]">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-[2vw] md:gap-[0.5vw]">
                                        <span className="px-[3vw] py-[1vw] md:px-[0.75vw] md:py-[0.25vw] rounded-full border border-border-primary text-[3vw] md:text-[0.8vw] font-mono bg-bg-secondary">
                                            {project.category}
                                        </span>
                                        {/* Add tech stack tags here if available in data later */}
                                    </div>
                                </div>

                                <div className="flex gap-[4vw] md:gap-[1vw] shrink-0">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-[2vw] md:gap-[0.5vw] px-[6vw] py-[3vw] md:px-[1.5vw] md:py-[0.75vw] bg-fg-primary text-bg-primary font-bold font-mono text-[3vw] md:text-[0.8vw] uppercase hover:scale-105 transition-transform rounded-full"
                                        >
                                            <ExternalLink className="w-[4vw] h-[4vw] md:w-[1vw] md:h-[1vw]" /> Live Demo
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-[2vw] md:gap-[0.5vw] px-[6vw] py-[3vw] md:px-[1.5vw] md:py-[0.75vw] border border-border-primary font-bold font-mono text-[3vw] md:text-[0.8vw] uppercase hover:bg-bg-secondary transition-colors rounded-full"
                                        >
                                            <Github className="w-[4vw] h-[4vw] md:w-[1vw] md:h-[1vw]" /> Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
