const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
};

const VIEWS_KEY = 'portfolio:traffic:views';
const UNIQUE_KEY = 'portfolio:traffic:unique-visitors';

const BOT_USER_AGENT =
  /bot|crawler|spider|crawling|preview|facebookexternalhit|slackbot|twitterbot|linkedinbot|discordbot|whatsapp|telegrambot|vercel-screenshot/i;

const sendJson = (res, status, body) => {
  res.statusCode = status;
  for (const [key, value] of Object.entries(JSON_HEADERS)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
};

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

const toCount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await readBody(req);
    const userAgent = String(req.headers['user-agent'] || '');
    const isBot = BOT_USER_AGENT.test(userAgent);
    const shouldTrackView = Boolean(body.trackView) && !isBot;
    const shouldTrackUnique = shouldTrackView && Boolean(body.trackUnique);

    let totalViews = 0;
    let uniqueVisitors = 0;
    let activeNow = 0;
    let trackedUniqueVisitor = false;

    if (shouldTrackView) {
      const commands = [
        ['INCR', VIEWS_KEY],
      ];

      if (shouldTrackUnique) {
        commands.push(['INCR', UNIQUE_KEY]);
      } else {
        commands.push(['GET', UNIQUE_KEY]);
      }

      const [views, currentUniqueVisitors] = await redisPipeline(commands);

      totalViews = toCount(views);
      uniqueVisitors = toCount(currentUniqueVisitors);
      activeNow = 1;
      trackedUniqueVisitor = shouldTrackUnique;
    } else {
      const [views, currentUniqueVisitors] = await redisPipeline([
        ['GET', VIEWS_KEY],
        ['GET', UNIQUE_KEY],
      ]);

      totalViews = toCount(views);
      uniqueVisitors = toCount(currentUniqueVisitors);
      activeNow = 0;
    }

    return sendJson(res, 200, {
      totalViews,
      uniqueVisitors,
      activeNow,
      service: 'upstash-redis',
      tracked: {
        view: shouldTrackView,
        uniqueVisitor: trackedUniqueVisitor,
        activeSession: shouldTrackView,
      },
    });
  } catch (error) {
    console.error('Traffic API failed:', error);
    return sendJson(res, 500, { error: 'Traffic data unavailable' });
  }
}
