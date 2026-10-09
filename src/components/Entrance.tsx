
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface EntranceProps {
    onComplete: () => void;
}

export default function Entrance({ onComplete }: EntranceProps) {
    const [step, setStep] = useState<0 | 1 | 2>(0);

    useEffect(() => {
        // Timeline
        // 0: Initial black
        // 1: "WAKE UP" (1s)
        // 2: Glitch out (3s) -> Complete

        const t1 = setTimeout(() => setStep(1), 1000);
        const t2 = setTimeout(() => setStep(2), 2500);
        const t3 = setTimeout(onComplete, 4000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-void-black flex items-center justify-center cursor-none">
            <AnimatePresence>
                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                        className="relative"
                    >
                        <h1 className={`text-6xl md:text-9xl font-display font-bold tracking-widest text-white ${step === 2 ? 'animate-glitch text-warrior-crimson' : ''}`}>
                            WAKE UP
                        </h1>
                        <div className="absolute inset-0 bg-warrior-crimson mix-blend-overlay opacity-0 animate-pulse-fast" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
