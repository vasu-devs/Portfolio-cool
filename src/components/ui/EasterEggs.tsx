import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
    id: number;
    title: string;
    body?: string;
    href?: string;
}

const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

const CONSOLE_ART = `
%c
  ┌─────────────────────────────────────┐
  │                                     │
  │   Vasu DevS — AI Engineer           │
  │                                     │
  │   You opened the console.           │
  │   I like you already.               │
  │                                     │
  │   Try: ↑ ↑ ↓ ↓ ← → ← → B A          │
  │   Or just type "hire" anywhere.     │
  │                                     │
  │   github.com/vasu-devs              │
  │                                     │
  └─────────────────────────────────────┘
`;

const isTypingTarget = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return false;
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
};

export const EasterEggs = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [partyMode, setPartyMode] = useState(false);
    const konamiIndex = useRef(0);
    const typedBuffer = useRef('');
    const toastId = useRef(0);

    const pushToast = useCallback((title: string, body?: string, href?: string) => {
        const id = ++toastId.current;
        setToasts((prev) => [...prev.slice(-2), { id, title, body, href }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    // Console greeting
    useEffect(() => {
        console.log(CONSOLE_ART, 'color: #d9480f; font-family: monospace;');
    }, []);

    // Party mode applies a slow hue-rotate to the whole page
    useEffect(() => {
        document.documentElement.classList.toggle('party-mode', partyMode);
        return () => document.documentElement.classList.remove('party-mode');
    }, [partyMode]);

    // Keyboard listeners: Konami code + "hire" typing
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (isTypingTarget(e.target)) return;

            // Konami
            const expected = KONAMI[konamiIndex.current];
            if (e.key === expected || e.key.toLowerCase() === expected) {
                konamiIndex.current += 1;
                if (konamiIndex.current === KONAMI.length) {
                    konamiIndex.current = 0;
                    setPartyMode((on) => {
                        pushToast(
                            on ? 'Party over.' : '🎉 Party mode unlocked',
                            on ? 'Back to tasteful minimalism.' : 'The whole site is hue-cycling. Konami again to stop.'
                        );
                        return !on;
                    });
                }
            } else {
                konamiIndex.current = e.key === KONAMI[0] ? 1 : 0;
            }

            // "hire" buffer
            if (e.key.length === 1) {
                typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-4);
                if (typedBuffer.current === 'hire') {
                    typedBuffer.current = '';
                    pushToast(
                        'You typed the magic word.',
                        'Smart move. Let’s talk →',
                        'https://cal.com/vasu-devs'
                    );
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [pushToast]);

    // Wordmark secret (fired from Header)
    useEffect(() => {
        const onWordmark = () => {
            pushToast(
                'Persistent, aren’t you?',
                'Five clicks on a logo. That’s the energy I bring to debugging.'
            );
        };
        window.addEventListener('egg:wordmark', onWordmark);
        return () => window.removeEventListener('egg:wordmark', onWordmark);
    }, [pushToast]);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none px-4 w-full sm:w-auto">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-auto bg-fg-primary text-bg-primary rounded-lg px-5 py-3.5 shadow-xl max-w-sm w-full sm:w-auto"
                    >
                        <p className="font-display text-base leading-snug">{t.title}</p>
                        {t.body && (
                            t.href ? (
                                <a
                                    href={t.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-[11px] uppercase tracking-[0.15em] opacity-80 hover:opacity-100 underline underline-offset-4 mt-1 block"
                                >
                                    {t.body}
                                </a>
                            ) : (
                                <p className="font-mono text-[11px] uppercase tracking-[0.15em] opacity-70 mt-1">
                                    {t.body}
                                </p>
                            )
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
