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
        <section id="hero" className="min-h-[100dvh] lg:min-h-[90vh] relative flex flex-col pb-0 overflow-visible">
            {/* Split Background */}
            <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                <div className={`h-[58%] lg:h-[52%] w-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
                <div className="h-[42%] lg:h-[45%] w-full bg-bg-primary" />
            </div>

            <Container className="relative z-10 min-h-[100dvh] lg:h-full flex flex-col pt-4 lg:pt-8 pb-24 lg:pb-10 overflow-visible">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end lg:items-start overflow-visible"
                >
                    {/* Left Column: Text */}
                    <div className="order-2 lg:order-1 lg:row-start-1 lg:col-start-1 lg:col-span-7 relative z-30 pt-12 md:pt-24 h-full flex flex-col pointer-events-none">
                        {/* Huge Heading */}
                        <div className="-translate-y-[10%] lg:translate-y-0 -mb-24 lg:-mb-0">
                            <h1 className={`font-display font-black text-[13vw] md:text-[11vw] lg:text-9xl xl:text-[10rem] leading-[0.8] lg:leading-[0.85] tracking-tighter uppercase mb-4 lg:mb-6 lg:mix-blend-difference ${theme === 'light' ? 'text-white' : 'text-black'}`}>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="block"
                                >
                                    VASU
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
                            className="w-full mt-auto mb-2 lg:mb-0 lg:mt-32 pointer-events-auto"
                        >
                            <p className="hero-intro-text max-w-2xl text-sm md:text-xl lg:text-3xl text-fg-secondary leading-relaxed font-medium mb-4 lg:mb-10">
                                A <strong className="text-fg-primary font-bold">20-year-old self-taught</strong> <strong className="text-fg-primary font-bold">Full Stack AI Engineer</strong> based in <span className="text-fg-primary">India</span>.
                                Building <strong className="text-fg-primary">AI Agents</strong> and <strong className="text-fg-primary">Intelligent Systems</strong>.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 relative z-50">
                                <SocialButton href="https://github.com/vasu-devs" icon={Github} label="GitHub Profile" />
                                <SocialButton href="https://x.com/vasu_devs" icon={Twitter} label="Twitter Profile" />
                                <SocialButton href="https://www.linkedin.com/in/vasu-devs/" icon={Linkedin} label="LinkedIn Profile" />
                                <SocialButton href="https://cal.com/vasu-devs" icon={Calendar} label="Book a Call" />
                                <ResumeButton onClick={onResumeClick} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Image - THEME-AWARE, STATIC */}
                    <div className="order-1 lg:order-2 absolute lg:relative inset-0 lg:inset-auto lg:row-start-1 lg:col-start-6 lg:col-span-12 flex justify-center lg:justify-end items-center lg:items-start z-10 pointer-events-none overflow-visible">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-full h-full lg:h-auto relative md:opacity-100 transition-opacity duration-1000 overflow-visible"
                        >
                            {/* Gradient overlay for better text readability */}
                            <div className={`absolute inset-x-0 bottom-0 top-[40%] lg:hidden z-20 pointer-events-none ${theme === 'dark'
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
                                style={{
                                    willChange: 'transform, filter',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
                                    maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
                                }}
                                className="relative w-full h-[110%] lg:h-full object-contain object-bottom drop-shadow-2xl z-10 scale-[1.45] md:scale-[1.3] lg:scale-125 -translate-y-[45%] md:translate-y-[-25%] lg:-translate-y-4"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}

            </Container>
        </section>
    );
};
