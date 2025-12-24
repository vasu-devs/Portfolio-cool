import { motion } from 'framer-motion';
import GitHubCalendar from 'react-github-calendar';
import { Mail, Calendar, Coffee } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { ResumeButton } from '../ui/ResumeButton';

interface FooterProps {
    theme: 'light' | 'dark';
    onResumeClick?: () => void;
}

export const Footer = ({ theme, onResumeClick }: FooterProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to December when the calendar container becomes visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && scrollContainerRef.current) {
                        // Small delay to ensure calendar has rendered
                        setTimeout(() => {
                            if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
                            }
                        }, 300);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (scrollContainerRef.current) {
            observer.observe(scrollContainerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <footer id="contact" className="min-h-[80vh] flex flex-col justify-between pt-[2vw] md:pt-4 relative">
            <Container>
                <div className="flex flex-col gap-[12vw] md:gap-12">
                    {/* Top Row: Heading & Heatmap */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-[8vw] md:gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-4"
                        >
                            <h2 className="font-display font-black text-[16vw] md:text-9xl lg:text-[12rem] leading-[0.75] tracking-tighter uppercase text-center md:text-left">
                                Let's<br />Talk.
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="col-span-1 md:col-span-8 flex flex-col justify-between mt-[8vw] md:mt-8 h-full md:ml-8"
                        >
                            <div className="bg-bg-secondary/50 p-[4vw] md:p-6 rounded-2xl border border-border-primary backdrop-blur-sm overflow-visible">
                                <div className="overflow-x-auto pb-4" ref={scrollContainerRef}>
                                    <div className="min-w-0 md:min-w-0 flex flex-row-reverse">
                                        <GitHubCalendar
                                            username="vasu-devs"
                                            colorScheme={theme === 'dark' ? 'dark' : 'light'}
                                            blockSize={window.innerWidth < 768 ? 15 : 18}
                                            blockMargin={6}
                                            fontSize={window.innerWidth < 768 ? 14 : 16}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Row: Actions (Single Line) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap md:flex-nowrap gap-[3vw] md:gap-3 items-center justify-center w-full"
                    >
                        {[
                            { href: "mailto:siddhvasudev1402@gmail.com", icon: <Mail className="w-[4.5vw] h-[4.5vw] md:w-5 md:h-5" />, label: "siddhvasudev1402@gmail.com", className: "bg-fg-primary text-bg-primary" },
                            { href: "https://cal.com/vasudev-siddh-bjemxn", icon: <Calendar className="w-[4.5vw] h-[4.5vw] md:w-5 md:h-5" />, label: "Book a call", className: "border border-border-primary hover:bg-bg-secondary" },
                            { href: "https://buymeacoffee.com/vasu.devs", icon: <Coffee className="w-[4.5vw] h-[4.5vw] md:w-5 md:h-5" />, label: "Buy me a coffee", className: "bg-[#FFDD00] text-black border border-transparent hover:border-black" }
                        ].map((btn, i) => (
                            <MagneticButton key={i}>
                                <a
                                    href={btn.href}
                                    target={btn.href.startsWith('http') ? "_blank" : undefined}
                                    className={`px-[6vw] md:px-8 py-[3vw] md:py-4 rounded-full font-bold font-mono text-[2.5vw] md:text-base uppercase transition-all flex items-center gap-[2vw] md:gap-3 whitespace-nowrap ${btn.className}`}
                                >
                                    {btn.icon} {btn.label}
                                </a>
                            </MagneticButton>
                        ))}
                        <ResumeButton
                            className="font-bold border border-border-primary hover:bg-bg-secondary"
                            onClick={onResumeClick}
                        />
                    </motion.div>
                </div>
            </Container>

            <Container className="flex justify-between items-end text-[3vw] md:text-sm pt-[3vw] md:pt-6 font-mono uppercase text-fg-secondary">
                <span>© 2025 Vasu-DevS</span>
                <div className="flex gap-[6vw] md:gap-4">
                    <a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">GitHub</a>
                    <a href="https://twitter.com/Vasu_DevS" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">Twitter</a>
                    <a href="https://linkedin.com/in/vasudev-siddh/" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">LinkedIn</a>
                </div>
            </Container>

            {/* Bottom Watermark - Separate & Faded - keeping vw for decorative scaling */}
            <div className="w-full flex justify-center items-end mt-[3vw] md:mt-4 overflow-hidden pointer-events-none select-none">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 0.3, y: 16 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="font-display font-black text-[24vw] md:text-[20.5vw] leading-[0.7] bg-gradient-to-b from-fg-primary to-transparent bg-clip-text text-transparent tracking-tighter uppercase whitespace-nowrap transform"
                >
                    Vasu-DevS
                </motion.h1>
            </div>
        </footer>
    );
};
