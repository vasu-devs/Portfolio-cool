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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[6vw] md:gap-[2vw]">
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
                            className="flex flex-col items-center justify-center p-[8vw] md:p-[3vw] border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm"
                        >
                            <div className="mb-[4vw] md:mb-[1.5vw] opacity-80">
                                <stat.icon className="w-[8vw] h-[8vw] md:w-[3vw] md:h-[3vw]" />
                            </div>
                            <span className="font-display font-bold text-[9vw] md:text-[4vw] mb-[1vw] md:mb-[0.5vw]">{stat.value}</span>
                            <span className="font-mono text-[2.5vw] md:text-[0.8vw] uppercase tracking-widest opacity-60">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
