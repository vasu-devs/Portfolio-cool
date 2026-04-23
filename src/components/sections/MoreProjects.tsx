import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Star, GitFork, Globe, ChevronDown } from 'lucide-react';
import { Container } from '../ui/Container';
import { MoreProjectModal } from '../ui/MoreProjectModal';
import { DetailSection } from '../ui/DetailSections';
import projectsData from '../../data/projects.json';

interface RepoProject {
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics: string[];
    updatedAt: string;
    summary?: string;
    details?: DetailSection[];
    highlights?: string[];
    tech?: string[];
    rank?: number;
}

const LANG_COLOR: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572a5',
    Rust: '#dea584',
    Go: '#00add8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Shell: '#89e051',
    Dockerfile: '#384d54',
    Java: '#b07219',
    Kotlin: '#a97bff',
    Swift: '#f05138',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    PHP: '#4f5d95',
    Ruby: '#701516',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Astro: '#ff5a03',
    'Jupyter Notebook': '#da5b0b',
    MDX: '#fcb32c',
    Lua: '#000080',
    Solidity: '#aa6746',
};

const INITIAL_VISIBLE = 9;

function dedupeTags(topics: string[], tech: string[], max = 4): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const src of [topics, tech]) {
        for (const t of src) {
            const key = t.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(t);
            if (out.length >= max) return out;
        }
    }
    return out;
}

