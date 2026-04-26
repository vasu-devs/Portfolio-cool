import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PerfWin {
    metric: string;
    desc: string;
}

interface Section {
    title: string;
    body?: string;
    bullets?: string[];
    perf?: PerfWin[];
}

const SECTIONS: Section[] = [
    {
        title: 'Context',
        body: 'A multi-platform e-commerce business was manually reconciling financial data across several payment processors, an ad platform, and a fulfilment provider. They needed a single internal tool to unify every transaction, attribute every line to the correct product and owner, compute accurate per-product P&L, and surface it on dashboards — with proper audit trails because this is financial data.',
    },
    {
        title: 'Scope delivered',
        bullets: [
            'Next.js 15 + PostgreSQL + Prisma 7 app with a 14-model schema and 24 migrations, deployed to Vercel in the Frankfurt region for database proximity.',
            '5 live platform integrations behind a single ConnectorInterface, each with credential testing, chunked sync, and encrypted credentials at rest.',
            'Full P&L engine handling refunds, chargebacks, processor fees, cross-processor deduplication and multi-currency math.',
            'Interactive dashboard — KPI cards, P&L waterfall, per-product/store/processor breakdowns, period comparison, live filters with instant re-aggregation.',
            'Role-based access control, audit logging, rate limiting, and a complete security-hardening pass before hand-off.',
        ],
    },
    {
        title: 'Performance engineering',
        body: 'Dashboard and sync pipeline were both treated as first-class performance targets. Every win below is measured against the pre-optimisation baseline.',
        perf: [
            { metric: '10×', desc: 'Faster Shopify ingestion via parallel upserts with bounded concurrency and a pre-loaded exchange-rate cache.' },
            { metric: '5–10×', desc: 'Faster overall sync pipeline via parallel enrichment, batched 200-row upserts and a tuned connection pool.' },
            { metric: '~100×', desc: 'Faster historical currency backfill by replacing a row-by-row Prisma migration with a bulk SQL UPDATE ... FROM.' },
            { metric: '>95%', desc: 'Dashboard load-time reduction — eliminated a 7.4-second meta-query bottleneck via composite indexes, Postgres RPC functions, and a pre-aggregated rollup table.' },
            { metric: '500 → 0 ms', desc: 'Dashboard filter latency — moved filter state client-side and pre-fetched both currencies in parallel so toggles fire with no server round-trip.' },
            { metric: '4,500×', desc: 'Faster product attribution by replacing per-row Prisma queries with bulk updateMany grouped by matched product.' },
        ],
    },
    {
        title: 'Architecture',
        bullets: [
            'Tri-format currency storage — every monetary amount persisted in native + base + pre-computed alternate currency, using decimal.js arbitrary-precision math end-to-end. No floating-point money bugs.',
            'Three-phase sync pipeline (fetch → enrich → attribute) with signed continuation tokens that survive Vercel\u2019s 300-second serverless cap and stale-lock auto-recovery.',
            'Pre-aggregated DailyPnlRollup table behind two PostgreSQL RPC functions, so the dashboard resolves set-based aggregations in-database instead of pulling raw rows to the app.',
            '40+ strategic indexes across 14 tables — including composite indexes tuned specifically to P&L filter shapes.',
            'Chunked per-connector sync sized to each API\u2019s real constraints (e.g. PayPal\u2019s hard 31-day window), with resumable continuation via syncLogId + syncSecret.',
        ],
    },
    {
        title: 'Quality & security',
        bullets: [
            '85-test suite covering P&L math, processor deduplication, attribution rules, partner splits, exchange-rate caching — including a golden equivalence test between the legacy Prisma path and the new PostgreSQL RPC.',
            'Three-tier RBAC (OWNER / MANAGER / MEMBER) enforced via Next.js middleware on every protected route and API endpoint.',
            'AES-256-GCM credential encryption at rest, Zod input validation on every route, per-IP rate limiting on sensitive endpoints.',
            'Audit logs + raw-response JSON snapshots on every transaction, order, and expense for full regulatory traceability.',
        ],
    },
];

const HEADLINE_METRICS = [
    { value: '18', label: 'Days, solo' },
    { value: '5', label: 'Integrations' },
    { value: '85', label: 'Tests' },
    { value: '40+', label: 'DB indexes' },
];

const TECH_STACK = [
    'Next.js 15',
    'TypeScript',
    'PostgreSQL',
    'Prisma 7',
    'NextAuth v5',
    'Tailwind 4',
    'Zustand',
    'Recharts',
    'decimal.js',
    'Supabase',
    'Vercel',
];

