import { motion } from 'framer-motion';


export const SideBranding = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="fixed right-3 md:right-6 top-[40%] -translate-y-1/2 z-[40] hidden xl:block pointer-events-none select-none mix-blend-difference"
        >
            <div className="flex flex-col items-center gap-12">
                {/* Vertical Text */}
                <div
                    className="font-mono text-[10px] uppercase tracking-[0.8em] whitespace-nowrap text-white"
                    style={{ writingMode: 'vertical-rl' }}
                >
                    VASU-DEVS
                </div>

                {/* Decorative Line */}
                <div className="w-px h-24 bg-white" />
            </div>
        </motion.div>
    );
};
