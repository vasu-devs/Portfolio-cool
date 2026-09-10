import { useDialog } from '../../hooks/useDialog';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface StealthExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import experienceData from '../../data/experience.json';

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

const HEADLINE_METRICS = experienceData.roles[0].metrics ?? [];
const SECTIONS: Section[] = experienceData.roles[0].sections ?? [];
const TECH_STACK = experienceData.roles[0].tech;

export const StealthExperienceModal = ({ isOpen, onClose }: StealthExperienceModalProps) => {
    const dialogRef = useDialog(isOpen, onClose);

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
                        ref={dialogRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-label={'withlayer.ai internship'}
                        className="relative w-full max-w-[1100px] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        <div className="flex justify-between items-start gap-4 px-[6vw] md:px-10 py-[5vw] md:py-6 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md z-10">
                            <div className="min-w-0">
                                <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[1vw] md:mb-2">
                                    Experience / Internship
                                </span>
                                <h2 className="font-display font-black text-[6vw] md:text-3xl lg:text-4xl leading-tight tracking-tight truncate">
                                    {experienceData.roles[0].company}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <CopyButton contentId="stealth-modal-content" className="flex" />
                                <button
                                    onClick={onClose}
                                    aria-label="Close internship overview"
                                    className="p-[2vw] md:p-2 rounded-full border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
                                >
                                    <X className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        <div
                            id="stealth-modal-content"
                            className="overflow-y-auto flex-1 overscroll-contain"
                            data-lenis-prevent
                        >
                            <div className="px-[6vw] md:px-10 py-[8vw] md:py-12">
                                <div className="mb-[10vw] md:mb-14 max-w-3xl">
                                    <div className="flex flex-wrap gap-[2vw] md:gap-2 mb-[4vw] md:mb-6">
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Jun 2026 → Present
                                        </span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">AI Engineering Intern</span>
                                        <span className="px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full border border-border-primary text-[2.5vw] md:text-xs font-mono uppercase tracking-widest text-fg-secondary">
                                            Applied AI
                                        </span>
                                    </div>
                                    <p className="text-[4vw] md:text-xl text-fg-secondary leading-relaxed">
                                        {experienceData.roles[0].summary}
                                    </p>
                                </div>

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
                                                            <div className="font-display font-black text-[6vw] md:text-2xl leading-none shrink-0 min-w-[24vw] md:min-w-[110px]">
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

                                <div className="mt-[14vw] md:mt-20 pt-[6vw] md:pt-8 border-t border-border-primary">
                                    <span className="font-mono text-[2.5vw] md:text-xs uppercase tracking-widest text-fg-secondary block mb-[3vw] md:mb-4">
                                        Technologies
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
