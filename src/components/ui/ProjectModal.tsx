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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
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
                        className="relative w-full max-w-5xl bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-primary/50 backdrop-blur-md z-10">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-widest text-fg-secondary">
                                    Project Demo
                                </span>
                                <h3 className="font-display font-bold text-2xl">{project.title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Video Container */}
                        <div className="relative aspect-video bg-black w-full overflow-hidden">
                            {project.videoUrl ? (
                                getYouTubeEmbedUrl(project.videoUrl) ? (
                                    <iframe
                                        src={getYouTubeEmbedUrl(project.videoUrl)!}
                                        title={project.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full border-0 shadow-2xl"
                                    />
                                ) : (
                                    <video
                                        src={project.videoUrl}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <p className="text-zinc-500 font-mono text-sm">No Video Available</p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Details */}
                        <div className="p-8 bg-bg-primary overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                                <div className="max-w-2xl">
                                    <p className="text-fg-secondary leading-relaxed mb-6 text-lg">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full border border-border-primary text-xs font-mono bg-bg-secondary">
                                            {project.category}
                                        </span>
                                        {/* Add tech stack tags here if available in data later */}
                                    </div>
                                </div>

                                <div className="flex gap-4 shrink-0">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-fg-primary text-bg-primary font-bold font-mono text-xs uppercase hover:scale-105 transition-transform rounded-full"
                                        >
                                            <ExternalLink size={16} /> Live Demo
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 border border-border-primary font-bold font-mono text-xs uppercase hover:bg-bg-secondary transition-colors rounded-full"
                                        >
                                            <Github size={16} /> Source
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
