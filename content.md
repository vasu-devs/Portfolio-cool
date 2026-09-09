# Vasu DevS - Portfolio Content

> Mirrors every text surface rendered on siddhvasudev.com: all seven sections plus the
> three Experience case-study modals and the per-project modals in 02 / 03.
> Section numbers match the on-site eyebrows.

---

## Hero Section
- **Wordmark:** VASU-DEVS (rendered as two stacked lines: VASU / DEVS)
- **Tagline:** AI engineer, AI engineering intern at a stealth company, and creator of JustHireMe.

- **Buttons & Socials:** RESUME, GitHub, Twitter, LinkedIn, Book a Call
- **Aesthetic:** Elevated, premium, static hero image with a radial theme transition, custom cursor with contrast-aware color / paint trails, and a sticky-hero stacked-section scroll pattern powered by Lenis.

---

## 01 / Experience

**Jun 2026 → Present | AI Engineering Intern · Stealth**

Contributing to AI systems with a focus on reliable agent behavior, real-time interactions, evaluation, and privacy. Company and project details remain confidential.

**2026 | Freelance · Stealth**

Freelance work for a confidential client.

---

**May 2026 | Open source founder / Local-first AI**
### JustHireMe — Agentic AI desktop app for transparent, privacy-first job search
Building and open-sourcing a local-first job intelligence workbench that ingests a candidate profile, builds a professional graph, discovers and filters job leads, explains role fit, and generates tailored resumes, cover letters, cold emails, and LinkedIn outreach. The launch went viral with 380.6K views while the product is live at justhireme.ai.

**Headline Metrics (card):**
- **380.6K:** Launch views
- **3.2K:** Likes
- **339:** Reposts
- **98:** Replies

**Headline Metrics (modal, live from GitHub):** 380.6K launch views · GitHub stars · Forks · Open PRs

**Tech Stack (card):** Tauri, React, TypeScript, FastAPI, SQLite, KuzuDB, LanceDB, Playwright
**Full stack (modal):** Tauri 2, React 19, TypeScript, Vite, Tailwind CSS, Python 3.13, FastAPI, WebSockets, SQLite, KuzuDB, LanceDB, Playwright

**Case Study Details (Experience Modal):**
Modal intro — A privacy-first desktop workbench for making job search more intelligent, transparent, and user-controlled: scrape better leads, filter noise, explain fit, match against a local profile graph and vector store, then generate tailored application materials for review.

- **01 Context:** The job-search flow is noisy, repetitive, and hard to trust. Candidates spend hours sorting through stale posts, duplicated listings, irrelevant roles, senior-only openings, and low-context descriptions. Most AI tools either scrape too broadly, rank opportunities like a black box, or jump straight to automation before the user has enough control.
- **02 Product idea:**
  - Built JustHireMe as a local-first desktop workbench for job intelligence instead of blind auto-apply.
  - Designed the workflow around a candidate-owned profile, explainable filtering, role scoring, and human review.
  - Made the supported open-source core contributor-friendly: source adapters, ranking logic, matching, customization, docs, and packaging.
  - Kept browser automation as an experimental lab area, disabled by default, so the product promise stays focused on trustworthy discovery and decision support.
- **03 Workflow:**
  - Import resume and profile data, then convert career history, skills, projects, and evidence into local profile context.
  - Discover leads from configured sources and normalize them before they enter the candidate pipeline.
  - Run a quality gate that rejects stale, thin, spammy, senior-only, unpaid, or low-context roles with visible reasons.
  - Score accepted roles against seniority, stack coverage, location constraints, project evidence, source signal, and semantic profile similarity.
  - Generate tailored resume PDFs, cover letter PDFs, cold emails, LinkedIn notes, keyword coverage summaries, and selected-project rationale for user review.
- **04 Architecture:**
  - Tauri desktop shell wraps a React + TypeScript workbench and launches a Python FastAPI sidecar.
  - SQLite stores the local CRM pipeline, lead history, notes, settings, and generated application context.
  - KuzuDB models the professional profile graph so roles can be evaluated against skills, projects, experience, and evidence relationships.
  - LanceDB stores skill, project, and job vectors for semantic matching that goes beyond keyword overlap.
  - FastAPI and WebSockets connect the UI to scraper agents, the quality gate, ranker/evaluator, customizer, and local data layer.
- **05 Trust model:** The core product principle is that career data should not have to live on someone else's server by default. Resumes, career history, API keys, job leads, notes, graph data, vectors, and generated documents are treated as local-first data. AI output is presented as a draft with explanations, not as an invisible decision maker.
- **06 Open-source launch:**
  - Open-sourced the alpha publicly at github.com/vasu-devs/JustHireMe and launched the live project at justhireme.ai.
  - The launch post reached 380.6K views, 3.2K likes, 339 reposts, and 98 replies, validating that developers and job seekers feel the pain this project targets.
  - The repository attracted early open-source attention, including hundreds of stars, forks, and active pull requests.
  - Positioned the project for contributors across agentic AI, source adapters, ranking algorithms, GraphRAG, semantic search, resume parsing, document generation, testing, docs, and UI/UX.
- **07 What I shipped:**
  - **Local:** Desktop architecture where profile data, lead tracking, graph data, vectors, settings, and generated documents stay on the user machine by default.
  - **Graph:** Professional profile modeling with KuzuDB so fit can be explained through skills, projects, experience, and evidence relationships.
  - **Vector:** Semantic matching with LanceDB to compare jobs against profile context instead of relying on brittle keyword matching alone.
  - **Gate:** Deterministic lead quality filters that reject weak postings before they pollute the pipeline, with reasons the user can inspect.
  - **Drafts:** Tailored resume, cover letter, cold email, and LinkedIn outreach generation built around human-in-the-loop review.
  - **OSS:** A public alpha with docs, contribution surfaces, source-adapter opportunities, and a roadmap for packaging and local keychain storage.

---

**Mar → Apr 2026 | Freelance · Full-stack Engineer · Stealth**

Delivered a full-stack application for a confidential client.

---

## 02 / Selected Works

### 1. JustHireMe (Local-First AI / Open Source)
**Live:** https://justhireme.ai | **Repo:** https://github.com/vasu-devs/JustHireMe
**Description:** A local-first AI job-intelligence desktop app with 2,000+ GitHub stars. It scrapes and ranks roles with graph + vector retrieval, explains why each fits, and generates tailored resumes and outreach — all on-device.
**Card actions:** LIVE_DEMO · WATCH_DEMO · "Want to see the code or discuss? Drop me a mail"
(Full case study is the JustHireMe entry under 01 / Experience.)

### 2. BranchGPT (Context Optimization / AI)
**Live:** https://branchgpt.siddhvasudev.com/ | **Video:** https://youtu.be/RB3zvAXbpL0?si=ICerMC6OnoqNvavM
**Description:** A Git-like chat interface that treats conversations as a Directed Acyclic Graph (DAG) for context garbage collection. Features include forking branches and merging insights back to keep AI context clean.
**Summary:** Conversations are trees, not lists. BranchGPT reimplements chat as a DAG — fork any message into a parallel reality, explore tangents without polluting the main thread, and smart-merge branches back as LLM-generated summaries.
**Highlights:**
- Conversations as DAGs — fork, branch, merge, prune
- LLM-summarized merges retain insight without transcript bloat
- Git-tree sidebar for instant branch navigation
**Tech Stack:** Next.js 16, TypeScript, Drizzle ORM, Neon Postgres, Vercel AI SDK, Groq, Tailwind 4

**Project Modal Details:**
- **The idea:** Long chat sessions bloat LLM context. Every tangent and dead-end stays in history, burning tokens and diluting relevance. BranchGPT models the conversation as a Git-style DAG — every message is a node, forking spawns a parallel branch that inherits history up to that point, and merging is explicit.
- **Smart merging:** Llama 3.3 summarizes branches before merging, so the parent only absorbs new insight — not the full branch transcript. Merge logic filters out shared history, appending only what's new. Merges recorded as distinct system events in the chat stream. The branch stays intact post-merge.
- **Tree navigation:** A visual Git-tree sidebar renders the whole conversation graph. Click any node to jump. Each branch preserves its own history up to the fork point, so context switching is clean and unambiguous.
- **Stack:** Next.js 16 — App Router + Server Actions, Neon Postgres via Drizzle ORM for tree storage, Vercel AI SDK wiring to Groq (Llama 3.3) for inference, Tailwind 4 + glassmorphic UI, full Markdown + LaTeX support.

### 3. Vaani (Voice AI / Fintech)
**Video:** https://www.youtube.com/watch?v=VsEfOfwh8XM
**Description:** An intelligent, voice-native debt collection platform powered by LiveKit, Groq, and Deepgram. Features sub-500ms latency, real-time negotiation, and FDCPA compliance guardrails.
**Summary:** Voice-native debt-recovery command center. LiveKit handles real-time transport, Groq runs the LLM, Deepgram does both STT and TTS. Two personas — empathetic Rachel and firm Orion — pick up the phone. A 'Sherlock' risk engine watches every second for compliance and intent.
**Highlights:**
- Sub-500 ms voice latency with full-duplex interruption handling
- Sherlock engine: FDCPA guardrails + debtor-matrix profiling + live PTP/Refusal/Dispute tagging
- Two tuned personas (Rachel / Orion) — dispatch by debtor archetype
**Tech Stack:** Python, FastAPI, LiveKit Agents, Groq, Deepgram, React 18, Vite, Tailwind, SIP, Docker

