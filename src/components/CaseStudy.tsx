import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Project } from './sections/Work';

export const CaseStudy = ({ title, category, description, thumbnailUrl, liveUrl, repoUrl, tech, index, onOpen }: Project & { index: number; onOpen: () => void }) => (
    <article className="grid md:grid-cols-2 items-center gap-8 lg:gap-16 py-10 md:py-16 border-t border-border-primary">
        <div className={`min-w-0 ${index % 2 ? 'md:order-2' : ''}`}>
            <p className="font-mono text-xs uppercase tracking-widest text-fg-secondary mb-5">{String(index + 1).padStart(2, '0')} / {category}</p>
            <h3 className="font-display font-black text-4xl lg:text-6xl tracking-tight mb-5">{title}</h3>
            <p className="text-base md:text-lg text-fg-secondary leading-relaxed mb-5 max-w-xl">{description}</p>
            <ul aria-label={`${title} technologies`} className="flex flex-wrap gap-2 mb-7">
                {tech?.slice(0, 5).map(item => <li key={item} className="text-xs px-3 py-1.5 rounded-full border border-border-primary text-fg-secondary">{item}</li>)}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-sm font-semibold">
                <button onClick={onOpen} className="inline-flex gap-2 items-center min-h-11 underline underline-offset-4" aria-label={`View details for ${title}`}>Read case study <ArrowRight size={16} aria-hidden="true" /></button>
                {repoUrl && <a href={repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 min-h-11" aria-label={`${title} on GitHub`}>GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 min-h-11" aria-label={`Visit ${title}`}>Visit site <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
        </div>
        <button onClick={onOpen} className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border-primary bg-bg-secondary text-left" aria-label={`Preview ${title} case study`}>
            {thumbnailUrl ? <img src={thumbnailUrl} alt={`${title} project preview`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="h-full p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#142d34] to-[#081317] text-white"><span className="font-mono text-xs uppercase tracking-widest">Multimodal document intelligence</span><span className="font-display text-6xl lg:text-8xl font-bold">{title}</span><span className="text-sm text-white/70">Text + tables + figures → grounded answers</span></div>}
            <span className="absolute bottom-4 right-4 bg-white text-black rounded-full p-3 shadow-lg"><ArrowUpRight size={20} aria-hidden="true" /></span>
        </button>
    </article>
);
