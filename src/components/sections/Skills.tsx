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
        <section id="skills" className="py-32 relative overflow-hidden">
            <Container>
                <h2 className="font-mono text-xs uppercase tracking-widest text-fg-secondary mb-16">Technical Expertise</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillCategories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border border-border-primary bg-bg-secondary/30 backdrop-blur-sm group hover:border-fg-primary/20 transition-colors"
                        >
                            <h3 className="font-display font-bold text-xl mb-6 text-fg-primary">{category.title}</h3>
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
