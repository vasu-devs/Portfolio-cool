import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

interface ResumeButtonProps {
    className?: string;
    showLabel?: boolean;
    onClick?: () => void;
}

// Custom Animated Eye SVG Component
const AnimatedEye = () => {
    return (
        <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible md:w-5 md:h-5"
        >
            {/* Eye outline - the open eye shape */}
            <motion.path
                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                variants={{
                    initial: { opacity: 0 },
                    hover: { opacity: 1 }
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Closed eye lid - curved line pointing down (visible when closed) */}
            <motion.path
                d="M2 12C2 12 5 16 12 16C19 16 22 12 22 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                variants={{
                    initial: { opacity: 1 },
                    hover: { opacity: 0 }
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Eyelashes on the closed lid - pointing downward */}
            <motion.g
                variants={{
                    initial: { opacity: 1 },
                    hover: { opacity: 0 }
                }}
                transition={{ duration: 0.2 }}
            >
                <line x1="6" y1="14.5" x2="5" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="16" x2="8.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="16.5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="16" x2="15.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="14.5" x2="19" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>

            {/* Iris circle */}
            <motion.circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                variants={{
                    initial: { scale: 0, opacity: 0 },
                    hover: { scale: 1, opacity: 1 }
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
            />

            {/* Pupil - filled circle */}
            <motion.circle
                cx="12"
                cy="12"
                r="1.5"
                fill="currentColor"
                variants={{
                    initial: { scale: 0, opacity: 0 },
                    hover: { scale: 1, opacity: 1 }
                }}
                transition={{ duration: 0.3, delay: 0.15 }}
            />

            {/* Pupil highlight/shine */}
            <motion.circle
                cx="13"
                cy="11"
                r="0.5"
                fill="var(--bg-primary)"
                variants={{
                    initial: { scale: 0, opacity: 0 },
                    hover: { scale: 1, opacity: 1 }
                }}
                transition={{ duration: 0.2, delay: 0.2 }}
            />
        </motion.svg>
    );
};

export const ResumeButton = ({ className = "", showLabel = true, onClick }: ResumeButtonProps) => {
    const handleClick = (e?: React.MouseEvent) => {
        if (onClick) {
            e?.preventDefault();
            onClick();
        }
    };

    return (
        <MagneticButton onClick={handleClick}>
            <motion.a
                href="https://drive.google.com/file/d/105PfA58-Eonq0lGmC0V8SnMOWsqlm-G6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                initial="initial"
                whileHover="hover"
                animate="initial"
                className={`group relative flex items-center gap-3 px-4 py-3 md:px-8 md:py-4 rounded-full border border-fg-primary/10 bg-fg-primary/[0.03] backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-fg-primary/30 font-mono text-xs uppercase tracking-widest ${className}`}
            >
                {/* Hover Background Expansion */}
                <div className="absolute inset-0 bg-fg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76, 0, 0.24, 1]" />

                <div className="relative flex items-center justify-center z-10 group-hover:text-bg-primary transition-colors duration-500">
                    <AnimatedEye />
                    {/* Glow effect on hover */}
                    <motion.div
                        className="absolute inset-0 bg-current/20 blur-lg rounded-full"
                        variants={{
                            initial: { opacity: 0, scale: 0.5 },
                            hover: { opacity: 0.6, scale: 1.5 }
                        }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                {showLabel && (
                    <span className="relative z-10 group-hover:text-bg-primary transition-colors duration-500">
                        Resume
                    </span>
                )}
            </motion.a>
        </MagneticButton>
    );
};
