import { motion } from 'framer-motion';
import { Container } from '../ui/Container';

const SERVICES = [
    {
        tag: 'Most requested',
        heading: 'AI Agents & Automation',
        description:
            'Multi-agent pipelines, RAG systems, LangGraph workflows, and intelligent automation. From research agents to production systems that actually ship.',
        chips: ['LangChain', 'LangGraph', 'RAG', 'Python', 'FastAPI'],
    },
    {
        tag: 'Speciality',
        heading: 'Voice AI Systems',
        description:
            'Real-time voice agents with sub-500ms latency. Full pipeline from STT to LLM to TTS — with personas, guardrails, and live dashboards.',
        chips: ['LiveKit', 'Deepgram', 'Groq', 'WebRTC'],
    },
    {
        tag: 'Fast turnaround',
        heading: 'Full Stack MVPs',
        description:
            'Production-ready apps shipped fast. Next.js, PostgreSQL, auth, payments, and real performance — not just a prototype. Last one: 18 days, 290 commits, zero post-launch bugs.',
        chips: ['Next.js', 'TypeScript', 'PostgreSQL', 'Vercel'],
    },
];

export const Services = () => {
    return (
        <section
            id="services"
            className="py-[16vw] md:py-24 bg-fg-primary text-bg-primary relative overflow-hidden"
        >
            <Container className="relative z-10">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-bg-primary/50 text-center block mb-[3vw] md:mb-4"
                >
                    06 / Services
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display font-black text-[10vw] md:text-7xl lg:text-8xl mb-[4vw] md:mb-6 text-center uppercase leading-[0.9] md:leading-none"
                >
                    What I Build
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[3vw] md:text-sm font-mono uppercase tracking-widest text-bg-primary/60 text-center mb-[12vw] md:mb-16"
                >
                    Freelance · Remote · Worldwide
                </motion.p>

                {/* Service cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4vw] md:gap-5 mb-[8vw] md:mb-10">
                    {SERVICES.map((service, i) => (
                        <motion.div
                            key={service.heading}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col p-[6vw] md:p-7 border border-bg-primary/20 rounded-3xl bg-bg-primary/5 backdrop-blur-sm"
                        >
                            {/* Tag */}
                            <span className="self-start font-mono text-[2.2vw] md:text-[10px] uppercase tracking-widest bg-bg-primary/10 border border-bg-primary/20 rounded-full px-[3vw] md:px-3 py-[1vw] md:py-1 mb-[5vw] md:mb-6">
                                {service.tag}
                            </span>

                            <h3 className="font-display font-bold text-[6vw] md:text-2xl mb-[3vw] md:mb-4 tracking-tight leading-tight">
                                {service.heading}
                            </h3>

                            <p className="text-[3.3vw] md:text-sm leading-relaxed opacity-75 mb-[5vw] md:mb-6 flex-1">
                                {service.description}
                            </p>

                            {/* Tech chips */}
                            <div className="flex flex-wrap gap-[2vw] md:gap-2 mb-[5vw] md:mb-6">
                                {service.chips.map(chip => (
                                    <span
                                        key={chip}
                                        className="font-mono text-[2.2vw] md:text-[10px] uppercase tracking-widest border border-bg-primary/20 rounded-full px-[2.5vw] md:px-2.5 py-[1vw] md:py-0.5 opacity-70"
                                    >
                                        {chip}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <a
                                href="https://cal.com/vasu-devs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="self-start font-mono text-[2.8vw] md:text-sm uppercase tracking-widest font-bold opacity-80 hover:opacity-100 transition-opacity"
                            >
                                Let's build →
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-[4vw] md:gap-0 border-t border-bg-primary/20 pt-[6vw] md:pt-8"
                >
                    <span className="font-mono text-[2.8vw] md:text-sm text-bg-primary/60 uppercase tracking-widest">
                        Available for remote projects worldwide
                    </span>

                    <a
                        href="https://cal.com/vasu-devs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-[6vw] md:px-8 py-[3vw] md:py-4 rounded-full font-bold font-mono text-[2.5vw] md:text-base uppercase bg-bg-primary text-fg-primary transition-opacity hover:opacity-90 whitespace-nowrap"
                    >
                        Book a free call
                    </a>
                </motion.div>
            </Container>
        </section>
    );
};
