import { useEffect, useRef } from 'react';

// Keep keyboard interaction in the open dialog and restore the invoking control.
export function useDialog(open: boolean, onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);
    const close = useRef(onClose);
    close.current = onClose;
    useEffect(() => {
        if (!open) return;
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex="0"]') ?? []).filter(el => el.getClientRects().length > 0);
        const focusFirst = () => (focusable()[0] ?? ref.current)?.focus();
        focusFirst();
        const onFocus = (event: FocusEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) focusFirst();
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); close.current(); }
            if (event.key !== 'Tab') return;
            const items = focusable();
            if (!items.length) { event.preventDefault(); ref.current?.focus(); return; }
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('focusin', onFocus);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('focusin', onFocus);
            document.body.style.overflow = overflow;
            previous?.focus();
        };
    }, [open]);
    return ref;
}
