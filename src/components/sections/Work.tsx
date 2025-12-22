import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Container } from '../ui/Container';
import { CaseStudy } from '../CaseStudy';

interface Project {
    title: string;
    category: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    repoUrl: string;
    liveUrl?: string;
}

interface WorkProps {
    projects: Project[];
    openModal: (project: Project) => void;
}

export const Work = ({ projects, openModal }: WorkProps) => {
    return (
        <section id="projects" className="py-32">
            <Container>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-xs uppercase tracking-widest text-fg-secondary mb-16"
                >
                    Selected Works
                </motion.h2>
                <div className="flex flex-col gap-12">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="group relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-fg-primary rounded-xl"
                            onClick={() => openModal(project)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openModal(project);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`View details for ${project.title}`}
                        >
                            <CaseStudy index={i} {...project} />
                            {/* Interactive Hint */}
                            <div className="absolute top-1/2 right-0 md:right-32 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-fg-primary text-bg-primary px-4 py-2 rounded-full font-mono text-xs uppercase font-bold flex items-center gap-2 pointer-events-none transform translate-x-4 group-hover:translate-x-0 duration-300 shadow-xl z-20">
                                <Play size={12} fill="currentColor" /> Watch Demo
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
