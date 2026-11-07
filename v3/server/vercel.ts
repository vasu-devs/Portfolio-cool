// The live site's agent: Vercel runs this as /api/agent. `npm run bundle:agent` bundles it (with the site's own copy) into ../api/agent.js, because Vercel builds functions from the root app, which has neither.
// Env on Vercel: GROQ_API_KEY (the model), UPSTASH_REDIS_REST_URL/TOKEN (rate limits).
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleAgent } from './agent.ts';

export default (req: IncomingMessage, res: ServerResponse) => handleAgent(req, res);
