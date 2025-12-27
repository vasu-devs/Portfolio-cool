import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Calendar } from 'lucide-react';
import { Container } from '../ui/Container';
import { SocialButton } from '../ui/SocialButton';
import { ResumeButton } from '../ui/ResumeButton';

interface HeroProps {
    theme?: 'light' | 'dark';
    onResumeClick?: () => void;
}

export const Hero = ({ theme = 'dark', onResumeClick }: HeroProps) => {
    return (
        <section id="hero" className="min-h-auto md:min-h-[90vh] relative flex flex-col pb-0 overflow-visible">
            {/* Split Background */}
            <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                <div className={`h-[52%] w-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
                <div className="h-[45%] w-full bg-bg-primary" />
            </div>

            <Container className="relative z-10 h-full flex flex-col pt-4 md:pt-8 pb-20 md:pb-10 overflow-visible">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end md:items-start overflow-visible"
                >
                    {/* Left Column: Text */}
                    <div className="order-2 md:order-1 md:row-start-1 md:col-start-1 md:col-span-7 relative z-30 pointer-events-none pt-[15vw] md:pt-10">
                        {/* Huge Heading */}
                        <div className="-translate-y-[18vw] md:translate-y-0 -mb-[12vw] md:-mb-0">
                            <h1 className={`font-display font-black text-[13vw] md:text-9xl lg:text-[10rem] leading-[0.8] md:leading-[0.85] tracking-tighter uppercase mb-[4vw] md:mb-6 md:mix-blend-difference ${theme === 'light' ? 'text-white' : 'text-black'}`}>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="block"
                                >
                                    VASU-
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="block"
                                >
                                    DEVS
                                </motion.span>
                            </h1>
                        </div>

                        {/* Description & Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="w-full pointer-events-auto mt-[55vw] md:mt-48"
                        >
                            <p className="max-w-2xl text-sm md:text-3xl text-fg-secondary leading-relaxed font-medium mb-[16vw] md:mb-10">
                                A <strong className="text-fg-primary font-bold">20-year-old self-taught</strong> <strong className="text-fg-primary font-bold">Full Stack AI Engineer</strong> based in <span className="text-fg-primary">India</span>.
                                Building <strong className="text-fg-primary">AI Agents</strong> and <strong className="text-fg-primary">Intelligent Systems</strong>.
                            </p>

                            <div className="flex flex-wrap gap-4 relative z-20">
                                <SocialButton href="https://github.com/vasu-devs" icon={Github} label="GitHub Profile" />
                                <SocialButton href="https://x.com/vasu_devs" icon={Twitter} label="Twitter Profile" />
                                <SocialButton href="https://www.linkedin.com/in/vasu-devs/" icon={Linkedin} label="LinkedIn Profile" />
                                <SocialButton href="https://cal.com/vasu-devs" icon={Calendar} label="Book a Call" />
                                <ResumeButton onClick={onResumeClick} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Image - THEME-AWARE, STATIC */}
                    <div className="order-1 md:order-2 absolute md:relative inset-0 md:inset-auto md:row-start-1 md:col-start-6 md:col-span-7 flex justify-center md:justify-end items-center md:items-start z-10 pointer-events-none overflow-visible">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-full h-full md:h-auto relative md:opacity-100 transition-opacity duration-1000 overflow-visible"
                        >
                            {/* Gradient overlay for better text readability */}
                            <div className={`absolute inset-x-0 bottom-0 top-[50%] md:hidden z-20 pointer-events-none ${theme === 'dark'
                                ? 'bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent'
                                : 'bg-gradient-to-t from-white via-white/40 to-transparent'
                                }`} />

                            {/* User's Hero Image - PREMIUM REFINED AESTHETICS, ELEVATED, STATIC */}
                            <motion.img
                                src="/Pic/Hero.webp"
                                alt="Vasu - Applied AI Engineer"
                                loading="eager"
                                fetchPriority="high"
                                initial={false}
                                animate={{
                                    filter: theme === 'dark'
                                        ? 'grayscale(10%) contrast(125%) brightness(1.1) saturate(1.15)'
                                        : 'grayscale(15%) contrast(110%) brightness(0.95) saturate(1.1)',
                                }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full h-[95%] md:h-full object-contain object-bottom md:object-top drop-shadow-2xl z-10 scale-[1.05] -translate-y-[35vw] md:scale-125 md:-translate-y-4"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}

            </Container>
        </section>
    );
};