**Project Modal Details:**
- **Voice pipeline:** LiveKit Agents for WebRTC transport + SIP outbound calls; Deepgram Nova-2 for real-time speech-to-text; Groq Llama 3 for low-latency LLM inference; Deepgram TTS for natural synthesized speech; Sub-500 ms end-to-end latency; full-duplex — debtors can interrupt mid-sentence.
- **Two personas:** Rachel — empathetic and patient, tuned for hardship cases. Orion — firm and direct, tuned for strategic defaulters.
- **Sherlock risk engine:** Every second of every call is analyzed live for compliance and intent. FDCPA guardrails instantly flag Bankruptcy, Attorney Representation and Cease & Desist triggers. Matrix profiling classifies debtors into quadrants (Hardship Case vs Strategic Defaulter). Outcomes are auto-tagged as Promise to Pay, Refusal, or Dispute.
- **Command Center:** A dark-mode React dashboard streams the live transcript in a hacker-style terminal with risk badges popping in as the AI detects intent. Recovery rates and risk scores aggregate across thousands of calls.
- **Architecture:** Frontend: React 18 + Vite + Tailwind, API: Python + FastAPI — orchestrates calls and SIP handler, Agent Worker: LiveKit Agents, runs as a separate process, Dockerfiles for DigitalOcean App Platform deployment (API + Worker + Frontend).

### 4. Odeon (Autonomous Agents)
**Video:** https://youtu.be/GFdSe4-c_xQ
**Description:** A framework for evolving voice agents through adversarial persona testing. It iteratively self-corrects based on simulation outcomes to improve agent performance.
**Summary:** AI agent optimization platform. Generate adversarial personas, run high-fidelity simulations, score each conversation against strict KPIs, and let a meta-agent rewrite the prompt automatically when targets are missed — a self-improving loop that converges on the optimal persona.
**Highlights:**
- Adversarial persona generation for synthetic stress testing
- Meta-agent auto-rewrites prompts when thresholds fail — self-improving loop
- Git-style red/green diff view shows exactly which words changed
**Tech Stack:** Python, FastAPI, WebSockets, Groq, LangChain, SQLite, React 19, Vite, TypeScript, Tailwind 4

**Project Modal Details:**
- **The problem:** Prompt tuning is a black box. You tweak, you hope, you ship. Odeon replaces that with a measurable loop: simulate realistic users, score the agent against numerical KPIs, and auto-rewrite the prompt when it fails.
- **Personas generated on the fly:** Odeon spawns diverse user personas per scenario — "The Lawyer," "The Crying Student," "The Stubborn Defaulter," etc. Each persona drives the user-side of the simulation, giving the agent genuinely hard traffic to handle.
- **Strict metric thresholds:** Empathy (1–10), Negotiation (1–10), Repetition (1–10). Agents must meet ALL criteria to pass a scenario — no cherry-picking.
- **Self-improving loop:** When the agent fails a threshold, the Optimizer meta-agent reads the failure logs and rewrites the system prompt. The Neural Visual Diffing view renders the prompt change as a Git-style red/green diff.
- **Live stream:** A bi-directional WebSocket streams every simulation character-by-character to the frontend. SQLite archives every run for replay, analysis, and forking.
- **Stack:** FastAPI + WebSockets backend, Groq Cloud for ultra-fast LLM inference (Llama 3.1 8B / 70B), LangChain for chain management and structured output parsing, SQLite for history & replay, React 19 + Vite + TypeScript + Tailwind 4 frontend.

### 5. MapMyRepo (Knowledge Graph / AI)
**Live:** https://mapmyrepo.siddhvasudev.com | **Video:** https://youtu.be/EmTDrPzAo40
**Description:** Turns any codebase into an interactive knowledge graph. Files and folders become interconnected nodes; Gemini summarizes each, and you can chat with the graph to explore architecture.
**Summary:** Transforms any codebase into an interactive D3.js force-directed node graph. Every file and folder is a node, Gemini summarizes each one, and a per-node chat panel lets you ask architectural questions directly.
**Highlights:**
- Interactive force-directed node graph of any codebase
- Gemini-powered per-node summaries + contextual chat
- Load any public GitHub repo by URL — no auth required
**Tech Stack:** React 19, TypeScript, Vite 6, D3.js 7, Google Gemini, Tailwind

**Project Modal Details:**
- **What it does:** Point it at a GitHub URL or drag a folder in. MapMyRepo parses the tree, filters out noise, and renders it as a force-directed graph you can orbit, zoom, and drill into.
- **Graph interactions:** Scroll to zoom, drag to pan, click a node to select; Double-click a folder to expand or collapse its contents; Hover highlights connected nodes; Distinct icons and colors per file type + folder.
- **AI layer (Gemini):** Per-node architectural summary generated on demand; Chat tab per node; Contextual answers (Gemini sees the file / folder metadata + related nodes); Markdown-rendered responses via Marked.
- **Import paths:** Local upload; GitHub URL; Optional GitHub PAT raises the 60/hr rate limit ceiling for private repos.
- **Stack:** React 19 + TypeScript + Vite 6, D3.js 7 for the force-directed graph, Google Gemini for per-node summaries and chat, Tailwind with glassmorphic sidebar + dark/light theming.

---

## 03 / More from GitHub (Public Work & Modals)

**Section intro:** A selection of my other public work. Click any tile for the full case study — summary, notable details, and tech stack pulled from the README.

**Language filters:** ALL 24 · PYTHON 7 · TYPESCRIPT 7 · JAVASCRIPT 6 · HTML 2 · JAVA 1
**Footer control:** SHOW ALL 24 PROJECTS

### Socratis (TypeScript)
- **Repo:** https://github.com/vasu-devs/Socratis
- **Description:** Voice AI Agent-powered technical interview platform with real-time voice interaction, live code feedback, and intelligent assessment using LiveKit, Deepgram, and Groq.
- **Summary:** Real-time AI interviewer that runs live coding interviews over WebRTC voice. Candidates code in Monaco while a Python agent watches every keystroke via chat-context injection, asks Socratic hints only when needed, and writes a forensic post-interview report.
- **Highlights:**
  - Real-time code awareness — agent sees every edit via chat-context injection
  - Socratic method — only speaks when detecting bugs, approach changes or stalls
  - Forensic report with exact-quote communication analysis and hallucination cross-checks
- **Tech:** Next.js 14, Python, LiveKit, Deepgram, Groq, MongoDB, TypeScript, Express
- **Modal Details:**
  - **The setup:** Candidate codes in Monaco. A Python voice agent drives the interview over WebRTC with LiveKit for transport, Deepgram for STT and aura-helios TTS, and Silero for voice-activity detection. The model is Groq's Llama-3.3 70B. Frontend is Next.js 14; an Express + MongoDB backend holds sessions.
  - **Real-time code awareness:** Earlier versions hallucinated about the candidate's code. V3's fix was Chat Context Injection: every edit in the Monaco editor pushes an explicit system message into the agent's context, so the model literally sees every diff instead of guessing.
  - **Behavior rules:**
    - Socratic — hint, don't solve
    - Speaks only when detecting bugs, approach changes or stalls
    - Adapts to any coding problem; asks for a description when missing
    - Cross-references verbal claims against the code to catch overclaims
  - **Post-interview forensics:** The same agent runs a second pass after the call ends. Strict Big-O on time and space. Line-by-line bug fixes in "Line X: [Issue] → [Fix]" format. Communication analysis citing exact transcript quotes. A hallucination check cross-references the candidate's claims against their actual code. Output renders on a radar-chart result page.

### Waldo (Python)
- **Repo:** https://github.com/vasu-devs/Waldo
- **Description:** A production-grade Retrieval-Augmented Generation system with multimodal support for PDFs containing text, images, tables, and charts.
- **Summary:** Production-grade agentic RAG pipeline that ingests complex PDFs with text, tables, charts and diagrams. Figures are transcribed by Gemini VLM, and a LangGraph agent routes, grades and rewrites queries with strict anti-hallucination guardrails.
- **Highlights:**
  - Multimodal ingestion — text + tables + figures in a single pipeline
  - LangGraph agent with query rewriting, relevance grading and retry logic
  - Refuses out-of-scope questions instead of hallucinating
- **Tech:** Python, FastAPI, React, Vite, Qdrant, LangGraph, Gemini, Groq, Docling
- **Modal Details:**
  - **The problem:** Most RAG systems only handle text. Waldo is built for real-world docs where the answer might live in a table, bar chart or figure caption — research papers, medical reports, technical spec sheets.
  - **Ingestion pipeline:**
    - IBM Docling extracts document structure with high fidelity
    - RapidOCR falls back for scanned pages
    - Gemini VLM transcribes figures to searchable semantic text
    - Sentence Transformers (all-MiniLM-L6-v2) embed chunks into Qdrant
  - **Agentic retrieval:**
    - LangGraph routes between direct response and retrieval
    - Every retrieved doc gets LLM-graded for relevance
    - Failed queries are rewritten (max 2 retries)
    - Visual-query detection auto-includes figure transcriptions
    - Groq serves the final generation for low latency
  - **Guardrails:** Out-of-scope questions are refused, not fabricated. When Gemini quota runs out, the system falls back to Docling's own captions rather than making something up.

