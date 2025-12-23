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
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={14} />,
            detail: 'vasudev-siddh',
            href: 'https://www.linkedin.com/in/vasudev-siddh/',
        },
        {
            name: 'X (Twitter)',
            icon: <Twitter size={14} />,
            detail: '@Vasu_DevS',
            href: 'https://twitter.com/Vasu_DevS',
        },
        {
            name: 'Cal.com',
            icon: <Calendar size={14} />,
            detail: 'Book a session',
            href: 'https://cal.com/vasudev-siddh-bjemxn',
        }
    ];

    return (
        <div className="fixed top-4 right-4 md:top-8 md:right-10 z-[70] select-none font-mono" ref={containerRef}>
            {/* Status Pill Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border transition-all duration-500 pointer-events-auto cursor-pointer shadow-2xl
                    ${isOpen
                        ? (isInverted ? 'bg-fg-primary text-bg-primary border-bg-primary ring-8 ring-emerald-500/10' : 'bg-fg-primary text-bg-primary border-fg-primary ring-8 ring-emerald-500/10')
                        : (isInverted
                            ? 'bg-fg-primary/95 text-bg-primary border-bg-primary/30 backdrop-blur-3xl hover:bg-fg-primary ring-emerald-500/5 hover:ring-8'
                            : 'bg-bg-primary/95 text-fg-primary border-border-primary/50 backdrop-blur-3xl hover:border-fg-primary/30 ring-emerald-500/5 hover:ring-8')
                    }`}
            >
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </span>
                <div className="flex flex-col items-start translate-y-[1px]">
                    <span className={`text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black leading-none mb-0.5 md:mb-1 
                        ${isOpen
                            ? (isInverted ? 'text-bg-primary/60' : 'text-bg-primary/60')
                            : (isInverted ? 'text-bg-primary/60' : 'text-fg-secondary/60')}`}
                    >
                        Open To Work
                    </span>
                    <span className={`text-[9px] md:text-[14px] uppercase tracking-[0.1em] font-black leading-none 
                        ${isOpen
                            ? (isInverted ? 'text-bg-primary' : 'text-bg-primary')
                            : (isInverted ? 'text-bg-primary' : 'text-fg-primary')}`}
                    >
                        Hire Me
                    </span>
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute top-full right-0 mt-4 w-[280px] md:w-[320px] max-w-[calc(100vw-2rem)] backdrop-blur-3xl border rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden z-[71]
                            ${isInverted ? 'bg-fg-primary/90 text-bg-primary border-bg-primary/10' : 'bg-bg-primary/90 text-fg-primary border-white/10'}
                        `}
                    >
                        {/* Premium Inner Glow */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                            <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-10`} />
                        </div>

                        <div className="p-4 md:p-6">
                            <div className={`px-2 pb-4 border-b mb-4 flex items-center justify-between transition-colors duration-500 ${isInverted ? 'border-bg-primary/5' : 'border-fg-primary/5'}`}>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-40 ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>Initialize Connection</span>
                                    <span className={`text-[7px] md:text-[8px] font-mono opacity-20 font-bold ${isInverted ? 'text-bg-primary' : ''}`}>PROTO_77_STABLE</span>
                                </div>
                                <div className={`p-2 rounded-full border border-emerald-500/20 bg-emerald-500/10`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {contactLinks.map((link, i) => (
                                    <motion.a
                                        key={i}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.2 }}
                                        className={`flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 group pointer-events-auto border border-transparent
                                            ${isInverted
                                                ? 'hover:bg-bg-primary/5 hover:border-bg-primary/5'
                                                : 'hover:bg-fg-primary/5 hover:border-fg-primary/5'}
                                        `}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <ChevronRight size={14} className={`opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`} />
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>{link.name}</span>
                                                <span className={`text-[9px] md:text-[10px] opacity-40 group-hover:opacity-100 transition-opacity truncate max-w-[150px] md:max-w-[200px] font-medium ${isInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>
                                                    {link.detail}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl transition-all duration-500 group-hover:scale-110 ${isInverted ? 'bg-bg-primary/5 text-bg-primary group-hover:bg-bg-primary group-hover:text-fg-primary' : 'bg-fg-primary/5 text-fg-primary group-hover:bg-fg-primary group-hover:text-bg-primary'}`}>
                                            {link.icon}
                                        </div>
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
village
