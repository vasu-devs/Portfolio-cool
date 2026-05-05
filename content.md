# Vasu DevS - Portfolio Content

## Hero Section
- **Name:** Vasu DevS
- **Tagline:** A 21-year-old self-taught Full Stack AI Engineer based in India. Building AI Agents and Intelligent Systems.
- **Links & Socials:** GitHub, Twitter, LinkedIn, Book a Call, Resume
- **Aesthetic:** Features an elevated, premium, and static hero image with a radial theme transition, custom cursor with contrast-aware color/paint trails, and a sticky-hero stacked-section scroll pattern powered by Lenis.

---

## 01 / Experience
**Mar 2026 → Apr 2026 | Freelance · Sole engineer**
### Full-Stack Engineer - Internal Finance & P&L Platform
End-to-end build of a production-grade financial reporting platform: unified transaction ingestion across five live platforms, accurate multi-currency P&L with full processor-level deduplication, and a live dashboard that loads in sub-second. Shipped to production on day 18 at full scope.

**Headline Metrics:**
- **18:** Days, solo
- **5:** Integrations
- **10x:** Faster sync
- **85:** Tests
- **40+:** DB indexes

**Tech Stack:** Next.js 15, TypeScript, PostgreSQL, Prisma 7, NextAuth v5, Tailwind 4, Zustand, Recharts, decimal.js, Supabase, Vercel

**Case Study Details (Experience Modal):**
- **Context:** A multi-platform e-commerce business was manually reconciling financial data across several payment processors, an ad platform, and a fulfilment provider. They needed a single internal tool to unify every transaction, attribute every line to the correct product and owner, compute accurate per-product P&L, and surface it on dashboards — with proper audit trails because this is financial data.
- **Scope delivered:**
  - Next.js 15 + PostgreSQL + Prisma 7 app with a 14-model schema and 24 migrations, deployed to Vercel in the Frankfurt region.
  - 5 live platform integrations behind a single ConnectorInterface, each with credential testing, chunked sync, and encrypted credentials at rest.
  - Full P&L engine handling refunds, chargebacks, processor fees, cross-processor deduplication and multi-currency math.
  - Interactive dashboard with KPI cards, P&L waterfall, per-product/store/processor breakdowns, period comparison, live filters with instant re-aggregation.
  - Role-based access control, audit logging, rate limiting, and a complete security-hardening pass before hand-off.
- **Performance engineering:**
  - **10x:** Faster Shopify ingestion via parallel upserts with bounded concurrency and a pre-loaded exchange-rate cache.
  - **5–10x:** Faster overall sync pipeline via parallel enrichment, batched 200-row upserts and a tuned connection pool.
  - **~100x:** Faster historical currency backfill by replacing a row-by-row Prisma migration with a bulk SQL UPDATE ... FROM.
  - **>95%:** Dashboard load-time reduction — eliminated a 7.4-second meta-query bottleneck via composite indexes, Postgres RPC functions, and a pre-aggregated rollup table.
  - **500 → 0 ms:** Dashboard filter latency — moved filter state client-side and pre-fetched both currencies in parallel.
  - **4,500x:** Faster product attribution by replacing per-row Prisma queries with bulk updateMany grouped by matched product.
- **Architecture:**
  - Tri-format currency storage using decimal.js arbitrary-precision math end-to-end.
  - Three-phase sync pipeline (fetch → enrich → attribute) with signed continuation tokens.
  - Pre-aggregated DailyPnlRollup table behind two PostgreSQL RPC functions.
  - 40+ strategic indexes across 14 tables.
  - Chunked per-connector sync sized to each API's real constraints.
- **Quality & security:**
  - 85-test suite covering P&L math, processor deduplication, attribution rules, partner splits, exchange-rate caching.
  - Three-tier RBAC (OWNER / MANAGER / MEMBER) enforced via Next.js middleware.
  - AES-256-GCM credential encryption at rest, Zod input validation on every route, per-IP rate limiting.
  - Audit logs + raw-response JSON snapshots on every transaction, order, and expense.

