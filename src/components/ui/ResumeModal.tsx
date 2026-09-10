import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";
import { CopyButton } from "./CopyButton";


interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeUrl: string;
}

export const ResumeModal = ({ isOpen, onClose, resumeUrl }: ResumeModalProps) => {
    const dialogRef = useDialog(isOpen, onClose);

    // Convert view link to preview link for embedding
    const embedUrl = resumeUrl.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');

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
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="resume-title"
                        ref={dialogRef}
                        tabIndex={-1}
                        className="relative w-full max-w-[90vw] md:max-w-[70vw] bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-[4vw] md:p-[1.5vw] border-b border-border-primary bg-bg-primary/50 backdrop-blur-md z-10">
                            <div>
                                <span className="font-mono text-[2.5vw] md:text-[0.8vw] uppercase tracking-widest text-fg-secondary">
                                    AI & Full-Stack Engineering
                                </span>
                                <h3 id="resume-title" className="font-display font-bold text-[5vw] md:text-2xl">Vasudev Siddh</h3>
                            </div>
                             <div className="flex items-center gap-[2vw] md:gap-[0.5vw]">
                                <CopyButton text={new URL(resumeUrl, window.location.origin).href} className="flex" />
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-[2vw] md:p-[0.5vw] rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary text-fg-secondary hover:text-fg-primary"
                                    title="Open in new tab"
                                    aria-label="Open resume in a new tab"
                                >
                                    <ExternalLink className="w-[5vw] h-[5vw] md:w-[1.25vw] md:h-[1.25vw]" />
                                </a>
                                <button

                                    onClick={onClose}
                                    aria-label="Close resume"
                                    className="p-[2vw] md:p-[0.5vw] rounded-full hover:bg-bg-primary transition-colors border border-transparent hover:border-border-primary"
                                >
                                    <X className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]" />
                                </button>
                            </div>
                        </div>

                        {/* Resume Content (Iframe) */}
                        <div className="flex-1 min-h-0 bg-white relative">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                title="Resume Preview"
                            />
                        </div>

                        <div className="p-4 bg-bg-primary/50 backdrop-blur-md border-t border-border-primary flex justify-center">
                            <a
                                href="/resume.pdf"
                                download="Vasudev-Siddh-Resume.pdf"
                                className="flex items-center gap-2 px-6 py-3 bg-fg-primary text-bg-primary font-bold font-mono text-sm uppercase rounded-full"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
