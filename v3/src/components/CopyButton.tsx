import { useState } from 'react';
import { play } from '../lib/sound';

/** The site's absolute root URL ('/' locally, '/new/' on the live site), for links inside copied Markdown. */
export const siteRoot = () => new URL(import.meta.env.BASE_URL, location.origin).href;

/** Copies Markdown to the clipboard and says so. `text` runs on click, so nothing is built until it is needed. */
export function CopyButton({ text, label, className }: { text: () => string; label: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      play('tap');
      setState('done');
    } catch {
      setState('failed'); // no clipboard access (an insecure origin or a denied permission)
    }
    setTimeout(() => setState('idle'), 1800);
  };
  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {state === 'done' ? 'Copied ✓' : state === 'failed' ? 'Couldn’t copy' : label}
    </button>
  );
}
