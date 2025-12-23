import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Twitter, Calendar, ChevronRight } from 'lucide-react';

interface StatusBadgeProps {
    isInverted?: boolean;
}

export const StatusBadge = ({ isInverted = false }: StatusBadgeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const contactLinks = [
        {
            name: 'Gmail',
            icon: <Mail size={14} />,
            detail: 'siddhvasudev1402@gmail.com',
            href: 'mailto:siddhvasudev1402@gmail.com',
            color: 'hover:bg-fg-primary/10 hover:border-border-primary/50'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={14} />,
            detail: 'vasudev-siddh',
            href: 'https://www.linkedin.com/in/vasudev-siddh/',
            color: 'hover:bg-fg-primary/10 hover:border-border-primary/50'
        },
        {
            name: 'X (Twitter)',
            icon: <Twitter size={14} />,
            detail: '@Vasu_DevS',
            href: 'https://twitter.com/Vasu_DevS',
            color: 'hover:bg-fg-primary/10 hover:border-border-primary/50'
        },
        {
            name: 'Cal.com',
            icon: <Calendar size={14} />,
            detail: 'Book a session',
            href: 'https://cal.com/vasudev-siddh-bjemxn',
            color: 'hover:bg-fg-primary/10 hover:border-border-primary/50'
        }
    ];

    return (
        <div className="fixed top-8 left-10 z-[70] hidden xl:block select-none font-mono" ref={containerRef}>
            {/* Status Pill Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg
                    ${isOpen
                        ? (isInverted ? 'bg-fg-primary/90 text-bg-primary border-bg-primary ring-4 ring-bg-primary/20 backdrop-blur-xl' : 'bg-fg-primary text-bg-primary border-fg-primary ring-4 ring-fg-primary/10')
                        : (isInverted
                            ? 'bg-fg-primary/80 text-bg-primary border-bg-primary/50 backdrop-blur-xl hover:bg-fg-primary/90'
                            : 'bg-bg-primary/80 text-fg-primary border-border-primary backdrop-blur-xl hover:border-fg-primary/50')
                    }`}
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                </span>
                <div className="flex flex-col items-start translate-y-[1px]">
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold leading-none ${isOpen ? (isInverted ? 'text-bg-primary/70' : 'text-bg-secondary/70') : (isInverted ? 'text-bg-primary/80' : 'text-fg-secondary')}`}>
                        System_Status
                    </span>
                    <span className={`text-xs uppercase tracking-[0.1em] font-black leading-none mt-1 ${isInverted ? 'text-bg-primary' : ''}`}>
                        Open to work
                    </span>
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className={`absolute top-full left-0 mt-4 w-80 backdrop-blur-2xl border rounded-[2rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.4)] overflow-hidden z-[71]
                            ${isInverted ? 'bg-fg-primary/95 text-bg-primary border-bg-primary/20' : 'bg-bg-primary/98 text-fg-primary border-border-primary'}
                        `}
                    >
                        {/* Subtle Top Edge Glow */}
                        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent ${isInverted ? 'via-bg-primary/10' : 'via-fg-primary/20'}`} />

                        <div className="p-4 pt-6">
                            <div className={`px-3 pb-3 border-b mb-3 flex items-center justify-between ${isInverted ? 'border-bg-primary/10' : 'border-border-primary/20'}`}>
                                <span className={`text-[10px] uppercase tracking-[0.25em] font-black opacity-80 ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>Initialize Connection</span>
                                <span className={`text-[8px] font-mono opacity-50 font-bold ${isInverted ? 'text-bg-primary' : ''}`}>STABLE_V1</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                {contactLinks.map((link, i) => (
                                    <motion.a
                                        key={i}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group pointer-events-auto border border-transparent
                                            ${isInverted
                                                ? 'hover:bg-bg-primary/10'
                                                : 'hover:bg-fg-primary/5'}
                                        `}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl group-hover:bg-transparent transition-all duration-300 ${isInverted ? 'bg-bg-primary/5 text-bg-primary' : 'bg-fg-primary/5 text-fg-primary'}`}>
                                                {link.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[11px] font-black uppercase tracking-wider ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>{link.name}</span>
                                                <span className={`text-[10px] transition-opacity truncate max-w-[180px] font-medium ${isInverted ? 'text-bg-primary/70 group-hover:text-bg-primary' : 'text-fg-primary/70 group-hover:text-fg-primary'}`}>
                                                    {link.detail}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 ${isInverted ? 'text-bg-primary/40' : 'text-fg-primary/40'}`} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
