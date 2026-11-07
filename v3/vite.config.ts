import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { handleAgent } from './server/agent.ts';

// Serves the agent endpoint from the dev and preview servers so the whole site runs locally.
const agentApi = (): Plugin => ({
  name: 'agent-api',
  configureServer: (server) => void server.middlewares.use('/api/agent', handleAgent),
  configurePreviewServer: (server) => void server.middlewares.use('/api/agent', handleAgent),
});

export default defineConfig(({ mode }) => {
  // .env.local (gitignored) may hold ANTHROPIC_API_KEY; the handler reads process.env.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
  // Local servers fall back to the Codex CLI login; AGENT_CODEX=0 in .env.local turns that off.
  process.env.AGENT_CODEX ??= env.AGENT_CODEX || '1';
  // The project copy lives in the main site's scripts/ folder, one level up; let the dev server read it.
  return { plugins: [react(), agentApi()], server: { fs: { allow: ['..'] } } };
});
