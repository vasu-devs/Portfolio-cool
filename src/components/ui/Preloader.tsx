import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const words = [
    "Hello World",
    "console.log('Welcome')",
    "system.init()",
    "01001000 01100101",
    "Vasu-DevS.exe",
    "Impact. Code. Story."
];

export const Preloader = ({ finishLoading }: { finishLoading: () => void }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Check if preloader has already been shown in this session
        const hasShown = sessionStorage.getItem('preloaderShown');
        if (hasShown) {
            finishLoading();
            return;
        }

        if (index === words.length - 1) {
            setTimeout(() => {
                sessionStorage.setItem('preloaderShown', 'true');
                finishLoading();
            }, 400);
            return;
        }

        const timeout = setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, index === 0 ? 400 : 80);

        return () => clearTimeout(timeout);
    }, [index, finishLoading]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/40 backdrop-blur-2xl"
        >
            {/* Floating Capsule */}
            <motion.div
                initial={{ y: 20 }}
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative flex flex-col items-center"
            >
                {/* Glow behind capsule */}
                <div className="absolute inset-0 bg-accent-primary/20 blur-[100px] rounded-full scale-150" />

                <div className="bg-bg-primary/50 border border-border-primary/50 backdrop-blur-xl rounded-full px-12 py-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6 relative overflow-hidden">
                    <div className="h-[40px] overflow-hidden flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={words[index]}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="text-xl md:text-2xl font-mono font-bold text-fg-primary tracking-[0.2em] whitespace-nowrap"
                            >
                                {words[index]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Minimalist Progress dots */}
                    <div className="flex gap-2">
                        {words.map((_, i) => (
                            <motion.div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${i <= index ? 'w-4 bg-fg-primary' : 'w-1 bg-border-primary'}`}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-fg-secondary animate-pulse"
                >
                    Establishing Connection...
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
