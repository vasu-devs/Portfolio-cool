import { motion } from 'framer-motion';
import {
    GitPullRequest,
    GitCommit,
    Star,
    Loader2,
    Palette,
    Wand2,
    BookOpen,
    Calendar,
    ArrowUpRight,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { useEffect, useState, useRef } from 'react';
import ossData from '../../data/oss-contributions.json';

interface OssImpactProps {
    stats: {
        stars: number;
        commits: number;
        prs: number;
    };
    isLoading?: boolean;
}

// Hand-curated featured contributions.
// Top tier: shown as big cards.
// Secondary: shown as compact one-line rows.
const FEATURED = [
    {
        repo: 'lingdojo/kana-dojo',
        url: 'https://github.com/lingdojo/kana-dojo',
        label: '4 PRs merged · Design System',
        title: 'kana-dojo',
        icon: Palette,
        description:
            "Authored four themes — Wabi, Wasabi Garden, Mirage Solis and Moonlit Waterfall — plus design documentation. Recurring contributor across the theme system.",
    },
    {
        repo: 'EbookFoundation/free-programming-books',
        url: 'https://github.com/EbookFoundation/free-programming-books',
        label: '275k★ · Developer Resources',
        title: 'free-programming-books',
        icon: BookOpen,
        description:
            "Added FastAPI to the programming cheatsheets index in EbookFoundation's famously selective developer-resource collection.",
    },
    {
        repo: 'pqoqubbw/icons',
        url: 'https://github.com/pqoqubbw/icons',
        label: 'Animated Icon Library',
        title: 'pqoqubbw/icons',
        icon: Wand2,
        description:
            "Contributed an animated corner-down-left icon with a path-draw animation to one of the most popular open-source animated-icon libraries.",
    },
];

const SECONDARY: any[] = [];

const AnimatedCounter = ({
    value,
    duration = 2000,
    suffix = '',
}: {
    value: number;
    duration?: number;
    suffix?: string;
}) => {
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

    return (
        <>
            {displayValue.toLocaleString()}
            {suffix}
        </>
    );
};

const StatSkeleton = () => (
    <div className="flex flex-col items-center justify-center p-[8vw] md:p-8 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm animate-pulse">
        <div className="mb-[4vw] md:mb-4 w-[8vw] h-[8vw] md:w-10 md:h-10 bg-bg-primary/20 rounded-full" />
        <div className="w-[15vw] md:w-24 h-[9vw] md:h-12 bg-bg-primary/20 rounded mb-[1vw] md:mb-2" />
        <div className="w-[20vw] md:w-28 h-[2.5vw] md:h-3 bg-bg-primary/20 rounded" />
    </div>
);

export const OssImpact = ({ stats, isLoading = false }: OssImpactProps) => {
    const totalPrs = ossData.totalPrs ?? 0;
    const repoCount = ossData.byRepo ? Object.keys(ossData.byRepo).length : 0;

    return (
        <section
            id="oss-impact"
            className="py-[16vw] md:py-24 bg-fg-primary text-bg-primary relative overflow-hidden"
        >
            <Container className="relative z-10">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-bg-primary/50 text-center block mb-[3vw] md:mb-4"
                >
                    05 / Community
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display font-black text-[10vw] md:text-7xl lg:text-8xl mb-[4vw] md:mb-6 text-center uppercase leading-[0.9] md:leading-none"
                >
                    Open Source<br />Impact
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[3vw] md:text-sm font-mono uppercase tracking-widest text-bg-primary/60 text-center mb-[12vw] md:mb-16"
                >
                    {totalPrs} merged PRs across {repoCount} external repositories
                </motion.p>

                {/* Top tier: 3 headline contributions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4vw] md:gap-5 mb-[6vw] md:mb-8">
                    {FEATURED.map((c, i) => (
                        <motion.a
                            key={c.repo}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group relative flex flex-col p-[6vw] md:p-7 border border-bg-primary/20 rounded-3xl bg-bg-primary/5 backdrop-blur-sm hover:bg-bg-primary/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4 mb-[5vw] md:mb-6">
                                <div className="p-[3vw] md:p-2.5 bg-bg-primary text-fg-primary rounded-xl shrink-0">
                                    <c.icon className="w-[6vw] h-[6vw] md:w-5 md:h-5" />
                                </div>
                                <span className="shrink-0 w-[8vw] h-[8vw] md:w-9 md:h-9 rounded-full border border-bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-bg-primary group-hover:text-fg-primary group-hover:rotate-45">
                                    <ArrowUpRight className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                </span>
                            </div>

                            <span className="font-mono text-[2.3vw] md:text-[10px] uppercase tracking-widest opacity-60 mb-[2vw] md:mb-3">
                                {c.label}
                            </span>
                            <h3 className="font-display font-bold text-[6vw] md:text-2xl mb-[2vw] md:mb-3 tracking-tight break-all">
                                {c.title}
                            </h3>
                            <p className="text-[3.3vw] md:text-sm leading-relaxed opacity-80">
                                {c.description}
                            </p>
                        </motion.a>
                    ))}
                </div>

                {/* Secondary tier: compact rows */}
                {SECONDARY.length > 0 && (
                    <div className="flex flex-col gap-[3vw] md:gap-3 mb-[14vw] md:mb-20">
                        {SECONDARY.map((c, i) => (
                            <motion.a
                                key={c.repo}
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-5%' }}
                                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                                className="group flex items-center gap-[4vw] md:gap-5 p-[4vw] md:p-4 border border-bg-primary/15 rounded-2xl bg-bg-primary/5 hover:bg-bg-primary/10 transition-colors"
                            >
                                <div className="p-[2.5vw] md:p-2 bg-bg-primary/10 rounded-lg shrink-0">
                                    <c.icon className="w-[5vw] h-[5vw] md:w-4 md:h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-[2vw] md:gap-3 mb-[0.5vw] md:mb-0.5">
                                        <h4 className="font-display font-bold text-[4vw] md:text-base truncate">
                                            {c.title}
                                        </h4>
                                        <span className="font-mono text-[2.3vw] md:text-[10px] uppercase tracking-widest opacity-50 truncate">
                                            {c.repo}
                                        </span>
                                    </div>
                                    <p className="text-[3vw] md:text-sm leading-relaxed opacity-70 line-clamp-1">
                                        {c.description}
                                    </p>
                                </div>
                                <ArrowUpRight className="w-[5vw] h-[5vw] md:w-4 md:h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </motion.a>
                        ))}
                    </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[6vw] md:gap-6">
                    {isLoading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        [
                            { icon: GitCommit, label: 'Total Commits', value: stats.commits, suffix: '+', delay: 0 },
                            { icon: Star, label: 'Stars Earned', value: stats.stars, suffix: '', delay: 0.1 },
                            { icon: GitPullRequest, label: 'PRs Merged', value: stats.prs, suffix: '', delay: 0.2 },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: stat.delay }}
                                className="flex flex-col items-center justify-center p-[8vw] md:p-8 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm group hover:bg-bg-primary/10"
                            >
                                <div className="mb-[4vw] md:mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <stat.icon className="w-[8vw] h-[8vw] md:w-10 md:h-10" />
                                </div>
                                <span className="font-display font-bold text-[9vw] md:text-6xl lg:text-7xl mb-[1vw] md:mb-3">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="font-mono text-[2.5vw] md:text-sm uppercase tracking-widest opacity-60">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))
                    )}
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center gap-2 mt-[4vw] md:mt-6 text-bg-primary/60">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-mono text-[2.5vw] md:text-sm uppercase tracking-widest">
                            Fetching live data...
                        </span>
                    </div>
                )}
            </Container>
        </section>
    );
};
