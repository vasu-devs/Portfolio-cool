import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
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
        <section id="projects" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="02"
                    label="selected work"
                    title="Flagship projects"
                    sub="Each one has a recorded demo and a full technical breakdown — click any card."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {projects.map((project, i) => (
                        <div
                            key={project.title}
                            className={`group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl ${
                                i === 0 ? 'md:col-span-2' : ''
                            }`}
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
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
