import { motion } from 'framer-motion';
import { GitPullRequest, GitCommit, Star, Loader2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { useEffect, useState, useRef } from 'react';

interface OssImpactProps {
    stats: {
        stars: number;
        commits: number;
        prs: number;
    };
    isLoading?: boolean;
}

// Animated counter component with easing
const AnimatedCounter = ({ value, duration = 2000, suffix = '' }: { value: number; duration?: number; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const previousValue = useRef(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        const startValue = previousValue.current;
        const endValue = value;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (endValue - startValue) * eased);
            setDisplayValue(currentValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                previousValue.current = endValue;
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value, duration]);

    return <>{displayValue.toLocaleString()}{suffix}</>;
};

// Loading skeleton for stats
const StatSkeleton = () => (
    <div className="flex flex-col items-center justify-center p-[8vw] md:p-[3vw] border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm animate-pulse">
        <div className="mb-[4vw] md:mb-[1.5vw] w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw] bg-bg-primary/20 rounded-full" />
        <div className="w-[15vw] md:w-[6vw] h-[9vw] md:h-[4vw] bg-bg-primary/20 rounded mb-[1vw] md:mb-[0.5vw]" />
        <div className="w-[20vw] md:w-[8vw] h-[2.5vw] md:h-[0.8vw] bg-bg-primary/20 rounded" />
    </div>
);

export const OssImpact = ({ stats, isLoading = false }: OssImpactProps) => {
    return (
        <section id="oss-impact" className="py-[16vw] md:py-[8vw] bg-fg-primary text-bg-primary relative overflow-hidden">
            <Container className="relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display font-black text-[10vw] md:text-[6vw] mb-[12vw] md:mb-[6vw] text-center uppercase leading-[0.9] md:leading-none"
                >
                    Open Source<br />Impact
                </motion.h2>

                {/* Featured Contribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-[16vw] md:mb-[6vw] p-[6vw] md:p-[2vw] border border-bg-primary/20 rounded-3xl bg-bg-primary/5 backdrop-blur-sm max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row gap-[6vw] md:gap-[2vw] items-center text-center md:text-left">
                        <div className="p-[4vw] md:p-[1vw] bg-bg-primary text-fg-primary rounded-xl shrink-0">
                            <GitPullRequest className="w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw]" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-[6vw] md:text-[2vw] mb-[2vw] md:mb-[0.5vw]">auto-timetable</h3>
                            <p className="font-mono text-[2.5vw] md:text-[0.9vw] opacity-60 mb-[3vw] md:mb-[1vw] uppercase tracking-wider">Significant Contribution • Core Logic Implementation</p>
                            <p className="text-[4vw] md:text-[1.2vw] leading-relaxed opacity-90">
                                Architected the core scheduling algorithm for SAYOUNCDR's auto-timetable. Optimized constraint satisfaction logic to generate conflict-free schedules efficiently.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[6vw] md:gap-[2vw]">
                    {isLoading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        [
                            { icon: GitCommit, label: "Total Commits", value: stats.commits, suffix: "+", delay: 0 },
                            { icon: Star, label: "Stars Earned", value: stats.stars, suffix: "", delay: 0.1 },
                            { icon: GitPullRequest, label: "PRs Merged", value: stats.prs, suffix: "", delay: 0.2 }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: stat.delay }}
                                className="flex flex-col items-center justify-center p-[8vw] md:p-[3vw] border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm group hover:bg-bg-primary/10 transition-colors"
                            >
                                <div className="mb-[4vw] md:mb-[1.5vw] opacity-80 group-hover:opacity-100 transition-opacity">
                                    <stat.icon className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw]" />
                                </div>
                                <span className="font-display font-bold text-[9vw] md:text-[4vw] mb-[1vw] md:mb-[0.5vw]">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="font-mono text-[2.5vw] md:text-[0.8vw] uppercase tracking-widest opacity-60">{stat.label}</span>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-center items-center gap-2 mt-[4vw] md:mt-[2vw] text-bg-primary/60">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-mono text-[2.5vw] md:text-[0.7vw] uppercase tracking-widest">Fetching live data...</span>
                    </div>
                )}
            </Container>
        </section>
    );
};