---

## 02 / Selected Work (Featured Projects)

### 1. BranchGPT (Context Optimization / AI)
**Live:** https://branchgpt.vasudev.live/ | **Video:** https://youtu.be/RB3zvAXbpL0?si=ICerMC6OnoqNvavM
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

### 2. Vaani (Voice AI / Fintech)
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

### 3. Odeon (Autonomous Agents)
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

### 4. MapMyRepo (Knowledge Graph / AI)
**Live:** https://mapmyrepo.vasudev.live | **Video:** https://youtu.be/EmTDrPzAo40
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

### 5. PolySEE (NLP / Chatbot)
**Video:** https://youtu.be/6weynv_rblI
**Description:** A multilingual campus chatbot designed to handle FAQs in regional languages. Maintains conversational context and simplifies student support.
**Summary:** Multilingual campus FAQ chatbot supporting Hindi, English and 3+ regional languages. RAG over institutional circulars and notices; admin-approval workflow before responses go live; deployable across web, WhatsApp and Telegram.
**Highlights:**
- Hindi + English + 3 regional languages via RAG
- Admin-approval workflow — only validated answers reach production
- Embeddable on web + WhatsApp + Telegram
**Tech Stack:** React, Tailwind, FastAPI, Python, Gemini Flash 2.0, Ollama, ChromaDB

**Project Modal Details:**
- **The problem:** Campus offices field the same questions every single day, often in Hindi or regional languages. Staff burn hours on repetition; answers already exist in circulars and PDFs but students want conversation, not search.
- **RAG pipeline:** Query embedded via local Ollama models; Semantic search over institutional documents in ChromaDB; Retrieved context + user query sent to Gemini Flash 2.0; Response returned with confidence score and source context.
- **Admin-approval workflow:** New responses don’t go live unconfirmed. In staging mode, each response shows its confidence score and the retrieved context. Admins approve or reject; only approved responses get promoted into the production dataset.
- **Multi-channel + multi-language:** Embeddable chat widget on the college website; WhatsApp + Telegram integrations for wider reach; Hindi + English + 3 additional regional languages; Confidence-based human fallback.
- **Stack:** Frontend: React + Tailwind; Backend: FastAPI (Python); LLM: Gemini Flash 2.0; Embeddings: Ollama (local); Vector DB: ChromaDB.

---

## 03 / More from GitHub (Public Work & Modals)

### Socratis (TypeScript)
- **Description:** Voice AI Agent-powered technical interview platform with real-time voice interaction, live code feedback, and intelligent assessment using LiveKit, Deepgram, and Groq.
- **Summary:** Real-time AI interviewer that runs live coding interviews over WebRTC voice. Candidates code in Monaco while a Python agent watches every keystroke via chat-context injection, asks Socratic hints only when needed, and writes a forensic post-interview report.
- **Highlights:** Real-time code awareness — agent sees every edit via chat-context injection; Socratic method — only speaks when detecting bugs, approach changes or stalls; Forensic report with exact-quote communication analysis and hallucination cross-checks.
- **Tech:** Next.js 14, Python, LiveKit, Deepgram, Groq, MongoDB, TypeScript, Express.
- **Modal Details:**
  - **The setup:** Candidate codes in Monaco. A Python voice agent drives the interview over WebRTC with LiveKit for transport, Deepgram for STT and aura-helios TTS, and Silero for voice-activity detection. The model is Groq's Llama-3.3 70B. Frontend is Next.js 14; an Express + MongoDB backend holds sessions.
  - **Real-time code awareness:** V3's fix was Chat Context Injection: every edit in the Monaco editor pushes an explicit system message into the agent's context, so the model literally sees every diff instead of guessing.
  - **Behavior rules:** Socratic — hint, don't solve. Speaks only when detecting bugs, approach changes or stalls. Adapts to any coding problem; asks for a description when missing. Cross-references verbal claims against the code to catch overclaims.
  - **Post-interview forensics:** The same agent runs a second pass after the call ends. Strict Big-O on time and space. Line-by-line bug fixes in "Line X: [Issue] → [Fix]" format. Communication analysis citing exact transcript quotes. A hallucination check cross-references the candidate's claims against their actual code. Output renders on a radar-chart result page.

