import { motion } from 'framer-motion';
import { Container } from '../ui/Container';

const skillCategories = [
    {
        title: "Languages",
        skills: ["Python", "JavaScript", "TypeScript", "C++"]
    },
    {
        title: "Frontend",
        skills: ["HTML", "CSS", "Tailwind", "React.js", "Vite", "Framer Motion", "D3.js"]
    },
    {
        title: "Backend",
        skills: ["Node.js", "Express", "FastAPI", "LangChain", "LiveKit", "Twilio"]
    },
    {
        title: "Databases",
        skills: ["MySQL", "MongoDB", "PostgreSQL", "Chroma", "Qdrant", "PgVector"]
    },
    {
        title: "AI/LLM Stack",
        skills: ["OpenAI", "Deepgram", "Ollama", "DeepSeek", "Gemini", "RAG Pipelines"]
    },
    {
        title: "Tools & DevOps",
        skills: ["Git", "GitHub", "Linux", "Bash", "Docker", "Postman"]
    }
];

export const Skills = () => {
    return (
        <section id="skills" className="pt-12 pb-16 md:pb-32 relative overflow-hidden">
            <Container>
                <h2 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-fg-secondary mb-12 md:mb-16">Technical Expertise</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {skillCategories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.7,
                                delay: idx * 0.1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="p-6 md:p-8 rounded-2xl border border-border-primary bg-bg-secondary/30 backdrop-blur-sm group hover:border-fg-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <h3 className="font-display font-bold text-xl md:text-2xl mb-6 text-fg-primary group-hover:text-fg-primary transition-colors">{category.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill, sIdx) => (
                                    <span
                                        key={sIdx}
                                        className="px-3 py-1 rounded-full bg-fg-primary/5 border border-fg-primary/10 text-xs font-mono text-fg-secondary group-hover:text-fg-primary group-hover:border-fg-primary/30 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
