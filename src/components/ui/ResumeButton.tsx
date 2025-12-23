import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ResumeButtonProps {
    className?: string;
    showLabel?: boolean;
    onClick?: () => void;
}

export const ResumeButton = ({ className = "", showLabel = true, onClick }: ResumeButtonProps) => {
    const handleClick = (e?: React.MouseEvent) => {
        if (onClick) {
            e?.preventDefault();
            onClick();
        }
    };

    return (
        <MagneticButton onClick={onClick ? () => handleClick() : undefined}>
            <motion.a
                href="https://drive.google.com/file/d/105PfA58-Eonq0lGmC0V8SnMOWsqlm-G6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                initial="initial"
                whileHover="hover"
                animate="initial"
                className={`flex items-center gap-3 px-8 py-4 rounded-full border border-border-primary hover:bg-fg-primary hover:text-bg-primary transition-all group font-mono text-xs uppercase tracking-widest relative overflow-hidden ${className}`}
            >
                <div className="relative flex items-center justify-center">
                    {/* The "Eye" - Closed lid by default, Opens on hover */}
                    <div className="relative z-10">
                        {/* Eye Lids/Frame */}
                        <motion.div
                            variants={{
                                initial: { scaleY: 0.35, opacity: 0.7 },
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
                    </div>
                </div>
                {showLabel && <span className="relative z-10">Resume</span>}
            </motion.a>
        </MagneticButton>
    );
};