export const MoreProjects = () => {
    // Sort by rank asc, then stars desc, then updatedAt desc, so tech-relevant
    // projects (lower rank) lead the grid.
    const projects = useMemo(() => {
        const list = [...((projectsData.projects as RepoProject[]) ?? [])];
        list.sort((a, b) => {
            const ra = a.rank ?? 5;
            const rb = b.rank ?? 5;
            if (ra !== rb) return ra - rb;
            if (b.stars !== a.stars) return b.stars - a.stars;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        return list;
    }, []);
    const [selected, setSelected] = useState<RepoProject | null>(null);
    const [langFilter, setLangFilter] = useState<string>('All');
    const [showAll, setShowAll] = useState(false);

    // Derive top languages (by repo count) for the filter chips.
    const languages = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const p of projects) {
            if (p.language) counts[p.language] = (counts[p.language] || 0) + 1;
        }
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([l]) => l);
    }, [projects]);

    const filtered = useMemo(() => {
        if (langFilter === 'All') return projects;
        return projects.filter((p) => p.language === langFilter);
    }, [projects, langFilter]);

    // Collapse only when the All filter is active AND the user hasn't expanded.
    const collapsed = langFilter === 'All' && !showAll;
    const visible = collapsed ? filtered.slice(0, INITIAL_VISIBLE) : filtered;
    const hiddenCount = filtered.length - visible.length;

    if (projects.length === 0) return null;

    return (
        <section id="more-projects" className="inverted bg-bg-primary text-fg-primary pt-[16vw] pb-[20vw] md:pt-24 md:pb-24 relative">
            <Container>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-mono text-[2.5vw] md:text-base uppercase tracking-widest text-fg-secondary mb-[3vw] md:mb-6"
                >
                    <span className="text-fg-primary/30">03 /</span> More from GitHub
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed mb-[6vw] md:mb-10 max-w-2xl"
                >
                    A selection of my other public work. Click any tile for the full
                    case study — summary, notable details, and tech stack pulled from
                    the README.
                </motion.p>

                {/* Filter chips */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-[2vw] md:gap-2 mb-[8vw] md:mb-12"
                >
                    {['All', ...languages].map((lang) => {
                        const isActive = lang === langFilter;
                        const count =
                            lang === 'All'
                                ? projects.length
                                : projects.filter((p) => p.language === lang).length;
                        return (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => {
                                    setLangFilter(lang);
                                    setShowAll(false);
                                }}
                                className={`inline-flex items-center gap-[1.5vw] md:gap-2 px-[3vw] md:px-4 py-[1.5vw] md:py-1.5 rounded-full text-[2.8vw] md:text-xs font-mono uppercase tracking-widest transition-colors ${
                                    isActive
                                        ? 'bg-fg-primary text-bg-primary border border-fg-primary'
                                        : 'border border-border-primary text-fg-secondary hover:bg-bg-secondary'
                                }`}
                            >
                                {lang !== 'All' && lang in LANG_COLOR && (
                                    <span
                                        className="w-[2vw] h-[2vw] md:w-2 md:h-2 rounded-full"
                                        style={{ background: LANG_COLOR[lang] }}
                                    />
                                )}
                                {lang}
                                <span className={isActive ? 'opacity-60' : 'opacity-50'}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4vw] md:gap-5">
                    <AnimatePresence mode="popLayout">
                        {visible.map((p, i) => (
                            <motion.button
                                key={p.name}
                                layout
                                type="button"
                                onClick={() => setSelected(p)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(i * 0.03, 0.3),
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                aria-label={`Open case study for ${p.name}`}
                                className="group relative flex flex-col text-left border border-border-primary rounded-2xl p-[5vw] md:p-6 bg-fg-primary/[0.03] hover:bg-fg-primary/[0.06] transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-start gap-3 mb-[3vw] md:mb-4">
                                    <h3 className="font-display font-bold text-[5vw] md:text-xl leading-tight tracking-tight truncate">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-[2vw] md:gap-2 shrink-0">
                                        <span className="w-[8vw] h-[8vw] md:w-9 md:h-9 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 group-hover:bg-fg-primary group-hover:text-bg-primary group-hover:rotate-45">
                                            <ArrowUpRight className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[3.5vw] md:text-sm text-fg-secondary leading-relaxed line-clamp-4 mb-[4vw] md:mb-5 flex-1">
                                    {p.summary || p.description || 'No description provided.'}
                                </p>

                                {(() => {
                                    const tags = dedupeTags(p.topics ?? [], p.tech ?? []);
                                    if (tags.length === 0) return null;
                                    return (
                                        <div className="flex flex-wrap gap-[1.5vw] md:gap-1.5 mb-[3vw] md:mb-4">
                                            {tags.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-[2vw] md:px-2 py-[0.5vw] md:py-0.5 rounded-full border border-border-primary text-[2.2vw] md:text-[10px] font-mono uppercase tracking-wider text-fg-secondary"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                })()}

                                <div className="flex items-center gap-[3vw] md:gap-4 font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary mt-auto pt-[3vw] md:pt-3 border-t border-border-primary/60">
                                    {p.language && (
                                        <span className="flex items-center gap-[1vw] md:gap-1.5">
                                            <span
                                                className="w-[2vw] h-[2vw] md:w-2 md:h-2 rounded-full"
                                                style={{
                                                    background:
                                                        LANG_COLOR[p.language] ?? '#71717a',
                                                }}
                                            />
                                            {p.language}
                                        </span>
                                    )}
                                    {p.stars > 0 && (
                                        <span className="flex items-center gap-[1vw] md:gap-1">
                                            <Star className="w-[3vw] h-[3vw] md:w-3 md:h-3" />
                                            {p.stars}
                                        </span>
                                    )}
                                    {p.forks > 0 && (
                                        <span className="flex items-center gap-[1vw] md:gap-1">
                                            <GitFork className="w-[3vw] h-[3vw] md:w-3 md:h-3" />
                                            {p.forks}
                                        </span>
                                    )}
                                    {p.homepage && (
                                        <span className="flex items-center gap-[1vw] md:gap-1 ml-auto">
                                            <Globe className="w-[3vw] h-[3vw] md:w-3 md:h-3" />
                                            Live
                                        </span>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand / collapse control */}
                {(hiddenCount > 0 || (langFilter === 'All' && showAll)) && (
                    <div className="flex justify-center mt-[8vw] md:mt-12">
                        <button
                            type="button"
                            onClick={() => setShowAll((v) => !v)}
                            className="inline-flex items-center gap-[2vw] md:gap-2 px-[5vw] md:px-6 py-[3vw] md:py-3 rounded-full border border-border-primary font-mono text-[2.8vw] md:text-sm uppercase tracking-widest font-bold hover:bg-bg-secondary transition-colors"
                        >
                            {showAll ? (
                                <>
                                    Show less
                                    <ChevronDown className="w-[4vw] h-[4vw] md:w-4 md:h-4 rotate-180" />
                                </>
                            ) : (
                                <>
                                    Show all {filtered.length} projects
                                    <ChevronDown className="w-[4vw] h-[4vw] md:w-4 md:h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </Container>

            <MoreProjectModal project={selected} onClose={() => setSelected(null)} />
        </section>
    );
};