### Waldo (Python)
- **Description:** A production-grade Retrieval-Augmented Generation system with multimodal support for PDFs containing text, images, tables, and charts.
- **Summary:** Production-grade agentic RAG pipeline that ingests complex PDFs with text, tables, charts and diagrams. Figures are transcribed by Gemini VLM, and a LangGraph agent routes, grades and rewrites queries with strict anti-hallucination guardrails.
- **Highlights:** Multimodal ingestion — text + tables + figures in a single pipeline; LangGraph agent with query rewriting, relevance grading and retry logic; Refuses out-of-scope questions instead of hallucinating.
- **Tech:** Python, FastAPI, React, Vite, Qdrant, LangGraph, Gemini, Groq, Docling.
- **Modal Details:**
  - **The problem:** Most RAG systems only handle text. Waldo is built for real-world docs where the answer might live in a table, bar chart or figure caption — research papers, medical reports, technical spec sheets.
  - **Ingestion pipeline:** IBM Docling extracts document structure with high fidelity; RapidOCR falls back for scanned pages; Gemini VLM transcribes figures to searchable semantic text; Sentence Transformers (all-MiniLM-L6-v2) embed chunks into Qdrant.
  - **Agentic retrieval:** LangGraph routes between direct response and retrieval; Every retrieved doc gets LLM-graded for relevance; Failed queries are rewritten (max 2 retries); Visual-query detection auto-includes figure transcriptions; Groq serves the final generation for low latency.
  - **Guardrails:** Out-of-scope questions are refused, not fabricated. When Gemini quota runs out, the system falls back to Docling's own captions rather than making something up.

### SSS - Screen Shot Sorter (Python)
- **Description:** Screen Shot Sorter
- **Summary:** Local AI-powered screenshot organizer. Qwen2-VL-2B runs on your GPU, classifying images into nine semantic buckets, extracting URLs, cleaning text and generating per-image markdown logs.
- **Highlights:** Fully local inference — no cloud API calls; Qwen2-VL vision pipeline + URL extraction + text cleaning; GPU-memory managed: cache clear every 5 images, bfloat16 weights.
- **Tech:** Python, PyTorch, Qwen2-VL, Transformers.
- **Modal Details:**
  - **The problem:** 4,000-file screenshot folders with zero structure. Manual sorting is unrealistic.
  - **Pipeline:** Vision model (Qwen2-VL-2B via Transformers/PyTorch) ingests each image → structured understanding; Classifier routes to one of nine categories — anime, tech, hiring, finance, learning, health, news, memes, misc; Link extractor pulls every URL in the image; Text cleaner strips hashtags, emojis, formatting noise; Per-image .txt log in `./output/extracted/` + master `links.md` index.
  - **Performance tuning:** Model loads once at startup, images process one at a time; GPU cache clears every 5 images; Uses `bfloat16` for reduced VRAM footprint; ~5–10 sec per image on RTX 4060 (8 GB VRAM target); No cloud API calls — fully local inference.

