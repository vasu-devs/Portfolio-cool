import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
    finishLoading: () => void;
    theme?: 'light' | 'dark';
}

export const Preloader = ({ finishLoading }: PreloaderProps) => {
    const [phase, setPhase] = useState<'text' | 'exit'>('text');

    useEffect(() => {
        // Text visible for 1.0s (Quick reveal)
        const timer = setTimeout(() => {
            setPhase('exit');
        }, 1000);

        // Cleanup after exit animation (1.5s exit -> wait 2.5s total)
        const cleanup = setTimeout(() => {
            finishLoading();
        }, 2500);

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
                transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1] }}
                className="h-[50vh] w-full bg-fg-primary relative z-20 flex items-end justify-center overflow-hidden border-b border-bg-primary/10"
            >
                {/* Text Container Top */}
                <div className="overflow-hidden mb-[-0.5vw] md:mb-[-1vw] pb-2 px-4">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{
                            y: phase === 'exit' ? "50%" : 0, // Moves slightly down while container moves up (Parallax)
                            opacity: phase === 'exit' ? 0 : 1
                        }}
                        transition={{
                            duration: 1.5,
                            ease: [0.87, 0, 0.13, 1],
                            opacity: { duration: 0.8, delay: 0.2 }
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
                transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1] }}
                className="h-[50vh] w-full bg-black relative z-20 flex items-start justify-center overflow-hidden border-t border-white/10"
            >
                {/* Text Container Bottom */}
                <div className="overflow-hidden mt-[-0.5vw] md:mt-[-1vw] pt-2 px-4">
                    <motion.h1
                        initial={{ y: "-100%" }}
                        animate={{
                            y: phase === 'exit' ? "-50%" : 0, // Moves slightly up while container moves down (Parallax)
                            opacity: phase === 'exit' ? 0 : 1
                        }}
                        transition={{
                            duration: 1.5,
                            ease: [0.87, 0, 0.13, 1],
                            opacity: { duration: 0.8, delay: 0.2 }
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