### SSS (Python)
- **Repo:** https://github.com/vasu-devs/SSS
- **Description:** Screen Shot Sorter
- **Summary:** Local AI-powered screenshot organizer. Qwen2-VL-2B runs on your GPU, classifying images into nine semantic buckets, extracting URLs, cleaning text and generating per-image markdown logs.
- **Highlights:**
  - Fully local inference — no cloud API calls
  - Qwen2-VL vision pipeline + URL extraction + text cleaning
  - GPU-memory managed: cache clear every 5 images, bfloat16 weights
- **Tech:** Python, PyTorch, Qwen2-VL, Transformers
- **Modal Details:**
  - **The problem:** 4,000-file screenshot folders with zero structure. Manual sorting is unrealistic.
  - **Pipeline:**
    - Vision model (Qwen2-VL-2B via Transformers/PyTorch) ingests each image → structured understanding
    - Classifier routes to one of nine categories — anime, tech, hiring, finance, learning, health, news, memes, misc
    - Link extractor pulls every URL in the image
    - Text cleaner strips hashtags, emojis, formatting noise
    - Per-image .txt log in `./output/extracted/` + master `links.md` index
  - **Performance tuning:**
    - Model loads once at startup, images process one at a time
    - GPU cache clears every 5 images
    - Uses `bfloat16` for reduced VRAM footprint
    - ~5–10 sec per image on RTX 4060 (8 GB VRAM target)
    - No cloud API calls — fully local inference

### DryRunVisualised (TypeScript)
- **Repo:** https://github.com/vasu-devs/DryRunVisualised
- **Live:** https://visualdsa.siddhvasudev.com
- **Summary:** Real-time algorithm visualizer that renders data-structure operations in both 2D (SVG) and 3D (WebGL via Three.js). Write Python or C++ in Monaco, hit Run, watch each line execute with full variable inspection.
- **Highlights:**
  - Dual 2D / 3D view toggle with draggable nodes in the 3D scene
  - 50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking
  - Per-line trace replay with step forward/backward and speed slider
- **Tech:** Next.js 16, React 19, Three.js, TypeScript, Pyodide, Monaco Editor, Zustand, Tailwind
- **Modal Details:**
  - **What it does:** Write an algorithm, step through its execution, and watch arrays sort, graphs traverse, linked lists re-wire and matrices transform — step by step, with every variable's current state rendered live. Toggle between an interactive 2D view (SVG/DOM) and an immersive 3D scene (Three.js + React Three Fiber) with orbit controls and draggable nodes.
  - **Execution pipeline:**
    - Python runs client-side in Pyodide (WebAssembly)
    - C++ compiles remotely via Godbolt Compiler Explorer API (GCC 14.1)
    - Instrumentation injects `sys.settrace` (Python) and stderr macros (C++)
    - Each line emits a JSON snapshot: `{ line, stack, heap, stdout }`
    - `vizDetector.ts` classifies variables (array/grid/graph/linked-list/tree/scalar) and routes them
  - **Experience details:**
    - 50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking
    - Resizable panels — editor, variables, visualization
    - Amber glow on modified cells, strikethrough on previous values
    - Force-directed graph layouts for adjacency-list graphs
    - SVG linked-list nodes with data | next compartments and curved arrow connectors

### A18-INFINION- (Python)
- **Repo:** https://github.com/vasu-devs/A18-INFINION-
- **Summary:** Multi-agent static bug detector for specialized C++ (Infineon RDI API). A central Orchestrator dispatches Code Parser, MCP Lookup, Bug Detector and Bug Describer agents through a two-layer detection strategy that boosts confidence when pattern matching and LLM reasoning agree.
- **Highlights:**
  - Context-first — pulls API docs via MCP before inspecting the code
  - Two-layer detection (pattern + LLM) with consensus-based confidence
  - Multi-bug support, per-snippet isolation, CSV in / CSV out
- **Tech:** Python, Gemini, OpenAI, DeepSeek, FastMCP
- **Modal Details:**
  - **The task:** Generic linters miss domain-specific mistakes in specialized C++ because they don't know the API's rules. The Infineon A18 Challenge was to build a reviewer that does.
  - **Context-first design:** Before any LLM sees the code, the MCP Lookup Agent queries an MCP server (FastMCP + BGE embeddings) against the RDI API documentation and pulls the relevant rules. Only then does the Bug Detector run — with the API manual already in context.
  - **Pipeline:**
    - Orchestrator dispatches agents per snippet
    - Code Parser classifies each line (code/comment/preprocessor) + 1-indexed numbering
    - MCP Lookup queries the docs server with caching
    - Bug Detector runs pattern-match + LLM-reasoning layers; boosts confidence on consensus
    - Bug Describer produces human-readable explanations citing the manual
  - **Multi-provider:** Gemini 2.0, DeepSeek V3 and GPT-4o are interchangeable. Detections below 70% confidence are dropped. CSV in → CSV out for batch evaluation.

### Portfolio-cool (TypeScript)
- **Repo:** https://github.com/vasu-devs/Portfolio-cool
- **Live:** https://www.siddhvasudev.com/
- **Summary:** This portfolio site. Vite + React + TypeScript with Tailwind and Framer Motion. Radial theme toggle, context-aware custom cursor with paint trails, magnetic buttons, live GitHub stats.
- **Highlights:**
  - Radial theme transition tied to click coordinates
  - Custom cursor with contrast-aware color + paint trails
  - Sticky-hero stacked-section scroll pattern powered by Lenis
- **Tech:** Vite, React, TypeScript, Tailwind, Framer Motion, Lenis, Vercel
- **Modal Details:**
  - **Signature interactions:**
    - Radial theme transition — click-coordinate-anchored circle expansion
    - Custom cursor with contrast-aware color + paint trails + eater bot
    - Magnetic buttons that pull toward the cursor
    - Film-grain SVG overlay at 3% opacity for analog texture
    - Sticky-hero stacked-section scroll pattern via Lenis
  - **Live data:**
    - Stars via Cloudflare Workers counter (bypasses GitHub rate limits)
    - Commits via the jogruber contributions proxy
    - PRs via GitHub's search endpoint
  - **Build:** Lazy-loaded sections via React.lazy + Suspense. TypeScript strict mode throughout. 100dvh mobile layouts, AA-contrast foreground colors. Deployed to Vercel.

### RupeeRoast (TypeScript)
- **Repo:** https://github.com/vasu-devs/RupeeRoast
- **Description:** The AI-powered financial forensic tool that turns messy bank PDFs into actionable insights—and roasts your spending habits
- **Summary:** AI financial forensic tool that parses messy Indian bank PDFs (including UPI), categorizes every transaction via an LLM, and produces both a dashboard and a Groq-powered 'Indian Dad / Gen-Z' roast of your impulsive purchases.
- **Highlights:**
  - Universal PDF extraction for messy bank statements incl. UPI transactions
  - Roaster persona critiques impulsive spending with data-backed sass
  - Interactive charts: category breakdowns, monthly trends, impulsive vs necessary
- **Tech:** Next.js 15, React 19, Tailwind, Framer Motion, Recharts, FastAPI, Python, Groq, Gemini
- **Modal Details:**
  - **What it does:** Hand it a bank statement PDF (Kotak, HDFC, SBI, whatever). It extracts every transaction including UPI, classifies into categories, and produces two artifacts: an interactive dashboard and a roast of your impulsive spending.
  - **Extraction:**
    - PyMuPDF4LLM as the primary parser — much better than plain PyPDF for complex layouts
    - PyPDF as fallback for edge cases
    - Pydantic-validated schemas throughout
  - **AI layer:**
    - Groq Llama-3 for fast categorization
    - Gemini generates the 'Indian Dad / Gen-Z' persona roast
  - **Frontend:** Next.js 15 App Router + React 19 + Tailwind 4 + Framer Motion. Recharts for the dashboard, Plotly for the complex interactive views. The featured chart is impulsive-vs-necessary. One `python run_delulu.py` boots both services.

### EmailDrafter (JavaScript)
- **Repo:** https://github.com/vasu-devs/EmailDrafter
- **Live:** https://email-drafter-three.vercel.app
- **Description:** AI-assisted email drafting app with a Python backend and a modern React + Vite + Tailwind frontend.
- **Summary:** AI-assisted email drafting app — FastAPI backend, React + Vite + Tailwind frontend. Users enter context and tone/length preferences; the backend calls an LLM to draft or refine; the UI shows live previews.
- **Highlights:**
  - Separate /draft and /refine endpoints with prompt-level control
  - Hot-reload dev loop via Vite + uvicorn --reload
  - Swappable backend — frontend only talks to a thin api.js wrapper
- **Tech:** React, Vite, Tailwind, Python, FastAPI
- **Modal Details:**
  - **What it does:** Two modes: draft from scratch (prompt + optional tone/length hints) and refine (existing draft + instructions). Live preview in the UI before you copy or send.
  - **API surface:**
    - POST /api/draft — { prompt, tone?, length? } → { draft }
    - POST /api/refine — { draft, instructions } → { draft }
  - **Architecture:** Monorepo with `backend/` (Python + venv + requirements.txt) and `frontend/my-app/` (Vite). All API calls funneled through `src/api.js` so the base URL is environment-swappable. Hot reload on both sides.

