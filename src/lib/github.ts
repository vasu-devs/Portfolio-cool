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

export interface GitHubRepoStats {
    stars: number;
    forks: number;
    openPullRequests: number;
}

export interface GitHubStatsPayload {
    user: string;
    fetchedAt: string;
    stars: number;
    repos: GitHubRepo[];
    source: string;
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

interface GitHubSearchResponse {
    total_count: number;
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

export async function fetchPortfolioGitHubStats(signal?: AbortSignal): Promise<GitHubStatsPayload> {
    try {
        const stats = await fetchGitHubJson<GitHubStatsPayload>('/api/github-stats', signal);
        if (typeof stats.stars === 'number' && Array.isArray(stats.repos)) {
            return stats;
        }
    } catch (error) {
        console.warn('Portfolio GitHub stats API unavailable, falling back to GitHub:', error);
    }

    const repos = await fetchUserRepos(signal);

    return {
        user: GITHUB_USER,
        fetchedAt: new Date().toISOString(),
        stars: countEarnedStars(repos),
        repos,
        source: 'github-rest-browser',
    };
}

export async function fetchRepoStats(owner: string, repo: string, signal?: AbortSignal): Promise<GitHubRepoStats> {
    const [repoData, pullRequests] = await Promise.all([
        fetchGitHubJson<GitHubApiRepo>(`https://api.github.com/repos/${owner}/${repo}`, signal),
        fetchGitHubJson<GitHubSearchResponse>(
            `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:pr+state:open`,
            signal
        ),
    ]);

    return {
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        openPullRequests: pullRequests.total_count || 0,
    };
}

export async function fetchCachedRepoStats(owner: string, repo: string, signal?: AbortSignal): Promise<GitHubRepoStats> {
    try {
        const params = new URLSearchParams({ owner, repo });
        const stats = await fetchGitHubJson<GitHubRepoStats>(`/api/github-repo-stats?${params}`, signal);

        if (
            typeof stats.stars === 'number'
            && typeof stats.forks === 'number'
            && typeof stats.openPullRequests === 'number'
            && stats.stars > 0
        ) {
            return stats;
        }

        throw new Error('Cached repo stats returned an invalid star count');
    } catch (error) {
        console.warn('Cached repo stats API unavailable, falling back to GitHub:', error);
        return fetchRepoStats(owner, repo, signal);
    }
}

export function countEarnedStars(repos: GitHubRepo[]): number {
    return repos
        .filter((repo) => !repo.isFork && !repo.isArchived && !repo.isPrivate)
        .reduce((total, repo) => total + repo.stars, 0);
}
