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
    const overallY = useTransform(scrollYProgress, [0, 1], [10, -10]); // Reduced parallax on mobile
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0] // Keep visible longer
    );

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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-fg-primary text-bg-primary px-[4vw] md:px-[1vw] py-[2vw] md:py-[0.5vw] rounded-full font-mono text-[2.5vw] md:text-[0.6vw] uppercase font-bold flex items-center gap-[2vw] md:gap-[0.5vw] pointer-events-none transform scale-90 group-hover:scale-100 z-20 whitespace-nowrap shadow-2xl">
                    <Play className="w-[2.5vw] h-[2.5vw] md:w-[0.6vw] md:h-[0.6vw]" fill="currentColor" /> Watch Demo
                </div>
            </div>
        </motion.div>
    );
};
