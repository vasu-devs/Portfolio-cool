import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Twitter, Calendar, ChevronRight } from 'lucide-react';

interface StatusBadgeProps {
    isInverted?: boolean;
    theme?: 'light' | 'dark';
}

export const StatusBadge = ({ isInverted = false, theme = 'dark' }: StatusBadgeProps) => {
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
                className={`flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border transition-all duration-500 pointer-events-auto cursor-pointer shadow-2xl mix-blend-exclusion
                    ${isOpen
                        ? 'bg-white text-black border-white ring-8 ring-emerald-500/10'
                        : 'bg-white text-black border-white ring-emerald-500/5 hover:ring-8'
                    }`}
            >
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </span>
                <div className="flex flex-col items-start translate-y-[1px]">
                    <span className={`text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black leading-none mb-0.5 md:mb-1 opacity-60`}>
                        Open To Work
                    </span>
                    <span className={`text-[9px] md:text-[14px] uppercase tracking-[0.1em] font-black leading-none`}>
                        Hire Me
                    </span>
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute top-full right-0 mt-4 w-[280px] md:w-[320px] max-w-[calc(100vw-2rem)] backdrop-blur-xl border rounded-[2rem] shadow-lg overflow-hidden z-[71]
                            ${(isInverted || theme === 'light')
                                ? 'bg-white/70 text-black border-black/10'
                                : 'bg-black/70 text-white border-white/10'}
                        `}
                    >
                        <div className="p-4 md:p-6 relative z-10">
                            <div className={`px-2 pb-4 border-b mb-4 flex items-center justify-between transition-colors duration-500 ${(isInverted || theme === 'light') ? 'border-black/5' : 'border-white/5'}`}>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-40 ${(isInverted || theme === 'light') ? 'text-black' : 'text-white'}`}>Initialize Connection</span>
                                    <span className={`text-[7px] md:text-[8px] font-mono opacity-20 font-bold ${(isInverted || theme === 'light') ? 'text-black' : 'text-white'}`}>PROTO_77_STABLE</span>
                                </div>
                                <div className={`p-2 rounded-full border ${(isInverted || theme === 'light') ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
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
                                            ${(isInverted || theme === 'light')
                                                ? 'hover:bg-black/5 hover:border-black/5'
                                                : 'hover:bg-white/5 hover:border-white/5'}
                                        `}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <ChevronRight size={14} className={`opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 ${(isInverted || theme === 'light') ? 'text-black' : 'text-white'}`} />
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${(isInverted || theme === 'light') ? 'text-black' : 'text-white'}`}>{link.name}</span>
                                                <span className={`text-[9px] md:text-[10px] opacity-40 group-hover:opacity-100 transition-opacity truncate max-w-[150px] md:max-w-[200px] font-medium ${(isInverted || theme === 'light') ? 'text-black' : 'text-white'}`}>
                                                    {link.detail}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl transition-all duration-500 group-hover:scale-110 ${(isInverted || theme === 'light') ? 'bg-black/5 text-black group-hover:bg-black group-hover:text-white' : 'bg-white/5 text-white group-hover:bg-white group-hover:text-black'}`}>
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