### DryRunVisualised (TypeScript)
- **Live:** https://visualdsa.vasudev.live
- **Summary:** Real-time algorithm visualizer that renders data-structure operations in both 2D (SVG) and 3D (WebGL via Three.js). Write Python or C++ in Monaco, hit Run, watch each line execute with full variable inspection.
- **Highlights:** Dual 2D / 3D view toggle with draggable nodes in the 3D scene; 50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking; Per-line trace replay with step forward/backward and speed slider.
- **Tech:** Next.js 16, React 19, Three.js, TypeScript, Pyodide, Monaco Editor, Zustand, Tailwind.
- **Modal Details:**
  - **What it does:** Write an algorithm, step through its execution, and watch arrays sort, graphs traverse, linked lists re-wire and matrices transform — step by step, with every variable's current state rendered live. Toggle between an interactive 2D view (SVG/DOM) and an immersive 3D scene (Three.js + React Three Fiber).
  - **Execution pipeline:** Python runs client-side in Pyodide (WebAssembly); C++ compiles remotely via Godbolt Compiler Explorer API (GCC 14.1); Instrumentation injects `sys.settrace` (Python) and stderr macros (C++); Each line emits a JSON snapshot: `{ line, stack, heap, stdout }`; `vizDetector.ts` classifies variables and routes them.
  - **Experience details:** Resizable panels — editor, variables, visualization; Amber glow on modified cells, strikethrough on previous values; Force-directed graph layouts for adjacency-list graphs; SVG linked-list nodes with data | next compartments and curved arrow connectors.

### A18-INFINION- (Python)
- **Summary:** Multi-agent static bug detector for specialized C++ (Infineon RDI API). A central Orchestrator dispatches Code Parser, MCP Lookup, Bug Detector and Bug Describer agents through a two-layer detection strategy that boosts confidence when pattern matching and LLM reasoning agree.
- **Highlights:** Context-first — pulls API docs via MCP before inspecting the code; Two-layer detection (pattern + LLM) with consensus-based confidence; Multi-bug support, per-snippet isolation, CSV in / CSV out.
- **Tech:** Python, Gemini, OpenAI, DeepSeek, FastMCP.
- **Modal Details:**
  - **The task:** Generic linters miss domain-specific mistakes in specialized C++ because they don't know the API's rules. The Infineon A18 Challenge was to build a reviewer that does.
  - **Context-first design:** Before any LLM sees the code, the MCP Lookup Agent queries an MCP server (FastMCP + BGE embeddings) against the RDI API documentation and pulls the relevant rules. Only then does the Bug Detector run.
  - **Pipeline:** Orchestrator dispatches agents per snippet; Code Parser classifies each line; MCP Lookup queries the docs server with caching; Bug Detector runs pattern-match + LLM-reasoning layers; Bug Describer produces human-readable explanations citing the manual.
  - **Multi-provider:** Gemini 2.0, DeepSeek V3 and GPT-4o are interchangeable. Detections below 70% confidence are dropped.

### Portfolio-cool (TypeScript)
- **Live:** https://www.vasudev.live/
- **Summary:** This portfolio site. Vite + React + TypeScript with Tailwind and Framer Motion. Radial theme toggle, context-aware custom cursor with paint trails, magnetic buttons, live GitHub stats.
- **Highlights:** Radial theme transition tied to click coordinates; Custom cursor with contrast-aware color + paint trails; Sticky-hero stacked-section scroll pattern powered by Lenis.
- **Tech:** Vite, React, TypeScript, Tailwind, Framer Motion, Lenis, Vercel.
- **Modal Details:**
  - **Signature interactions:** Radial theme transition — click-coordinate-anchored circle expansion; Custom cursor with contrast-aware color + paint trails + eater bot; Magnetic buttons that pull toward the cursor; Film-grain SVG overlay at 3% opacity for analog texture.
  - **Live data:** Stars via Cloudflare Workers counter; Commits via the jogruber contributions proxy; PRs via GitHub's search endpoint.
  - **Build:** Lazy-loaded sections via React.lazy + Suspense. TypeScript strict mode throughout. 100dvh mobile layouts, AA-contrast foreground colors.

