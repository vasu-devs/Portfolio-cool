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

    const validId = value => typeof value === 'string' && /^[a-f0-9-]{36}$/i.test(value);
    const visitorId = validId(body.visitorId) && !isBot ? body.visitorId : '';
    const viewId = validId(body.viewId) ? body.viewId : '';
    const script = `
      local viewsKey,uniqueKey,registry,sequence,active,viewKey=unpack(KEYS)
      local id,trackView,trackUnique,now,heartbeat=unpack(ARGV)
      local number=false
      if id~='' then
        number=redis.call('HGET',registry,id)
        if not number then
          number=redis.call('INCR',sequence)
          redis.call('HSET',registry,id,number)
          if trackUnique=='1' then redis.call('INCR',uniqueKey) end
        end
        if heartbeat=='1' then redis.call('ZADD',active,now,id) end
      elseif trackView=='1' and trackUnique=='1' then
        redis.call('INCR',uniqueKey)
      end
      if trackView=='1' then
        if viewKey=='' or redis.call('SET',viewKey,'1','EX',86400,'NX') then redis.call('INCR',viewsKey) end
      end
      redis.call('ZREMRANGEBYSCORE',active,'-inf',tonumber(now)-90000)
      return {tonumber(redis.call('GET',viewsKey) or 0),tonumber(redis.call('GET',uniqueKey) or 0),redis.call('ZCARD',active),tonumber(number) or 0}
    `;
    const [result] = await redisPipeline([['EVAL',script,6,VIEWS_KEY,UNIQUE_KEY,
      'portfolio:traffic:visitor-registry-v1','portfolio:traffic:visitor-sequence-v1',
      'portfolio:traffic:active-v1',viewId?'portfolio:traffic:view:'+viewId:'',
      visitorId,shouldTrackView?'1':'0',shouldTrackUnique?'1':'0',String(Date.now()),
      visitorId && body.heartbeat === true ? '1':'0']]);
    const [totalViews,uniqueVisitors,activeNow,visitorNumber]=result.map(toCount);
    return sendJson(res,200,{totalViews,uniqueVisitors,activeNow,visitorNumber:visitorNumber||null,
      activeWindowSeconds:90,visitorNumberScope:'Since September 26, 2026',service:'upstash-redis',
      tracked:{view:shouldTrackView,uniqueVisitor:shouldTrackUnique,activeSession:!!visitorId && body.heartbeat===true}});

  } catch (error) {
    console.error('Traffic API failed:', error);
    return sendJson(res, 500, { error: 'Traffic data unavailable' });
  }
}
