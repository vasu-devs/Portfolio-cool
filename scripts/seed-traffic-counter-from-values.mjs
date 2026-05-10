const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const [viewsArg, uniqueArg] = process.argv.slice(2);
const totalViews = Number(process.env.TRAFFIC_TOTAL_VIEWS ?? viewsArg);
const uniqueVisitors = Number(process.env.TRAFFIC_UNIQUE_VISITORS ?? uniqueArg);

if (!url || !token) {
  console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

if (!Number.isInteger(totalViews) || totalViews < 0) {
  console.error('TRAFFIC_TOTAL_VIEWS must be a non-negative integer');
  process.exit(1);
}

if (!Number.isInteger(uniqueVisitors) || uniqueVisitors < 0) {
  console.error('TRAFFIC_UNIQUE_VISITORS must be a non-negative integer');
  process.exit(1);
}

const response = await fetch(`${url}/pipeline`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify([
    ['SET', 'portfolio:traffic:views', String(totalViews)],
    ['SET', 'portfolio:traffic:unique-visitors', String(uniqueVisitors)],
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

console.log(JSON.stringify({ totalViews, uniqueVisitors, seeded: true }, null, 2));
