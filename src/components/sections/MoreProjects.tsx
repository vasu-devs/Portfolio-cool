import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star, GitFork } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { MoreProjectModal } from '../ui/MoreProjectModal';
import { DetailSection } from '../ui/DetailSections';
import projectsData from '../../data/projects.json';
import { fetchPortfolioGitHubStats, GitHubRepo, GITHUB_USER } from '../../lib/github';

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
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Rust: '#dea584',
    Go: '#00add8',
    Shell: '#89e051',
};

const INITIAL_VISIBLE = 9;
const FEATURED = new Set(['branchgpt', 'vaani', 'odeon', 'mapmyrepo', 'polysee']);

export const MoreProjects = () => {
    const [liveRepos, setLiveRepos] = useState<GitHubRepo[] | null>(null);
    const [selected, setSelected] = useState<RepoProject | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        fetchPortfolioGitHubStats(controller.signal)
            .then((stats) => {
                setLiveRepos(
                    stats.repos.filter((repo) => {
                        if (repo.isFork || repo.isArchived || repo.isPrivate) return false;
                        if (repo.name.toLowerCase() === GITHUB_USER) return false;
                        return !FEATURED.has(repo.name.toLowerCase());
                    })
                );
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === 'AbortError') return;
                console.warn('Failed to refresh live GitHub project stats:', error);
            });

        return () => {
            controller.abort();
        };
    }, []);

    // Sort by rank asc, then stars desc, then updatedAt desc.
    const projects = useMemo(() => {
        const curated = [...((projectsData.projects as RepoProject[]) ?? [])];
        const liveByName = new Map(
            (liveRepos ?? []).map((repo) => [repo.name.toLowerCase(), repo])
        );
        const curatedNames = new Set(curated.map((repo) => repo.name.toLowerCase()));
        const list: RepoProject[] = curated.map((project) => {
            const live = liveByName.get(project.name.toLowerCase());
            if (!live) return project;

            return {
                ...project,
                description: live.description || project.description,
                url: live.url,
                homepage: live.homepage,
                language: live.language,
                stars: live.stars,
                forks: live.forks,
                topics: live.topics,
                updatedAt: live.updatedAt,
            };
        });

        for (const repo of liveRepos ?? []) {
            if (curatedNames.has(repo.name.toLowerCase())) continue;
            list.push({
                name: repo.name,
                description: repo.description,
                url: repo.url,
                homepage: repo.homepage,
                language: repo.language,
                stars: repo.stars,
                forks: repo.forks,
                topics: repo.topics,
                updatedAt: repo.updatedAt,
            });
        }

        list.sort((a, b) => {
            const ra = a.rank ?? 5;
            const rb = b.rank ?? 5;
            if (ra !== rb) return ra - rb;
            if (b.stars !== a.stars) return b.stars - a.stars;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        return list;
    }, [liveRepos]);

    useEffect(() => {
        if (!selected) return;
        const refreshed = projects.find((project) => project.name === selected.name);
        if (refreshed && refreshed !== selected) setSelected(refreshed);
    }, [projects, selected]);

    const visible = showAll ? projects : projects.slice(0, INITIAL_VISIBLE);
    const hiddenCount = projects.length - visible.length;

    if (projects.length === 0) return null;

    return (
        <section id="more-projects" className="py-16 md:py-24">
            <Container>
                <SectionHeading
                    index="05"
                    label="repositories"
                    title="More from GitHub"
                    sub="Public work beyond the flagships — click any repo for the full breakdown."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visible.map((p, i) => (
                        <motion.button
                            key={p.name}
                            type="button"
                            onClick={() => setSelected(p)}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.4, delay: Math.min((i % 3) * 0.05, 0.15), ease: [0.22, 1, 0.36, 1] }}
                            aria-label={`Open case study for ${p.name}`}
                            className="group flex flex-col text-left border border-border-primary rounded-xl bg-bg-primary p-5 cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="font-mono text-[13px] font-semibold tracking-tight truncate group-hover:text-accent transition-colors duration-300">
                                    {p.name}
                                </h3>
                                <ArrowUpRight size={13} className="shrink-0 text-fg-secondary group-hover:text-accent transition-colors mt-0.5" />
                            </div>

                            <p className="text-[13px] text-fg-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
                                {p.summary || p.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center gap-3 font-mono text-[10px] text-fg-secondary pt-3 border-t border-border-primary">
                                {p.language && (
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: LANG_COLOR[p.language] ?? '#a1a1aa' }}
                                        />
                                        {p.language}
                                    </span>
                                )}
                                {p.stars > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        {p.stars}
                                    </span>
                                )}
                                {p.forks > 0 && (
                                    <span className="flex items-center gap-1">
                                        <GitFork className="w-3 h-3" />
                                        {p.forks}
                                    </span>
                                )}
                                {p.homepage && <span className="ml-auto text-accent">live</span>}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {(hiddenCount > 0 || showAll) && (
                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={() => setShowAll((v) => !v)}
                            className="inline-flex items-center gap-2 h-10 px-5 rounded-md border border-border-primary bg-bg-primary font-mono text-xs text-fg-secondary hover:text-fg-primary hover:border-fg-primary/40 transition-colors cursor-pointer"
                        >
                            {showAll ? 'show less' : `show all ${projects.length} repos`}
                        </button>
                    </div>
                )}
            </Container>

            <MoreProjectModal project={selected} onClose={() => setSelected(null)} />
        </section>
    );
};