### RupeeRoast (TypeScript)
- **Description:** The AI-powered financial forensic tool that turns messy bank PDFs into actionable insights—and roasts your spending habits.
- **Summary:** AI financial forensic tool that parses messy Indian bank PDFs (including UPI), categorizes every transaction via an LLM, and produces both a dashboard and a Groq-powered 'Indian Dad / Gen-Z' roast of your impulsive purchases.
- **Highlights:** Universal PDF extraction for messy bank statements incl. UPI transactions; Roaster persona critiques impulsive spending with data-backed sass; Interactive charts.
- **Tech:** Next.js 15, React 19, Tailwind, Framer Motion, Recharts, FastAPI, Python, Groq, Gemini.
- **Modal Details:**
  - **What it does:** Hand it a bank statement PDF (Kotak, HDFC, SBI). It extracts every transaction including UPI, classifies into categories, and produces an interactive dashboard and a roast of your impulsive spending.
  - **Extraction:** PyMuPDF4LLM as the primary parser; PyPDF as fallback; Pydantic-validated schemas.
  - **AI layer:** Groq Llama-3 for fast categorization; Gemini generates the 'Indian Dad / Gen-Z' persona roast.
  - **Frontend:** Next.js 15 App Router + React 19 + Tailwind 4 + Framer Motion. Recharts for the dashboard, Plotly for complex interactive views.

### EmailDrafter (JavaScript)
- **Live:** https://email-drafter-three.vercel.app
- **Summary:** AI-assisted email drafting app — FastAPI backend, React + Vite + Tailwind frontend. Users enter context and tone/length preferences; the backend calls an LLM to draft or refine; the UI shows live previews.
- **Highlights:** Separate /draft and /refine endpoints with prompt-level control; Hot-reload dev loop via Vite + uvicorn --reload; Swappable backend.
- **Tech:** React, Vite, Tailwind, Python, FastAPI.
- **Modal Details:**
  - **What it does:** Two modes: draft from scratch and refine. Live preview in the UI.
  - **API surface:** POST /api/draft; POST /api/refine.
  - **Architecture:** Monorepo with `backend/` and `frontend/my-app/`. All API calls funneled through `src/api.js`.

### Korosuke (Python)
- **Description:** A personal AI sidebar assistant built with PyQt5 and Ollama.
- **Summary:** PyQt5 sliding-sidebar desktop assistant. Chat with a local LLaMA via Ollama, toggle with a hotkey, runs inference on a background thread so the UI never blocks.
- **Highlights:** Sliding sidebar UI with non-blocking background worker; Local Ollama inference — no cloud round-trips; ESC to hide, re-run to toggle behavior.
- **Tech:** Python, PyQt5, Ollama, LLaMA.
- **Modal Details:**
  - **What it does:** A sidebar that slides in from the screen edge for AI chat, and slides away when dismissed. All inference runs against local Ollama (default `llama3.2:1b`).
  - **Details:** PyQt5 with smooth slide animations and styled chat bubbles; Background QThread worker; PID-based hotkey toggle.

### ASCIIRealTime (HTML)
- **Live:** https://ascii-real-time.vercel.app
- **Summary:** Browser demo that turns your webcam feed into real-time ASCII or emoji art. Optional MediaPipe Selfie Segmentation masks the background. Zero build — vanilla JS + Tailwind via CDN.
- **Highlights:** ASCII text mode + emoji-canvas mode with per-glyph caching; MediaPipe Selfie Segmentation for optional background removal; Privacy — all processing in-browser, video never leaves your device.
- **Tech:** JavaScript, Tailwind, MediaPipe.
- **Modal Details:**
  - **How it works:** Samples camera frames to an offscreen canvas; Per-cell luminance via perceptual luma; Maps brightness → character. Image smoothing disabled everywhere.
  - **Modes:** ASCII text — `<pre>` with dynamically-sized font; Emoji — `<canvas>` grid with per-glyph bitmap caching; Palettes: Basic, Extended, Blocks, Emoji, Custom.