### Korosuke (Python)
- **Repo:** https://github.com/vasu-devs/Korosuke
- **Description:** A personal AI sidebar assistant built with PyQt5 and Ollama. It provides a sliding sidebar interface, chat-like conversation, and lightweight integration with LLaMA models.
- **Summary:** PyQt5 sliding-sidebar desktop assistant. Chat with a local LLaMA via Ollama, toggle with a hotkey, runs inference on a background thread so the UI never blocks.
- **Highlights:**
  - Sliding sidebar UI with non-blocking background worker
  - Local Ollama inference — no cloud round-trips
  - ESC to hide, re-run to toggle behavior
- **Tech:** Python, PyQt5, Ollama, LLaMA
- **Modal Details:**
  - **What it does:** A sidebar that slides in from the screen edge for AI chat, and slides away when dismissed. All inference runs against local Ollama (default `llama3.2:1b`) so it works offline with zero API keys.
  - **Details:**
    - PyQt5 with smooth slide animations and styled chat bubbles
    - Background QThread worker — UI never freezes during generation
    - PID-based hotkey toggle: re-running the script flips visibility
    - ESC hides the sidebar

### ASCIIRealTime (HTML)
- **Repo:** https://github.com/vasu-devs/ASCIIRealTime
- **Live:** https://ascii-real-time.vercel.app
- **Description:** Real Time ASCII video streaming using user camera
- **Summary:** Browser demo that turns your webcam feed into real-time ASCII or emoji art. Optional MediaPipe Selfie Segmentation masks the background. Zero build — vanilla JS + Tailwind via CDN.
- **Highlights:**
  - ASCII text mode + emoji-canvas mode with per-glyph caching
  - MediaPipe Selfie Segmentation for optional background removal
  - Privacy — all processing in-browser, video never leaves your device
- **Tech:** JavaScript, Tailwind, MediaPipe
- **Modal Details:**
  - **How it works:**
    - Samples camera frames to an offscreen canvas at a dynamic grid size
    - Per-cell luminance via perceptual luma: `0.2126R + 0.7152G + 0.0722B`
    - Maps brightness → character from active palette (light → dark)
    - Image smoothing disabled everywhere for pixel-crisp edges
  - **Modes:**
    - ASCII text — `<pre>` with dynamically-sized font
    - Emoji — `<canvas>` grid with per-glyph bitmap caching for alignment
    - Palettes: Basic, Extended, Blocks, Emoji, Custom
  - **Privacy:** All processing in-browser. Video never leaves the device. External libraries load from CDNs.

### Health-os (TypeScript)
- **Repo:** https://github.com/vasu-devs/Health-os
- **Summary:** Mobile-first PWA dashboard for workouts and meals. Next.js 14 App Router with a viewport-locked layout where only internal panes scroll — the page itself never grows a scrollbar.
- **Highlights:**
  - Installable PWA with offline-ready service worker
  - Viewport-locked (100dvh) layout with internal scroll panes only
  - Mobile-first responsive design
- **Tech:** Next.js 14, TypeScript, Tailwind, next-pwa
- **Modal Details:**
  - **What it is:** A progressive web app. Add to home screen on mobile and it runs like a native app. Service worker is only generated in production build (next-pwa is disabled in dev by design).
  - **The layout trick:** Whole page is locked to `h-[100dvh]` with `overflow-hidden` on the outer body. Only the workout list and meal list scroll internally. On mobile, `100dvh` handles the browser chrome properly so the app uses the full available screen at all times.
  - **Stack:**
    - Next.js 14 App Router
    - TypeScript
    - Tailwind
    - next-pwa for the service worker generation

### GitArt (TypeScript)
- **Repo:** https://github.com/vasu-devs/GitArt
- **Live:** https://git-art-iota.vercel.app
- **Summary:** Browser-based tool that lets you paint your GitHub contribution graph like a canvas. Design a 52x7 heatmap, the app builds a real Git repository — in-browser via isomorphic-git on memfs, zipped with JSZip — whose commit timestamps reproduce that design when pushed.
- **Highlights:**
  - Runs entirely in-browser — no server, no GitHub API, no fake identities
  - 30+ built-in templates (Pac-Man, QR code, Christmas tree, Nyan trail...)
  - Image drop-in with 5-band quantization + text-to-pixels bitmap font
- **Tech:** Next.js 16, React 19, TypeScript, Tailwind, isomorphic-git, memfs, JSZip
- **Modal Details:**
  - **The concept:** GitHub's profile page renders your commit activity as a 52-week x 7-day heatmap. GitArt treats that grid as a painter's canvas: pick colors, draw a design, and the app builds a real Git repo whose commit timestamps reproduce the design when pushed to a fresh empty repo.
  - **Everything runs in the browser:**
    - isomorphic-git on a memfs virtual filesystem
    - JSZip packages .git/ + files into a single zip
    - No server writes, no GitHub API calls, no fake identities
  - **Intensity mapping:** Cells have intensity 0-4 mapping to 0 / 1 / 5 / 10 / 20 commits per day. The brightest cell (20 commits) stays within GitHub's "active user" bucket so the graph looks dramatic without looking synthetic.
  - **Design tools:**
    - Brush (levels 0-4) + eraser
    - Drop-in images quantized to 5 intensity bands
    - Text-to-pixels via bitmap font
    - 30+ templates — Pac-Man Chase, QR Code, Matrix Rain, Nyan Trail, Christmas Tree, Fireworks...
    - Time Machine — target any year 2022-2027, anchors to the first Sunday of that year

### GhostSync (HTML)
- **Repo:** https://github.com/vasu-devs/GhostSync
- **Description:** Control Antigravity IDE remotely via Telegram - from anywhere in the world.
- **Summary:** Windows app that exposes Antigravity IDE to a private Telegram bot over a Cloudflare Tunnel, so you can trigger AI prompts and receive live IDE screenshots from anywhere — with a strict user whitelist and rate limiting.
- **Highlights:**
  - Auto-generated Cloudflare tunnel — no port-forwarding required
  - Live IDE screenshots streamed back over Telegram
  - User-ID whitelist, rate limits, auto-deleted screenshots
- **Tech:** Python, python-telegram-bot, CustomTkinter, Cloudflared, PyAutoGUI
- **Modal Details:**
  - **What it does:** Run Antigravity on your PC, configure GhostSync with your Telegram bot token and user ID, click Connect. From any Telegram client you can now send a folder path to open, fire AI prompts, and receive live screenshots of your IDE.
  - **How the bridge works:**
    - Auto-downloads `cloudflared.exe` and spawns a Cloudflare Tunnel
    - python-telegram-bot listens for authorized commands
    - PyAutoGUI automates IDE input (window detection via %LOCALAPPDATA%)
    - CustomTkinter GUI; single PyInstaller .exe for non-Python users
  - **Security:**
    - User-ID whitelist — only your Telegram account can issue commands
    - 10 req/min rate limit
    - Screenshots auto-deleted after sending
    - Logs sanitize sensitive data
    - Credentials in %USERPROFILE%\.ghostsync\.env — never uploaded

### Kyoka (Python)
- **Repo:** https://github.com/vasu-devs/Kyoka
- **Description:** Kyoka: Elite behavioral intelligence unit that transforms raw OSINT into deep psychological dossiers and actionable negotiation strategies using multi-agent AI.
- **Summary:** OSINT-driven behavioral intelligence app. A tri-agent LangChain pipeline reads a target's digital footprint, synthesizes DISC and Big-Five traits, then produces actionable 'Battle Cards' with DOs, DON'Ts and opening lines.
- **Highlights:**
  - Tri-agent pipeline: researcher → analyst → tactician
  - DISC + Big-Five + ego-hook detection from LinkedIn / GitHub / Twitter content
  - Luxury-tool UI with radar charts, magnetic hovers, chat simulator
- **Tech:** React, Vite, Tailwind, Framer Motion, FastAPI, Python, LangChain, Gemini, DeepSeek, Tavily
- **Modal Details:**
  - **The premise:** In most high-stakes meetings you know someone's title but not their core drivers, shadow traits or preferred communication protocol. Kyoka closes that gap.
  - **Tri-agent pipeline:**
    - Deep Diver (Tavily Search) — OSINT across LinkedIn, GitHub, X, YouTube
    - PsychProfiler (DeepSeek-V3 / Gemini) — DISC, Big-Five, archetypes, ego hooks
    - Strategist (GPT-4o / Gemini) — Battle Card with DOs, DON'Ts, opening lines
  - **Backend:** FastAPI + LangChain. A unified `run.py` creates the venv, installs both Python and Node deps, and launches backend + frontend in parallel.
  - **Frontend:** "Charcoal & Gold" luxury-concierge aesthetic — Playfair Display for headings, Inter for data. Radar charts visualize personality skew. Reveal cards, magnetic hovers, and a chat simulator let you rehearse the conversation before it happens.

### BranchGPT-Extension (TypeScript)
- **Repo:** https://github.com/vasu-devs/BranchGPT-Extension
- **Summary:** Chrome extension that turns ChatGPT into a DAG-based chat tool. Fork any message into a parallel branch, visualize the tree in a side panel, and keep context clean. All data stored locally via IndexedDB.
- **Highlights:**
  - True branching — fork any message into a parallel reality
  - Conversation tree rendered in a sleek side panel
  - Local-only IndexedDB storage; injects directly into the ChatGPT UI