export const ExperienceModal = ({ isOpen, onClose }: ExperienceModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-[3vw] md:p-[2vw]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
                    />

                    <motion.div
                        initial={{ scale: 0.97, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.97, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-[1100px] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        {/* Sticky header */}
                        <div className="flex justify-between items-start gap-4 px-[6vw] md:px-10 py-[5vw] md:py-6 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md z-10">
                            <div className="min-w-0">
                                <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[1vw] md:mb-2">
                                    Case study · Freelance
                                </span>
                                <h2 className="font-display font-black text-[6vw] md:text-3xl lg:text-4xl leading-tight tracking-tight truncate">
                                    Internal Finance &amp; P&amp;L Platform
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <CopyButton contentId="experience-modal-content" className="flex" />
                                <button
                                    onClick={onClose}
                                    aria-label="Close case study"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <X className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div
                            id="experience-modal-content"
                            className="overflow-y-auto flex-1 overscroll-contain"
                            data-lenis-prevent
                        >
                            <div className="px-[6vw] md:px-10 py-[8vw] md:py-12">
                                {/* Hero block */}
                                <div className="mb-[10vw] md:mb-14 max-w-3xl">
                                    <div className="flex flex-wrap gap-[2vw] md:gap-2 mb-[4vw] md:mb-6">
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Mar 2026 → Apr 2026
                                        </span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Sole engineer
                                        </span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Next.js · PostgreSQL
                                        </span>
                                    </div>
                                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed">
                                        End-to-end build of a production-grade financial reporting platform:
                                        unified transaction ingestion across five live platforms, accurate
                                        multi-currency P&amp;L with full processor-level deduplication, and a
                                        live dashboard that loads in sub-second.
                                    </p>
                                </div>

                                {/* Metric strip */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-4 mb-[12vw] md:mb-16">
                                    {HEADLINE_METRICS.map((m) => (
                                        <div
                                            key={m.label}
                                            className="p-[4vw] md:p-5 rounded-xl border border-border-primary"
                                        >
                                            <div className="font-display font-black text-[8vw] md:text-4xl leading-none mb-[1vw] md:mb-2">
                                                {m.value}
                                            </div>
                                            <div className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary">
                                                {m.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Sections */}
                                <div className="space-y-[14vw] md:space-y-20">
                                    {SECTIONS.map((section, i) => (
                                        <section key={section.title}>
                                            <div className="flex items-baseline gap-[3vw] md:gap-4 mb-[4vw] md:mb-6">
                                                <span className="font-mono text-[2.5vw] md:text-xs text-fg-secondary tabular-nums">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="h-px flex-1 bg-border-primary" />
                                                <h3 className="font-display font-bold text-[5.5vw] md:text-2xl uppercase tracking-tight">
                                                    {section.title}
                                                </h3>
                                            </div>

                                            {section.body && (
                                                <p className="text-[3.8vw] md:text-lg text-fg-secondary leading-relaxed mb-[5vw] md:mb-8 max-w-3xl">
                                                    {section.body}
                                                </p>
                                            )}

                                            {section.bullets && (
                                                <ul className="space-y-[3vw] md:space-y-4 max-w-3xl">
                                                    {section.bullets.map((b, bi) => (
                                                        <li
                                                            key={bi}
                                                            className="relative pl-[6vw] md:pl-8 text-[3.5vw] md:text-base leading-relaxed text-fg-secondary before:content-[''] before:absolute before:left-[1vw] md:before:left-2 before:top-[2vw] md:before:top-3 before:w-[2vw] md:before:w-2 before:h-px before:bg-fg-primary/40"
                                                        >
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {section.perf && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[3vw] md:gap-4">
                                                    {section.perf.map((w) => (
                                                        <div
                                                            key={w.metric}
                                                            className="p-[4vw] md:p-6 rounded-xl border border-border-primary bg-bg-secondary/40 flex gap-[3vw] md:gap-5 items-start"
                                                        >
                                                            <div className="font-display font-black text-[7vw] md:text-3xl leading-none shrink-0 min-w-[20vw] md:min-w-[90px]">
                                                                {w.metric}
                                                            </div>
                                                            <p className="text-[3.2vw] md:text-sm leading-relaxed text-fg-secondary">
                                                                {w.desc}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    ))}
                                </div>

                                {/* Tech stack footer */}
                                <div className="mt-[14vw] md:mt-20 pt-[6vw] md:pt-8 border-t border-border-primary">
                                    <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                        Stack
                                    </span>
                                    <div className="flex flex-wrap gap-[2vw] md:gap-2">
                                        {TECH_STACK.map((t) => (
                                            <span
                                                key={t}
                                                className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono bg-bg-secondary/40 text-fg-secondary"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