### Health-os (TypeScript)
- **Summary:** Mobile-first PWA dashboard for workouts and meals. Next.js 14 App Router with a viewport-locked layout where only internal panes scroll — the page itself never grows a scrollbar.
- **Highlights:** Installable PWA with offline-ready service worker; Viewport-locked (100dvh) layout with internal scroll panes only; Mobile-first responsive design.
- **Tech:** Next.js 14, TypeScript, Tailwind, next-pwa.
- **Modal Details:**
  - **What it is:** A progressive web app. Add to home screen on mobile and it runs like a native app.
  - **The layout trick:** Whole page is locked to `h-[100dvh]` with `overflow-hidden` on the outer body. Only the workout list and meal list scroll internally.

### GitArt (TypeScript)
- **Live:** https://git-art-iota.vercel.app
- **Summary:** Browser-based tool that lets you paint your GitHub contribution graph like a canvas. Design a 52x7 heatmap, the app builds a real Git repository in-browser.
- **Highlights:** Runs entirely in-browser — no server, no GitHub API; 30+ built-in templates (Pac-Man, QR code, Christmas tree); Image drop-in with 5-band quantization + text-to-pixels bitmap font.
- **Tech:** Next.js 16, React 19, TypeScript, Tailwind, isomorphic-git, memfs, JSZip.
- **Modal Details:**
  - **The concept:** Treats GitHub's 52-week x 7-day heatmap as a painter's canvas. The app builds a real Git repo whose commit timestamps reproduce the design when pushed.
  - **Everything runs in the browser:** isomorphic-git on a memfs virtual filesystem; JSZip packages .git/ + files into a single zip.
  - **Intensity mapping:** Cells have intensity 0-4 mapping to 0 / 1 / 5 / 10 / 20 commits per day.
  - **Design tools:** Brush (levels 0-4) + eraser; Drop-in images; Text-to-pixels; 30+ templates; Time Machine — target any year 2022-2027.

### GhostSync (HTML)
- **Summary:** Windows app that exposes Antigravity IDE to a private Telegram bot over a Cloudflare Tunnel, so you can trigger AI prompts and receive live IDE screenshots from anywhere.
- **Highlights:** Auto-generated Cloudflare tunnel; Live IDE screenshots streamed back over Telegram; User-ID whitelist, rate limits, auto-deleted screenshots.
- **Tech:** Python, python-telegram-bot, CustomTkinter, Cloudflared, PyAutoGUI.
- **Modal Details:**
  - **What it does:** Run Antigravity on your PC, configure GhostSync with your Telegram bot token. From any Telegram client you can now send a folder path to open, fire AI prompts, and receive live screenshots of your IDE.
  - **How the bridge works:** Auto-downloads `cloudflared.exe` and spawns a Cloudflare Tunnel; python-telegram-bot listens for authorized commands; PyAutoGUI automates IDE input.
  - **Security:** User-ID whitelist; 10 req/min rate limit; Screenshots auto-deleted after sending; Credentials in %USERPROFILE%\\.ghostsync\\.env.

### Kyoka (Python)
- **Summary:** OSINT-driven behavioral intelligence app. A tri-agent LangChain pipeline reads a target's digital footprint, synthesizes DISC and Big-Five traits, then produces actionable 'Battle Cards' with DOs, DON'Ts and opening lines.
- **Highlights:** Tri-agent pipeline: researcher → analyst → tactician; DISC + Big-Five + ego-hook detection; Luxury-tool UI with radar charts, magnetic hovers, chat simulator.
- **Tech:** React, Vite, Tailwind, Framer Motion, FastAPI, Python, LangChain, Gemini, DeepSeek, Tavily.
- **Modal Details:**
  - **The premise:** In most high-stakes meetings you know someone's title but not their core drivers, shadow traits or preferred communication protocol. Kyoka closes that gap.
  - **Tri-agent pipeline:** Deep Diver (Tavily Search) — OSINT across LinkedIn, GitHub, X, YouTube; PsychProfiler — DISC, Big-Five, ego hooks; Strategist — Battle Card with DOs, DON'Ts, opening lines.
  - **Frontend:** "Charcoal & Gold" luxury-concierge aesthetic. Radar charts visualize personality skew. Reveal cards, magnetic hovers, and a chat simulator let you rehearse the conversation before it happens.