- **Tech:** Vite, React, TypeScript, Tailwind, Dexie.js, CRXJS
- **Modal Details:**
  - **What it does:** Injects directly into the ChatGPT UI — no new surface to learn. Adds a Fork button to every message. Clicking it spawns a parallel branch from that point; the parent chat stays intact. A side panel visualizes the whole conversation tree so you can flip between branches or prune the ones that didn't pan out.
  - **Tech:**
    - Vite + CRXJS — Manifest V3 native build
    - React + TypeScript + Tailwind
    - Dexie.js over IndexedDB for local storage
  - **Privacy:** Everything local. No external servers, no analytics, no telemetry. Every branch, every message, every tree structure stays on your machine.

### PixelForge (Java)
- **Repo:** https://github.com/vasu-devs/PixelForge
- **Description:** PixelForge Studio is a high-performance, aesthetically pleasing image-to-ASCII art converter built with JavaFX. It transforms your images into detailed ASCII representations with a sleek "Matrix-style" dark interface.
- **Summary:** JavaFX image-to-ASCII converter with a multi-threaded rendering engine. Real-time preview with debounced slider, full-color per-character mode, and HD PNG export at original image dimensions.
- **Highlights:**
  - Multi-threaded canvas engine — UI stays smooth while rendering
  - Full-color per-character mode based on original image data
  - Ultra-HD PNG export at source image dimensions
- **Tech:** Java 17, JavaFX, Maven
- **Modal Details:**
  - **Engine:**
    - Multi-threaded background rendering — UI thread never blocks
    - Smart slider debouncing — one render fires when you stop dragging
    - Adaptive viewport — art scales to window dimensions
    - Dark-theme UI with smooth animations
  - **Output:** Full-color mode samples the original image's pixel colors and applies them per-character, creating the illusion of the original image through typography. Download triggers a dedicated HD render pass at the source image's original resolution — so a 4K input gives you a 4K ASCII PNG, not a screenshot.
  - **Build:** Java 17 + JavaFX 17, packaged with Maven. Run via `mvn javafx:run`.

### Maze-Pathfinder-Visualizer (Python)
- **Repo:** https://github.com/vasu-devs/Maze-Pathfinder-Visualizer
- **Description:** An interactive Pygame-based maze pathfinding visualizer that demonstrates four classic pathfinding algorithms: BFS, DFS, Dijkstra, and A*.
- **Summary:** Pygame-based pathfinding visualizer comparing BFS, DFS, Dijkstra and A* side-by-side on procedurally generated mazes. Per-algorithm color coding, 60 FPS step-by-step exploration.
- **Highlights:**
  - 4 classic algorithms: BFS, DFS, Dijkstra, A* with Manhattan heuristic
  - Procedural maze generation via recursive backtracking
  - 60 FPS visualization with per-algorithm metrics
- **Tech:** Python, Pygame
- **Modal Details:**
  - **How it works:**
    - Mazes generated via recursive backtracking (stack-based DFS → one solution)
    - 45x45 cell grid at 15 px/cell (675x675 window) — 60 FPS animation
    - Path reconstruction via parent pointers stored in `visited: {cell: parent}`
    - A* uses Manhattan distance as its admissible heuristic
  - **Color coding:**
    - Blue — BFS explored cells
    - Red — DFS explored cells
    - Green — Dijkstra explored cells
    - Yellow — A* explored cells
    - Orange — final shortest path
  - **Controls:** Press 1-4 to select algorithm, SPACE to run, R to generate a new maze, ESC to quit. Each run displays path length and wall-clock execution time.

### weather-dashboard-ai (JavaScript)
- **Repo:** https://github.com/vasu-devs/weather-dashboard-ai
- **Live:** https://weather-dashboard-ai.vercel.app
- **Description:** An AI-powered weather dashboard combining real-time weather data from OpenWeatherMap with lifestyle suggestions generated via the OpenRouter API (DeepSeek model).
- **Summary:** React + FastAPI weather dashboard combining OpenWeatherMap data with AI-generated lifestyle suggestions (clothing, activity, precaution) from OpenRouter's DeepSeek model.
- **Highlights:**
  - Fused weather data + AI-generated daily suggestions
  - JSON-only LLM prompt for reliable structured output
  - CORS-ready split frontend/backend, Heroku-style Procfile included
- **Tech:** React 19, Vite, Tailwind, Axios, FastAPI, Python, DeepSeek, OpenWeatherMap
- **Modal Details:**
  - **Flow:**
    - User enters a city in the frontend
    - Frontend hits GET `/weather/{city}`
    - Backend fetches current weather from OpenWeatherMap
    - Backend passes weather JSON to OpenRouter DeepSeek with a JSON-only prompt
    - AI returns structured JSON (activity/precaution/clothing) → merged with weather data
  - **Reliability:** Constrained JSON-only prompting means the LLM can't free-form — parsing the response into typed fields is deterministic.
  - **Stack:** Frontend: React 19 + Vite 7 + Axios + Tailwind. Backend: FastAPI + Uvicorn + Requests + Pydantic. Procfile included for Heroku-style deploy.

### ChatBotUI (JavaScript)
- **Repo:** https://github.com/vasu-devs/ChatBotUI
- **Summary:** React + Vite college-assistant front-end with three portals sharing a unified theme — landing, student chat with voice input, and admin dashboard for PDF document management.
- **Highlights:**
  - Three-portal design: landing / student chat / admin
  - Drag-and-drop PDF ingestion with real-time processing status
  - Voice-mode overlay for accessibility
- **Tech:** React, Vite, Tailwind, FastAPI
- **Modal Details:**
  - **Portals:**
    - Landing — marketing page with feature cards and usage-stats tiles
    - Student Chat — message bubbles, typing indicators, department context switching, voice-mode overlay
    - Admin — drag-and-drop PDF upload with real-time processing, knowledge-base management, analytics
  - **Architecture:** Shared `ThemeContext` and `useTheme` hook keep all three portals visually consistent through dark/light switches. A root layout wraps everything in the theme provider; `AppRouter.jsx` handles portal-level navigation.
  - **Stack:** React 19+ with hooks + context API, Vite for dev and build, Tailwind for styling. API layer structured for FastAPI backend integration.

### Forge (JavaScript)
- **Repo:** https://github.com/vasu-devs/Forge
- **Description:** A SOTA SDLC skill set for Claude Code — 16 lifecycle skills, a continuous-learning memory layer, and a live code-dependency graph.
- **Summary:** One cohesive Claude Code plugin: 16 hand-off-linked SDLC skills (understand → brainstorm → architect → plan → tdd → debug → review → verify → ship), each encoding a falsifiable engineering rule — plus a local memory layer that learns from your sessions and a live, self-updating map of your codebase.
- **Highlights:**
  - 16 namespaced lifecycle skills wired into one hand-off chain — discipline as falsifiable rules, not vibes
  - Two-tier continuous-learning memory: per-project instincts + anonymized global lessons, distilled from your own sessions
  - Live code-dependency graph (god-nodes, modules, blast-radius, cycles) patched incrementally so it never goes stale
- **Tech:** Claude Code plugin, Node.js, JSONL, ONNX embeddings
- **Modal Details:**
  - **The problem:** Power users of Claude Code accumulate a dozen overlapping skill packs, and a raw model has predictable failure modes: it assumes silently, over-builds, edits code it doesn't understand, and claims success it never verified. Forge is one namespaced lifecycle that enforces engineering discipline AND learns from your sessions so the agent stops repeating mistakes.
  - **Falsifiable, not aspirational:**
    - tdd: no production code without a failing test first — watch it fail, delete pre-test code
    - debug: after 3 failed fixes, question the architecture
    - verify: a claim → required-proof table before 'done' is allowed
    - Each skill names the rationalization it forbids, so the agent can't talk itself out of the process
  - **The memory loop:** Four lifecycle hooks feed a zero-dependency Node core: every Edit/Write/Bash is logged as compact JSONL, a throttled background distiller (Haiku) extracts trigger → action lessons through a strict quality gate, and the highest-confidence lessons are injected at session start. Its memory subsystem was later extracted into a second standalone plugin, engram.
  - **The code graph:** forge:graph builds a static import graph for JS/TS, Python, C/C++, Ruby and Rust (including tsconfig aliases), surfaces god-nodes, cycles and dead files, and is rebuilt once then patched by an mtime-diff on every stop — a high-accuracy skeleton that stays cheap.

### PolySEE (JavaScript)
- **Repo:** https://github.com/vasu-devs/PolySEE
- **Description:** A multilingual campus chatbot that answers student FAQs from documents, supports regional languages, maintains context, and escalates to staff when unsure.
- **Summary:** Multilingual campus FAQ chatbot supporting Hindi, English and 3+ regional languages — RAG over institutional circulars with an admin-approval workflow before answers go live. Smart India Hackathon 2025 semifinalist (Top 15 of 900+ teams).
- **Highlights:**
  - Hindi + English + 3 regional languages via RAG
  - Admin-approval workflow — only validated answers reach production
  - SIH 2025 semifinalist: Top 15 of 900+ teams
