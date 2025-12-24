import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Github, Play } from "lucide-react";
import { MagneticButton } from "./ui/MagneticButton";

export const CaseStudy = ({
    title,
    category,
    description,
    thumbnailUrl,
    repoUrl,
    liveUrl,
    index
}: {
    title: string;
    category: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    repoUrl?: string;
    liveUrl?: string;
    index: number;
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const overallY = useTransform(scrollYProgress, [0, 1], [10, -10]);
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y: overallY }}
            className="min-h-[50vh] md:min-h-[80vh] w-full flex flex-col md:flex-row items-center gap-[8vw] md:gap-[3vw] py-[4vw] md:py-[6vw] border-t border-border-primary"
        >
            {/* Text Side */}
            <div className={`flex-1 w-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-mono text-[2.5vw] md:text-[0.8vw] text-fg-secondary uppercase tracking-widest mb-[3vw] md:mb-[1vw] block"
                >
                    0{index + 1} // {category}
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-display font-black text-[8vw] md:text-[4vw] mb-[4vw] md:mb-[1.5vw] uppercase leading-[0.95] md:leading-[0.9]"
                >
                    {title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-[4vw] md:text-[1.2vw] text-fg-secondary leading-relaxed mb-[6vw] md:mb-[2vw] max-w-md"
                >
                    {description}
                </motion.p>

                <div className="flex gap-[4vw] md:gap-[1vw]">
                    {liveUrl && (
                        <MagneticButton>
                            <a href={liveUrl} target="_blank" className="flex items-center gap-[2vw] md:gap-[0.5vw] px-[6vw] md:px-[1.5vw] py-[3vw] md:py-[0.75vw] bg-fg-primary text-bg-primary font-bold font-mono text-[2.5vw] md:text-[0.8vw] uppercase hover:scale-105 transition-transform">
                                Live_Demo <ArrowUpRight className="w-[4vw] h-[4vw] md:w-[1vw] md:h-[1vw]" />
                            </a>
                        </MagneticButton>
                    )}
                    {repoUrl && (
                        <MagneticButton>
                            <a href={repoUrl} target="_blank" className="flex items-center gap-[2vw] md:gap-[0.5vw] px-[6vw] md:px-[1.5vw] py-[3vw] md:py-[0.75vw] border border-border-primary font-bold font-mono text-[2.5vw] md:text-[0.8vw] uppercase hover:bg-bg-secondary transition-colors">
                                Source_Code <Github className="w-[4vw] h-[4vw] md:w-[1vw] md:h-[1vw]" />
                            </a>
                        </MagneticButton>
                    )}
                </div>
            </div>

            {/* Visual Side */}
            <div
                className="flex-1 w-full aspect-video md:aspect-[4/3] bg-bg-secondary relative overflow-hidden rounded-xl border border-border-primary group cursor-pointer"
                onClick={() => {
                    // Ensure it triggers parent's openModal if needed, 
                    // but CaseStudy is already wrapped in a clickable div in Work.tsx.
                }}
            >
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-border-primary opacity-50" />
                    )}
                </motion.div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play Button Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[15vw] h-[15vw] md:w-[4vw] md:h-[4vw] rounded-full bg-fg-primary/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                        <Play className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw] text-white fill-white translate-x-0.5" />
                    </div>
                </div>

                {/* Watch Demo Hint */}
                <div className="absolute bottom-[4vw] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="bg-fg-primary text-bg-primary px-[4vw] md:px-[1.2vw] py-[2vw] md:py-[0.6vw] rounded-full font-mono text-[2.5vw] md:text-[0.65vw] uppercase font-black tracking-widest shadow-2xl">
                        Watch_Demo
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
