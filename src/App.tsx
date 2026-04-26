import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Hero } from './components/sections/Hero';
import { Grain } from './components/ui/Grain';
import { Preloader } from './components/ui/Preloader';
import { StatusBadge } from './components/ui/StatusBadge';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomCursor } from './components/ui/CustomCursor';
import { useLenis } from './hooks/useLenis';
import type { Project } from './components/sections/Work';

// Lazy load sections and modals
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience })));
const Work = lazy(() => import('./components/sections/Work').then(m => ({ default: m.Work })));
const MoreProjects = lazy(() => import('./components/sections/MoreProjects').then(m => ({ default: m.MoreProjects })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })));
const OssImpact = lazy(() => import('./components/sections/OssImpact').then(m => ({ default: m.OssImpact })));
const Services = lazy(() => import('./components/sections/Services').then(m => ({ default: m.Services })));
const Footer = lazy(() => import('./components/sections/Footer').then(m => ({ default: m.Footer })));
const ProjectModal = lazy(() => import('./components/ui/ProjectModal').then(m => ({ default: m.ProjectModal })));
const ResumeModal = lazy(() => import('./components/ui/ResumeModal').then(m => ({ default: m.ResumeModal })));

export default function App() {
   const [theme] = useState<'light' | 'dark'>('dark');
   const [stats, setStats] = useState({ stars: 0, commits: 0, prs: 0 });
   const [isStatsLoading, setIsStatsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [isNavInverted, setIsNavInverted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isTransitioning] = useState(false);
   const [clickPos] = useState({ x: 0, y: 0 });

   // Initialize Lenis smooth scrolling
   useLenis();

   const resumeUrl = "https://drive.google.com/file/d/1YK8o65wTso2_l2e9bwZo46daonm6-P7x/view?usp=sharing";

   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);

   // Detect what's behind the bottom nav so it can flip its color scheme
   // when crossing inverted-bg sections (Experience, MoreProjects, OssImpact).
   useEffect(() => {
      const NAV_INVERTED_SECTION_IDS = ['experience', 'more-projects', 'oss-impact', 'services'];
      let rafId: number | null = null;

      const check = () => {
         rafId = null;
         // Nav sits at bottom-6 (24px from bottom) with ~50px height — sample its center.
         const navCenterY = window.innerHeight - 50;
         const overlaps = NAV_INVERTED_SECTION_IDS.some(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= navCenterY && rect.bottom >= navCenterY;
         });
         setIsNavInverted(overlaps);
      };

      const onScroll = () => {
         if (rafId === null) rafId = requestAnimationFrame(check);
      };

      check();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => {
         window.removeEventListener('scroll', onScroll);
         window.removeEventListener('resize', onScroll);
         if (rafId !== null) cancelAnimationFrame(rafId);
      };
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
                  const total = contributionsData.contributions?.reduce((acc: number, day: { count?: number }) => acc + (day.count || 0), 0) || 0;
                  setStats(prev => ({ ...prev, commits: total }));
               }
            }

            // 2. Fetch total stars from a cached counter service.
            // GitHub's unauthenticated API is capped at 60 req/hr per IP — visitors
            // on shared NATs/mobile carriers routinely hit the limit and stars fall
            // back to 0. This worker caches globally and has no practical limit.
            const starsData = await fetchJson('https://api.github-star-counter.workers.dev/user/vasu-devs');
            if (starsData && typeof starsData.stars === 'number') {
               setStats(prev => ({ ...prev, stars: starsData.stars }));
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



   const openModal = (project: Project) => {
      setSelectedProject(project);
      setIsModalOpen(true);
   };

   const openResumeModal = () => {
      setIsResumeModalOpen(true);
   };

   const projects: Project[] = [
      {
         title: 'BranchGPT',
         category: 'Context Optimization / AI',
         description: 'A Git-like chat interface that treats conversations as a Directed Acyclic Graph (DAG) for context garbage collection. Features include forking branches and merging insights back to keep AI context clean.',
         summary:
            'Conversations are trees, not lists. BranchGPT reimplements chat as a DAG — fork any message into a parallel reality, explore tangents without polluting the main thread, and smart-merge branches back as LLM-generated summaries.',
         details: [
            {
               title: 'The idea',
               body:
                  "Long chat sessions bloat LLM context. Every tangent and dead-end stays in history, burning tokens and diluting relevance. BranchGPT models the conversation as a Git-style DAG — every message is a node, forking spawns a parallel branch that inherits history up to that point, and merging is explicit.",
            },
            {
               title: 'Smart merging',
               bullets: [
                  "Llama 3.3 summarizes branches before merging, so the parent only absorbs new insight — not the full branch transcript",
                  'Merge logic filters out shared history, appending only what\'s new',
                  'Merges recorded as distinct system events in the chat stream',
                  'The branch stays intact post-merge — you can keep exploring it',
               ],
            },
            {
               title: 'Tree navigation',
               body:
                  "A visual Git-tree sidebar renders the whole conversation graph. Click any node to jump. Each branch preserves its own history up to the fork point, so context switching is clean and unambiguous.",
            },
            {
               title: 'Stack',
               bullets: [
                  'Next.js 16 — App Router + Server Actions',
                  'Neon Postgres via Drizzle ORM for tree storage',
                  'Vercel AI SDK wiring to Groq (Llama 3.3) for inference',
                  'Tailwind 4 + glassmorphic UI, full Markdown + LaTeX support',
               ],
            },
         ],
         highlights: [
            'Conversations as DAGs — fork, branch, merge, prune',
            'LLM-summarized merges retain insight without transcript bloat',
            'Git-tree sidebar for instant branch navigation',
         ],
         tech: ['Next.js 16', 'TypeScript', 'Drizzle ORM', 'Neon Postgres', 'Vercel AI SDK', 'Groq', 'Tailwind 4'],
         videoUrl: 'https://youtu.be/RB3zvAXbpL0?si=ICerMC6OnoqNvavM',
         thumbnailUrl: '/covers/branchGPT.png',
         liveUrl: 'https://branchgpt.vasudev.live/'
      },
      {
         title: 'Vaani',
         category: 'Voice AI / Fintech',
         description: 'An intelligent, voice-native debt collection platform powered by LiveKit, Groq, and Deepgram. Features sub-500ms latency, real-time negotiation, and FDCPA compliance guardrails.',
         summary:
            "Voice-native debt-recovery command center. LiveKit handles real-time transport, Groq runs the LLM, Deepgram does both STT and TTS. Two personas — empathetic Rachel and firm Orion — pick up the phone. A 'Sherlock' risk engine watches every second for compliance and intent.",
         details: [
            {
               title: 'Voice pipeline',
               bullets: [
                  'LiveKit Agents for WebRTC transport + SIP outbound calls',
                  'Deepgram Nova-2 for real-time speech-to-text',
                  'Groq Llama 3 for low-latency LLM inference',
                  'Deepgram TTS for natural synthesized speech',
                  'Sub-500 ms end-to-end latency; full-duplex — debtors can interrupt mid-sentence',
               ],
            },
            {
               title: 'Two personas',
               bullets: [
                  'Rachel — empathetic and patient, tuned for hardship cases',
                  'Orion — firm and direct, tuned for strategic defaulters',
               ],
            },
            {
               title: 'Sherlock risk engine',
               body:
                  "Every second of every call is analyzed live for compliance and intent. FDCPA guardrails instantly flag Bankruptcy, Attorney Representation and Cease & Desist triggers. Matrix profiling classifies debtors into quadrants (Hardship Case vs Strategic Defaulter). Outcomes are auto-tagged as Promise to Pay, Refusal, or Dispute.",
            },
            {
               title: 'Command Center',
               body:
                  'A dark-mode React dashboard streams the live transcript in a hacker-style terminal with risk badges popping in as the AI detects intent. Recovery rates and risk scores aggregate across thousands of calls.',
            },
            {
               title: 'Architecture',
               bullets: [
                  'Frontend: React 18 + Vite + Tailwind',
                  'API: Python + FastAPI — orchestrates calls and SIP handler',
                  'Agent Worker: LiveKit Agents, runs as a separate process',
                  'Dockerfiles for DigitalOcean App Platform deployment (API + Worker + Frontend)',
               ],
            },
         ],
         highlights: [
            'Sub-500 ms voice latency with full-duplex interruption handling',
            "Sherlock engine: FDCPA guardrails + debtor-matrix profiling + live PTP/Refusal/Dispute tagging",
            'Two tuned personas (Rachel / Orion) — dispatch by debtor archetype',
         ],
         tech: ['Python', 'FastAPI', 'LiveKit Agents', 'Groq', 'Deepgram', 'React 18', 'Vite', 'Tailwind', 'SIP', 'Docker'],
         videoUrl: 'https://www.youtube.com/watch?v=VsEfOfwh8XM',
         thumbnailUrl: '/covers/Vaani.png',
      },
      {
         title: 'Odeon',
         category: 'Autonomous Agents',
         description: 'A framework for evolving voice agents through adversarial persona testing. It iteratively self-corrects based on simulation outcomes to improve agent performance.',
         summary:
            "AI agent optimization platform. Generate adversarial personas, run high-fidelity simulations, score each conversation against strict KPIs, and let a meta-agent rewrite the prompt automatically when targets are missed — a self-improving loop that converges on the optimal persona.",
         details: [
            {
               title: 'The problem',
               body:
                  "Prompt tuning is a black box. You tweak, you hope, you ship. Odeon replaces that with a measurable loop: simulate realistic users, score the agent against numerical KPIs, and auto-rewrite the prompt when it fails.",
            },
            {
               title: 'Personas generated on the fly',
               body:
                  "Odeon spawns diverse user personas per scenario — \"The Lawyer,\" \"The Crying Student,\" \"The Stubborn Defaulter,\" etc. Each persona drives the user-side of the simulation, giving the agent genuinely hard traffic to handle.",
            },
            {
               title: 'Strict metric thresholds',
               bullets: [
                  'Empathy (1–10)',
                  'Negotiation (1–10)',
                  'Repetition (1–10)',
                  'Agents must meet ALL criteria to pass a scenario — no cherry-picking',
               ],
            },
            {
               title: 'Self-improving loop',
               body:
                  "When the agent fails a threshold, the Optimizer meta-agent reads the failure logs and rewrites the system prompt. The Neural Visual Diffing view renders the prompt change as a Git-style red/green diff — so you can see exactly which words changed to improve empathy or compliance.",
            },
            {
               title: 'Live stream',
               body:
                  "A bi-directional WebSocket streams every simulation character-by-character to the frontend. SQLite archives every run for replay, analysis, and forking.",
            },
            {
               title: 'Stack',
               bullets: [
                  'FastAPI + WebSockets backend',
                  'Groq Cloud for ultra-fast LLM inference (Llama 3.1 8B / 70B)',
                  'LangChain for chain management and structured output parsing',
                  'SQLite for history & replay',
                  'React 19 + Vite + TypeScript + Tailwind 4 frontend (neo-brutalist / glassmorphism)',
               ],
            },
         ],
         highlights: [
            'Adversarial persona generation for synthetic stress testing',
            'Meta-agent auto-rewrites prompts when thresholds fail — self-improving loop',
            'Git-style red/green diff view shows exactly which words changed',
         ],
         tech: ['Python', 'FastAPI', 'WebSockets', 'Groq', 'LangChain', 'SQLite', 'React 19', 'Vite', 'TypeScript', 'Tailwind 4'],
         videoUrl: 'https://youtu.be/GFdSe4-c_xQ',
         thumbnailUrl: '/covers/Odeon.png',
      },
      {
         title: 'MapMyRepo',
         category: 'Knowledge Graph / AI',
         description: 'Turns any codebase into an interactive knowledge graph. Files and folders become interconnected nodes; Gemini summarizes each, and you can chat with the graph to explore architecture.',
         summary:
            "Transforms any codebase — uploaded locally or fetched from a public GitHub URL — into an interactive D3.js force-directed node graph. Every file and folder is a node, Gemini summarizes each one, and a per-node chat panel lets you ask architectural questions directly.",
         details: [
            {
               title: 'What it does',
               body:
                  "Point it at a GitHub URL or drag a folder in. MapMyRepo parses the tree, filters out noise (node_modules, .git, build artifacts), and renders it as a force-directed graph you can orbit, zoom, and drill into. The goal: understand complex architectures or onboard into unfamiliar codebases in minutes instead of hours.",
            },
            {
               title: 'Graph interactions',
               bullets: [
                  'Scroll to zoom, drag to pan, click a node to select',
                  'Double-click a folder to expand or collapse its contents',
                  'Hover highlights connected nodes',
                  'Distinct icons and colors per file type + folder',
               ],
            },
            {
               title: 'AI layer (Gemini)',
               bullets: [
                  'Per-node architectural summary generated on demand',
                  'Chat tab per node — "what does this file do?", "where is auth handled?", "explain the routing structure"',
                  'Contextual answers: Gemini sees the file / folder metadata + related nodes',
                  'Markdown-rendered responses via Marked',
               ],
            },
            {
               title: 'Import paths',
               bullets: [
                  'Local upload: drag and drop any folder',
                  'GitHub URL: paste a public repo URL to visualize instantly',
                  "Optional GitHub PAT raises the 60/hr rate limit ceiling for private repos",
               ],
            },
            {
               title: 'Stack',
               bullets: [
                  'React 19 + TypeScript + Vite 6',
                  'D3.js 7 for the force-directed graph',
                  'Google Gemini for per-node summaries and chat',
                  'Tailwind with glassmorphic sidebar + dark/light theming',
               ],
            },
         ],
         highlights: [
            'Interactive force-directed node graph of any codebase',
            'Gemini-powered per-node summaries + contextual chat',
            'Load any public GitHub repo by URL — no auth required',
         ],
         tech: ['React 19', 'TypeScript', 'Vite 6', 'D3.js 7', 'Google Gemini', 'Tailwind'],
         videoUrl: 'https://youtu.be/EmTDrPzAo40',
         thumbnailUrl: '/covers/MapMyRepo.png',
         liveUrl: 'https://mapmyrepo.vasudev.live'
      },
      {
         title: 'PolySEE',
         category: 'NLP / Chatbot',
         description: 'A multilingual campus chatbot designed to handle FAQs in regional languages. Maintains conversational context and simplifies student support.',
         summary:
            "Multilingual campus FAQ chatbot supporting Hindi, English and 3+ regional languages. RAG over institutional circulars and notices; admin-approval workflow before responses go live; deployable across web, WhatsApp and Telegram.",
         details: [
            {
               title: 'The problem',
               body:
                  "Campus offices field the same questions — fee deadlines, scholarship forms, timetable changes — every single day, often in Hindi or regional languages. Staff burn hours on repetition; answers already exist in circulars and PDFs but students want conversation, not search.",
            },
            {
               title: 'RAG pipeline',
               bullets: [
                  'Query embedded via local Ollama models',
                  'Semantic search over institutional documents in ChromaDB',
                  'Retrieved context + user query sent to Gemini Flash 2.0',
                  'Response returned with confidence score and source context',
               ],
            },
            {
               title: 'Admin-approval workflow',
               body:
                  "New responses don\u2019t go live unconfirmed. In staging mode, each response shows its confidence score and the retrieved context. Admins approve or reject; only approved responses get promoted into the production dataset. This gives the bot a fact-checked update loop that student volunteers can maintain.",
            },
            {
               title: 'Multi-channel + multi-language',
               bullets: [
                  'Embeddable chat widget on the college website',
                  'WhatsApp + Telegram integrations for wider reach',
                  'Hindi + English + 3 additional regional languages',
                  'Confidence-based human fallback when the bot is unsure',
               ],
            },
            {
               title: 'Stack',
               bullets: [
                  'Frontend: React + Tailwind (student chat UI + admin dashboard)',
                  'Backend: FastAPI (Python) — chat, validation, logging',
                  'LLM: Gemini Flash 2.0',
                  'Embeddings: Ollama (local)',
                  'Vector DB: ChromaDB',
               ],
            },
         ],
         highlights: [
            'Hindi + English + 3 regional languages via RAG',
            'Admin-approval workflow — only validated answers reach production',
            'Embeddable on web + WhatsApp + Telegram',
         ],
         tech: ['React', 'Tailwind', 'FastAPI', 'Python', 'Gemini Flash 2.0', 'Ollama', 'ChromaDB'],
         videoUrl: 'https://youtu.be/6weynv_rblI',
         thumbnailUrl: '/covers/PolySee.png',
      }
   ];

   // Nav bg is "light" when (theme is light) XOR (over an inverted section).
   // Drives the glass + text colors so the nav is always readable.
   const navIsOverLightBg = (theme === 'light') !== isNavInverted;

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

         <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div
               className={`
                  backdrop-blur-2xl backdrop-saturate-150 border rounded-full px-5 md:px-6 py-2.5 md:py-3 flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-center transition-colors duration-300 pointer-events-auto
                  ${navIsOverLightBg
                     ? 'bg-white/70 border-black/10 text-black shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
                     : 'bg-zinc-900/60 border-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)]'}
               `}
            >
               <span className="font-mono text-sm md:text-base uppercase tracking-widest font-black shrink-0">
                  Vasu-DevS
               </span>
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex lg:hidden items-center gap-4 pr-4 border-r border-current/10">
                     <a href="mailto:siddhvasudev1402@gmail.com" className="opacity-70 hover:opacity-100 transition-opacity">
                        <Mail className="w-4 h-4 md:w-5 md:h-5" />
                     </a>
                     <a href="https://www.linkedin.com/in/vasu-devs/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                        <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                     </a>
                     <a href="https://twitter.com/Vasu_DevS" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                        <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                     </a>
                  </div>
                  <a href="#experience" className="hidden lg:block text-sm md:text-base font-mono uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">Experience</a>
                  <a href="#skills" className="hidden lg:block text-sm md:text-base font-mono uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">Skills</a>
                  <a href="#services" className="hidden lg:block text-sm md:text-base font-mono uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">Services</a>
                  <a href="#contact" className="hidden lg:block text-sm md:text-base font-mono uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">Contact</a>
                  {/* <div ref={toggleRef}>
                     <MagneticButton onClick={toggleTheme}>
                        <SunToggle theme={theme} isInverted={isNavInverted} />
                     </MagneticButton>
                  </div> */}
               </div>
            </div>
         </nav >

         <StatusBadge isInverted={isNavInverted} theme={theme} />

         {/* Stacked Sticky Sections - Each overlaps the previous */}

         {/* Hero Section - Fixed behind everything */}
         <div className="fixed top-0 left-0 right-0 h-screen z-10">
            <Hero theme={theme} onResumeClick={openResumeModal} />
         </div>

         {/* Spacer to push content below the Hero - pointer-events-none to allow interaction with hero */}
         <div className="h-screen pointer-events-none relative z-0" />

         {/* All scrollable content - overlaps the fixed Hero */}
         <div className="relative z-20 bg-bg-primary">
            <Suspense fallback={<div className="h-96" />}>
               <Experience />
               <Work projects={projects} openModal={openModal} />
               <MoreProjects />
               <Skills />
               <OssImpact stats={stats} isLoading={isStatsLoading} />
               <Services />
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
