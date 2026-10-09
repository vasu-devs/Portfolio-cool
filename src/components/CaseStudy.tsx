import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export const CaseStudy = ({
    title,
    category,
    description,
    thumbnailUrl,
    liveUrl,
    tech,
    index
}: {
    title: string;
    category: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    liveUrl?: string;
    tech?: string[];
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.5, delay: Math.min((index % 2) * 0.08, 0.2), ease: [0.22, 1, 0.36, 1] }}
            className="h-full flex flex-col border border-border-primary rounded-xl bg-bg-primary overflow-hidden transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]"
        >
            {/* Cover */}
            <div className="relative aspect-[16/9] bg-bg-secondary overflow-hidden border-b border-border-primary">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`${title} — ${category} preview`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-border-primary" />
                )}
                <div className="absolute inset-0 bg-fg-primary/0 group-hover:bg-fg-primary/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 bg-bg-primary text-fg-primary px-4 py-2 rounded-md font-mono text-xs opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Play size={12} className="fill-current" />
                        watch demo
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-display font-semibold text-lg tracking-tight group-hover:text-accent transition-colors duration-300">
                        {title}
                    </h3>
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline underline-offset-4"
                        >
                            live
                            <ArrowUpRight size={11} />
                        </a>
                    )}
                </div>
                <p className="font-mono text-[10px] text-fg-secondary uppercase tracking-wider mb-3">
                    {category}
                </p>
                <p className="text-sm text-fg-secondary leading-relaxed mb-4 flex-1">
                    {description}
                </p>
                {tech && tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tech.slice(0, 5).map((t) => (
                            <span key={t} className="font-mono text-[10px] text-fg-secondary bg-bg-secondary border border-border-primary rounded px-1.5 py-0.5">
                                {t}
                            </span>
                        ))}
                        {tech.length > 5 && (
                            <span className="font-mono text-[10px] text-fg-secondary px-1 py-0.5">
                                +{tech.length - 5}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
