
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

const skills = {
    "Languages": ["Python", "JavaScript", "TypeScript", "C++"],
    "Frontend": ["HTML", "CSS", "Tailwind", "React.js", "Vite", "Framer Motion", "D3.js"],
    "Backend": ["Node.js", "Express", "FastAPI", "LangChain", "LiveKit", "Twilio"],
    "Databases": ["MySQL", "MongoDB", "PostgreSQL", "Chroma", "Qdrant", "PgVector"],
    "AI/LLM Stack": ["OpenAI", "Deepgram", "Ollama", "DeepSeek", "Gemini", "RAG Pipelines"],
    "Tools & DevOps": ["Git", "GitHub", "Linux", "Bash", "Docker", "Postman"]
};

export const Skills = () => {
    return (
        <section id="skills" className="py-32 px-4 md:px-8 relative z-20 bg-bg-primary overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-aura-purple/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    <div className="lg:col-span-4">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-display font-bold mb-8 sticky top-32"
                        >
                            ABILITIES &<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aura-gold to-aura-purple animate-pulse-slow">MASTERY</span>
                        </motion.h2>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {Object.entries(skills).map(([category, items], catIndex) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: catIndex * 0.1 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-mono text-aura-gold uppercase tracking-widest border-b border-white/10 pb-2">
                                        {category}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {items.map((skill, index) => (
                                            <motion.span
                                                key={skill}
                                                whileHover={{ scale: 1.05, borderColor: '#8A2BE2', boxShadow: '0 0 10px rgba(138,43,226,0.3)' }}
                                                className="px-4 py-2 border border-white/10 rounded-full text-sm md:text-base hover:bg-white/5 transition-all cursor-default"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
