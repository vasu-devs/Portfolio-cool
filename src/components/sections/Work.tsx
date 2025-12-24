import { motion } from 'framer-motion';
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
        <section id="projects" className="pt-[1vw] pb-[20vw] md:pt-4 md:pb-24 relative">
            <Container>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-16"
                >
                    Selected Works
                </motion.h2>
                <div className="flex flex-col gap-[10vw] md:gap-16">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
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
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
