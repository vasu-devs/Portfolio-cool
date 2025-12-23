import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { ResumeButton } from '../ui/ResumeButton';

interface HeroProps {
    theme?: 'light' | 'dark';
}

export const Hero = ({ theme = 'dark' }: HeroProps) => {
    return (
        <section id="hero" className="min-h-[85vh] md:min-h-[90vh] relative flex flex-col pb-0 overflow-visible">
            {/* Split Background */}
            <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                <div className={`h-[62%] w-full transition-colors duration-700 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
                <div className="h-[38%] w-full transition-colors duration-700 bg-bg-primary" />
            </div>

            <Container className="relative z-10 h-full flex flex-col pt-10 md:pt-16 pb-4 md:pb-10 overflow-visible">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end md:items-start overflow-visible"
                >
                    {/* Left Column: Text - Added pt to match image gap */}
                    <div className="order-2 md:order-1 md:row-start-1 md:col-start-1 md:col-span-7 relative z-30 pointer-events-none pt-6 md:pt-12 mix-blend-exclusion">
                        {/* Huge Heading */}
                        <div className="-translate-y-36 md:translate-y-0">
                            <h1 className={`font-display font-black text-[22vw] md:text-[10vw] leading-[0.75] md:leading-[0.85] tracking-tighter uppercase mb-4 md:mb-8 drop-shadow-2xl ${theme === 'dark' ? 'text-black' : 'text-white'}`}>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="block"
                                >
                                    Code.
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="block"
                                >
                                    Story.
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="block"
                                >
                                    Impact.
                                </motion.span>
                            </h1>
                        </div>

                        {/* Description & Links - Now also in mix-blend-exclusion for reactive inversion */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="pt-4 md:pt-8 w-full pointer-events-auto -mt-16 md:mt-0"
                        >
                            <p className="max-w-xl text-sm md:text-2xl text-fg-secondary leading-relaxed font-light drop-shadow-md mb-4 md:mb-8">
                                I am a <strong className="text-fg-primary font-bold">Full Stack AI Engineer</strong> based in India.
                                Building <strong className="text-fg-primary">AI Agents</strong> and <strong className="text-fg-primary">Intelligent Systems</strong>.
                            </p>

                            <div className="flex flex-wrap gap-4 relative z-20">
                                <MagneticButton>
                                    <a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-3 md:p-4 rounded-full border border-border-primary hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Github size={18} className="md:w-5 md:h-5" />
                                    </a>
                                </MagneticButton>
                                <MagneticButton>
                                    <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="p-3 md:p-4 rounded-full border border-border-primary hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Twitter size={18} className="md:w-5 md:h-5" />
                                    </a>
                                </MagneticButton>
                                <MagneticButton>
                                    <a href="https://www.linkedin.com/in/vasu-devs/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-3 md:p-4 rounded-full border border-border-primary hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Linkedin size={18} className="md:w-5 md:h-5" />
                                    </a>
                                </MagneticButton>
                                <ResumeButton />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Image - THEME-AWARE, STATIC (Requested) */}
                    <div className="order-1 md:order-2 absolute md:relative inset-0 md:inset-auto md:row-start-1 md:col-start-6 md:col-span-7 flex justify-center md:justify-end items-center md:items-start z-10 pointer-events-none overflow-visible">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-full h-full md:h-auto relative md:opacity-100 transition-opacity duration-1000 overflow-visible"
                        >
                            {/* Mobile Gradient Mask - Tuned for even higher image */}
                            <div className="absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent md:hidden z-20" />

                            {/* User's Hero Image - PREMIUM REFINED AESTHETICS, ELEVATED, STATIC */}
                            <motion.img
                                src="/Pic/Hero.png"
                                alt="Vasu - Applied AI Engineer"
                                initial={false}
                                animate={{
                                    filter: theme === 'dark'
                                        ? 'grayscale(10%) contrast(125%) brightness(1.1) saturate(1.15)'
                                        : 'grayscale(15%) contrast(110%) brightness(0.95) saturate(1.1)',
                                }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full h-[95%] md:h-full object-contain object-bottom md:object-top drop-shadow-2xl z-10 md:scale-110 md:-translate-y-24"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-secondary">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12 bg-gradient-to-b from-fg-primary to-transparent"
                    />
                </motion.div>
            </Container>
        </section>
    );
};
