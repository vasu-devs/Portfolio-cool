// Local-only model: asks the Codex CLI (the developer's ChatGPT login) in a read-only, throwaway sandbox.
// shortcut: spawns one CLI process per question (~6 s); replace with a hosted model API before deploying.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export const codexEnabled = () => process.env.AGENT_CODEX === '1';

export function askCodex(prompt: string, timeoutMs = 45_000): Promise<string> {
  // An empty working dir under /var/tmp (on disk, not the RAM-backed /tmp) gives the sandbox nothing to read.
  const dir = mkdtempSync(join(process.env.AGENT_TMP ?? '/var/tmp', 'portfolio-agent-'));
  const out = join(dir, 'answer.txt');
  return new Promise((resolve, reject) => {
    const child = spawn('codex', ['exec', '--sandbox', 'read-only', '--ephemeral', '--skip-git-repo-check', '--ignore-user-config', '--ignore-rules', '-c', 'model_reasoning_effort="low"', '--color', 'never', '-o', out, '-'], { cwd: dir, stdio: ['pipe', 'ignore', 'ignore'] });
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timer);
      try {
        const text = readFileSync(out, 'utf8').trim();
        code === 0 && text ? resolve(text) : reject(new Error(`E_AGENT_CODEX_${code}`));
      } catch {
        reject(new Error(`E_AGENT_CODEX_${code}`));
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
    child.stdin.end(prompt);
  });
}
