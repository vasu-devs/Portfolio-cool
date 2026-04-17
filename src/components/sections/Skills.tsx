import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
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

// null color means "use currentColor" — ideal for monochrome brand marks
// so they adapt to light/dark theme instead of being invisible.
const skillIconMap: Record<string, { icon: IconComponent; color: string | null }> = {
    // Languages
    Python: { icon: SiPython, color: '#3776AB' },
    TypeScript: { icon: SiTypescript, color: '#3178C6' },
    JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
    'C++': { icon: SiCplusplus, color: '#00599C' },

    // Frontend
    'Next.js': { icon: SiNextdotjs, color: null },
    React: { icon: SiReact, color: '#61DAFB' },
    Vite: { icon: SiVite, color: '#646CFF' },
    Tailwind: { icon: SiTailwindcss, color: '#06B6D4' },
    'Framer Motion': { icon: SiFramer, color: '#0055FF' },
    'Three.js': { icon: SiThreedotjs, color: null },
    'D3.js': { icon: SiD3Dotjs, color: '#F9A03C' },

    // Backend
    'Node.js': { icon: SiNodedotjs, color: '#339933' },
    Express: { icon: SiExpress, color: null },
    FastAPI: { icon: SiFastapi, color: '#009688' },
    Prisma: { icon: SiPrisma, color: null },
    Drizzle: { icon: SiDrizzle, color: '#C5F74F' },

    // Data / Vector
    PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
    MongoDB: { icon: SiMongodb, color: '#47A248' },
    Supabase: { icon: SiSupabase, color: '#3ECF8E' },
    Neon: { icon: BrandNeon, color: '#00E699' },
    ChromaDB: { icon: BrandChromadb, color: '#FC521F' },
    Qdrant: { icon: BrandQdrant, color: '#DC244C' },

    // AI / LLM
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

    // Voice / Realtime
    LiveKit: { icon: BrandLivekit, color: '#FF3399' },
    Deepgram: { icon: SiDeepgram, color: '#13EF93' },

    // DevOps
    Git: { icon: SiGit, color: '#F05032' },
    Docker: { icon: SiDocker, color: '#2496ED' },
    Linux: { icon: SiLinux, color: '#FCC624' },
    Vercel: { icon: SiVercel, color: null },
    Cloudflare: { icon: SiCloudflare, color: '#F38020' },
    Postman: { icon: SiPostman, color: '#FF6C37' },
};

const skillCategories = [
    {
        title: 'Languages',
        skills: ['Python', 'TypeScript', 'JavaScript', 'C++'],
    },
    {
        title: 'Frontend',
        skills: ['Next.js', 'React', 'Vite', 'Tailwind', 'Framer Motion', 'Three.js', 'D3.js'],
    },
    {
        title: 'Backend',
        skills: ['Node.js', 'Express', 'FastAPI', 'Prisma', 'Drizzle'],
    },
    {
        title: 'Data & Vector',
        skills: ['PostgreSQL', 'MongoDB', 'Supabase', 'Neon', 'Qdrant', 'ChromaDB'],
    },
    {
        title: 'AI / LLM',
        skills: [
            'OpenAI', 'Claude', 'Gemini', 'Groq', 'DeepSeek',
            'LangChain', 'LangGraph', 'Ollama', 'Hugging Face', 'PyTorch',
        ],
    },
    {
        title: 'Voice & Realtime',
        skills: ['LiveKit', 'Deepgram'],
    },
    {
        title: 'DevOps',
        skills: ['Git', 'Docker', 'Linux', 'Vercel', 'Cloudflare', 'Postman'],
    },
];

// Skill badge with hover color reveal
const SkillBadge = ({ skill }: { skill: string }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const skillData = skillIconMap[skill];
    const Icon = skillData?.icon;
    const brandColor = skillData?.color;

    return (
        <span
            className="inline-flex items-center gap-[1.5vw] md:gap-2 px-[3vw] py-[1.5vw] md:px-3.5 md:py-1.5 rounded-full bg-fg-primary/5 border border-fg-primary/10 text-[3vw] md:text-sm font-mono text-fg-secondary cursor-default transition-all duration-300 hover:scale-[1.03] hover:border-fg-primary/30 hover:bg-fg-primary/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {Icon && (
                <Icon
                    className="w-[3.5vw] h-[3.5vw] md:w-4 md:h-4 transition-all duration-300 shrink-0"
                    style={{
                        // Monochrome brands (color === null) always inherit current text color
                        color: brandColor === null
                            ? undefined
                            : isHovered
                            ? brandColor
                            : undefined,
                        filter: isHovered ? 'none' : 'grayscale(100%)',
                        opacity: isHovered ? 1 : 0.5,
                    }}
                />
            )}
            <span
                className={`transition-all duration-300 ${
                    isHovered ? 'text-fg-primary' : 'text-fg-secondary'
                }`}
            >
                {skill}
            </span>
        </span>
    );
};

export const Skills = () => {
    return (
        <section
            id="skills"
            className="pt-[12vw] pb-[16vw] md:pt-12 md:pb-24 relative overflow-hidden"
        >
            <Container>
                <h2 className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[8vw] md:mb-10">
                    <span className="text-fg-primary/30">04 /</span> Technical Expertise
                </h2>

                <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed mb-[12vw] md:mb-16 max-w-2xl">
                    The tools I reach for when building — grouped by where they sit in
                    the stack. Hover any badge to see its brand color.
                </p>

                <div className="divide-y divide-border-primary">
                    {skillCategories.map((category, idx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.05,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-[4vw] md:gap-8 py-[7vw] md:py-8 first:pt-0 last:pb-0"
                        >
                            {/* Label column */}
                            <div className="md:col-span-1">
                                <div className="flex items-baseline gap-[2vw] md:gap-3">
                                    <span className="font-mono text-[2.3vw] md:text-xs text-fg-secondary tabular-nums">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-display font-bold text-[5.5vw] md:text-xl text-fg-primary tracking-tight uppercase">
                                        {category.title}
                                    </h3>
                                </div>
                                <span className="font-mono text-[2.3vw] md:text-[10px] uppercase tracking-widest text-fg-secondary/60 mt-[1vw] md:mt-1.5 ml-[6vw] md:ml-8 block">
                                    {category.skills.length} tools
                                </span>
                            </div>

                            {/* Badges column */}
                            <div className="md:col-span-3 flex flex-wrap gap-[2vw] md:gap-2">
                                {category.skills.map((skill) => (
                                    <SkillBadge key={skill} skill={skill} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
