const [viewsArg, uniqueArg] = process.argv.slice(2);

const views = Number(viewsArg);
const uniqueVisitors = Number(uniqueArg);

if (!Number.isInteger(views) || views < 0 || !Number.isInteger(uniqueVisitors) || uniqueVisitors < 0) {
  console.error('Usage: node scripts/seed-traffic-counter.mjs <views> <uniqueVisitors>');
  process.exit(1);
}

const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN.');
  process.exit(1);
}

const response = await fetch(`${url}/pipeline`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify([
    ['SET', 'portfolio:traffic:views', views],
    ['SET', 'portfolio:traffic:unique-visitors', uniqueVisitors],
  ]),
});

if (!response.ok) {
  console.error(`Upstash returned ${response.status}`);
  process.exit(1);
}

const result = await response.json();
const error = result.find((item) => item.error);

if (error) {
  console.error(error.error);
  process.exit(1);
}

console.log(`Seeded traffic counter: ${views} views, ${uniqueVisitors} unique visitors.`);
