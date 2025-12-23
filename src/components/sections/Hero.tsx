import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { ResumeButton } from '../ui/ResumeButton';

export const Hero = () => {
    return (
        <header className="h-screen flex flex-col justify-end pt-32 pb-24 relative overflow-hidden">
            {/* Background Image - Simplified */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/20 via-bg-primary to-bg-primary" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-bg-primary to-bg-primary opacity-50" />
            </div>

            <Container className="relative z-10 h-full flex flex-col justify-end pt-20 pb-12 md:pb-10 overflow-visible">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
                >
                    {/* Left Column: Text */}
                    <div className="order-2 md:order-1 md:row-start-1 md:col-start-1 md:col-span-7 relative z-30 pointer-events-none mix-blend-exclusion md:translate-y-8">
                        <h1 className="font-display font-black text-[15vw] md:text-[10vw] leading-[0.8] tracking-tighter uppercase mb-6 md:mb-8 drop-shadow-2xl text-fg-primary">
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="border-t border-border-primary pt-6 md:pt-8 bg-bg-primary/30 backdrop-blur-sm p-4 rounded-xl w-full pointer-events-auto"
                        >
                            <p className="max-w-xl text-lg md:text-2xl text-fg-secondary leading-relaxed font-light drop-shadow-md mb-8">
                                I am a <strong className="text-fg-primary font-bold">Full Stack AI Engineer</strong> based in India.
                                Building <strong className="text-fg-primary">AI Agents</strong> and <strong className="text-fg-primary">Intelligent Systems</strong>.
                            </p>

                            <div className="flex gap-4 relative z-20">
                                <MagneticButton>
                                    <a href="https://github.com/vasu-devs" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-4 rounded-full border border-border-primary bg-bg-primary/50 backdrop-blur hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Github size={20} />
                                    </a>
                                </MagneticButton>
                                <MagneticButton>
                                    <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="p-4 rounded-full border border-border-primary bg-bg-primary/50 backdrop-blur hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Twitter size={20} />
                                    </a>
                                </MagneticButton>
                                <MagneticButton>
                                    <a href="https://www.linkedin.com/in/vasu-devs/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-4 rounded-full border border-border-primary bg-bg-primary/50 backdrop-blur hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                                        <Linkedin size={20} />
                                    </a>
                                </MagneticButton>
                                <ResumeButton />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="order-1 md:order-2 md:row-start-1 md:col-start-6 md:col-span-7 flex justify-end items-end h-full relative z-10 pointer-events-none md:pt-12"
                    >
                        {/* Profile Image with Glow */}
                        <div className="w-full aspect-square md:aspect-[4/5] relative group transform translate-y-[10%] scale-100 md:scale-110">
                            <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-75 translate-y-10" />

                            {/* User's Hero Image */}
                            <img
                                src="/Hero.png"
                                alt="Vasu - Applied AI Engineer"
                                className="relative w-full h-full object-contain object-bottom drop-shadow-2xl z-10 grayscale-[20%] contrast-125"
                            />
                        </div>
                    </motion.div>
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
        </header>
    );
};
