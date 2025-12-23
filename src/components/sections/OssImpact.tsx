import { motion } from 'framer-motion';
import { GitPullRequest, GitCommit, Star } from 'lucide-react';
import { Container } from '../ui/Container';

interface OssImpactProps {
    stats: {
        stars: number;
        commits: number;
        prs: number;
    };
}

export const OssImpact = ({ stats }: OssImpactProps) => {
    return (
        <section id="oss-impact" className="py-16 md:py-32 bg-fg-primary text-bg-primary relative overflow-hidden">
            <Container className="relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display font-black text-4xl md:text-8xl mb-12 md:mb-24 text-center uppercase leading-[0.9] md:leading-none"
                >
                    Open Source<br />Impact
                </motion.h2>

                {/* Featured Contribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-24 p-6 md:p-8 border border-bg-primary/20 rounded-3xl bg-bg-primary/5 backdrop-blur-sm max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                        <div className="p-4 bg-bg-primary text-fg-primary rounded-xl shrink-0">
                            <GitPullRequest size={24} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-2xl md:text-3xl mb-2">auto-timetable</h3>
                            <p className="font-mono text-[10px] md:text-sm opacity-60 mb-3 md:mb-4 uppercase tracking-wider">Significant Contribution • Core Logic Implementation</p>
                            <p className="text-base md:text-lg leading-relaxed opacity-90">
                                Architected the core scheduling algorithm for SAYOUNCDR's auto-timetable. Optimized constraint satisfaction logic to generate conflict-free schedules efficiently.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { icon: GitCommit, label: "Total Commits", value: `${stats.commits}+`, delay: 0 },
                        { icon: Star, label: "Stars Earned", value: stats.stars, delay: 0.1 },
                        { icon: GitPullRequest, label: "PRs Merged", value: stats.prs, delay: 0.2 }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: stat.delay }}
                            className="flex flex-col items-center justify-center p-8 md:p-12 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm"
                        >
                            <div className="mb-4 md:mb-6 opacity-80">
                                <div className="md:hidden">
                                    <stat.icon size={32} />
                                </div>
                                <div className="hidden md:block">
                                    <stat.icon size={48} />
                                </div>
                            </div>
                            <span className="font-display font-bold text-4xl md:text-6xl mb-1 md:mb-2">{stat.value}</span>
                            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
