import { ArrowUpRight, GitPullRequest, Star, GitCommit } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ContributionGraph } from '../ui/ContributionGraph';
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
const FEATURED = [
    {
        url: 'https://github.com/lingdojo/kana-dojo',
        title: 'lingdojo/kana-dojo',
        label: '4 PRs merged · design system',
        description: 'Authored four themes — Wabi, Wasabi Garden, Mirage Solis, Moonlit Waterfall — plus design documentation. Recurring contributor across the theme system.',
    },
    {
        url: 'https://github.com/EbookFoundation/free-programming-books',
        title: 'EbookFoundation/free-programming-books',
        label: '275k★ · developer resources',
        description: "Added FastAPI to the programming cheatsheets index in EbookFoundation's famously selective collection.",
    },
    {
        url: 'https://github.com/pqoqubbw/icons',
        title: 'pqoqubbw/icons',
        label: 'animated icon library',
        description: 'Contributed an animated corner-down-left icon with a path-draw animation to one of the most popular animated-icon libraries.',
    },
];

const AnimatedCounter = ({
    value,
    duration = 1500,
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

export const OssImpact = ({ stats, isLoading = false }: OssImpactProps) => {
    const totalPrs = ossData.totalPrs ?? 0;
    const repoCount = ossData.byRepo ? Object.keys(ossData.byRepo).length : 0;

    return (
        <section id="open-source" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="04"
                    label="open source"
                    title="Public by default"
                    sub={`${totalPrs} merged PRs across ${repoCount} external repositories, plus a year of daily commits.`}
                />

                {/* Live stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border-primary border border-border-primary rounded-lg overflow-hidden mb-5">
                    {[
                        { icon: GitCommit, label: 'contributions, last year', value: stats.commits, suffix: '+' },
                        { icon: Star, label: 'stars earned', value: stats.stars, suffix: '' },
                        { icon: GitPullRequest, label: 'pull requests', value: stats.prs, suffix: '' },
                    ].map((s) => (
                        <div key={s.label} className="bg-bg-primary px-5 py-4 flex items-center gap-4">
                            <s.icon size={18} className="text-accent shrink-0" />
                            <div>
                                <div className="font-display font-semibold text-2xl leading-none mb-1 tabular-nums">
                                    {isLoading || s.value === 0 ? (
                                        <span className="inline-block w-14 h-6 rounded bg-bg-secondary animate-pulse" />
                                    ) : (
                                        <AnimatedCounter value={s.value} suffix={s.suffix} />
                                    )}
                                </div>
                                <div className="font-mono text-[10px] text-fg-secondary">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Self-rendered contribution heatmap */}
                <div className="mb-8">
                    <ContributionGraph username="vasu-devs" />
                </div>

                {/* Featured contributions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {FEATURED.map((c) => (
                        <a
                            key={c.url}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border border-border-primary rounded-xl bg-bg-primary p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <span className="font-mono text-[10px] text-fg-secondary uppercase tracking-wider">
                                    {c.label}
                                </span>
                                <ArrowUpRight size={13} className="shrink-0 text-fg-secondary group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="font-display font-semibold text-[15px] tracking-tight mb-2 break-all group-hover:text-accent transition-colors duration-300">
                                {c.title}
                            </h3>
                            <p className="text-[13px] text-fg-secondary leading-relaxed">
                                {c.description}
                            </p>
                        </a>
                    ))}
                </div>
            </Container>
        </section>
    );
};
