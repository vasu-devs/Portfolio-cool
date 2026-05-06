const USER = 'vasu-devs';
const PER_PAGE = 100;
const CACHE_KEY = 'portfolio:github:stats';
const CACHE_TTL_SECONDS = 60;
const STALE_TTL_SECONDS = 86400;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 's-maxage=60, stale-while-revalidate=300',
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
  'User-Agent': 'portfolio-github-stats',
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

const readCachedStats = async () => {
  try {
    const [cached] = await redisPipeline([['GET', CACHE_KEY]]);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (typeof parsed.stars !== 'number' || !Array.isArray(parsed.repos)) return null;

    return parsed;
  } catch (error) {
    console.warn('GitHub stats cache read failed:', error);
    return null;
  }
};

const writeCachedStats = async (payload) => {
  try {
    await redisPipeline([
      ['SET', CACHE_KEY, JSON.stringify(payload), 'EX', STALE_TTL_SECONDS],
    ]);
  } catch (error) {
    console.warn('GitHub stats cache write failed:', error);
  }
};

const cacheAgeSeconds = (payload) => {
  const fetchedAt = new Date(payload.fetchedAt).getTime();
  if (!Number.isFinite(fetchedAt)) return Infinity;
  return Math.max(0, Math.floor((Date.now() - fetchedAt) / 1000));
};

const normalizeRepo = (repo) => ({
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
});

const fetchAllRepos = async () => {
  const repos = [];

  for (let page = 1; page < 20; page += 1) {
    const url = `https://api.github.com/users/${USER}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`;
    const response = await fetch(url, { headers: githubHeaders() });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API ${response.status}: ${body}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    repos.push(...batch.map(normalizeRepo));
    if (batch.length < PER_PAGE) break;
  }

  return repos;
};

const isEarnedRepo = (repo) => !repo.isFork && !repo.isArchived && !repo.isPrivate;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const cached = await readCachedStats();

    if (cached && cacheAgeSeconds(cached) < CACHE_TTL_SECONDS) {
      return sendJson(res, 200, {
        ...cached,
        cached: true,
        stale: false,
        source: 'upstash-redis',
      });
    }

    const repos = await fetchAllRepos();
    const stars = repos
      .filter(isEarnedRepo)
      .reduce((total, repo) => total + repo.stars, 0);

    const payload = {
      user: USER,
      fetchedAt: new Date().toISOString(),
      stars,
      repos,
      source: 'github-rest',
      cached: false,
      stale: false,
    };

    await writeCachedStats(payload);
    return sendJson(res, 200, payload);
  } catch (error) {
    console.error('GitHub stats API failed:', error);
    const cached = await readCachedStats();

    if (cached) {
      return sendJson(res, 200, {
        ...cached,
        cached: true,
        stale: true,
        source: 'upstash-redis-stale',
      });
    }

    return sendJson(res, 502, { error: 'GitHub stats unavailable' });
  }
}
