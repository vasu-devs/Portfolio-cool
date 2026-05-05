import { createHash } from 'node:crypto';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
};

const VIEWS_KEY = 'portfolio:traffic:views';
const UNIQUE_KEY = 'portfolio:traffic:unique-visitors';
const VISITOR_KEY_PREFIX = 'portfolio:traffic:visitor';
const RATE_LIMIT_PREFIX = 'portfolio:traffic:rate';
const RATE_LIMIT_PER_MINUTE = 120;

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

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const firstForwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0];

  return firstForwardedIp?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
};

const getMinuteBucket = () => Math.floor(Date.now() / 60000);

const hashValue = (value) => createHash('sha256').update(value).digest('hex');

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
    const acceptLanguage = String(req.headers['accept-language'] || '');
    const isBot = BOT_USER_AGENT.test(userAgent);
    const ip = getClientIp(req);
    const clientHash = hashValue(`${ip}:${userAgent}:${acceptLanguage}`);
    const rateKey = `${RATE_LIMIT_PREFIX}:${getMinuteBucket()}:${hashValue(ip)}`;

    const [requestCount] = await redisPipeline([
      ['INCR', rateKey],
      ['EXPIRE', rateKey, 60],
    ]);

    if (toCount(requestCount) > RATE_LIMIT_PER_MINUTE) {
      return sendJson(res, 429, { error: 'Rate limited' });
    }

    const shouldTrackView = Boolean(body.trackView) && !isBot;

    let totalViews = 0;
    let uniqueVisitors = 0;
    let trackedUniqueVisitor = false;

    if (shouldTrackView) {
      const visitorKey = `${VISITOR_KEY_PREFIX}:${clientHash}`;
      const [views, visitorCreated, currentUniqueVisitors] = await redisPipeline([
        ['INCR', VIEWS_KEY],
        ['SET', visitorKey, '1', 'NX'],
        ['GET', UNIQUE_KEY],
      ]);

      totalViews = toCount(views);
      uniqueVisitors = toCount(currentUniqueVisitors);

      if (visitorCreated === 'OK') {
        const [updatedUniqueVisitors] = await redisPipeline([
          ['INCR', UNIQUE_KEY],
        ]);
        uniqueVisitors = toCount(updatedUniqueVisitors);
        trackedUniqueVisitor = true;
      }
    } else {
      const [views, currentUniqueVisitors] = await redisPipeline([
        ['GET', VIEWS_KEY],
        ['GET', UNIQUE_KEY],
      ]);

      totalViews = toCount(views);
      uniqueVisitors = toCount(currentUniqueVisitors);
    }

    return sendJson(res, 200, {
      totalViews,
      uniqueVisitors,
      service: 'upstash-redis',
      tracked: {
        view: shouldTrackView,
        uniqueVisitor: trackedUniqueVisitor,
      },
    });
  } catch (error) {
    console.error('Traffic API failed:', error);
    return sendJson(res, 500, { error: 'Traffic data unavailable' });
  }
}
