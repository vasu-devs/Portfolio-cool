
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data';
import { ExternalLink, Github } from 'lucide-react';

export default function Conquests() {
    const [selected, setSelected] = useState(0);

    return (
        <section className="h-full w-full flex flex-col md:flex-row gap-8 overflow-hidden">
            {/* LEFT: LIST SELECTOR */}
            <div className="w-full md:w-1/3 flex flex-col justify-center border-r border-white/10 pr-8">
                <h3 className="text-warrior-gold font-mono tracking-widest text-xs mb-8">[ TARGET SELECT ]</h3>
                <div className="flex flex-col gap-4">
                    {projects.map((project, index) => (
                        <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`text-left p-4 font-display tracking-wider transition-all duration-300 relative group ${selected === index
                                    ? 'bg-warrior-crimson text-white skew-x-[-12deg] shadow-[5px_5px_0px_rgba(255,255,255,0.1)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xs font-mono absolute top-2 right-2 opacity-50">0{index + 1}</span>
                            {project.title.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: DETAILS VIEW */}
            <div className="w-full md:w-2/3 relative flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selected}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full flex flex-col"
                    >
                        {/* IMAGE PREVIEW WITH CRT EFFECT */}
                        <div className="relative h-64 md:h-1/2 w-full overflow-hidden border border-white/10 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-void-black to-transparent z-10" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none" />
                            <img
                                src={projects[selected].thumbnailUrl}
                                alt={projects[selected].title}
                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Glitch Overlay */}
                            <div className="absolute inset-0 bg-warrior-crimson/20 mix-blend-color-burn opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                        </div>

                        {/* INFO HUD */}
                        <div className="flex-1 pt-8 flex flex-col relative">
                            <div className="absolute top-0 right-0 p-2 border border-warrior-gold/30 text-warrior-gold font-mono text-xs">
                                STATUS: CONQUERED
                            </div>

                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white">
                                {projects[selected].title}
                            </h2>

                            <p className="text-warrior-silver font-mono text-sm leading-relaxed mb-8 border-l-2 border-warrior-crimson pl-4">
                                {projects[selected].description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-auto">
                                {projects[selected].tech.map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <a
                                    href={projects[selected].githubUrl}
                                    target="_blank"
                                    className="px-6 py-3 bg-white text-void-black font-bold font-mono hover:bg-warrior-crimson hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Github size={16} /> CODEBASE
                                </a>
                                {projects[selected].liveUrl && (
                                    <a
                                        href={projects[selected].liveUrl}
                                        target="_blank"
                                        className="px-6 py-3 border border-white/30 text-white font-mono hover:bg-white/10 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={16} /> DEPLOYMENT
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
