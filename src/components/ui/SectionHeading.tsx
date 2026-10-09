interface SectionHeadingProps {
    index: string;
    label: string;
    title: string;
    sub?: string;
}

export const SectionHeading = ({ index, label, title, sub }: SectionHeadingProps) => (
    <div className="mb-8 md:mb-10">
        <p className="font-mono text-xs text-fg-secondary mb-2">
            <span className="text-accent">//</span> {index} · {label}
        </p>
        <h2 className="font-display font-semibold text-2xl md:text-[1.75rem] tracking-tight">
            {title}
        </h2>
        {sub && (
            <p className="text-sm md:text-[15px] text-fg-secondary leading-relaxed mt-2 max-w-2xl">
                {sub}
            </p>
        )}
    </div>
);
