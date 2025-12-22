import GitHubCalendar from 'react-github-calendar';
import { useState, useEffect } from 'react';
import {
   Github,
   Linkedin,
   Mail,
   Moon,
   Sun,
   GitCommit,
   GitPullRequest,
   Star,
   Download,
   Calendar,
   Coffee,
   Twitter,
   Play
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Container } from './components/ui/Container';
import { Grain } from './components/ui/Grain';
import { MagneticButton } from './components/ui/MagneticButton';

// CaseStudy used for project display
import { CaseStudy } from './components/CaseStudy';
import { ProjectModal } from './components/ui/ProjectModal';

function App() {
   const [theme, setTheme] = useState<'light' | 'dark'>('dark');
   const [stats, setStats] = useState({ stars: 0, commits: 0, prs: 0 });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<any>(null);
   const [isNavInverted, setIsNavInverted] = useState(false); // State for navbar inversion



   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);



   useEffect(() => {
      const handleScroll = () => {
         const ossSection = document.getElementById('oss-impact');
         if (ossSection) {
            const rect = ossSection.getBoundingClientRect();
            // Check if the navbar (approx 80px height including positioning) overlaps with the section
            const navBottom = 100; // conservative buffer
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

   // Fetch Stats Logic
   useEffect(() => {
      const fetchStats = async () => {
         try {
            const res = await fetch('https://api.github.com/users/vasu-devs/repos?per_page=100');
            const repos = await res.json();

            if (Array.isArray(repos)) {
               const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
               setStats({
                  stars: totalStars,
                  commits: 882, // Updated from research
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
                  <a href="#contact" className={`hidden md:block text-xs font-mono uppercase tracking-widest transition-colors ${isNavInverted ? 'hover:text-bg-secondary' : 'hover:text-fg-secondary'}`}>Contact</a>

                  <MagneticButton onClick={toggleTheme}>
                     <div className={`p-1.5 cursor-pointer rounded-full transition-colors ${isNavInverted ? 'hover:bg-bg-primary hover:text-fg-primary' : 'hover:bg-fg-primary hover:text-bg-primary'}`}>
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                     </div>
                  </MagneticButton>
               </div>
            </div>
         </nav>

         {/* 1. HERO (Cinematic & Readable) */}
         <header className="h-screen flex flex-col justify-end pb-24 relative overflow-hidden">
            {/* Background Image */}
            {/* Background Image - Simplified */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/20 via-bg-primary to-bg-primary" />
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-bg-primary to-bg-primary opacity-50" />
            </div>

            <Container className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-10 overflow-visible">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
               >
                  {/* Left Column: Text */}
                  <div className="order-2 md:order-1 md:row-start-1 md:col-start-1 md:col-span-7 relative z-30 pointer-events-none mix-blend-exclusion md:translate-y-16">
                     <h1 className="font-display font-black text-[15vw] md:text-[11.5vw] leading-[0.8] tracking-tighter uppercase mb-6 md:mb-8 drop-shadow-2xl text-fg-primary">
                        Code.<br />
                        Story.<br />
                        Impact.
                     </h1>
                     <div className="border-t border-border-primary pt-6 md:pt-8 bg-bg-primary/30 backdrop-blur-sm p-4 rounded-xl w-full md:w-[160%] pointer-events-auto">
                        <p className="max-w-xl text-lg md:text-2xl text-fg-secondary leading-relaxed font-light drop-shadow-md mb-8">
                           I am an <strong className="text-fg-primary font-bold">Applied AI Engineer</strong> based in India.
                           Building <strong className="text-fg-primary">Voice Agents</strong> and <strong className="text-fg-primary">Intelligent Systems</strong>.
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
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Image */}
                  <div className="order-1 md:order-2 md:row-start-1 md:col-end-15 md:col-span-12 flex justify-end items-end h-full relative z-10 pointer-events-none">
                     {/* Profile Image with Glow */}
                     <div className="w-full aspect-square md:w-[500%] md:aspect-[4/5] relative group transform translate-y-[-5%] md:translate-x-[-5%] scale-110 md:scale-125">
                        <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-75 translate-y-10" />

                        {/* User's Hero Image */}
                        <img
                           src="/Hero.png"
                           alt="Vasu - Applied AI Engineer"
                           className="relative w-full h-full object-contain object-bottom drop-shadow-2xl z-10 grayscale-[20%] contrast-125"
                        />
                     </div>
                  </div>
               </motion.div>
            </Container>
         </header>



         {/* 3. SELECTED WORK (Case Studies with Popups) */}
         <section id="projects" className="py-32">
            <Container>
               <h2 className="font-mono text-xs uppercase tracking-widest text-fg-secondary mb-16">Selected Works</h2>
               <div className="flex flex-col gap-12">
                  {projects.map((project, i) => (
                     <div
                        key={i}
                        className="group relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-fg-primary rounded-xl"
                        onClick={() => openModal(project)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openModal(project);
                           }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${project.title}`}
                     >
                        <CaseStudy index={i} {...project} />
                        {/* Interactive Hint */}
                        <div className="absolute top-1/2 right-0 md:right-32 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-fg-primary text-bg-primary px-4 py-2 rounded-full font-mono text-xs uppercase font-bold flex items-center gap-2 pointer-events-none transform translate-x-4 group-hover:translate-x-0 duration-300 shadow-xl z-20">
                           <Play size={12} fill="currentColor" /> Watch Demo
                        </div>
                     </div>
                  ))}
               </div>
            </Container>
         </section>

         {/* 4. OSS & IMPACT */}
         <section id="oss-impact" className="py-32 bg-fg-primary text-bg-primary relative overflow-hidden">
            <Container className="relative z-10">
               <h2 className="font-display font-black text-6xl md:text-8xl mb-24 text-center uppercase leading-none">
                  Open Source<br />Impact
               </h2>

               {/* Featured Contribution */}
               <div className="mb-24 p-8 border border-bg-primary/20 rounded-3xl bg-bg-primary/5 backdrop-blur-sm max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                     <div className="p-4 bg-bg-primary text-fg-primary rounded-xl">
                        <GitPullRequest size={32} />
                     </div>
                     <div>
                        <h3 className="font-display font-bold text-3xl mb-2">auto-timetable</h3>
                        <p className="font-mono text-sm opacity-60 mb-4">Significant Contribution • Core Logic Implementation</p>
                        <p className="text-lg leading-relaxed opacity-90">
                           Architected the core scheduling algorithm for SAYOUNCDR's auto-timetable. Optimized constraint satisfaction logic to generate conflict-free schedules efficiently.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center justify-center p-12 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm">
                     <GitCommit size={48} className="mb-6 opacity-80" />
                     <span className="font-display font-bold text-6xl mb-2">{stats.commits}+</span>
                     <span className="font-mono text-xs uppercase tracking-widest opacity-60">Total Commits</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-12 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm">
                     <Star size={48} className="mb-6 opacity-80" />
                     <span className="font-display font-bold text-6xl mb-2">{stats.stars}</span>
                     <span className="font-mono text-xs uppercase tracking-widest opacity-60">Stars Earned</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-12 border border-bg-primary/20 rounded-2xl bg-bg-primary/5 backdrop-blur-sm">
                     <GitPullRequest size={48} className="mb-6 opacity-80" />
                     <span className="font-display font-bold text-6xl mb-2">{stats.prs}</span>
                     <span className="font-mono text-xs uppercase tracking-widest opacity-60">PRs Merged</span>
                  </div>
               </div>
            </Container>
         </section>

         {/* 5. FOOTER */}
         <footer id="contact" className="min-h-[80vh] flex flex-col justify-between pt-24 relative">
            <Container>
               <div className="flex flex-col gap-12 md:gap-20">
                  {/* Top Row: Heading & Heatmap */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-4">
                      <h2 className="font-display font-black text-[22vw] md:text-[10vw] leading-[0.75] tracking-tighter uppercase">
                        Let's<br />Talk.
                      </h2>
                    </div>
                                 
                    <div className="md:col-span-8 flex flex-col justify-between mt-12 h-full ml-12">
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
                    </div>
                  </div>

                  {/* Bottom Row: Actions (Single Line) */}
                  <div className="flex flex-nowrap gap-4 items-center justify-center overflow-x-auto pb-2 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                     <MagneticButton>
                        <a href="mailto:siddhvasudev1402@gmail.com" className="bg-fg-primary text-bg-primary px-8 py-4 rounded-full font-bold font-mono text-sm uppercase hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap">
                           <Mail size={18} /> siddhvasudev1402@gmail.com
                        </a>
                     </MagneticButton>

                     <MagneticButton>
                        <a href="https://cal.com/vasudev-siddh-bjemxn" target="_blank" className="border border-border-primary px-8 py-4 rounded-full font-bold font-mono text-sm uppercase hover:bg-bg-secondary transition-colors flex items-center gap-2 whitespace-nowrap">
                           <Calendar size={18} /> Book a call
                        </a>
                     </MagneticButton>

                     <MagneticButton>
                        <a href="https://buymeacoffee.com/Vasu-DevS" target="_blank" className="bg-[#FFDD00] text-black px-8 py-4 rounded-full font-bold font-mono text-sm uppercase hover:scale-105 transition-transform flex items-center gap-2 border border-transparent hover:border-black whitespace-nowrap">
                           <Coffee size={18} /> Buy me a coffee
                        </a>
                     </MagneticButton>

                     <MagneticButton>
                        <a href="/resume.pdf" className="border border-border-primary px-8 py-4 rounded-full font-bold font-mono text-sm uppercase hover:bg-bg-secondary transition-colors flex items-center gap-2 whitespace-nowrap">
                           <Download size={18} /> Download CV
                        </a>
                     </MagneticButton>
                  </div>
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
               <h1 className="font-display font-black text-[20.5vw] leading-[0.8] bg-gradient-to-b from-fg-primary to-transparent bg-clip-text text-transparent tracking-tighter uppercase whitespace-nowrap opacity-30 transform translate-y-4">
                  Vasu-DevS
               </h1>
            </div>
         </footer>

         {/* VIDEO MODAL */}
         <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            project={selectedProject}
         />
      </div >
   );
}

export default App;
