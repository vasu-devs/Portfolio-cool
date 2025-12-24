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
        <section id="skills" className="pt-[12vw] pb-[16vw] md:pt-[3vw] md:pb-[8vw] relative overflow-hidden">
            <Container>
                <h2 className="font-mono text-[2.5vw] md:text-[0.8vw] uppercase tracking-widest text-fg-secondary mb-[12vw] md:mb-[4vw]">Technical Expertise</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[6vw] md:gap-[2vw]">
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
                            className="p-[6vw] md:p-[2vw] rounded-2xl border border-border-primary bg-bg-secondary/30 backdrop-blur-sm group hover:border-fg-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <h3 className="font-display font-bold text-[5vw] md:text-[1.5vw] mb-[6vw] md:mb-[1.5vw] text-fg-primary group-hover:text-fg-primary transition-colors">{category.title}</h3>
                            <div className="flex flex-wrap gap-[2vw] md:gap-[0.5vw]">
                                {category.skills.map((skill, sIdx) => (
                                    <span
                                        key={sIdx}
                                        className="px-[3vw] py-[1vw] md:px-[0.75vw] md:py-[0.25vw] rounded-full bg-fg-primary/5 border border-fg-primary/10 text-[3vw] md:text-[0.8vw] font-mono text-fg-secondary group-hover:text-fg-primary group-hover:border-fg-primary/30 transition-colors"
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
