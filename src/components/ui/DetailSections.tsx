export interface DetailSection {
    title: string;
    body?: string;
    bullets?: string[];
}

interface DetailSectionsProps {
    sections: DetailSection[];
}

export const DetailSections = ({ sections }: DetailSectionsProps) => {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="space-y-[7vw] md:space-y-9">
            {sections.map((s, i) => (
                <section key={i}>
                    <div className="flex items-baseline gap-[3vw] md:gap-3 mb-[3vw] md:mb-4">
                        <span className="font-mono text-[2.5vw] md:text-xs text-fg-secondary tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="h-px flex-1 bg-border-primary" />
                        <h4 className="font-mono text-[2.8vw] md:text-xs uppercase tracking-widest text-fg-primary">
                            {s.title}
                        </h4>
                    </div>
                    {s.body && (
                        <p className="text-[3.5vw] md:text-base text-fg-secondary leading-relaxed whitespace-pre-line">
                            {s.body}
                        </p>
                    )}
                    {s.bullets && s.bullets.length > 0 && (
                        <ul className={`space-y-[2vw] md:space-y-2.5 ${s.body ? 'mt-[3vw] md:mt-4' : ''}`}>
                            {s.bullets.map((b, bi) => (
                                <li
                                    key={bi}
                                    className="relative pl-[5vw] md:pl-6 text-[3.5vw] md:text-base leading-relaxed text-fg-secondary before:content-[''] before:absolute before:left-[1vw] md:before:left-2 before:top-[2.2vw] md:before:top-3 before:w-[2vw] md:before:w-2 before:h-px before:bg-fg-primary/40"
                                >
                                    {b}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </div>
    );
};
