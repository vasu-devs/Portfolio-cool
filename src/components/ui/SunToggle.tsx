import { motion, AnimatePresence } from 'framer-motion';

interface SunToggleProps {
    theme: 'light' | 'dark';
    isInverted?: boolean;
}

export const SunToggle = ({ theme, isInverted }: SunToggleProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative p-2 rounded-full cursor-pointer transition-colors duration-300 overflow-hidden
                ${isInverted
                    ? 'hover:bg-bg-primary/20'
                    : 'hover:bg-fg-primary/10'}
            `}
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    style={{
                        filter: theme === 'dark' && !isInverted
                            ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5)) drop-shadow(0 0 4px rgba(0,0,0,0.3))'
                            : 'none'
                    }}
                >
                    <mask id="moon-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <motion.circle
                            animate={theme === 'light' ? { cx: 24, cy: 0 } : { cx: 16, cy: 8 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            r="9"
                            fill="black"
                        />
                    </mask>

                    {/* Core Body (Sun/Moon) */}
                    <motion.circle
                        cx="12"
                        cy="12"
                        animate={theme === 'light' ? {
                            r: 5,
                            fill: '#000000',
                            stroke: '#ffffff',
                            strokeWidth: 2
                        } : {
                            r: 9,
                            // In dark mode: if inverted (light bg), use dark color. Otherwise use light color.
                            fill: isInverted ? '#050505' : 'currentColor',
                            stroke: isInverted ? '#050505' : 'currentColor',
                            strokeWidth: 0
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        mask="url(#moon-mask)"
                    />

                    {/* Sun Rays */}
                    <AnimatePresence>
                        {theme === 'light' && (
                            <motion.g
                                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0, rotate: 45 }}
                                transition={{ duration: 0.4, ease: "backOut" }}
                            >
                                {/* White outline for rays */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.line
                                        key={`outline-${i}`}
                                        x1="12"
                                        y1="3.5"
                                        x2="12"
                                        y2="0.5"
                                        stroke="#ffffff"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        transform={`rotate(${i * 45} 12 12)`}
                                    />
                                ))}
                                {/* Black rays on top */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.line
                                        key={i}
                                        x1="12"
                                        y1="3.5"
                                        x2="12"
                                        y2="0.5"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        transform={`rotate(${i * 45} 12 12)`}
                                    />
                                ))}
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Glow for Sun */}
                <AnimatePresence>
                    {theme === 'light' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 blur-xl rounded-full -z-10"
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
