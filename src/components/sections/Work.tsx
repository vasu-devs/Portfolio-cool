import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { CaseStudy } from '../CaseStudy';
import { DetailSection } from '../ui/DetailSections';

export interface Project {
    title: string;
    category: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    repoUrl?: string;
    liveUrl?: string;
    // Rich case-study content rendered below the video in ProjectModal
    summary?: string;
    details?: DetailSection[];
    highlights?: string[];
    tech?: string[];
}

interface WorkProps {
    projects: Project[];
    openModal: (project: Project) => void;
}

export const Work = ({ projects, openModal }: WorkProps) => {
    return (
        <section id="projects" className="pt-12 pb-16 md:pt-16 md:pb-24 relative">
            <Container>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[6vw] md:mb-16"
                >
                    <span className="text-fg-primary/30">02 /</span> Selected Works
                </motion.h2>
                <div className="flex flex-col gap-4 md:gap-6">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="relative"
                        >
                            <CaseStudy index={i} {...project} onOpen={() => openModal(project)} />
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
