const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const match = process.argv[2] || 'portfolio:*';

if (!url || !token) {
  console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

const redisPipeline = async (commands) => {
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(commands),
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

  return results.map((item) => item.result);
};

let cursor = '0';
const keys = [];

do {
  const [scanResult] = await redisPipeline([
    ['SCAN', cursor, 'MATCH', match, 'COUNT', 100],
  ]);

  cursor = String(scanResult?.[0] || '0');
  const batch = Array.isArray(scanResult?.[1]) ? scanResult[1] : [];
  keys.push(...batch);
} while (cursor !== '0' && keys.length < 1000);

if (!keys.length) {
  console.log(JSON.stringify({ match, keys: [] }, null, 2));
  process.exit(0);
}

const types = await redisPipeline(keys.map((key) => ['TYPE', key]));
const valueCommands = keys.map((key, index) => {
  const type = types[index];

  if (type === 'string') return ['GET', key];
  if (type === 'zset') return ['ZCARD', key];
  if (type === 'set') return ['SCARD', key];
  if (type === 'hash') return ['HLEN', key];
  if (type === 'list') return ['LLEN', key];

  return ['TYPE', key];
});

const values = await redisPipeline(valueCommands);
const entries = keys.map((key, index) => ({
  key,
  type: types[index],
  value: values[index],
}));

console.log(JSON.stringify({ match, count: entries.length, entries }, null, 2));
