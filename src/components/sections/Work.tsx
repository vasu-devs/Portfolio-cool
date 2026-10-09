import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { CaseStudy } from '../CaseStudy';

interface Project {
    title: string;
    category: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    repoUrl?: string;
    liveUrl?: string;
}

interface WorkProps {
    projects: Project[];
    openModal: (project: Project) => void;
}

export const Work = ({ projects, openModal }: WorkProps) => {
    return (
        <section id="projects" className="py-32 px-4 md:px-8 relative z-20 bg-bg-primary">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-6xl md:text-9xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fg-primary to-fg-secondary/50">
                        AURA HARVEST
                    </h2>
                    <div className="h-1 w-32 bg-aura-purple shadow-[0_0_15px_#8A2BE2]" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => openModal(project)}
                            className="group relative aspect-[4/3] rounded-sm overflow-hidden cursor-none bg-bg-secondary border border-white/5 hover:border-aura-purple/50 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 z-10" />

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-aura-purple/10 mix-blend-overlay z-20" />

                            <img
                                src={project.thumbnailUrl}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                            />

                            <div className="absolute bottom-0 left-0 p-8 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-aura-gold font-mono text-sm tracking-widest mb-2 block drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                                    +{100 * (index + 1)} AURA
                                </span>
                                <h3 className="text-4xl font-display font-bold text-white mb-2 group-hover:text-glow">
                                    {project.title}
                                </h3>
                                <p className="text-fg-secondary/80 font-mono text-sm border-l-2 border-aura-purple pl-3">
                                    {project.category}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
