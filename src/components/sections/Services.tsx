import { ArrowUpRight, Bot, Mic, Rocket } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

const SERVICES = [
    {
        icon: Bot,
        tag: 'most requested',
        heading: 'AI Agents & Automation',
        description:
            'Multi-agent pipelines, RAG systems, LangGraph workflows, and intelligent automation. From research agents to production systems that actually ship.',
        chips: ['LangChain', 'LangGraph', 'RAG', 'Python', 'FastAPI'],
    },
    {
        icon: Mic,
        tag: 'speciality',
        heading: 'Voice AI Systems',
        description:
            'Real-time voice agents with sub-500ms latency. Full pipeline from STT to LLM to TTS — with personas, guardrails, and live dashboards.',
        chips: ['LiveKit', 'Deepgram', 'Groq', 'WebRTC'],
    },
    {
        icon: Rocket,
        tag: 'fast turnaround',
        heading: 'Full Stack MVPs',
        description:
            'Production-ready apps shipped fast. Next.js, PostgreSQL, auth, payments, and real performance — not just a prototype. Last one: 18 days, zero post-launch bugs.',
        chips: ['Next.js', 'TypeScript', 'PostgreSQL', 'Vercel'],
    },
];

export const Services = () => {
    return (
        <section id="services" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="06"
                    label="services"
                    title="What I build for clients"
                    sub="Freelance · remote · worldwide. Fixed-scope or ongoing."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {SERVICES.map((service) => (
                        <div
                            key={service.heading}
                            className="flex flex-col border border-border-primary rounded-xl bg-bg-primary p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <span className="w-9 h-9 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                                    <service.icon size={17} />
                                </span>
                                <span className="font-mono text-[10px] text-fg-secondary border border-border-primary rounded px-2 py-0.5">
                                    {service.tag}
                                </span>
                            </div>

                            <h3 className="font-display font-semibold text-lg tracking-tight mb-2">
                                {service.heading}
                            </h3>
                            <p className="text-[13px] text-fg-secondary leading-relaxed mb-5 flex-1">
                                {service.description}
                            </p>
                            <p className="font-mono text-[10px] text-fg-secondary">
                                {service.chips.join(' · ')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA banner */}
                <div className="terminal rounded-xl border border-fg-primary/20 px-6 md:px-8 py-6 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                        <p className="font-mono text-xs text-emerald-400 mb-1.5">
                            $ availability --check
                        </p>
                        <p className="font-display font-semibold text-xl md:text-2xl tracking-tight text-white">
                            Taking on new projects — let's scope yours.
                        </p>
                    </div>
                    <a
                        href="https://cal.com/vasu-devs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-md bg-accent text-white font-mono text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        book a free call
                        <ArrowUpRight size={14} />
                    </a>
                </div>
            </Container>
        </section>
    );
};
