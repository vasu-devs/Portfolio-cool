export const GITHUB_USER = 'vasu-devs';

const PER_PAGE = 100;

export interface GitHubRepo {
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics: string[];
    updatedAt: string;
    isFork: boolean;
    isArchived: boolean;
    isPrivate: boolean;
}

interface GitHubApiRepo {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    topics?: string[];
    updated_at: string;
    fork: boolean;
    archived: boolean;
    private: boolean;
}

async function fetchGitHubJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url, {
        signal,
        cache: 'no-store',
        headers: {
            Accept: 'application/vnd.github+json',
        },
    });

    if (!res.ok) {
        throw new Error(`GitHub API returned ${res.status} for ${url}`);
    }

    return res.json() as Promise<T>;
}

function normalizeRepo(repo: GitHubApiRepo): GitHubRepo {
    return {
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language || null,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        isFork: repo.fork,
        isArchived: repo.archived,
        isPrivate: repo.private,
    };
}

export async function fetchUserRepos(signal?: AbortSignal): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];

    for (let page = 1; page < 20; page += 1) {
        const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`;
        const batch = await fetchGitHubJson<GitHubApiRepo[]>(url, signal);
        repos.push(...batch.map(normalizeRepo));

        if (batch.length < PER_PAGE) break;
    }

    return repos;
}

export function countEarnedStars(repos: GitHubRepo[]): number {
    return repos
        .filter((repo) => !repo.isFork && !repo.isArchived && !repo.isPrivate)
        .reduce((total, repo) => total + repo.stars, 0);
}
