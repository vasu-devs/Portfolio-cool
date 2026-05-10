const CACHE_TTL_SECONDS = 60 * 60 * 6;
const STALE_TTL_SECONDS = 60 * 60 * 24 * 7;
const OWNER_RE = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const REPO_RE = /^[A-Za-z0-9_.-]+$/;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 's-maxage=3600, stale-while-revalidate=86400',
};

const sendJson = (res, status, body) => {
  res.statusCode = status;
  for (const [key, value] of Object.entries(JSON_HEADERS)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
};

const githubHeaders = () => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-github-repo-stats',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

const getRedisConfig = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  }

  return { url, token };
};

const redisPipeline = async (commands) => {
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    throw new Error(`Upstash returned ${response.status}`);
  }

  const results = await response.json();
  const error = results.find((item) => item.error);

  if (error) {
    throw new Error(error.error);
  }

  return results.map((item) => item.result);
};

const cacheKey = (owner, repo) => `portfolio:github:repo:${owner.toLowerCase()}:${repo.toLowerCase()}:stats`;

const readCachedStats = async (owner, repo) => {
  try {
    const [cached] = await redisPipeline([['GET', cacheKey(owner, repo)]]);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (
      typeof parsed.stars !== 'number'
      || typeof parsed.forks !== 'number'
      || typeof parsed.openPullRequests !== 'number'
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('GitHub repo stats cache read failed:', error);
    return null;
  }
};

const writeCachedStats = async (owner, repo, payload) => {
  try {
    await redisPipeline([
      ['SET', cacheKey(owner, repo), JSON.stringify(payload), 'EX', STALE_TTL_SECONDS],
    ]);
  } catch (error) {
    console.warn('GitHub repo stats cache write failed:', error);
  }
};

const cacheAgeSeconds = (payload) => {
  const fetchedAt = new Date(payload.fetchedAt).getTime();
  if (!Number.isFinite(fetchedAt)) return Infinity;
  return Math.max(0, Math.floor((Date.now() - fetchedAt) / 1000));
};

const fetchGitHubJson = async (url) => {
  const response = await fetch(url, { headers: githubHeaders() });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body}`);
  }

  return response.json();
};

const fetchRepoStats = async (owner, repo) => {
  const [repoData, pullRequests] = await Promise.all([
    fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}`),
    fetchGitHubJson(
      `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:pr+state:open`
    ),
  ]);

  return {
    owner,
    repo,
    fetchedAt: new Date().toISOString(),
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    openPullRequests: pullRequests.total_count || 0,
    source: 'github-rest',
    cached: false,
    stale: false,
  };
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const owner = String(req.query.owner || '').trim();
  const repo = String(req.query.repo || '').trim();

  if (!OWNER_RE.test(owner) || !REPO_RE.test(repo)) {
    return sendJson(res, 400, { error: 'Invalid owner or repo' });
  }

  try {
    const cached = await readCachedStats(owner, repo);

    if (cached && cacheAgeSeconds(cached) < CACHE_TTL_SECONDS) {
      return sendJson(res, 200, {
        ...cached,
        cached: true,
        stale: false,
        source: 'upstash-redis',
      });
    }

    const payload = await fetchRepoStats(owner, repo);
    await writeCachedStats(owner, repo, payload);

    return sendJson(res, 200, payload);
  } catch (error) {
    console.error('GitHub repo stats API failed:', error);
    const cached = await readCachedStats(owner, repo);

    if (cached) {
      return sendJson(res, 200, {
        ...cached,
        cached: true,
        stale: true,
        source: 'upstash-redis-stale',
      });
    }

    return sendJson(res, 502, { error: 'GitHub repo stats unavailable' });
  }
}
