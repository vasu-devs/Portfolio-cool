import { motion } from 'framer-motion';

export const SideBranding = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute right-3 md:right-6 inset-y-0 z-[40] hidden xl:block pointer-events-none select-none mix-blend-difference"
        >
            {/* VASU-DEVS — entirely in upper half, anchored just above the 44% split */}
            <div
                className="absolute right-0 font-mono text-[10px] uppercase tracking-[0.8em] whitespace-nowrap text-white"
                style={{
                    writingMode: 'vertical-rl',
                    bottom: 'calc(56% + 24px)',
                }}
            >
                VASU-DEVS
            </div>

            {/* Decorative line — entirely in lower half, anchored just below the 44% split */}
            <div
                className="absolute right-0 w-px h-24 bg-white"
                style={{ top: 'calc(44% + 24px)' }}
            />
        </motion.div>
    );
};
