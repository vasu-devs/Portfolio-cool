import { motion } from 'framer-motion';

interface SideBrandingProps {
    isInverted: boolean;
}

export const SideBranding = ({ isInverted }: SideBrandingProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-[40] hidden xl:block pointer-events-none select-none transition-colors duration-500"
        >
            <div className="flex flex-col items-center gap-12">
                {/* Vertical Text */}
                <div
                    className={`font-mono text-[10px] uppercase tracking-[0.8em] whitespace-nowrap transition-colors duration-500 ${isInverted
                        ? 'text-bg-primary'
                        : 'text-fg-secondary/50'
                        }`}
                    style={{ writingMode: 'vertical-rl' }}
                >
                    VASU-DEVS
                </div>

                {/* Decorative Line */}
                <div className={`w-px h-24 bg-gradient-to-b transition-colors duration-500 ${isInverted
                    ? 'from-bg-primary to-transparent'
                    : 'from-border-primary to-transparent'
                    }`} />
            </div>
        </motion.div>
    );
};