- **Tech:** React, Tailwind, FastAPI, Python, Gemini Flash 2.0, Ollama, ChromaDB
- **Modal Details:**
  - **The problem:** Campus offices field the same questions — fee deadlines, scholarship forms, timetable changes — every single day, often in Hindi or regional languages. Staff burn hours on repetition; answers already exist in circulars and PDFs but students want conversation, not search.
  - **RAG pipeline:**
    - Query embedded via local Ollama models
    - Semantic search over institutional documents in ChromaDB
    - Retrieved context + user query sent to Gemini Flash 2.0
    - Response returned with confidence score and source context
  - **Admin-approval workflow:** New responses don't go live unconfirmed. In staging mode, each response shows its confidence score and the retrieved context. Admins approve or reject; only approved responses get promoted into the production dataset — a fact-checked update loop that student volunteers can maintain.
  - **Multi-channel + multi-language:**
    - Embeddable chat widget on the college website
    - WhatsApp + Telegram integrations for wider reach
    - Confidence-based human fallback when the bot is unsure

### Arohan (JavaScript)
- **Repo:** https://github.com/vasu-devs/Arohan
- **Description:** The AI IPO Observatory — a research-grounded predictive model for the 2026 frontier-AI mega-IPOs.
- **Summary:** An investor-research observatory for the 2026 AI mega-IPO window (OpenAI, Anthropic, xAI/SPCX): a probability-weighted comparables + scenario model rendered as P10–P90 fan charts, an expected-return heatmap, and an in-app reader for the full research corpus — built in a single day.
- **Highlights:**
  - Four-layer scenario model: historical-comparables regression, fundamentals, demand overlay, macro gate
  - Fan-chart forecast lab with a live macro-stress slider and bear/base/bull toggles
  - 8 markdown dossiers (~4,300 words, 24 sources) bundled and readable in-app
- **Tech:** React 19, Vite, Tailwind 4, Recharts, Motion
- **Modal Details:**
  - **The model:** A log-linear regression anchor fit on a 20-listing historical IPO dataset (1995–2025), a company-fundamentals layer from verified June 2026 marks, a demand-side overlay, and a macro gate. Nine scenario cells per company collapse into probability-weighted P10/P50/P90 bands, computed offline and embedded as static data.
  - **Honest framing:** An OpenAI listing at ~$1T would be ~6x the largest IPO in history, so the comparables regression is an anchor, not statistics-grade inference — every band is labelled probability-weighted, with wide error bars and caveats baked into each research file. A research exercise, not investment advice.

### NyaySaathi (Python)
- **Repo:** https://github.com/vasu-devs/NyaySaathi
- **Description:** AI legal research assistant for Indian law — RAG over the Constitution, IT Act and FIRs with citation-backed answers.
- **Summary:** AI legal assistant that gives Indian citizens accurate, citation-backed answers grounded strictly in verified statutes — a local Qdrant RAG with legal-aware chunking, reference-aware reranking, and support for ~13 Indian languages including romanized Hinglish.
- **Highlights:**
  - Legal-aware chunking that preserves Article/Section/Part/Chapter structure
  - Hybrid retrieval + reranking with a Constitution-to-statute cross-link map
  - Refuses to hallucinate: context-only answers with official-source fallback
- **Tech:** Python, FastAPI, Qdrant, sentence-transformers, Gemini 2.0 Flash, React 19
- **Modal Details:**
  - **The problem:** Statutes like the Constitution and the IT Act are dense, cross-referenced, and only available in English legalese — and generic chatbots hallucinate fake sections, which is dangerous for legal questions. NyaySaathi answers only from verified source documents, in the user's own language.
  - **Retrieval engine:**
    - Embedded local Qdrant — no server or Docker needed
    - Query expansion via a hand-tuned Constitution-to-statute link map (e.g. IT Act 69A → Article 19(2))
    - Reranking by exact article/section matches, number proximity and keyword overlap
    - 13-language layer: script detection + Hinglish heuristics, English-pivot retrieval, translate-back answers
  - **Product surfaces:** Three features on one backend: the cited legal chatbot, NyayLens per-document Q&A (isolated collection per upload), and NyayShala — daily auto-generated legal-literacy nuggets across contract, criminal, family, IP, tax and property law.

### fastapi-cheatsheet
- **Repo:** https://github.com/vasu-devs/fastapi-cheatsheet
- **Description:** A comprehensive FastAPI Cheat Sheet (Markdown + PDF).
- **Summary:** A comprehensive FastAPI cheat sheet in Markdown + PDF — small, useful, and quietly my most-forked repo. Its FastAPI entry was also merged into EbookFoundation/free-programming-books (275k+ stars).
- **Tech:** FastAPI, Python, Markdown

---

## 04 / Technical Expertise
**Section intro:** The tools I reach for when building — grouped by where they sit in the stack. Hover any badge to see its brand color.

- **01 Languages (6 tools):** Python, TypeScript, JavaScript, C++, Rust, Java
- **02 Frontend & Desktop (8 tools):** Next.js, React, Vite, Tailwind, Framer Motion, Three.js, D3.js, Tauri
- **03 Backend (5 tools):** Node.js, Express, FastAPI, Prisma, Drizzle
- **04 Data & Vector (8 tools):** PostgreSQL, MongoDB, Supabase, Neon, Redis, SQLite, Qdrant, ChromaDB
- **05 AI / LLM (10 tools):** OpenAI, Claude, Gemini, Groq, DeepSeek, LangChain, LangGraph, Ollama, Hugging Face, PyTorch
- **06 Voice & Realtime (4 tools):** LiveKit, Deepgram, WebRTC, Twilio / SIP
- **07 DevOps (7 tools):** Git, Docker, Linux, Vercel, Cloudflare, GitHub Actions, Postman

---

## 05 / Community — Open Source Impact
**Headline:** 8 merged PRs across 5 external repositories

**Featured Contributions:**
1. **kana-dojo (4 PRs merged · Design System):** Authored four themes — Wabi, Wasabi Garden, Mirage Solis and Moonlit Waterfall — plus design documentation. Recurring contributor across the theme system.
2. **free-programming-books (275k★ · Developer Resources):** Added FastAPI to the programming cheatsheets index in EbookFoundation's famously selective developer-resource collection.
3. **pqoqubbw/icons (Animated Icon Library):** Contributed an animated corner-down-left icon with a path-draw animation to one of the most popular open-source animated-icon libraries.

**Live Stats (fetched at runtime):**
- **2,519+** Total commits
- **2,263** Stars earned
- **26** PRs merged

---

## 06 / Services — What I Build
**Eyebrow:** Freelance · Remote · Worldwide

- **AI Agents & Automation (Most requested):** Multi-agent pipelines, RAG systems, LangGraph workflows, and intelligent automation. From research agents to production systems that actually ship. (LangChain, LangGraph, RAG, Python, FastAPI)
- **Voice AI Systems (Speciality):** Real-time voice agents with sub-500ms latency. Full pipeline from STT to LLM to TTS — with personas, guardrails, and live dashboards. (LiveKit, Deepgram, Groq, WebRTC)
- **Full Stack MVPs (Fast turnaround):** Production-ready apps shipped fast. Next.js, PostgreSQL, auth, payments, and real performance — not just a prototype. (Next.js, TypeScript, PostgreSQL, Vercel)
- **Card CTA (each):** LET'S BUILD →
- **Closing:** Available for remote projects worldwide. (BOOK A FREE CALL)

---

## 07 / Contact (Footer)
- **Heading:** Let's Talk.
- **GitHub Contribution Calendar:** Aug → Jul, "2,519 contributions in the last year", Less → More legend.
- **Contact Methods:**
  - Email: siddhvasudev1402@gmail.com
  - Book a call: https://cal.com/vasu-devs
  - Buy me a coffee: https://buymeacoffee.com/vasu.devs
  - Resume
  - Socials: GitHub, Twitter, LinkedIn
- **Copyright:** © 2026 Vasu-DevS
- **Wordmark:** VASU-DEVS

---

## Global UI, Overlays & Micro-copy
Text that isn't inside a numbered section but is rendered on the site.

### Selected Works card chrome (02)
- **Buttons:** Live_Demo (with arrow) · Watch_Demo
- **Line under each card:** "Want to see the code or discuss? **Drop me a mail**" → mailto:siddhvasudev1402@gmail.com

### Case-study & project modal chrome

- Controls: Copy text button (turns to **Copied** for 2s), Close, GitHub / live-site icons
- Escape closes any modal; the backdrop is click-to-close
- Section headers are numbered 01, 02, 03 … with a hairline rule
- Closing block on each modal: **Stack** + tech chips

### Resume overlay
- Trigger: **RESUME** button in the hero and footer
- Modal title: **My Resume**
- Controls: "Open in new tab", "Resume Preview"

### Status badge (floating contact dock)
- Header: **Initialize Connection**
- Status line: **PROTO_77_STABLE**
- Channels: Gmail (siddhvasudev1402@gmail.com) · LinkedIn (vasu-devs) · X (Twitter) · Cal.com ("Book a session")

### Viewer / traffic badge
- Collapsed label: **Views**
- Panel title: **Traffic Insights**
- Stats: **Total Views**, **Unique Visitors**, **Session** (TRACKED)
- States: REFRESHING_DATA… · UPSTASH_REDIS_CACHED · DATA_UNAVAILABLE

### Side branding
- Vertical wordmark on the right edge (desktop only): **VASU-DEVS**

### Theme & cursor
- Sun/moon toggle switches light ↔ dark with a click-anchored radial wipe
- Custom contrast-aware cursor with paint trails; film-grain overlay at 3% opacity
- Preloader animation on first load (no copy)

