import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";
import { useEffect } from "react";

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeUrl: string;
}

export const ResumeModal = ({ isOpen, onClose, resumeUrl }: ResumeModalProps) => {
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

    // Convert view link to preview link for embedding
    const embedUrl = resumeUrl.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');

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
                        className="relative w-full max-w-5xl bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-border-primary bg-bg-primary/50 backdrop-blur-md z-10">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-widest text-fg-secondary">
                                    Curriculum Vitae
                                </span>
                                <h3 className="font-display font-bold text-xl md:text-2xl">My Resume</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary text-fg-secondary hover:text-fg-primary"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={20} />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Resume Content (Iframe) */}
                        <div className="flex-1 bg-zinc-900 relative">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                title="Resume Preview"
                                allow="autoplay"
                            />
                        </div>

                        {/* Footer (Optional) */}
                        <div className="p-4 bg-bg-primary/50 backdrop-blur-md border-t border-border-primary flex justify-center md:hidden">
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2 bg-fg-primary text-bg-primary font-bold font-mono text-xs uppercase rounded-full"
                            >
                                <Download size={16} /> Download PDF
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
