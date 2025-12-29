import { useState, useEffect, useRef, useTransition, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Hero } from './components/sections/Hero';
import { Grain } from './components/ui/Grain';
import { MagneticButton } from './components/ui/MagneticButton';
import { Preloader } from './components/ui/Preloader';
import { SideBranding } from './components/ui/SideBranding';
import { StatusBadge } from './components/ui/StatusBadge';
import { SunToggle } from './components/ui/SunToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomCursor } from './components/ui/CustomCursor';
import { useLenis } from './hooks/useLenis';

// Lazy load sections and modals
const Work = lazy(() => import('./components/sections/Work').then(m => ({ default: m.Work })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })));
const OssImpact = lazy(() => import('./components/sections/OssImpact').then(m => ({ default: m.OssImpact })));
const Footer = lazy(() => import('./components/sections/Footer').then(m => ({ default: m.Footer })));
const ProjectModal = lazy(() => import('./components/ui/ProjectModal').then(m => ({ default: m.ProjectModal })));
const ResumeModal = lazy(() => import('./components/ui/ResumeModal').then(m => ({ default: m.ResumeModal })));

export default function App() {
   const [theme, setTheme] = useState<'light' | 'dark'>('dark');
   const [stats, setStats] = useState({ stars: 0, commits: 0, prs: 0 });
   const [isStatsLoading, setIsStatsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<any>(null);
   const [isNavInverted, setIsNavInverted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isTransitioning, setIsTransitioning] = useState(false);
   const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
   const [isPending, startTransition] = useTransition();
   const toggleRef = useRef<HTMLDivElement>(null);

   // Initialize Lenis smooth scrolling
   useLenis();

   const resumeUrl = "https://drive.google.com/file/d/105PfA58-Eonq0lGmC0V8SnMOWsqlm-G6/view?usp=sharing";

   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);

   useEffect(() => {
      const handleScroll = () => {
         const ossSection = document.getElementById('oss-impact');
         if (ossSection) {
            const rect = ossSection.getBoundingClientRect();
            const navBuffer = 100;
            const bottomThreshold = window.innerHeight - navBuffer;

            if (rect.top <= bottomThreshold && rect.bottom >= bottomThreshold - 40) {
               setIsNavInverted(true);
            } else {
               setIsNavInverted(false);
            }
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   useEffect(() => {
      const fetchStats = async () => {
         setIsStatsLoading(true);

         try {
            // Helper to fetch and return JSON or null on error
            const fetchJson = async (url: string) => {
               try {
                  const res = await fetch(url);
                  if (!res.ok) {
                     console.warn(`API returned ${res.status} for ${url}`);
                     return null;
                  }
                  return await res.json();
               } catch (e) {
                  console.warn(`Failed to fetch from ${url}:`, e);
                  return null;
               }
            };

            // 1. Use the same API as react-github-calendar for accurate contribution data (last year only)
            const contributionsData = await fetchJson('https://github-contributions-api.jogruber.de/v4/vasu-devs?y=last');
            if (contributionsData && contributionsData.total) {
               // Get last year's contributions (matches the heatmap)
               if (contributionsData.total.lastYear !== undefined) {
                  setStats(prev => ({ ...prev, commits: contributionsData.total.lastYear }));
               } else {
                  // Fallback: sum contributions from the data
                  const total = contributionsData.contributions?.reduce((acc: number, day: any) => acc + (day.count || 0), 0) || 0;
                  setStats(prev => ({ ...prev, commits: total }));
               }
            }

            // 2. Fetch Repos for Star Count
            const repos = await fetchJson('https://api.github.com/users/vasu-devs/repos?per_page=100');
            if (Array.isArray(repos) && repos.length > 0) {
               const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
               setStats(prev => ({ ...prev, stars: totalStars }));
            }

            // 3. Fetch PR Count from GitHub API
            const prsData = await fetchJson('https://api.github.com/search/issues?q=type:pr+author:vasu-devs');
            if (prsData && typeof prsData.total_count === 'number') {
               setStats(prev => ({ ...prev, prs: prsData.total_count }));
            }

         } catch (e) {
            console.error("Critical error fetching GH stats:", e);
         } finally {
            setIsStatsLoading(false);
         }
      };

      // Initial fetch with slight delay to prioritize LCP
      const initialTimer = setTimeout(fetchStats, 1000);

      // Periodic refresh every 5 minutes (300000ms)
      const refreshInterval = setInterval(fetchStats, 300000);

      return () => {
         clearTimeout(initialTimer);
         clearInterval(refreshInterval);
      };
   }, []);


   const toggleTheme = (e?: React.MouseEvent) => {
      if (isTransitioning || isPending) return;

      if (e) {
         setClickPos({ x: e.clientX, y: e.clientY });
      } else if (toggleRef.current) {
         const rect = toggleRef.current.getBoundingClientRect();
         setClickPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }

      setIsTransitioning(true);

      // Delay theme change to middle of expansion, use startTransition to avoid blocking
      setTimeout(() => {
         startTransition(() => {
            setTheme(prev => prev === 'dark' ? 'light' : 'dark');
         });
      }, 300);

      // Reset transition state
      setTimeout(() => {
         setIsTransitioning(false);
      }, 1200);
   };

   const openModal = (project: any) => {
      setSelectedProject(project);
      setIsModalOpen(true);
   };

   const openResumeModal = () => {
      setIsResumeModalOpen(true);
   };

   const projects = [
      {
         title: 'Vaani',
         category: 'Voice AI / Fintech',
         description: 'An intelligent, voice-native debt collection platform powered by LiveKit, Groq, and Deepgram. Features sub-500ms latency, real-time negotiation, and FDCPA compliance guardrails.',
         videoUrl: 'https://www.youtube.com/watch?v=VsEfOfwh8XM',
         thumbnailUrl: 'https://img.youtube.com/vi/VsEfOfwh8XM/maxresdefault.jpg',
         repoUrl: 'https://github.com/vasu-devs/Vaani',
         liveUrl: undefined
      },
      {
         title: 'Odeon',
         category: 'Autonomous Agents',
         description: 'A framework for evolving voice agents through adversarial persona testing. It iteratively self-corrects based on simulation outcomes to improve agent performance.',
         videoUrl: 'https://youtu.be/GFdSe4-c_xQ',
         thumbnailUrl: 'https://img.youtube.com/vi/GFdSe4-c_xQ/maxresdefault.jpg',
         repoUrl: 'https://github.com/vasu-devs/Odeon',
      },
      {
         title: 'MapMyRepo',
         category: 'Knowledge Graph / AI',
         description: 'Turns GitHub profiles into an interactive "Code Universe". Utilizes AI to map languages as planets and repositories as moons, creating a visual knowledge graph.',
         videoUrl: 'https://youtu.be/EmTDrPzAo40',
         thumbnailUrl: 'https://img.youtube.com/vi/EmTDrPzAo40/maxresdefault.jpg',
         repoUrl: 'https://github.com/vasu-devs/MapMyRepo',
         liveUrl: 'https://mapmyrepo.vasudev.live'
      },
      {
         title: 'PolySEE',
         category: 'NLP / Chatbot',
         description: 'A multilingual campus chatbot designed to handle FAQs in regional languages. Maintains conversational context and simplifies student support.',
         videoUrl: 'https://youtu.be/6weynv_rblI',
         thumbnailUrl: 'https://img.youtube.com/vi/6weynv_rblI/maxresdefault.jpg',
         repoUrl: 'https://github.com/vasu-devs/PolySEE',
      }
   ];

   return (
      <div className="min-h-screen bg-bg-primary text-fg-primary selection:bg-fg-primary selection:text-bg-primary font-sans relative">
         <CustomCursor theme={theme} isAppTransitioning={isTransitioning} />
         <AnimatePresence mode="wait">
            {isLoading && (
               <Preloader key="preloader" theme={theme} finishLoading={() => setIsLoading(false)} />
            )}
         </AnimatePresence>

         <AnimatePresence mode="wait">
            {isTransitioning && (
               <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                  <motion.div
                     initial={{ opacity: 0, scale: 0 }}
                     animate={{
                        opacity: [0, 1, 0.5, 0],
                        scale: [0, 1, 5],
                     }}
                     transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                     className="absolute"
                     style={{
                        left: clickPos.x,
                        top: clickPos.y,
                        width: '100vw',
                        height: '100vw',
                        marginLeft: '-50vw',
                        marginTop: '-50vw',
                        borderRadius: '50%',
                        border: theme === 'dark' ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.1)',
                        background: theme === 'dark'
                           ? 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)'
                           : 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.05) 50%, transparent 70%)',
                        boxShadow: theme === 'dark'
                           ? '0 0 60px rgba(255, 255, 255, 0.1)'
                           : '0 0 60px rgba(0, 0, 0, 0.1)',
                        transform: 'translateZ(0)',
                        willChange: 'transform, opacity',
                     }}
                  />
                  {[...Array(8)].map((_, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0, rotate: i * 45, width: 2 }}
                        animate={{
                           opacity: [0, 0.6, 0],
                           height: ['0px', `${150 + Math.random() * 400}px`],
                           width: [2, 3, 1],
                        }}
                        transition={{
                           duration: 1.0,
                           ease: "easeOut",
                           delay: Math.random() * 0.1
                        }}
                        className="absolute origin-top"
                        style={{
                           left: clickPos.x,
                           top: clickPos.y,
                           background: theme === 'dark'
                              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)'
                              : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)',
                           transform: 'translateZ(0)', // Force GPU
                        }}
                     />
                  ))}
               </div>
            )}
         </AnimatePresence>

         <Grain />
         <SideBranding />

         <nav className="fixed bottom-[4vw] md:bottom-6 left-0 right-0 z-50 flex justify-center px-2 md:px-4">
            <div
               className={`
                  backdrop-blur-xl border rounded-full px-[4vw] md:px-5 py-[3vw] md:py-2.5 shadow-lg flex items-center gap-[3vw] md:gap-6 w-full md:w-auto max-w-none md:max-w-none justify-between transition-all duration-300
                  ${isNavInverted
                     ? 'bg-fg-primary/95 border-bg-primary text-bg-primary'
                     : 'bg-bg-primary/95 border-border-primary text-fg-primary'}
               `}
               style={{
                  textShadow: !isNavInverted && theme === 'dark'
                     ? '0 0 3px rgba(0,0,0,0.5), 0 0 6px rgba(0,0,0,0.3)'
                     : 'none'
               }}
            >
               <span className="font-mono text-[3vw] md:text-sm uppercase tracking-widest font-black shrink-0"
                  style={{
                     WebkitTextStroke: !isNavInverted && theme === 'dark' ? '0.5px rgba(0,0,0,0.3)' : 'none'
                  }}
               >Vasu-DevS</span>
               <div className="flex items-center gap-[3vw] md:gap-4">
                  <div className="flex md:hidden items-center gap-[4vw] pr-[3vw] border-r border-current/10">
                     <a href="mailto:siddhvasudev1402@gmail.com" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}
                        style={{ filter: !isNavInverted && theme === 'dark' ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'none' }}
                     >
                        <Mail className="w-[5vw] h-[5vw]" />
                     </a>
                     <a href="https://www.linkedin.com/in/vasudev-siddh/" target="_blank" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}
                        style={{ filter: !isNavInverted && theme === 'dark' ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'none' }}
                     >
                        <Linkedin className="w-[5vw] h-[5vw]" />
                     </a>
                     <a href="https://twitter.com/Vasu_DevS" target="_blank" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}
                        style={{ filter: !isNavInverted && theme === 'dark' ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'none' }}
                     >
                        <Twitter className="w-[5vw] h-[5vw]" />
                     </a>
                  </div>
                  <a href="#projects" className={`hidden md:block text-sm font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Work</a>
                  <a href="#skills" className={`hidden md:block text-sm font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Skills</a>
                  <a href="#contact" className={`hidden md:block text-sm font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Contact</a>
                  <div ref={toggleRef}>
                     <MagneticButton onClick={toggleTheme}>
                        <SunToggle theme={theme} isInverted={isNavInverted} />
                     </MagneticButton>
                  </div>
               </div>
            </div>
         </nav >

         <StatusBadge isInverted={isNavInverted} theme={theme} />

         {/* Stacked Sticky Sections - Each overlaps the previous */}

         {/* Hero Section - Fixed behind everything */}
         <div className="fixed top-0 left-0 right-0 h-screen z-0">
            <Hero theme={theme} onResumeClick={openResumeModal} />
         </div>

         {/* Spacer to push content below the Hero - pointer-events-none to allow interaction with hero */}
         <div className="h-[75vh] md:h-screen pointer-events-none" />

         {/* All scrollable content - overlaps the fixed Hero */}
         <div className="relative z-20 bg-bg-primary">
            <Suspense fallback={<div className="h-96" />}>
               <Skills />
               <Work projects={projects} openModal={openModal} />
               <OssImpact stats={stats} isLoading={isStatsLoading} />
               <Footer theme={theme} onResumeClick={openResumeModal} />
            </Suspense>
         </div>

         <Suspense fallback={null}>
            <ProjectModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               project={selectedProject}
            />

            <ResumeModal
               isOpen={isResumeModalOpen}
               onClose={() => setIsResumeModalOpen(false)}
               resumeUrl={resumeUrl}
            />
         </Suspense>
         <Analytics />
         <SpeedInsights />
      </div >
   );
}