### BranchGPT-Extension (TypeScript)
- **Summary:** Chrome extension that turns ChatGPT into a DAG-based chat tool. Fork any message into a parallel branch, visualize the tree in a side panel, and keep context clean. All data stored locally via IndexedDB.
- **Highlights:** True branching — fork any message into a parallel reality; Conversation tree rendered in a sleek side panel; Local-only IndexedDB storage.
- **Tech:** Vite, React, TypeScript, Tailwind, Dexie.js, CRXJS.
- **Modal Details:**
  - **What it does:** Injects directly into the ChatGPT UI. Adds a Fork button to every message. Spawns a parallel branch from that point. A side panel visualizes the whole conversation tree.
  - **Tech:** Vite + CRXJS — Manifest V3 native build; Dexie.js over IndexedDB.
  - **Privacy:** Everything local. No external servers, no analytics, no telemetry.

### PixelForge (Java)
- **Summary:** JavaFX image-to-ASCII converter with a multi-threaded rendering engine. Real-time preview with debounced slider, full-color per-character mode, and HD PNG export at original image dimensions.
- **Highlights:** Multi-threaded canvas engine; Full-color per-character mode based on original image data; Ultra-HD PNG export at source image dimensions.
- **Tech:** Java 17, JavaFX, Maven.
- **Modal Details:**
  - **Engine:** Multi-threaded background rendering; Smart slider debouncing; Adaptive viewport; Dark-theme UI with smooth animations.
  - **Output:** Full-color mode samples the original image's pixel colors and applies them per-character. Download triggers a dedicated HD render pass at the source image's original resolution.

### Maze-Pathfinder-Visualizer (Python)
- **Summary:** Pygame-based pathfinding visualizer comparing BFS, DFS, Dijkstra and A* side-by-side on procedurally generated mazes. Per-algorithm color coding, 60 FPS step-by-step exploration.
- **Highlights:** 4 classic algorithms: BFS, DFS, Dijkstra, A* with Manhattan heuristic; Procedural maze generation via recursive backtracking; 60 FPS visualization with per-algorithm metrics.
- **Tech:** Python, Pygame.
- **Modal Details:**
  - **How it works:** Mazes generated via recursive backtracking; 45x45 cell grid at 15 px/cell; Path reconstruction via parent pointers stored in `visited`; A* uses Manhattan distance as its admissible heuristic.
  - **Color coding:** Blue — BFS, Red — DFS, Green — Dijkstra, Yellow — A*, Orange — final shortest path.
  - **Controls:** Press 1-4 to select algorithm, SPACE to run, R to generate a new maze, ESC to quit.

### weather-dashboard-ai (JavaScript)
- **Live:** https://weather-dashboard-ai.vercel.app
- **Summary:** React + FastAPI weather dashboard combining OpenWeatherMap data with AI-generated lifestyle suggestions (clothing, activity, precaution) from OpenRouter's DeepSeek model.
- **Highlights:** Fused weather data + AI-generated daily suggestions; JSON-only LLM prompt for reliable structured output; CORS-ready split frontend/backend, Heroku-style Procfile included.
- **Tech:** React 19, Vite, Tailwind, Axios, FastAPI, Python, DeepSeek, OpenWeatherMap.
- **Modal Details:**
  - **Flow:** User enters a city in the frontend; Frontend hits GET `/weather/{city}`; Backend fetches current weather from OpenWeatherMap; Backend passes weather JSON to OpenRouter DeepSeek with a JSON-only prompt; AI returns structured JSON.
  - **Reliability:** Constrained JSON-only prompting means the LLM can't free-form — parsing the response into typed fields is deterministic.