---

## Timeline / Milestones

> Source: `src/data/milestones.json`.

- **Nov 2024 — Foundations** (learn): University of Colorado Computer Communications specialization + Coursera networking / systems track. The groundwork before the AI ramp.
- **H1 2025 — Deep Learning + data engineering** (learn): NPTEL Deep Learning (IIT Kharagpur), the 8-course MongoDB University track (incl. RAG + AI Agents), and SkillStone DSA training.
- **Sep 2025 — Oracle OCI AI Foundations — 98%** (award): Passed the Oracle Cloud Infrastructure 2025 AI Foundations Associate exam at 98%.
- **Oct 2025 — Smart India Hackathon semifinalist** (award): PolySEE, a multilingual campus RAG chatbot, reached the Top 15 of 900+ teams at SIH 2025.
- **Oct 2025 — First voice-agent work** (work): Started building real-time LiveKit voice agents — the beginning of the voice-AI thread that runs through everything since.
- **Nov 2025 — Open source: themes + animated icons** (oss): Merged 4 dark themes into lingdojo/kana-dojo and an animated corner-arrow pack into pqoqubbw/icons (5.5k★). Hacktoberfest 2025.
- **Dec 2025 — siddhvasudev.com + Odeon + BranchGPT** (ship): Shipped the live portfolio, the Odeon self-improving voice-agent gym, and the first BranchGPT DAG-chat build.
- **Jan → Mar 2026 — Recruitment take-homes, all shipped** (ship): Socratis (voice interviewer), Waldo (multimodal RAG), RupeeRoast (fintech forensics), and the Infineon A18 agentic C++ bug detector — each a complete product.
- **Feb 2026 — Visual DSA** (ship): Shipped visualdsa.siddhvasudev.com — run Python or C++ and watch it execute line-by-line in 2D + 3D.
- **Mar → Apr 2026 — Freelance · Stealth:** Delivered a full-stack application for a confidential client.
- **May 2026 — JustHireMe goes viral** (ship): Launched the local-first AI job-intelligence desktop app. 380K+ views and 800 → 2,000+ GitHub stars within two weeks.
- **Jun 2026 — Forge + engram** (ship): Published two Claude Code plugins: Forge (a SOTA SDLC skill set) and engram (local cross-session agent memory).
- **Jun 2026 → now — AI engineering internship · Stealth:** Contributing to AI systems with a focus on reliable agent behavior, real-time interactions, evaluation, and privacy. Company and project details remain confidential.


---

## Products — Building & Shipped

> Source: `src/data/products.json`.


### Building

#### JustHireMe — Local-first AI job-intelligence workbench [Live]
- **Blurb:** Scrapes and ranks job leads with graph + vector retrieval, explains why each role fits, and generates tailored resumes, cover letters and outreach — all on your machine, no data leaving the device.
- **How:** A Tauri 2 (Rust) shell hosts a React workbench and launches a bundled Python FastAPI sidecar; ranking blends deterministic scoring, an optional LLM evaluator and a keyless bundled ONNX embedding model over Kuzu + LanceDB.
- **Metrics:** 2k+ GitHub stars · 620 Backend tests · 102 Releases
- **Tech:** Tauri 2, Rust, React 19, Python, FastAPI, Kuzu, LanceDB, ONNX
- **Links:** Live: https://justhireme.ai · Repo: https://github.com/vasu-devs/JustHireMe

#### Forge — A SOTA SDLC skill set for Claude Code [Active]
- **Blurb:** One cohesive plugin of 16 hand-off-linked lifecycle skills (understand → plan → tdd → debug → review → ship) that encode software discipline as falsifiable rules and learn from your sessions.
- **How:** A zero-dependency Node hook core feeds a two-tier continuous-learning memory layer and a live, self-updating code-dependency graph — all local, patched incrementally on each turn.
- **Metrics:** 16 Skills · v2.1 Shipped
- **Tech:** Claude Code plugin, Node.js, JSONL, ONNX embeddings
- **Links:** Repo: https://github.com/vasu-devs/Forge

#### engram — Local cross-session memory for Claude Code [Active]
- **Blurb:** Gives Claude Code a memory that survives across sessions — surfaced proactively at session start, consolidated instead of hoarded, and treated as untrusted against prompt-injection.
- **How:** A two-tier local plugin with Mem0-style ADD/UPDATE/DELETE consolidation, a bi-temporal lifecycle, importance-modulated decay, and a hand-rolled dense-cosine + BM25 + entity hybrid retriever — no ANN index, no telemetry.
- **Metrics:** 384d Local ONNX embed · v2 Rebuilt
- **Tech:** Node.js ESM, bge-small-en, BM25, Mem0-style
- **Links:** Repo: https://github.com/vasu-devs/Forge


### Shipped

#### BranchGPT — Git-DAG chat for context optimization [Live]
- **Blurb:** Reimagines chat as a Directed Acyclic Graph — fork any message into a parallel branch, then smart-merge insights back as an LLM-generated summary so context stays clean.
- **Tech:** Next.js 16, Drizzle, Neon, Vercel AI SDK, Groq
- **Links:** Live: https://branchgpt.siddhvasudev.com · Repo: https://github.com/vasu-devs/BranchGPT

#### MapMyRepo — Any codebase → interactive knowledge graph [Live]
- **Blurb:** Turns a repo or whole GitHub profile into a D3 force-directed node graph with Gemini per-node summaries and a chat panel to explore architecture.
- **Tech:** React 19, TypeScript, D3.js, Google Gemini
- **Links:** Live: https://mapmyrepo.siddhvasudev.com · Repo: https://github.com/vasu-devs/MapMyRepo

#### Visual DSA — Run code, watch it execute in 2D + 3D [Live]
- **Blurb:** Write Python or C++, hit run, and step through execution as arrays sort, graphs traverse and lists re-wire — line by line, with full variable inspection in both 2D and 3D.
- **Tech:** Next.js 16, React 19, Three.js, Pyodide, Monaco
- **Links:** Live: https://visualdsa.siddhvasudev.com · Repo: https://github.com/vasu-devs/DryRunVisualised

#### GitArt — Paint your GitHub contribution graph [Live]
- **Blurb:** Design a 52×7 heatmap in the browser and get a real, pushable Git repo whose commit timestamps reproduce the art — built entirely client-side with isomorphic-git.
- **Tech:** Next.js 16, React 19, isomorphic-git, memfs, JSZip
- **Links:** Live: https://git-art-iota.vercel.app · Repo: https://github.com/vasu-devs/GitArt

#### Vaani — Voice-native AI debt collection [Demo]
- **Blurb:** Sub-500ms outbound voice agent with an FDCPA 'Sherlock' risk engine, two tuned personas, and a live mission-control dashboard.
- **Tech:** Python, FastAPI, LiveKit, Groq, Deepgram
- **Links:** Live: https://www.youtube.com/watch?v=VsEfOfwh8XM · Repo: https://github.com/vasu-devs/Vaani

#### Odeon — Self-improving voice-agent gym [Demo]
- **Blurb:** Generates adversarial personas, scores each conversation against KPIs, and lets a meta-agent auto-rewrite the prompt — with a Git-style neural diff of every change.
- **Tech:** Python, FastAPI, WebSockets, Groq, React 19
- **Links:** Live: https://youtu.be/GFdSe4-c_xQ · Repo: https://github.com/vasu-devs/Odeon

#### Socratis — Real-time AI voice interviewer [Shipped]
- **Blurb:** Conducts live coding interviews over WebRTC voice, watches every keystroke via chat-context injection, and writes a forensic post-interview report.
- **Tech:** Next.js 14, LiveKit, Deepgram, Groq, MongoDB
- **Links:** Repo: https://github.com/vasu-devs/Socratis

#### Waldo — Agentic multimodal RAG over PDFs [Shipped]
- **Blurb:** Ingests complex PDFs with text, tables and figures; transcribes charts with a Gemini VLM; and a LangGraph agent routes, grades and rewrites queries with anti-hallucination guardrails.
- **Tech:** Python, FastAPI, Qdrant, LangGraph, Gemini
- **Links:** Repo: https://github.com/vasu-devs/Waldo

#### RupeeRoast — AI forensics for messy bank PDFs [Shipped]
- **Blurb:** Parses messy Indian bank + UPI statements, categorizes every transaction with an LLM, and produces both an interactive dashboard and a data-backed roast of your spending.
- **Tech:** Next.js 15, FastAPI, Groq, Gemini, Recharts
- **Links:** Repo: https://github.com/vasu-devs/RupeeRoast

#### Kyoka — OSINT → behavioral battle cards [Prototype]
- **Blurb:** A tri-agent pipeline that reads a target's public footprint, synthesizes DISC + Big-Five traits, and produces an actionable negotiation 'Battle Card'.
- **Tech:** React, FastAPI, LangChain, Gemini, Tavily
- **Links:** Repo: https://github.com/vasu-devs/Kyoka

#### LeetBot — AI LeetCode tutor extension [Published]
- **Blurb:** A Chrome MV3 extension with Tutor / Hint / Planner modes and auto-generated Mermaid diagrams, injected onto any LeetCode problem — keys stay local.
- **Tech:** React 19, Vite, Chrome MV3, Gemini, Mermaid.js
- **Links:** Repo: https://github.com/vasu-devs/LeetBot

