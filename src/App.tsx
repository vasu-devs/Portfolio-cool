import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Hero } from './components/sections/Hero';
import { Header } from './components/ui/Header';
import { EasterEggs } from './components/ui/EasterEggs';
import { useLenis } from './hooks/useLenis';
import type { Project } from './components/sections/Work';
import projectsData from './data/projects.json';
import { fetchPortfolioGitHubStats } from './lib/github';

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

function getStaticProjectStars() {
   return ((projectsData.projects as { stars?: number }[]) ?? []).reduce(
      (total, project) => total + (project.stars || 0),
      0
   );
}

export default function App() {
   const [stats, setStats] = useState({ stars: 0, commits: 0, prs: 0 });
   const [isStatsLoading, setIsStatsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);

   // Initialize Lenis smooth scrolling
   useLenis();

   const resumeUrl = "https://drive.google.com/file/d/1izp4u2wqtKNfSSXFTvX_VBnAe6vKKoT4/view?usp=sharing";

   // Single bright theme — the whole site lives on cream paper.
   useEffect(() => {
      document.documentElement.setAttribute('data-theme', 'light');
   }, []);

   // Silent traffic tracking (the old ViewerBadge UI is gone, keep the counts).
   useEffect(() => {
      const KEY = 'portfolio:traffic:unique-tracked';
      let isUnique = false;
      try {
         isUnique = localStorage.getItem(KEY) !== '1';
      } catch { /* count as non-unique */ }

      fetch('/api/traffic', {
         method: 'POST',
         headers: { 'content-type': 'application/json' },
         cache: 'no-store',
         body: JSON.stringify({ trackView: true, trackUnique: isUnique }),
      }).then(() => {
         if (isUnique) {
            try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
         }
      }).catch(() => { /* tracking is best-effort */ });
   }, []);

   useEffect(() => {
      const fetchStats = async () => {
         setIsStatsLoading(true);

         try {
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

            // 1. Same API as react-github-calendar for accurate contribution data
            const contributionsData = await fetchJson('https://github-contributions-api.jogruber.de/v4/vasu-devs?y=last');
            if (contributionsData && contributionsData.total) {
               if (contributionsData.total.lastYear !== undefined) {
                  setStats(prev => ({ ...prev, commits: contributionsData.total.lastYear }));
               } else {
                  const total = contributionsData.contributions?.reduce((acc: number, day: { count?: number }) => acc + (day.count || 0), 0) || 0;
                  setStats(prev => ({ ...prev, commits: total }));
               }
            }

            // 2. Live stars: cached Vercel API → direct GitHub → stale local JSON.
            try {
               const starsData = await fetchPortfolioGitHubStats();
               if (starsData.stars > 0) {
                  setStats(prev => ({ ...prev, stars: starsData.stars }));
               } else {
                  throw new Error('GitHub returned zero stars unexpectedly');
               }
            } catch (e) {
               console.warn('Failed to fetch live GitHub stars:', e);
               const cachedStarsData = await fetchJson('https://api.github-star-counter.workers.dev/user/vasu-devs');
               const fallbackStars =
                  cachedStarsData && typeof cachedStarsData.stars === 'number' && cachedStarsData.stars > 0
                     ? cachedStarsData.stars
                     : getStaticProjectStars();

               setStats(prev => ({ ...prev, stars: Math.max(prev.stars, fallbackStars) }));
            }

            // 3. PR count from GitHub API
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

      // Slight delay to prioritize LCP; GitHub stats change slowly.
      const initialTimer = setTimeout(fetchStats, 1000);
      return () => clearTimeout(initialTimer);
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
                  "New responses don’t go live unconfirmed. In staging mode, each response shows its confidence score and the retrieved context. Admins approve or reject; only approved responses get promoted into the production dataset. This gives the bot a fact-checked update loop that student volunteers can maintain.",
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

   return (
      <div className="min-h-screen bg-bg-primary text-fg-primary font-sans relative">
         <Header />
         <EasterEggs />

         <Hero onResumeClick={openResumeModal} stats={stats} isStatsLoading={isStatsLoading} />

         <Suspense fallback={<div className="h-96" />}>
            <Experience />
            <Work projects={projects} openModal={openModal} />
            <Skills />
            <OssImpact stats={stats} isLoading={isStatsLoading} />
            <MoreProjects />
            <Services />
            <Footer onResumeClick={openResumeModal} />
         </Suspense>

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
      </div>
   );
}
