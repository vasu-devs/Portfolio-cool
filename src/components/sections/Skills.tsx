import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import {
    SiPython, SiJavascript, SiTypescript, SiCplusplus,
    SiHtml5, SiCss3, SiTailwindcss, SiReact, SiVite, SiFramer, SiD3Dotjs,
    SiNodedotjs, SiExpress, SiFastapi, SiLangchain, SiTwilio,
    SiMysql, SiMongodb, SiPostgresql, SiChromatic,
    SiOpenai, SiOllama, SiGooglegemini,
    SiGit, SiGithub, SiLinux, SiGnubash, SiDocker, SiPostman
} from 'react-icons/si';
import { FaDatabase, FaBrain, FaMicrophone, FaLink, FaVideo, FaVectorSquare } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Skill icon mapping with brand colors
const skillIconMap: Record<string, { icon: IconType; color: string }> = {
    // Languages
    "Python": { icon: SiPython, color: "#3776AB" },
    "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
    "TypeScript": { icon: SiTypescript, color: "#3178C6" },
    "C++": { icon: SiCplusplus, color: "#00599C" },

    // Frontend
    "HTML": { icon: SiHtml5, color: "#E34F26" },
    "CSS": { icon: SiCss3, color: "#1572B6" },
    "Tailwind": { icon: SiTailwindcss, color: "#06B6D4" },
    "React.js": { icon: SiReact, color: "#61DAFB" },
    "Vite": { icon: SiVite, color: "#646CFF" },
    "Framer Motion": { icon: SiFramer, color: "#0055FF" },
    "D3.js": { icon: SiD3Dotjs, color: "#F9A03C" },

    // Backend
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Express": { icon: SiExpress, color: "#68A063" },
    "FastAPI": { icon: SiFastapi, color: "#009688" },
    "LangChain": { icon: SiLangchain, color: "#65C9A8" },
    "LiveKit": { icon: FaVideo, color: "#FF3399" },
    "Twilio": { icon: SiTwilio, color: "#F22F46" },

    // Databases
    "MySQL": { icon: SiMysql, color: "#4479A1" },
    "MongoDB": { icon: SiMongodb, color: "#47A248" },
    "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
    "Chroma": { icon: SiChromatic, color: "#FC521F" },
    "Qdrant": { icon: FaVectorSquare, color: "#DC244C" },
    "PgVector": { icon: FaDatabase, color: "#4169E1" },

    // AI/LLM Stack
    "OpenAI": { icon: SiOpenai, color: "#10A37F" },
    "Deepgram": { icon: FaMicrophone, color: "#13EF93" },
    "Ollama": { icon: SiOllama, color: "#FFFFFF" },
    "DeepSeek": { icon: FaBrain, color: "#0066FF" },
    "Gemini": { icon: SiGooglegemini, color: "#8E75B2" },
    "RAG Pipelines": { icon: FaLink, color: "#9333EA" },

    // Tools & DevOps
    "Git": { icon: SiGit, color: "#F05032" },
    "GitHub": { icon: SiGithub, color: "#E6EDF3" },
    "Linux": { icon: SiLinux, color: "#FCC624" },
    "Bash": { icon: SiGnubash, color: "#4EAA25" },
    "Docker": { icon: SiDocker, color: "#2496ED" },
    "Postman": { icon: SiPostman, color: "#FF6C37" }
};

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

// Skill badge component with hover effect
const SkillBadge = ({ skill }: { skill: string }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const skillData = skillIconMap[skill];
    const Icon = skillData?.icon;
    const brandColor = skillData?.color || "#888888";

    return (
        <span
            className="inline-flex items-center gap-[1.5vw] md:gap-2 px-[3vw] py-[1.5vw] md:px-4 md:py-2 rounded-full bg-fg-primary/5 border border-fg-primary/10 text-[3vw] md:text-sm font-mono text-fg-secondary cursor-default hover:scale-105 hover:border-fg-primary/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {Icon && (
                <Icon
                    className="w-[3.5vw] h-[3.5vw] md:w-4 md:h-4 transition-all duration-300"
                    style={{
                        color: isHovered ? brandColor : undefined,
                        filter: isHovered ? 'none' : 'grayscale(100%)',
                        opacity: isHovered ? 1 : 0.5
                    }}
                />
            )}
            <span
                className={`transition-all duration-300 ${isHovered ? 'text-fg-primary' : 'text-fg-secondary'}`}
            >
                {skill}
            </span>
        </span>
    );
};

export const Skills = () => {
    return (
        <section id="skills" className="pt-[12vw] pb-[16vw] md:pt-12 md:pb-24 relative overflow-hidden">
            <Container>
                <h2 className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[12vw] md:mb-16">Technical Expertise</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[6vw] md:gap-6">
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
                            className="p-[6vw] md:p-6 rounded-2xl border border-border-primary bg-bg-secondary/30 backdrop-blur-sm group hover:border-fg-primary/20 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <h3 className="font-display font-bold text-[5vw] md:text-2xl mb-[6vw] md:mb-5 text-fg-primary group-hover:text-fg-primary transition-colors">{category.title}</h3>
                            <div className="flex flex-wrap gap-[2vw] md:gap-2">
                                {category.skills.map((skill, sIdx) => (
                                    <SkillBadge key={sIdx} skill={skill} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
