import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Hero } from './components/sections/Hero';
import { Work } from './components/sections/Work';
import { Skills } from './components/sections/Skills';
import { OssImpact } from './components/sections/OssImpact';
import { Footer } from './components/sections/Footer';
import { Grain } from './components/ui/Grain';
import { MagneticButton } from './components/ui/MagneticButton';
import { ProjectModal } from './components/ui/ProjectModal';

export default function App() {
   const [theme, setTheme] = useState<'light' | 'dark'>('dark');
   const [stats, setStats] = useState({ stars: 0, commits: 0, prs: 0 });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<any>(null);
   const [isNavInverted, setIsNavInverted] = useState(false);

   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);

   useEffect(() => {
      const handleScroll = () => {
         const ossSection = document.getElementById('oss-impact');
         if (ossSection) {
            const rect = ossSection.getBoundingClientRect();
            const navBottom = 100;
            if (rect.top <= navBottom && rect.bottom >= 0) {
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
            const res = await fetch('https://api.github.com/users/vasu-devs/repos?per_page=100');
            const repos = await res.json();

            if (Array.isArray(repos)) {
               const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
               setStats({
                  stars: totalStars,
                  commits: 882,
                  prs: 45
               });
            }
         } catch (e) {
            console.error("Failed to fetch GH stats", e);
         }
      };
      fetchStats();
   }, []);

   const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
   };

   const openModal = (project: any) => {
      setSelectedProject(project);
      setIsModalOpen(true);
   };

   const projects = [
      {
         title: 'Vaani',
         category: 'Voice AI / Fintech',
         description: 'An intelligent, voice-native debt collection platform powered by LiveKit, Groq, and Deepgram. Features sub-500ms latency, real-time negotiation, and FDCPA compliance guardrails.',
         videoUrl: 'https://cdn.pixabay.com/video/2019/04/23/23011-332483109_large.mp4',
         thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
         repoUrl: 'https://github.com/vasu-devs/Vaani',
         liveUrl: undefined
      },
      {
         title: 'Odeon',
         category: 'Autonomous Agents',
         description: 'A framework for evolving voice agents through adversarial persona testing. It iteratively self-corrects based on simulation outcomes to improve agent performance.',
         videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40131-424930030_large.mp4',
         thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop',
         repoUrl: 'https://github.com/vasu-devs/Odeon',
      },
      {
         title: 'MapMyRepo',
         category: 'Knowledge Graph / AI',
         description: 'Turns GitHub profiles into an interactive "Code Universe". Utilizes AI to map languages as planets and repositories as moons, creating a visual knowledge graph.',
         videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186175-877660269_large.mp4',
         thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
         repoUrl: 'https://github.com/vasu-devs/MapMyRepo',
         liveUrl: 'https://mapmyrepo.vasudev.live'
      },
      {
         title: 'PolySEE',
         category: 'NLP / Chatbot',
         description: 'A multilingual campus chatbot designed to handle FAQs in regional languages. Maintains conversational context and simplifies student support.',
         videoUrl: 'https://cdn.pixabay.com/video/2023/04/21/160100-820542969_large.mp4',
         thumbnailUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2506&auto=format&fit=crop',
         repoUrl: 'https://github.com/vasu-devs/PolySEE',
      }
   ];

   return (
      <div className="min-h-screen bg-bg-primary text-fg-primary selection:bg-fg-primary selection:text-bg-primary transition-colors duration-500 font-sans">
         <Grain />

         {/* Navigation - Glassmorphic Sticky Header */}
         <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className={`
             backdrop-blur-xl border rounded-full px-6 py-3 shadow-lg flex items-center gap-6 md:gap-12 min-w-[300px] justify-between transition-all duration-300
             ${isNavInverted
                  ? 'bg-fg-primary/90 border-bg-primary text-bg-primary'
                  : 'bg-bg-primary/70 border-border-primary text-fg-primary'}
            `}>
               <span className="font-mono text-xs uppercase tracking-widest font-bold">Vasu-DevS</span>

               <div className="flex items-center gap-4">
                  <a href="#projects" className={`hidden md:block text-xs font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Work</a>
                  <a href="#skills" className={`hidden md:block text-xs font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Skills</a>
                  <a href="#contact" className={`hidden md:block text-xs font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Contact</a>

                  <MagneticButton onClick={toggleTheme}>
                     <div className={`p-1.5 cursor-pointer rounded-full transition-colors ${isNavInverted ? 'hover:bg-bg-primary hover:text-fg-primary' : 'hover:bg-fg-primary hover:text-bg-primary'}`}>
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                     </div>
                  </MagneticButton>
               </div>
            </div>
         </nav>

         <Hero />
         <Work projects={projects} openModal={openModal} />
         <Skills />
         <OssImpact stats={stats} />
         <Footer theme={theme} />

         <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            project={selectedProject}
         />
      </div >
   );
}