### ChatBotUI (JavaScript)
- **Summary:** React + Vite college-assistant front-end with three portals sharing a unified theme — landing, student chat with voice input, and admin dashboard for PDF document management.
- **Highlights:** Three-portal design: landing / student chat / admin; Drag-and-drop PDF ingestion with real-time processing status; Voice-mode overlay for accessibility.
- **Tech:** React, Vite, Tailwind, FastAPI.
- **Modal Details:**
  - **Portals:** Landing — marketing page with feature cards and usage-stats tiles; Student Chat — message bubbles, typing indicators, department context switching, voice-mode overlay; Admin — drag-and-drop PDF upload with real-time processing, knowledge-base management, analytics.
  - **Architecture:** Shared `ThemeContext` and `useTheme` hook keep all three portals visually consistent through dark/light switches.

### HireMe (TypeScript)
- **Description:** Automating Hiring Processs
- **Summary:** Experiment in automating the hiring loop end-to-end — job-description parsing, candidate screening and shortlisting via LLMs.

---

## 04 / Technical Expertise
- **Languages:** Python, TypeScript, JavaScript, C++
- **Frontend:** Next.js, React, Vite, Tailwind, Framer Motion, Three.js, D3.js
- **Backend:** Node.js, Express, FastAPI, Prisma, Drizzle
- **Data & Vector:** PostgreSQL, MongoDB, Supabase, Neon, Qdrant, ChromaDB
- **AI / LLM:** OpenAI, Claude, Gemini, Groq, DeepSeek, LangChain, LangGraph, Ollama, Hugging Face, PyTorch
- **Voice & Realtime:** LiveKit, Deepgram
- **DevOps:** Git, Docker, Linux, Vercel, Cloudflare, Postman

---

## 05 / Community (Open Source Impact)
**Stats:** 
- Fetching live data for Total Commits (+), Stars Earned, PRs Merged.

**Featured Contributions:**
1. **lingdojo/kana-dojo (4 PRs merged · Design System)**: Authored four themes — Wabi, Wasabi Garden, Mirage Solis and Moonlit Waterfall — plus design documentation. Recurring contributor across the theme system.
2. **EbookFoundation/free-programming-books (275k★ · Developer Resources)**: Added FastAPI to the programming cheatsheets index in EbookFoundation's famously selective developer-resource collection.
3. **pqoqubbw/icons (Animated Icon Library)**: Contributed an animated corner-down-left icon with a path-draw animation to one of the most popular open-source animated-icon libraries.

---

## 06 / Services (What I Build)
- **AI Agents & Automation (Most requested):** Multi-agent pipelines, RAG systems, LangGraph workflows, and intelligent automation. From research agents to production systems that actually ship. (LangChain, LangGraph, RAG, Python, FastAPI)
- **Voice AI Systems (Speciality):** Real-time voice agents with sub-500ms latency. Full pipeline from STT to LLM to TTS — with personas, guardrails, and live dashboards. (LiveKit, Deepgram, Groq, WebRTC)
- **Full Stack MVPs (Fast turnaround):** Production-ready apps shipped fast. Next.js, PostgreSQL, auth, payments, and real performance — not just a prototype. Last one: 18 days, 290 commits, zero post-launch bugs. (Next.js, TypeScript, PostgreSQL, Vercel)
- **Available for remote projects worldwide.** (Book a free call)

---

## 07 / Contact (Footer)
- **Heading:** Let's Talk.
- **GitHub Contribution Calendar:** Shows last year's activity.
- **Contact Methods:** 
  - Email: siddhvasudev1402@gmail.com
  - Book a call: https://cal.com/vasu-devs
  - Buy me a coffee: https://buymeacoffee.com/vasu.devs
  - Socials: GitHub, Twitter, LinkedIn
- **Copyright:** © 2025 Vasu-DevS
