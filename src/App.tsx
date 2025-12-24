import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Hero } from './components/sections/Hero';
import { Work } from './components/sections/Work';
import { Skills } from './components/sections/Skills';
import { OssImpact } from './components/sections/OssImpact';
import { Footer } from './components/sections/Footer';
import { Grain } from './components/ui/Grain';
import { MagneticButton } from './components/ui/MagneticButton';
import { ProjectModal } from './components/ui/ProjectModal';
import { ResumeModal } from './components/ui/ResumeModal';
import { Preloader } from './components/ui/Preloader';
import { SideBranding } from './components/ui/SideBranding';
import { StatusBadge } from './components/ui/StatusBadge';
import { SunToggle } from './components/ui/SunToggle';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
   const [theme, setTheme] = useState<'light' | 'dark'>('dark');
   const [stats, setStats] = useState({ stars: 12, commits: 882, prs: 45 });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<any>(null);
   const [isNavInverted, setIsNavInverted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isTransitioning, setIsTransitioning] = useState(false);
   const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
   const toggleRef = useRef<HTMLDivElement>(null);

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
         try {
            // Helper to fetch and return JSON or null on error
            const fetchJson = async (url: string, options?: RequestInit) => {
               try {
                  const res = await fetch(url, options);
                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                  return await res.json();
               } catch (e) {
                  console.warn(`Failed to fetch from ${url}:`, e);
                  return null;
               }
            };

            // 1. Fetch Repos for Star Count
            const repos = await fetchJson('https://api.github.com/users/vasu-devs/repos?per_page=100');
            if (Array.isArray(repos)) {
               const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
               setStats(prev => ({ ...prev, stars: totalStars }));
            }

            // 2. Fetch PR Count
            const prsData = await fetchJson('https://api.github.com/search/issues?q=type:pr+author:vasu-devs');
            if (prsData && typeof prsData.total_count === 'number') {
               setStats(prev => ({ ...prev, prs: prsData.total_count }));
            }

            // 3. Fetch Commits Count
            const commitsData = await fetchJson('https://api.github.com/search/commits?q=author:vasu-devs', {
               headers: { 'Accept': 'application/vnd.github.cloak-preview' }
            });
            if (commitsData && typeof commitsData.total_count === 'number') {
               setStats(prev => ({ ...prev, commits: commitsData.total_count }));
            }

         } catch (e) {
            console.error("Critical error fetching GH stats", e);
         }
      };

      // Delay fetch slightly to prioritize LCP
      const timer = setTimeout(fetchStats, 1000);
      return () => clearTimeout(timer);
   }, []);

   const toggleTheme = (e?: React.MouseEvent) => {
      if (isTransitioning) return;

      if (e) {
         setClickPos({ x: e.clientX, y: e.clientY });
      } else if (toggleRef.current) {
         const rect = toggleRef.current.getBoundingClientRect();
         setClickPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }

      setIsTransitioning(true);

      // Delay theme change to middle of expansion
      setTimeout(() => {
         setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      }, 400);

      // Reset transition
      setTimeout(() => {
         setIsTransitioning(false);
      }, 1000);
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
      <div className="min-h-screen bg-bg-primary text-fg-primary selection:bg-fg-primary selection:text-bg-primary transition-colors duration-700 font-sans relative">
         <AnimatePresence mode="wait">
            {isLoading && (
               <Preloader key="preloader" finishLoading={() => setIsLoading(false)} />
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
                     transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                     className="absolute"
                     style={{
                        left: clickPos.x,
                        top: clickPos.y,
                        width: '100vw',
                        height: '100vw',
                        marginLeft: '-50vw',
                        marginTop: '-50vw',
                        borderRadius: '50%',
                        border: theme === 'dark' ? '8px solid rgba(255, 204, 0, 0.3)' : '8px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: theme === 'dark'
                           ? '0 0 100px rgba(255, 204, 0, 0.4), inset 0 0 80px rgba(255, 204, 0, 0.2)'
                           : '0 0 100px rgba(255, 255, 255, 0.4), inset 0 0 80px rgba(255, 255, 255, 0.2)',
                        background: theme === 'dark'
                           ? 'radial-gradient(circle, rgba(255, 204, 0, 0.1) 0%, transparent 70%)'
                           : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                        filter: 'blur(10px)',
                     }}
                  />
                  {[...Array(16)].map((_, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0, rotate: i * 22.5, width: 2 }}
                        animate={{
                           opacity: [0, 0.8, 0],
                           height: ['0px', `${200 + Math.random() * 800}px`],
                           width: [2, 4, 1],
                        }}
                        transition={{
                           duration: 1.2,
                           ease: "easeOut",
                           delay: Math.random() * 0.2
                        }}
                        className="absolute origin-top blur-md"
                        style={{
                           left: clickPos.x,
                           top: clickPos.y,
                           background: theme === 'dark'
                              ? 'linear-gradient(to bottom, rgba(255, 204, 0, 0.6), transparent)'
                              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent)',
                        }}
                     />
                  ))}
               </div>
            )}
         </AnimatePresence>

         <Grain />
         <SideBranding />

         <nav className="fixed bottom-[4vw] md:bottom-[2vw] left-0 right-0 z-50 flex justify-center px-4">
            <div className={`
              backdrop-blur-xl border rounded-full px-[4vw] md:px-[1.5vw] py-[2vw] md:py-[0.8vw] shadow-lg flex items-center gap-[3vw] md:gap-[3vw] w-auto max-w-[95vw] justify-between transition-all duration-300
              ${isNavInverted
                  ? 'bg-fg-primary/90 border-bg-primary text-bg-primary'
                  : 'bg-bg-primary/70 border-border-primary text-fg-primary'}
            `}>
               <span className="font-mono text-[1.8vw] md:text-[0.8vw] uppercase tracking-widest font-black shrink-0">Vasu-DevS</span>
               <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                  <div className="flex md:hidden items-center gap-[2.5vw] pr-[2.5vw] border-r border-current/10">
                     <a href="mailto:siddhvasudev1402@gmail.com" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>
                        <Mail className="w-[3.5vw] h-[3.5vw]" />
                     </a>
                     <a href="https://www.linkedin.com/in/vasudev-siddh/" target="_blank" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>
                        <Linkedin className="w-[3.5vw] h-[3.5vw]" />
                     </a>
                     <a href="https://twitter.com/Vasu_DevS" target="_blank" className={`transition-opacity hover:opacity-100 opacity-70 ${isNavInverted ? 'text-bg-primary' : 'text-fg-primary'}`}>
                        <Twitter className="w-[3.5vw] h-[3.5vw]" />
                     </a>
                  </div>
                  <a href="#projects" className={`hidden md:block text-[0.8vw] font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Work</a>
                  <a href="#skills" className={`hidden md:block text-[0.8vw] font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Skills</a>
                  <a href="#contact" className={`hidden md:block text-[0.8vw] font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Contact</a>
                  <div ref={toggleRef}>
                     <MagneticButton onClick={toggleTheme}>
                        <SunToggle theme={theme} isInverted={isNavInverted} />
                     </MagneticButton>
                  </div>
               </div>
            </div>
         </nav>

         <StatusBadge isInverted={isNavInverted} theme={theme} />

         {/* Fixed Hero - stays in place */}
         <div className="fixed top-0 left-0 right-0 h-screen z-0">
            <Hero theme={theme} onResumeClick={openResumeModal} />
         </div>

         {/* Spacer to push content down initially */}
         <div className="h-screen" />

         {/* Content that overlaps the Hero */}
         <div className="relative z-20 bg-bg-primary">
            <Work projects={projects} openModal={openModal} />
            <Skills />
            <OssImpact stats={stats} />
            <Footer theme={theme} onResumeClick={openResumeModal} />
         </div>

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
      </div>
   );
}
