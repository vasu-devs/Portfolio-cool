import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ResumeButtonProps {
    className?: string;
    showLabel?: boolean;
}

export const ResumeButton = ({ className = "", showLabel = true }: ResumeButtonProps) => {
    return (
        <MagneticButton>
            <a
                href="https://drive.google.com/file/d/105PfA58-Eonq0lGmC0V8SnMOWsqlm-G6/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-8 py-4 rounded-full border border-border-primary bg-bg-primary/50 backdrop-blur hover:bg-fg-primary hover:text-bg-primary transition-all group font-mono text-xs uppercase tracking-widest relative overflow-hidden ${className}`}
            >
                <div className="relative flex items-center justify-center">
                    {/* The "Eye" - Closed by default, Opens on hover */}
                    <motion.div
                        className="relative z-10"
                        initial="initial"
                        whileHover="hover"
                        animate="initial"
                    >
                        {/* Eye Lids/Frame */}
                        <motion.div
                            variants={{
                                initial: { scaleY: 0, opacity: 0.3 },
                                hover: { scaleY: 1, opacity: 1 }
                            }}
                            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                        >
                            <Eye size={18} />
                        </motion.div>

                        {/* Pupil Glow */}
                        <motion.div
                            className="absolute inset-0 bg-accent-primary/40 blur-md rounded-full"
                            variants={{
                                initial: { opacity: 0, scale: 0 },
                                hover: { opacity: 1, scale: 1.2 }
                            }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.div>
                </div>
                {showLabel && <span className="relative z-10">Resume</span>}
            </a>
        </MagneticButton>
    );
};
