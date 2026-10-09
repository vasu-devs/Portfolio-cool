
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AuraClickerProps {
    points: number;
    incrementPoints: (amount: number) => void;
}

interface ClickEffect {
    id: number;
    x: number;
    y: number;
    amount: number;
}

export default function AuraClicker({ points, incrementPoints }: AuraClickerProps) {
    const [clicks, setClicks] = useState<ClickEffect[]>([]);

    const handleClick = useCallback((e: MouseEvent) => {
        // Aesthetic: Only farm aura if not clicking on interactive elements (buttons, links)
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a') || target.closest('input')) return;

        const amount = 10; // Base aura per click
        incrementPoints(amount);

        const newClick = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            amount
        };

        setClicks(prev => [...prev, newClick]);

        // Cleanup click effect
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== newClick.id));
        }, 1000);
    }, [incrementPoints]);

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {/* Persistent Counter UI */}
            <div className="fixed top-6 right-6 pointer-events-auto">
                <div className="glass px-6 py-3 rounded-full flex items-center gap-3 bg-black/40 border border-aura-purple/30 shadow-[0_0_15px_rgba(138,43,226,0.3)] backdrop-blur-md">
                    <div className="w-3 h-3 rounded-full bg-aura-purple animate-pulse shadow-[0_0_10px_#8A2BE2]" />
                    <span className="font-display text-xl text-white tracking-widest min-w-[80px] text-right">
                        {points.toLocaleString()}
                    </span>
                    <span className="text-xs text-aura-purple/80 font-mono tracking-widest uppercase">AURA</span>
                </div>
            </div>

            {/* Click Effects */}
            <AnimatePresence>
                {clicks.map(click => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 1, y: click.y - 20, x: click.x }}
                        animate={{ opacity: 0, y: click.y - 100 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute flex items-center text-aura-gold font-bold text-xl drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]"
                        style={{ left: 0, top: 0 }} // Position handled by initial/animate x/y
                    >
                        <Plus size={16} className="mr-1" />
                        {click.amount}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
