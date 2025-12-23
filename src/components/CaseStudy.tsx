import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Github, Play } from "lucide-react";
import { MagneticButton } from "./ui/MagneticButton";

export const CaseStudy = ({
    title,
    category,
    description,
    videoUrl,
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Hover play prevented:", e));
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <motion.div
            ref={ref}
            style={{ opacity }}
            className="min-h-[80vh] w-full flex flex-col md:flex-row items-center gap-12 py-24 border-t border-border-primary"
        >
            {/* Text Side */}
            <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <span className="font-mono text-xs text-fg-secondary uppercase tracking-widest mb-4 block">
                    0{index + 1} // {category}
                </span>
                <h2 className="font-display font-black text-4xl md:text-6xl mb-6 uppercase leading-[0.9]">
                    {title}
                </h2>
                <p className="text-lg text-fg-secondary leading-relaxed mb-8 max-w-md">
                    {description}
                </p>

                <div className="flex gap-4">
                    {liveUrl && (
                        <MagneticButton>
                            <a href={liveUrl} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-fg-primary text-bg-primary font-bold font-mono text-xs uppercase hover:scale-105 transition-transform">
                                Live_Demo <ArrowUpRight size={16} />
                            </a>
                        </MagneticButton>
                    )}
                    {repoUrl && (
                        <MagneticButton>
                            <a href={repoUrl} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-border-primary font-bold font-mono text-xs uppercase hover:bg-bg-secondary transition-colors">
                                Source_Code <Github size={16} />
                            </a>
                        </MagneticButton>
                    )}
                </div>
            </div>

            {/* Visual Side */}
            <div
                className="flex-1 w-full aspect-video md:aspect-[4/3] bg-bg-secondary relative overflow-hidden rounded-lg border border-border-primary group cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
                    {videoUrl ? (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            poster={thumbnailUrl}
                            muted
                            loop
                            playsInline
                            preload="none"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-border-primary opacity-50" />
                    )}
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />

                {/* Watch Demo Hint - Only on Media Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-fg-primary text-bg-primary px-4 py-2 rounded-full font-mono text-[10px] uppercase font-bold flex items-center gap-2 pointer-events-none transform scale-90 group-hover:scale-100 z-20 whitespace-nowrap shadow-2xl">
                    <Play size={10} fill="currentColor" /> Watch Demo
                </div>
            </div>
        </motion.div>
    );
};
