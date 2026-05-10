const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

const response = await fetch(`${url}/pipeline`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify([
    ['GET', 'portfolio:traffic:views'],
    ['GET', 'portfolio:traffic:unique-visitors'],
  ]),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`Upstash returned ${response.status}: ${body}`);
}

const results = await response.json();
const error = results.find((item) => item.error);

if (error) {
  throw new Error(error.error);
}

const toCount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const payload = {
  totalViews: toCount(results[0]?.result),
  uniqueVisitors: toCount(results[1]?.result),
};

console.log(JSON.stringify(payload, null, 2));
