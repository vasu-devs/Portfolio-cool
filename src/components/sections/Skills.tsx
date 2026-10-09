import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import {
    // Languages
    SiPython, SiTypescript, SiJavascript, SiCplusplus,
    // Frontend
    SiNextdotjs, SiReact, SiVite, SiTailwindcss, SiFramer, SiThreedotjs, SiD3Dotjs,
    // Backend
    SiNodedotjs, SiExpress, SiFastapi, SiPrisma, SiDrizzle,
    // Data
    SiPostgresql, SiMongodb, SiSupabase,
    // AI / LLM
    SiOpenai, SiAnthropic, SiGooglegemini, SiLangchain, SiOllama, SiHuggingface, SiPytorch,
    // Voice
    SiDeepgram,
    // DevOps
    SiGit, SiDocker, SiLinux, SiVercel, SiCloudflare, SiPostman,
} from 'react-icons/si';
import {
    BrandGroq, BrandLivekit, BrandDeepseek, BrandQdrant, BrandChromadb, BrandNeon, BrandLanggraph,
} from '../ui/BrandIcons';
import { IconType } from 'react-icons';

type IconComponent = IconType | React.ComponentType<React.SVGProps<SVGSVGElement>>;

// null color means "use currentColor" — for monochrome brand marks.
const skillIconMap: Record<string, { icon: IconComponent; color: string | null }> = {
    Python: { icon: SiPython, color: '#3776AB' },
    TypeScript: { icon: SiTypescript, color: '#3178C6' },
    JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
    'C++': { icon: SiCplusplus, color: '#00599C' },
    'Next.js': { icon: SiNextdotjs, color: null },
    React: { icon: SiReact, color: '#61DAFB' },
    Vite: { icon: SiVite, color: '#646CFF' },
    Tailwind: { icon: SiTailwindcss, color: '#06B6D4' },
    'Framer Motion': { icon: SiFramer, color: '#0055FF' },
    'Three.js': { icon: SiThreedotjs, color: null },
    'D3.js': { icon: SiD3Dotjs, color: '#F9A03C' },
    'Node.js': { icon: SiNodedotjs, color: '#339933' },
    Express: { icon: SiExpress, color: null },
    FastAPI: { icon: SiFastapi, color: '#009688' },
    Prisma: { icon: SiPrisma, color: null },
    Drizzle: { icon: SiDrizzle, color: '#C5F74F' },
    PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
    MongoDB: { icon: SiMongodb, color: '#47A248' },
    Supabase: { icon: SiSupabase, color: '#3ECF8E' },
    Neon: { icon: BrandNeon, color: '#00E699' },
    ChromaDB: { icon: BrandChromadb, color: '#FC521F' },
    Qdrant: { icon: BrandQdrant, color: '#DC244C' },
    OpenAI: { icon: SiOpenai, color: null },
    Claude: { icon: SiAnthropic, color: '#CC785C' },
    Gemini: { icon: SiGooglegemini, color: '#8E75B2' },
    Groq: { icon: BrandGroq, color: '#F55036' },
    DeepSeek: { icon: BrandDeepseek, color: '#4D6BFE' },
    LangChain: { icon: SiLangchain, color: '#3DA374' },
    LangGraph: { icon: BrandLanggraph, color: '#3DA374' },
    Ollama: { icon: SiOllama, color: null },
    'Hugging Face': { icon: SiHuggingface, color: '#FFD21E' },
    PyTorch: { icon: SiPytorch, color: '#EE4C2C' },
    LiveKit: { icon: BrandLivekit, color: '#FF3399' },
    Deepgram: { icon: SiDeepgram, color: '#13EF93' },
    Git: { icon: SiGit, color: '#F05032' },
    Docker: { icon: SiDocker, color: '#2496ED' },
    Linux: { icon: SiLinux, color: '#FCC624' },
    Vercel: { icon: SiVercel, color: null },
    Cloudflare: { icon: SiCloudflare, color: '#F38020' },
    Postman: { icon: SiPostman, color: '#FF6C37' },
};

const skillCategories = [
    { title: 'ai / llm', skills: ['OpenAI', 'Claude', 'Gemini', 'Groq', 'DeepSeek', 'LangChain', 'LangGraph', 'Ollama', 'Hugging Face', 'PyTorch'] },
    { title: 'voice / realtime', skills: ['LiveKit', 'Deepgram'] },
    { title: 'languages', skills: ['Python', 'TypeScript', 'JavaScript', 'C++'] },
    { title: 'frontend', skills: ['Next.js', 'React', 'Vite', 'Tailwind', 'Framer Motion', 'Three.js', 'D3.js'] },
    { title: 'backend', skills: ['Node.js', 'Express', 'FastAPI', 'Prisma', 'Drizzle'] },
    { title: 'data / vector', skills: ['PostgreSQL', 'MongoDB', 'Supabase', 'Neon', 'Qdrant', 'ChromaDB'] },
    { title: 'devops', skills: ['Git', 'Docker', 'Linux', 'Vercel', 'Cloudflare', 'Postman'] },
];

// Skill badge with brand color reveal on hover.
const SkillBadge = ({ skill }: { skill: string }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const skillData = skillIconMap[skill];
    const Icon = skillData?.icon;
    const brandColor = skillData?.color;

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border-primary bg-bg-primary font-mono text-xs text-fg-secondary cursor-default transition-colors duration-200 hover:border-fg-primary/35 hover:text-fg-primary"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {Icon && (
                <Icon
                    className="w-3.5 h-3.5 transition-all duration-200 shrink-0"
                    style={{
                        color: brandColor === null ? undefined : isHovered ? brandColor : undefined,
                        filter: isHovered ? 'none' : 'grayscale(100%)',
                        opacity: isHovered ? 1 : 0.55,
                    }}
                />
            )}
            {skill}
        </span>
    );
};

export const Skills = () => {
    return (
        <section id="skills" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="03"
                    label="stack"
                    title="Tools I ship with"
                    sub="AI-first, full-stack capable. Hover any badge for its brand color."
                />

                <div className="border border-border-primary rounded-xl bg-bg-primary divide-y divide-border-primary overflow-hidden">
                    {skillCategories.map((category) => (
                        <div
                            key={category.title}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 px-5 md:px-6 py-4 items-start"
                        >
                            <h3 className="sm:col-span-3 font-mono text-[11px] text-fg-secondary pt-1.5">
                                {category.title}
                            </h3>
                            <div className="sm:col-span-9 flex flex-wrap gap-1.5">
                                {category.skills.map((skill) => (
                                    <SkillBadge key={skill} skill={skill} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
