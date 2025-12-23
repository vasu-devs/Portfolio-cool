import { motion } from 'framer-motion';
import GitHubCalendar from 'react-github-calendar';
import { Mail, Calendar, Coffee } from 'lucide-react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { ResumeButton } from '../ui/ResumeButton';

interface FooterProps {
    theme: 'light' | 'dark';
}

export const Footer = ({ theme }: FooterProps) => {
    return (
        <footer id="contact" className="min-h-[80vh] flex flex-col justify-between pt-24 relative">
            <Container>
                <div className="flex flex-col gap-12 md:gap-20">
                    {/* Top Row: Heading & Heatmap */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-4"
                        >
                            <h2 className="font-display font-black text-[22vw] md:text-[10vw] leading-[0.75] tracking-tighter uppercase">
                                Let's<br />Talk.
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="md:col-span-8 flex flex-col justify-between mt-12 h-full ml-12"
                        >
                            <div className="bg-bg-secondary/50 p-8 rounded-2xl border border-border-primary backdrop-blur-sm overflow-visible">
                                <GitHubCalendar
                                    username="vasu-devs"
                                    colorScheme={theme === 'dark' ? 'dark' : 'light'}
                                    blockSize={12}
                                    blockMargin={2}
                                    fontSize={14}
                                    style={{
                                        color: theme === 'dark' ? '#ffffff' : '#050505',
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Row: Actions (Single Line) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-nowrap gap-4 items-center justify-center overflow-x-auto pb-2 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {[
                            { href: "mailto:siddhvasudev1402@gmail.com", icon: <Mail size={18} />, label: "siddhvasudev1402@gmail.com", className: "bg-fg-primary text-bg-primary" },
                            { href: "https://cal.com/vasudev-siddh-bjemxn", icon: <Calendar size={18} />, label: "Book a call", className: "border border-border-primary hover:bg-bg-secondary" },
                            { href: "https://buymeacoffee.com/vasu.devs", icon: <Coffee size={18} />, label: "Buy me a coffee", className: "bg-[#FFDD00] text-black border border-transparent hover:border-black" }
                        ].map((btn, i) => (
                            <MagneticButton key={i}>
                                <a
                                    href={btn.href}
                                    target={btn.href.startsWith('http') ? "_blank" : undefined}
                                    className={`px-8 py-4 rounded-full font-bold font-mono text-sm uppercase transition-all flex items-center gap-2 whitespace-nowrap ${btn.className}`}
                                >
                                    {btn.icon} {btn.label}
                                </a>
                            </MagneticButton>
                        ))}
                        <ResumeButton className="font-bold border border-border-primary hover:bg-bg-secondary" />
                    </motion.div>
                </div>
            </Container>

            <Container className="flex justify-between items-end text-xs pt-12 font-mono uppercase text-fg-secondary">
                <span>© 2025 Vasu-DevS</span>
                <div className="flex gap-6">
                    <a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">GitHub</a>
                    <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">Twitter</a>
                    <a href="https://linkedin.com/in/vasu-devs" target="_blank" rel="noopener noreferrer" className="hover:text-fg-primary transition-colors">LinkedIn</a>
                </div>
            </Container>

            {/* Bottom Watermark - Separate & Faded */}
            <div className="w-full flex justify-center items-end mt-12 overflow-hidden pointer-events-none select-none">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 0.3, y: 16 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="font-display font-black text-[20.5vw] leading-[0.8] bg-gradient-to-b from-fg-primary to-transparent bg-clip-text text-transparent tracking-tighter uppercase whitespace-nowrap transform"
                >
                    Vasu-DevS
                </motion.h1>
            </div>
        </footer>
    );
};
