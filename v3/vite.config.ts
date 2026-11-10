import react from '@vitejs/plugin-react';
import { createReadStream } from 'node:fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { handleAgent } from './server/agent.ts';
import { seo } from './scripts/seo.ts';

// Serves the agent endpoint from the dev and preview servers so the whole site runs locally.
const agentApi = (): Plugin => ({
  name: 'agent-api',
  configureServer: (server) => void server.middlewares.use('/api/agent', handleAgent),
  configurePreviewServer: (server) => void server.middlewares.use('/api/agent', handleAgent),
});

// The résumé files live in the main site's public/ folder (the build ships them from there); the dev server reads them
// from the same place, so the sheet's Download PDF works locally.
const resumeFiles = (): Plugin => ({
  name: 'resume-files',
  configureServer: (server) => void server.middlewares.use((req, res, next) => {
    const ext = /^\/resume\.(html|pdf)(\?|$)/.exec(req.url ?? '')?.[1];
    if (!ext) return next();
    res.setHeader('Content-Type', ext === 'pdf' ? 'application/pdf' : 'text/html; charset=utf-8');
    createReadStream(new URL(`../public/resume.${ext}`, import.meta.url)).pipe(res);
  }),
});

export default defineConfig(({ mode }) => {
  // .env.local (gitignored) may hold GROQ_API_KEY; the handler reads process.env.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GROQ_API_KEY && !process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  // Local servers fall back to the Codex CLI login; AGENT_CODEX=0 in .env.local turns that off.
  process.env.AGENT_CODEX ??= env.AGENT_CODEX || '1';
  // The project copy lives in the main site's scripts/ folder, one level up; let the dev server read it.
  return { plugins: [react(), agentApi(), resumeFiles(), seo()], server: { fs: { allow: ['..'] } } };
});
