import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
    finishLoading: () => void;
    theme?: 'light' | 'dark';
}

export const Preloader = ({ finishLoading }: PreloaderProps) => {
    const [phase, setPhase] = useState<'text' | 'exit'>('text');

    useEffect(() => {
        // Reduced duration: Text visible for 1.2s (including entry)
        const timer = setTimeout(() => {
            setPhase('exit');
        }, 1200);

        // Cleanup after exit animation (0.8s exit)
        const cleanup = setTimeout(() => {
            finishLoading();
        }, 2100);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanup);
        };
    }, [finishLoading]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
            {/* Top Shutter - Slides UP */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: phase === 'exit' ? "-100%" : 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="h-[50vh] w-full bg-fg-primary relative z-20 flex items-end justify-center overflow-hidden border-b border-bg-primary/10"
            >
                {/* Text Container Top */}
                <div className="overflow-hidden mb-[-0.5vw] md:mb-[-1vw] pb-2">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }} // Keep at 0 so it stays visible until panel moves
                        transition={{
                            y: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                            delay: 0.1
                        }}
                        className="text-[15vw] leading-none font-black tracking-tighter text-bg-primary font-display translate-y-[50%]"
                    >
                        VASU
                    </motion.h1>
                </div>
            </motion.div>

            {/* Bottom Shutter - Slides DOWN */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: phase === 'exit' ? "100%" : 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="h-[50vh] w-full bg-black relative z-20 flex items-start justify-center overflow-hidden border-t border-white/10"
            >
                {/* Text Container Bottom */}
                <div className="overflow-hidden mt-[-0.5vw] md:mt-[-1vw] pt-2">
                    <motion.h1
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        transition={{
                            y: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                            delay: 0.1
                        }}
                        className="text-[15vw] leading-none font-black tracking-tighter text-white font-display -translate-y-[50%]"
                    >
                        DEVS
                    </motion.h1>
                </div>
            </motion.div>
        </div>
    );
};