#### PolySEE — Multilingual campus FAQ chatbot [Shipped]
- **Blurb:** RAG over institutional circulars in Hindi, English and regional languages, with an admin-approval workflow before answers go live. Smart India Hackathon 2025 semifinalist.
- **Tech:** React, FastAPI, Gemini Flash, Ollama, ChromaDB
- **Links:** Repo: https://github.com/vasu-devs/PolySEE

### Principles

- **Eval-driven:** Ship behind measurable gates — deterministic checks plus LLM-as-judge, and pass^k for reliability. Not vibes.
- **Local-first & private:** Default to on-device: bundled ONNX embeddings, keyless operation, no telemetry, data that never leaves the machine.
- **Agent-assisted, human-owned:** Heavy agent-assisted workflow with versioned plans, TDD and internal code-review passes — but I own every line that ships.
- **Ship the whole slice:** Prototype to production: packaging, CI, signed releases and docs. A demo is not a product.
- **Honest metrics:** Real numbers, real commit shares. If it's a contribution to someone else's product, it says so.
- **Fast:** Two-day SaaS sprints. Single-day recruitment take-homes. Momentum compounds.

---

## Project Catalog (domains & status)

> Source: `src/data/catalog.ts` — the filterable catalog.
> Entries already detailed under **Products — Building & Shipped** above are listed
> here by name only, with their catalog domains, to avoid repeating the same copy.

#### GhostSync — Drive your AI IDE from Telegram [Shipped]
- **Domains:** Dev Tools
- **Blurb:** Control the Antigravity IDE remotely over a Cloudflare tunnel — send prompts from anywhere and get live IDE screenshots back, with a strict user whitelist.
- **Tech:** Python, Telegram, Cloudflared, PyAutoGUI
- **Links:** Repo: https://github.com/vasu-devs/GhostSync

#### A18 · Infineon — Multi-agent static C++ bug detector [Complete]
- **Domains:** Agents, Dev Tools
- **Blurb:** Context-first MCP documentation-RAG plus a two-layer (pattern + LLM) detection strategy for bugs in Infineon's proprietary RDI API.
- **Tech:** Python, FastMCP, DeepSeek, Gemini
- **Links:** Repo: https://github.com/vasu-devs/A18-INFINION-

#### NyaySaathi — AI legal assistant for Indian law [Shipped]
- **Domains:** RAG
- **Blurb:** Local Qdrant RAG over the Constitution and IT Act with legal-aware chunking, reference-aware reranking and 13-language support.
- **Tech:** FastAPI, Qdrant, Gemini, sentence-transformers
- **Links:** Repo: https://github.com/vasu-devs/NyaySaathi

#### Screen Shot Sorter — Local Qwen2-VL screenshot organizer [Shipped]
- **Domains:** AI Apps
- **Blurb:** Classifies screenshots into semantic buckets, extracts URLs and cleans text with a vision model running fully on your GPU — privacy-first.
- **Tech:** Python, PyTorch, Qwen2-VL
- **Links:** Repo: https://github.com/vasu-devs/SSS

#### Korosuke — PyQt5 local-LLM sidebar assistant [Shipped]
- **Domains:** AI Apps
- **Blurb:** A sliding desktop sidebar that chats with a local LLaMA via Ollama, running inference off a background thread so the UI never blocks.
- **Tech:** Python, PyQt5, Ollama
- **Links:** Repo: https://github.com/vasu-devs/Korosuke

#### Arohan — AI IPO observatory [Shipped]
- **Domains:** Fintech, Web
- **Blurb:** A probability-weighted scenario model for the 2026 AI mega-IPOs with fan-chart forecasts and an in-app research reader — built in a single day.
- **Tech:** React 19, Vite, Recharts, Motion
- **Links:** Repo: https://github.com/vasu-devs/Arohan

#### Remotion Studio — Code-first demo-video studio [Active]
- **Domains:** Dev Tools, Web
- **Blurb:** A data-driven Remotion engine with a perceptual OKLCH color system, an anti-slop quality gate, and a repo-to-video "autodemo" pipeline.
- **Tech:** Remotion, React, Three.js, GSAP, OKLCH

#### ASCII Real-Time — Webcam → live ASCII / emoji art [Live]
- **Domains:** Web
- **Blurb:** Real-time webcam-to-ASCII in the browser with optional MediaPipe background removal — all vision runs client-side, nothing is uploaded.
- **Tech:** Vanilla JS, MediaPipe, Canvas
- **Links:** Live: https://ascii-real-time.vercel.app · Repo: https://github.com/vasu-devs/ASCIIRealTime

#### EmailDrafter — Tone-aware AI email drafter [Live]
- **Domains:** AI Apps
- **Blurb:** Turn a rough note plus a tone into a finished, paste-ready email — FastAPI backend, React frontend with live preview and history.
- **Tech:** React, FastAPI, DeepSeek
- **Links:** Live: https://email-drafter-three.vercel.app · Repo: https://github.com/vasu-devs/EmailDrafter

#### Weather Dashboard AI — Weather + AI lifestyle guidance [Live]
- **Domains:** AI Apps
- **Blurb:** Fuses live OpenWeatherMap data with LLM-generated clothing, activity and precaution suggestions in a single call.
- **Tech:** React 19, FastAPI, DeepSeek, OpenWeatherMap
- **Links:** Live: https://weather-dashboard-ai.vercel.app · Repo: https://github.com/vasu-devs/weather-dashboard-ai

#### PixelForge — JavaFX image-to-ASCII, Dockerized [Shipped]
- **Domains:** Dev Tools
- **Blurb:** A multi-threaded JavaFX ASCII-art converter with full-color mode and HD export, containerized so the desktop GUI runs from a browser tab.
- **Tech:** Java 17, JavaFX, Maven, Docker
- **Links:** Repo: https://github.com/vasu-devs/PixelForge

#### Auto-Timetable — OR-Tools timetable scheduler [Shipped]
- **Domains:** Web
- **Blurb:** A full-stack scheduler whose core is a Google OR-Tools CP-SAT constraint engine handling rooms, faculty, wings, electives and combined classes.
- **Tech:** React, Express, FastAPI, OR-Tools
- **Links:** Repo: https://github.com/vasu-devs/auto-timetable

### Also in the catalog (detailed above)

- **JustHireMe** — domains: Agents, RAG [Live] *(details above)*
  - A viral open-source desktop app that scrapes and ranks roles with graph + vector retrieval, explains fit, and generates tailored resumes and outreach — entirely on-device. 2,000+ stars.
- **Vaani** — domains: Voice AI, Fintech [Demo] *(details above)*
  - Generates adversarial personas, scores conversations against KPIs, and lets a meta-agent auto-rewrite the prompt — with a git-style neural diff of every change.
- **Odeon** — domains: Voice AI, Agents [Demo] *(details above)*
- **MapMyRepo** — domains: Dev Tools [Live] *(details above)*
  - Turns a repo or a whole GitHub profile into a D3 force-directed graph with Gemini per-node summaries and a chat panel to explore architecture.
- **BranchGPT** — domains: AI Apps, Dev Tools [Live] *(details above)*
  - Reframes chat as a Directed Acyclic Graph — fork any message into a parallel branch, then smart-merge insights back as an LLM-generated summary.
- **Visual DSA** — domains: Dev Tools [Live] *(details above)*
  - Write Python or C++, hit run, and step through execution line-by-line with full variable inspection in both 2D and 3D.
- **Socratis** — domains: Voice AI [Shipped] *(details above)*
  - Conducts live coding interviews over WebRTC voice, watches every keystroke via chat-context injection, and writes a forensic post-interview report.
- **Waldo** — domains: RAG [Shipped] *(details above)*
  - Ingests complex PDFs with text, tables and figures; a Gemini VLM transcribes charts; a LangGraph agent routes, grades and rewrites queries with anti-hallucination guardrails.
- **RupeeRoast** — domains: Fintech, AI Apps [Shipped] *(details above)*
  - Parses Indian bank + UPI statements, categorizes every transaction with an LLM, and produces both a dashboard and a data-backed roast of your spending.
- **Kyoka** — domains: Agents [Prototype] *(details above)*
  - RAG over institutional circulars in Hindi, English and regional languages, with an admin-approval workflow before answers go live. Smart India Hackathon 2025 semifinalist.
- **PolySEE** — domains: RAG [Shipped] *(details above)*
- **GitArt** — domains: Dev Tools, Web [Live] *(details above)*
  - Design a 52×7 heatmap in the browser and get a real, pushable Git repo whose commit timestamps reproduce the art — entirely client-side with isomorphic-git.
- **Forge** — domains: Dev Tools, Agents [Active] *(details above)*
  - 16 hand-off-linked lifecycle skills plus a zero-dependency Node core with a continuous-learning memory layer and a live, self-updating code-dependency graph.
- **engram** — domains: Dev Tools, RAG [Active] *(details above)*
  - Mem0-style consolidation, a bi-temporal lifecycle, importance decay, and a hand-rolled dense + BM25 + entity hybrid retriever — all local, no telemetry.
- **LeetBot** — domains: AI Apps [Published] *(details above)*
  - A Chrome MV3 extension with Tutor / Hint / Planner modes and auto-generated Mermaid diagrams, injected onto any LeetCode problem — keys stay local.
