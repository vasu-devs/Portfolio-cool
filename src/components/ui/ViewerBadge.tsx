import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, Activity, Bot } from 'lucide-react';

interface ViewerBadgeProps {
    theme?: 'light' | 'dark';
}

export const ViewerBadge = ({ theme = 'dark' }: ViewerBadgeProps) => {
    const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, onlineNow: 0 });
    const [displayStats, setDisplayStats] = useState({ totalViews: 0, uniqueVisitors: 0, onlineNow: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [overInverted, setOverInverted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const INVERTED_SECTION_IDS = ['experience', 'more-projects', 'oss-impact'];
    const baseIsLight = theme === 'light';
    const isOverLightBg = baseIsLight !== overInverted;

    const NAMESPACE = 'vasudev-live-portfolio-analytics';
    const BASE_VIEWS = 609;
    const BASE_VISITORS = 450;

    useEffect(() => {
        const fetchStats = async (isInitial = false) => {
            if (!isInitial) setIsRefreshing(true);
            try {
                const endpoint = isInitial ? 'up' : 'get';
                const totalRes = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/total_views/${endpoint}`);
                const totalData = await totalRes.json();
                
                let uniqueCount = 0;
                const hasVisited = localStorage.getItem('v_visited');
                
                if (isInitial && !hasVisited) {
                    const uniqueRes = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/unique_visitors/up`);
                    const uniqueData = await uniqueRes.json();
                    uniqueCount = uniqueData.count;
                    localStorage.setItem('v_visited', 'true');
                } else {
                    const uniqueRes = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/unique_visitors`);
                    const uniqueData = await uniqueRes.json();
                    uniqueCount = uniqueData.count;
                }

                const newStats = {
                    totalViews: BASE_VIEWS + (totalData.count || 0),
                    uniqueVisitors: BASE_VISITORS + (uniqueCount || 0),
                    onlineNow: Math.floor(Math.random() * 3) + 2
                };
                
                setStats(newStats);
                if (isInitial) setDisplayStats(newStats);
            } catch (e) {
                console.error("Failed to fetch visitor stats:", e);
                if (isInitial) {
                    const fallback = { totalViews: 609, uniqueVisitors: 450, onlineNow: 1 };
                    setStats(fallback);
                    setDisplayStats(fallback);
                }
            } finally {
                if (isInitial) setIsLoading(false);
                setTimeout(() => setIsRefreshing(false), 1000);
            }
        };

        fetchStats(true);
        const interval = setInterval(() => fetchStats(false), 15000);
        return () => clearInterval(interval);
    }, []);

    // Smooth counter animation
    useEffect(() => {
        const duration = 2000; // 2 seconds to reach the goal
        const steps = 60;
        const intervalTime = duration / steps;
        
        const timer = setInterval(() => {
            setDisplayStats(prev => {
                const update = (current: number, target: number) => {
                    if (current === target) return target;
                    const diff = target - current;
                    const step = Math.ceil(Math.abs(diff) / 10);
                    return diff > 0 ? current + step : current - step;
                };
                
                return {
                    totalViews: update(prev.totalViews, stats.totalViews),
                    uniqueVisitors: update(prev.uniqueVisitors, stats.uniqueVisitors),
                    onlineNow: update(prev.onlineNow, stats.onlineNow)
                };
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [stats]);

    // Fluctuate Online Now more frequently
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                onlineNow: Math.max(1, prev.onlineNow + (Math.random() > 0.5 ? 1 : -1))
            }));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let rafId: number | null = null;
        const check = () => {
            rafId = null;
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;

            let overlaps = INVERTED_SECTION_IDS.some(id => {
                const el = document.getElementById(id);
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.top <= centerY && r.bottom >= centerY;
            });

            if (!overlaps && window.scrollY < window.innerHeight - centerY) {
                overlaps = true;
            }
            setOverInverted(overlaps);
        };

        const onScroll = () => {
            if (rafId === null) rafId = requestAnimationFrame(check);
        };

        check();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

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

    return (
        <div 
            ref={containerRef}
            className="fixed top-[4vw] left-[4vw] md:top-[2vw] md:left-[2.5vw] z-[70] font-mono select-none"
        >
            {/* Main Trigger Pill */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-[2.5vw] md:gap-[0.9vw] px-[5vw] py-[2.5vw] md:px-[1.8vw] md:py-[1vw] rounded-full border backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 pointer-events-auto cursor-pointer
                    ${isOverLightBg
                        ? 'bg-white/70 border-black/10 text-black shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
                        : 'bg-zinc-900/60 border-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)]'}
                `}
            >
                <div className="flex items-center justify-center shrink-0">
                    <motion.div
                        animate={isRefreshing ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
                    >
                        <Bot className={`w-[3.5vw] h-[3.5vw] md:w-[14px] md:h-[14px] ${isOverLightBg ? 'text-black' : 'text-white'}`} />
                    </motion.div>
                </div>
                <span className={`text-[2.2vw] md:text-xs uppercase tracking-[0.15em] font-black leading-tight translate-y-[0.5px]
                    ${isOverLightBg ? 'text-black' : 'text-white'}`}>
                    {isLoading ? '---' : displayStats.totalViews.toLocaleString()} <span className="opacity-40">Views</span>
                </span>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute top-full left-0 mt-[4vw] md:mt-[1vw] w-[70vw] md:w-[22vw] max-w-[calc(100vw-2rem)] backdrop-blur-xl border rounded-[2rem] shadow-lg overflow-hidden z-[71]
                            ${isOverLightBg
                                ? 'bg-white/70 text-black border-black/10'
                                : 'bg-black/70 text-white border-white/10'}
                        `}
                    >
                        <div className="p-[4vw] md:p-[1.5vw] relative z-10">
                            {/* Header */}
                            <div className={`px-[2vw] md:px-[0.5vw] pb-[4vw] md:pb-[1vw] border-b mb-[4vw] md:mb-[1vw] flex items-center justify-between transition-colors duration-300 ${isOverLightBg ? 'border-black/5' : 'border-white/5'}`}>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[2.25vw] md:text-[0.7vw] uppercase tracking-[0.3em] font-black opacity-40 ${isOverLightBg ? 'text-black' : 'text-white'}`}>Traffic Insights</span>
                                    <span className={`text-[1.75vw] md:text-[0.6vw] font-mono opacity-20 font-bold ${isOverLightBg ? 'text-black' : 'text-white'}`}>
                                        {isRefreshing ? 'REFRESHING_DATA...' : 'LIVE_FETCH_STABLE'}
                                    </span>
                                </div>
                                <div className={`p-[2vw] md:p-[0.5vw] rounded-full border ${isOverLightBg ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
                                    <div className={`w-[1.5vw] h-[1.5vw] md:w-[0.4vw] md:h-[0.4vw] rounded-full bg-emerald-500 ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`} />
                                </div>
                            </div>

                            {/* Stats Rows */}
                            <div className="flex flex-col gap-[2vw] md:gap-[0.5vw]">
                                {[
                                    { name: 'Online Now', value: `${displayStats.onlineNow} ACTIVE`, icon: <Activity size={14} />, color: 'text-emerald-500' },
                                    { name: 'Unique Visitors', value: displayStats.uniqueVisitors.toLocaleString(), icon: <Users size={14} /> },
                                    { name: 'Total Views', value: displayStats.totalViews.toLocaleString(), icon: <Eye size={14} /> }
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-between p-[3vw] md:p-[1vw] rounded-2xl border border-transparent transition-all duration-300
                                            ${isOverLightBg
                                                ? 'hover:bg-black/5 hover:border-black/5'
                                                : 'hover:bg-white/5 hover:border-white/5'}
                                        `}
                                    >
                                        <div className="flex items-center gap-[4vw] md:gap-[1vw]">
                                            <div className={`p-[2vw] md:p-[0.75vw] rounded-xl ${isOverLightBg ? 'bg-black/5 text-black' : 'bg-white/5 text-white'}`}>
                                                {stat.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[2.25vw] md:text-[0.7vw] uppercase tracking-wider font-bold opacity-40 ${isOverLightBg ? 'text-black' : 'text-white'}`}>
                                                    {stat.name}
                                                </span>
                                                <span className={`text-[2.5vw] md:text-[0.9vw] font-black ${stat.color || ''} ${isOverLightBg ? 'text-black' : 'text-white'}`}>
                                                    {stat.value}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer text */}
                            <div className="mt-4 pt-4 border-t border-current/5 opacity-20 text-[1.5vw] md:text-[0.5vw] uppercase tracking-widest text-center">
                                Analytics seeded from Vercel history
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
