import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Container } from '../ui/Container';
import { SocialButton } from '../ui/SocialButton';
import { ResumeButton } from '../ui/ResumeButton';

interface HeroProps { theme?: 'light' | 'dark'; onResumeClick?: () => void; }

export const Hero = ({ onResumeClick }: HeroProps) => (
    <section id="hero" aria-label="Introduction" className="relative bg-bg-primary">
        <div className="bg-[#f5f5f3] text-[#111] overflow-hidden">
            <Container className="grid grid-cols-[1.05fr_1fr] items-end gap-2 pt-24 md:pt-28">
                <div className="relative z-10 pb-8 md:pb-14">
                    <p className="font-mono text-[11px] md:text-sm uppercase tracking-[0.16em] mb-5 md:mb-8">Vasudev Siddh / India</p>
                    <h1 className="font-display font-black text-[clamp(3.5rem,12vw,10rem)] leading-[0.82] tracking-tighter uppercase" aria-label="Vasudev Siddh">
                        <span className="block">Vasu</span><span className="block">Devs</span>
                    </h1>
                    <p className="mt-6 md:mt-8 text-xs md:text-lg font-medium">AI &amp; Full-Stack Engineer</p>
                </div>
                <img src="/Pic/Hero.webp" alt="Vasudev Siddh" fetchPriority="high" loading="eager" className="w-full h-[280px] sm:h-[360px] lg:h-[480px] object-cover object-top grayscale" />
            </Container>
        </div>
        <Container className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 py-10 md:py-14">
            <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fg-secondary mb-4">Voice AI / Agent evaluation / Full-stack products</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12] max-w-3xl">I build AI tools you can actually use.</h2>
                <p className="text-base md:text-lg text-fg-secondary leading-relaxed max-w-2xl mt-5">AI Engineering Intern at <a href="https://withlayer.ai" target="_blank" rel="noreferrer" className="text-fg-primary underline underline-offset-4">withlayer.ai</a> and creator of <a href="https://justhireme.ai" target="_blank" rel="noreferrer" className="text-fg-primary underline underline-offset-4">JustHireMe</a>, an open-source desktop app with 2,200+ GitHub stars.</p>
            </div>
            <div className="flex flex-col justify-center gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    <a href="#projects" className="inline-flex items-center gap-3 bg-fg-primary text-bg-primary rounded-full px-6 py-4 text-sm font-semibold">Explore my work <ArrowDown size={17} aria-hidden="true" /></a>
                    <ResumeButton onClick={onResumeClick} />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <SocialButton href="https://github.com/vasu-devs" icon={Github} label="GitHub Profile" />
                    <SocialButton href="https://www.linkedin.com/in/vasu-devs/" icon={Linkedin} label="LinkedIn Profile" />
                    <SocialButton href="mailto:siddhvasudev1402@gmail.com" icon={Mail} label="Email Vasudev" />
                    <a href="https://cal.com/vasu-devs" target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4 ml-2">Book a conversation</a>
                </div>
            </div>
        </Container>
    </section>
);
