# Vasu-DevS — Portfolio Content

Everything visually shown on the portfolio (https://www.vasudev.live/), consolidated. Each section mirrors what appears on the live site in top-to-bottom order.

---

## Identity & Global Elements

- **Display name:** Vasu-DevS
- **Full name in hero:** VASU DEVS (rendered as two stacked blocks)
- **Tagline (hero intro):** A **21-year-old self-taught** **Full Stack AI Engineer** based in **India**. Building **AI Agents** and **Intelligent Systems**.
- **Primary email:** siddhvasudev1402@gmail.com
- **GitHub:** https://github.com/vasu-devs
- **Twitter / X:** https://x.com/vasu_devs (handle shown as @Vasu_DevS)
- **LinkedIn:** https://www.linkedin.com/in/vasu-devs/
- **Cal.com (book a call):** https://cal.com/vasu-devs
- **Buy me a coffee:** https://buymeacoffee.com/vasu.devs
- **Resume (Google Drive):** https://drive.google.com/file/d/1YK8o65wTso2_l2e9bwZo46daonm6-P7x/view?usp=sharing
- **Live site:** https://www.vasudev.live/
- **Portfolio repo:** https://github.com/vasu-devs/Portfolio-cool
- **Copyright line in footer:** © 2025 Vasu-DevS
- **Side branding (desktop vertical rail, in Hero):** VASU-DEVS

### Floating status pill (top-right on every screen)
- Label: **Open To Work** (emerald dot)
- Click reveals a dropdown titled **Initialize Connection** with sub-label **PROTO_77_STABLE**, listing:
  - **Gmail** — siddhvasudev1402@gmail.com
  - **LinkedIn** — vasu-devs
  - **X (Twitter)** — @Vasu_DevS
  - **Cal.com** — Book a session

### Bottom floating navigation (on every screen)
- Brand mark: **Vasu-DevS**
- Anchor links (desktop): **Experience**, **Work**, **Skills**, **Contact**
- Mobile icon cluster: Mail, LinkedIn, Twitter
- Right-side control: **Sun / Moon** theme toggle (click triggers a radial "sunlight" wave using the View Transitions API, anchored at the click coordinates)

### Preloader (shown on first load for ~2.5s)
- Top half (light, slides up): **VASU**
- Bottom half (dark, slides down): **DEVS**

---

## 01 / Experience — Freelance Case Study

**Section label:** `01 /` Experience

### Card (summary on the page)
- **Date pill:** Mar → Apr 2026
- **Meta:** Freelance · Sole engineer
- **Role title:** Full-Stack Engineer
- **Subtitle:** Internal Finance & P&L Platform
- **Brief:** End-to-end build of a Next.js 15 / PostgreSQL financial reporting platform: unified ingestion across five live platforms, accurate multi-currency P&L, and a dashboard that loads in sub-second. Shipped to production on day 18 at full scope.
- **Headline metrics (4 tiles):**
  - **18** — Days, solo
  - **5** — Integrations
  - **10×** — Faster sync
  - **85** — Tests
- **Tech chips on card:** Next.js 15, TypeScript, PostgreSQL, Prisma, Tailwind, Vercel
- **CTA:** Open case study →

### Case-study modal (click the card to open)

**Header:**
- Kicker: Case study · Freelance
- Title: Internal Finance & P&L Platform
- Tags: `Mar 2026 → Apr 2026`, `Sole engineer`, `Next.js · PostgreSQL`
- Lede: End-to-end build of a production-grade financial reporting platform: unified transaction ingestion across five live platforms, accurate multi-currency P&L with full processor-level deduplication, and a live dashboard that loads in sub-second.

**Metric strip (4 tiles):**
- **18** Days, solo
- **5** Integrations
- **85** Tests
- **40+** DB indexes

**01 — Context**
A multi-platform e-commerce business was manually reconciling financial data across several payment processors, an ad platform, and a fulfilment provider. They needed a single internal tool to unify every transaction, attribute every line to the correct product and owner, compute accurate per-product P&L, and surface it on dashboards — with proper audit trails because this is financial data.

**02 — Scope delivered**
- Next.js 15 + PostgreSQL + Prisma 7 app with a 14-model schema and 24 migrations, deployed to Vercel in the Frankfurt region for database proximity.
- 5 live platform integrations behind a single `ConnectorInterface`, each with credential testing, chunked sync, and encrypted credentials at rest.
- Full P&L engine handling refunds, chargebacks, processor fees, cross-processor deduplication and multi-currency math.
- Interactive dashboard — KPI cards, P&L waterfall, per-product/store/processor breakdowns, period comparison, live filters with instant re-aggregation.
- Role-based access control, audit logging, rate limiting, and a complete security-hardening pass before hand-off.

**03 — Performance engineering**
Dashboard and sync pipeline were both treated as first-class performance targets. Every win below is measured against the pre-optimisation baseline.
- **10×** — Faster Shopify ingestion via parallel upserts with bounded concurrency and a pre-loaded exchange-rate cache.
- **5–10×** — Faster overall sync pipeline via parallel enrichment, batched 200-row upserts and a tuned connection pool.
- **~100×** — Faster historical currency backfill by replacing a row-by-row Prisma migration with a bulk SQL `UPDATE ... FROM`.
- **>95%** — Dashboard load-time reduction — eliminated a 7.4-second meta-query bottleneck via composite indexes, Postgres RPC functions, and a pre-aggregated rollup table.
- **500 → 0 ms** — Dashboard filter latency — moved filter state client-side and pre-fetched both currencies in parallel so toggles fire with no server round-trip.
- **4,500×** — Faster product attribution by replacing per-row Prisma queries with bulk `updateMany` grouped by matched product.

**04 — Architecture**
- Tri-format currency storage — every monetary amount persisted in native + base + pre-computed alternate currency, using decimal.js arbitrary-precision math end-to-end. No floating-point money bugs.
- Three-phase sync pipeline (fetch → enrich → attribute) with signed continuation tokens that survive Vercel's 300-second serverless cap and stale-lock auto-recovery.
- Pre-aggregated `DailyPnlRollup` table behind two PostgreSQL RPC functions, so the dashboard resolves set-based aggregations in-database instead of pulling raw rows to the app.
- 40+ strategic indexes across 14 tables — including composite indexes tuned specifically to P&L filter shapes.
- Chunked per-connector sync sized to each API's real constraints (e.g. PayPal's hard 31-day window), with resumable continuation via `syncLogId` + `syncSecret`.

**05 — Quality & security**
- 85-test suite covering P&L math, processor deduplication, attribution rules, partner splits, exchange-rate caching — including a golden equivalence test between the legacy Prisma path and the new PostgreSQL RPC.
- Three-tier RBAC (OWNER / MANAGER / MEMBER) enforced via Next.js middleware on every protected route and API endpoint.
- AES-256-GCM credential encryption at rest, Zod input validation on every route, per-IP rate limiting on sensitive endpoints.
- Audit logs + raw-response JSON snapshots on every transaction, order, and expense for full regulatory traceability.

**Tech stack footer:**
Next.js 15 · TypeScript · PostgreSQL · Prisma 7 · NextAuth v5 · Tailwind 4 · Zustand · Recharts · decimal.js · Supabase · Vercel

### Extended résumé bullets for this same engagement

**Role:** Sole full-stack engineer (freelance)
**Timeline:** 18 calendar days · 290 commits · solo · shipped to production
**Stack:** Next.js 15 · TypeScript · PostgreSQL · Prisma 7 · Vercel · NextAuth v5 · Tailwind 4 · Zustand · Recharts · decimal.js

**Shipping velocity & scale**
- Delivered a production fintech SaaS solo in 18 days — 290 commits, ~71,000 LOC across 211 TS/TSX files, 14-model Postgres schema, 24 migrations, and 85 automated tests.
- Integrated 5 third-party platforms (Stripe, PayPal, Shopify GraphQL, Meta Ads, FulfilmentChina) behind a unified `ConnectorInterface` with AES-256-GCM credential encryption at rest.
- Built a chunked sync engine that survives Vercel's 300s serverless cap via signed continuation tokens — enabled multi-year historical imports that previously couldn't run at all.

**Performance engineering (with % improvement)**
- 10× faster Shopify ingestion (≈90% latency reduction) — parallelised upserts with bounded concurrency + pre-loaded exchange-rate cache.
- 5–10× faster overall sync pipeline (80–90% reduction) — parallel enrichment, 200-row batched upserts, connection-pool tuning.
- ~100× faster historical EUR backfill (~99% reduction) — rewrote row-by-row Prisma migration as a single bulk SQL `UPDATE ... FROM`.
- Eliminated a 7.4-second dashboard bottleneck (>95% load-time reduction) — split the fat meta query, added 7 composite indexes + 2 PostgreSQL RPC functions, introduced a pre-aggregated `DailyPnlRollup` table.
- 4,500× faster product attribution on a regression — reworked per-variant matching from per-row queries to bulk `updateMany` grouped by matched product.
- Dashboard filter latency: ~500ms → ~0ms (100% server-round-trip elimination) — moved filter state client-side and pre-fetched both currencies in parallel.

**Financial correctness & data quality**
- Detected and fixed a $23,700 revenue double-counting defect (Shopify ↔ Stripe ledger overlap on Flow-B funnel checkouts).
- Caught and reverted an over-aggressive fix that was erasing $281,000 of legitimate revenue; rebuilt deduplication rules to preserve all real charges.
- Recovered 641 orphaned orders, 2,350 transactions missing store attribution, and 133 unattributed PayPal charges — all reattributed without manual spreadsheet work.
- Resolved 55 production bugs total across data integrity, sync stability, currency handling, UI/UX, and security.

**Architecture & infrastructure**
- Multi-currency storage (native + USD base + pre-computed EUR on every row) with decimal.js arbitrary precision — zero floating-point money bugs.
- Instant zero-flicker USD/EUR switching across the entire app by pre-fetching both currencies in parallel on dashboard mount.
- 40+ strategic DB indexes (including 5+ composite indexes tuned to P&L filter shapes) across 14 tables.
- Deployed to Vercel `fra1` to co-locate with Supabase EU — ~10ms DB round-trip vs ~120ms from US regions.

**Quality & security**
- 85-test suite (3,093 LOC) covering P&L math, PayPal/Stripe dedup, attribution rules, partner splits, exchange-rate caching, and an RPC-vs-legacy golden equivalence test.
- 3-tier RBAC (OWNER / MANAGER / MEMBER) enforced via Next.js middleware on every protected route and API endpoint.
- Per-IP rate limiting on all sensitive endpoints (5/15min on auth, 30/min on P&L, 10/min on sync), Zod input validation on every route, full production security audit pass.
- Audit logging + `rawData` JSON snapshots on every transaction/order/expense for regulatory-grade traceability.

**Delivery & ownership**
- Solo ownership of architecture, database design, API integrations, UI, deployment, and client communication — zero design/ops/senior support.
- Client signed off on scope in full and took delivery on day 18; zero post-handoff bug reports to date.

**One-line résumé version**
> Sole engineer on an 18-day freelance build: shipped a Next.js 15 / PostgreSQL fintech SaaS (290 commits, ~71k LOC, 14-model schema, 85 tests) with 5 live payment/ad-platform integrations; drove 10× faster sync, >95% dashboard load-time reduction via 7 new indexes + 2 Postgres RPCs, and resolved a $23,700 revenue double-count defect plus 641 orphaned orders and 2,350 mis-attributed transactions.

---

## 02 / Selected Works

**Section label:** `02 /` Selected Works

Six flagship projects are shown as full case-study rows. Each row: title, category, description, "Live_Demo" button (when applicable), "Source_Code" GitHub button, and a hover-to-play video thumbnail that opens a full modal with summary, detail sections, highlights, and tech.

### 1. BranchGPT — Context Optimization / AI
- **Description:** A Git-like chat interface that treats conversations as a Directed Acyclic Graph (DAG) for context garbage collection. Features include forking branches and merging insights back to keep AI context clean.
- **Live demo:** https://branchgpt.vasudev.live/
- **Repo:** https://github.com/vasu-devs/BranchGPT
- **Video:** https://youtu.be/RB3zvAXbpL0?si=ICerMC6OnoqNvavM
- **Summary:** Conversations are trees, not lists. BranchGPT reimplements chat as a DAG — fork any message into a parallel reality, explore tangents without polluting the main thread, and smart-merge branches back as LLM-generated summaries.
- **The idea:** Long chat sessions bloat LLM context. Every tangent and dead-end stays in history, burning tokens and diluting relevance. BranchGPT models the conversation as a Git-style DAG — every message is a node, forking spawns a parallel branch that inherits history up to that point, and merging is explicit.
- **Smart merging:**
  - Llama 3.3 summarizes branches before merging, so the parent only absorbs new insight — not the full branch transcript
  - Merge logic filters out shared history, appending only what's new
  - Merges recorded as distinct system events in the chat stream
  - The branch stays intact post-merge — you can keep exploring it
- **Tree navigation:** A visual Git-tree sidebar renders the whole conversation graph. Click any node to jump. Each branch preserves its own history up to the fork point, so context switching is clean and unambiguous.
- **Stack:**
  - Next.js 16 — App Router + Server Actions
  - Neon Postgres via Drizzle ORM for tree storage
  - Vercel AI SDK wiring to Groq (Llama 3.3) for inference
  - Tailwind 4 + glassmorphic UI, full Markdown + LaTeX support
- **Highlights:**
  - Conversations as DAGs — fork, branch, merge, prune
  - LLM-summarized merges retain insight without transcript bloat
  - Git-tree sidebar for instant branch navigation
- **Tech:** Next.js 16, TypeScript, Drizzle ORM, Neon Postgres, Vercel AI SDK, Groq, Tailwind 4

### 2. Vaani — Voice AI / Fintech
- **Description:** An intelligent, voice-native debt collection platform powered by LiveKit, Groq, and Deepgram. Features sub-500ms latency, real-time negotiation, and FDCPA compliance guardrails.
- **Repo:** https://github.com/vasu-devs/Vaani
- **Video:** https://www.youtube.com/watch?v=VsEfOfwh8XM
- **Summary:** Voice-native debt-recovery command center. LiveKit handles real-time transport, Groq runs the LLM, Deepgram does both STT and TTS. Two personas — empathetic Rachel and firm Orion — pick up the phone. A "Sherlock" risk engine watches every second for compliance and intent.
- **Voice pipeline:**
  - LiveKit Agents for WebRTC transport + SIP outbound calls
  - Deepgram Nova-2 for real-time speech-to-text
  - Groq Llama 3 for low-latency LLM inference
  - Deepgram TTS for natural synthesized speech
  - Sub-500 ms end-to-end latency; full-duplex — debtors can interrupt mid-sentence
- **Two personas:**
  - Rachel — empathetic and patient, tuned for hardship cases
  - Orion — firm and direct, tuned for strategic defaulters
- **Sherlock risk engine:** Every second of every call is analyzed live for compliance and intent. FDCPA guardrails instantly flag Bankruptcy, Attorney Representation and Cease & Desist triggers. Matrix profiling classifies debtors into quadrants (Hardship Case vs Strategic Defaulter). Outcomes are auto-tagged as Promise to Pay, Refusal, or Dispute.
- **Command Center:** A dark-mode React dashboard streams the live transcript in a hacker-style terminal with risk badges popping in as the AI detects intent. Recovery rates and risk scores aggregate across thousands of calls.
- **Architecture:**
  - Frontend: React 18 + Vite + Tailwind
  - API: Python + FastAPI — orchestrates calls and SIP handler
  - Agent Worker: LiveKit Agents, runs as a separate process
  - Dockerfiles for DigitalOcean App Platform deployment (API + Worker + Frontend)
- **Highlights:**
  - Sub-500 ms voice latency with full-duplex interruption handling
  - Sherlock engine: FDCPA guardrails + debtor-matrix profiling + live PTP/Refusal/Dispute tagging
  - Two tuned personas (Rachel / Orion) — dispatch by debtor archetype
- **Tech:** Python, FastAPI, LiveKit Agents, Groq, Deepgram, React 18, Vite, Tailwind, SIP, Docker

### 3. Odeon — Autonomous Agents
- **Description:** A framework for evolving voice agents through adversarial persona testing. It iteratively self-corrects based on simulation outcomes to improve agent performance.
- **Repo:** https://github.com/vasu-devs/Odeon
- **Video:** https://youtu.be/GFdSe4-c_xQ
- **Summary:** AI agent optimization platform. Generate adversarial personas, run high-fidelity simulations, score each conversation against strict KPIs, and let a meta-agent rewrite the prompt automatically when targets are missed — a self-improving loop that converges on the optimal persona.
- **The problem:** Prompt tuning is a black box. You tweak, you hope, you ship. Odeon replaces that with a measurable loop: simulate realistic users, score the agent against numerical KPIs, and auto-rewrite the prompt when it fails.
- **Personas generated on the fly:** Odeon spawns diverse user personas per scenario — "The Lawyer," "The Crying Student," "The Stubborn Defaulter," etc. Each persona drives the user-side of the simulation, giving the agent genuinely hard traffic to handle.
- **Strict metric thresholds:**
  - Empathy (1–10)
  - Negotiation (1–10)
  - Repetition (1–10)
  - Agents must meet ALL criteria to pass a scenario — no cherry-picking
- **Self-improving loop:** When the agent fails a threshold, the Optimizer meta-agent reads the failure logs and rewrites the system prompt. The Neural Visual Diffing view renders the prompt change as a Git-style red/green diff — so you can see exactly which words changed to improve empathy or compliance.
- **Live stream:** A bi-directional WebSocket streams every simulation character-by-character to the frontend. SQLite archives every run for replay, analysis, and forking.
- **Stack:**
  - FastAPI + WebSockets backend
  - Groq Cloud for ultra-fast LLM inference (Llama 3.1 8B / 70B)
  - LangChain for chain management and structured output parsing
  - SQLite for history & replay
  - React 19 + Vite + TypeScript + Tailwind 4 frontend (neo-brutalist / glassmorphism)
- **Highlights:**
  - Adversarial persona generation for synthetic stress testing
  - Meta-agent auto-rewrites prompts when thresholds fail — self-improving loop
  - Git-style red/green diff view shows exactly which words changed
- **Tech:** Python, FastAPI, WebSockets, Groq, LangChain, SQLite, React 19, Vite, TypeScript, Tailwind 4

### 4. MapMyRepo — Knowledge Graph / AI
- **Description:** Turns any codebase into an interactive knowledge graph. Files and folders become interconnected nodes; Gemini summarizes each, and you can chat with the graph to explore architecture.
- **Live demo:** https://mapmyrepo.vasudev.live
- **Repo:** https://github.com/vasu-devs/MapMyRepo
- **Video:** https://youtu.be/EmTDrPzAo40
- **Summary:** Transforms any codebase — uploaded locally or fetched from a public GitHub URL — into an interactive D3.js force-directed node graph. Every file and folder is a node, Gemini summarizes each one, and a per-node chat panel lets you ask architectural questions directly.
- **What it does:** Point it at a GitHub URL or drag a folder in. MapMyRepo parses the tree, filters out noise (node_modules, .git, build artifacts), and renders it as a force-directed graph you can orbit, zoom, and drill into. The goal: understand complex architectures or onboard into unfamiliar codebases in minutes instead of hours.
- **Graph interactions:**
  - Scroll to zoom, drag to pan, click a node to select
  - Double-click a folder to expand or collapse its contents
  - Hover highlights connected nodes
  - Distinct icons and colors per file type + folder
- **AI layer (Gemini):**
  - Per-node architectural summary generated on demand
  - Chat tab per node — "what does this file do?", "where is auth handled?", "explain the routing structure"
  - Contextual answers: Gemini sees the file / folder metadata + related nodes
  - Markdown-rendered responses via Marked
- **Import paths:**
  - Local upload: drag and drop any folder
  - GitHub URL: paste a public repo URL to visualize instantly
  - Optional GitHub PAT raises the 60/hr rate limit ceiling for private repos
- **Stack:**
  - React 19 + TypeScript + Vite 6
  - D3.js 7 for the force-directed graph
  - Google Gemini for per-node summaries and chat
  - Tailwind with glassmorphic sidebar + dark/light theming
- **Highlights:**
  - Interactive force-directed node graph of any codebase
  - Gemini-powered per-node summaries + contextual chat
  - Load any public GitHub repo by URL — no auth required
- **Tech:** React 19, TypeScript, Vite 6, D3.js 7, Google Gemini, Tailwind

### 5. PolySEE — NLP / Chatbot
- **Description:** A multilingual campus chatbot designed to handle FAQs in regional languages. Maintains conversational context and simplifies student support.
- **Repo:** https://github.com/vasu-devs/PolySEE
- **Video:** https://youtu.be/6weynv_rblI
- **Summary:** Multilingual campus FAQ chatbot supporting Hindi, English and 3+ regional languages. RAG over institutional circulars and notices; admin-approval workflow before responses go live; deployable across web, WhatsApp and Telegram.
- **The problem:** Campus offices field the same questions — fee deadlines, scholarship forms, timetable changes — every single day, often in Hindi or regional languages. Staff burn hours on repetition; answers already exist in circulars and PDFs but students want conversation, not search.
- **RAG pipeline:**
  - Query embedded via local Ollama models
  - Semantic search over institutional documents in ChromaDB
  - Retrieved context + user query sent to Gemini Flash 2.0
  - Response returned with confidence score and source context
- **Admin-approval workflow:** New responses don't go live unconfirmed. In staging mode, each response shows its confidence score and the retrieved context. Admins approve or reject; only approved responses get promoted into the production dataset. This gives the bot a fact-checked update loop that student volunteers can maintain.
- **Multi-channel + multi-language:**
  - Embeddable chat widget on the college website
  - WhatsApp + Telegram integrations for wider reach
  - Hindi + English + 3 additional regional languages
  - Confidence-based human fallback when the bot is unsure
- **Stack:**
  - Frontend: React + Tailwind (student chat UI + admin dashboard)
  - Backend: FastAPI (Python) — chat, validation, logging
  - LLM: Gemini Flash 2.0
  - Embeddings: Ollama (local)
  - Vector DB: ChromaDB
- **Highlights:**
  - Hindi + English + 3 regional languages via RAG
  - Admin-approval workflow — only validated answers reach production
  - Embeddable on web + WhatsApp + Telegram
- **Tech:** React, Tailwind, FastAPI, Python, Gemini Flash 2.0, Ollama, ChromaDB

---

## 03 / More from GitHub

**Section label:** `03 /` More from GitHub

**Intro:** A selection of my other public work. Click any tile for the full case study — summary, notable details, and tech stack pulled from the README.

**Filter chips:** All + top languages (derived from repo counts), e.g. Python, TypeScript, HTML, JavaScript, C++.
**Initial view:** 9 tiles. "Show all N projects" expands the grid.

Each tile shows: repo name, summary, up to 4 tag chips (topics ∪ tech), language dot + label, stars (if > 0), forks (if > 0), and a "Live" globe icon if a homepage is set.

### Socratis
- **Language:** TypeScript · **Stars:** 2
- **URL:** https://github.com/vasu-devs/Socratis
- **Description:** Voice AI Agent-powered technical interview platform with real-time voice interaction, live code feedback, and intelligent assessment using LiveKit, Deepgram, and Groq.
- **Summary:** Real-time AI interviewer that runs live coding interviews over WebRTC voice. Candidates code in Monaco while a Python agent watches every keystroke via chat-context injection, asks Socratic hints only when needed, and writes a forensic post-interview report.
- **Highlights:**
  - Real-time code awareness — agent sees every edit via chat-context injection
  - Socratic method — only speaks when detecting bugs, approach changes or stalls
  - Forensic report with exact-quote communication analysis and hallucination cross-checks
- **Tech:** Next.js 14, Python, LiveKit, Deepgram, Groq, MongoDB, TypeScript, Express
- **Details:**
  - *The setup* — Candidate codes in Monaco. A Python voice agent drives the interview over WebRTC with LiveKit for transport, Deepgram for STT and aura-helios TTS, and Silero for voice-activity detection. The model is Groq's Llama-3.3 70B. Frontend is Next.js 14; an Express + MongoDB backend holds sessions.
  - *Real-time code awareness* — Earlier versions hallucinated about the candidate's code. V3's fix was Chat Context Injection: every edit in the Monaco editor pushes an explicit system message into the agent's context, so the model literally sees every diff instead of guessing.
  - *Behavior rules* — Socratic (hint, don't solve); Speaks only when detecting bugs, approach changes or stalls; Adapts to any coding problem; asks for a description when missing; Cross-references verbal claims against the code to catch overclaims.
  - *Post-interview forensics* — Second pass after the call ends. Strict Big-O on time/space. Line-by-line bug fixes in "Line X: [Issue] → [Fix]" format. Communication analysis citing exact transcript quotes. A hallucination check cross-references the candidate's claims against their actual code. Output renders on a radar-chart result page.

### Waldo
- **Language:** Python · **Stars:** 2
- **URL:** https://github.com/vasu-devs/Waldo
- **Description:** A production-grade Retrieval-Augmented Generation system with multimodal support for PDFs containing text, images, tables, and charts.
- **Summary:** Production-grade agentic RAG pipeline that ingests complex PDFs with text, tables, charts and diagrams. Figures are transcribed by Gemini VLM, and a LangGraph agent routes, grades and rewrites queries with strict anti-hallucination guardrails.
- **Highlights:**
  - Multimodal ingestion — text + tables + figures in a single pipeline
  - LangGraph agent with query rewriting, relevance grading and retry logic
  - Refuses out-of-scope questions instead of hallucinating
- **Tech:** Python, FastAPI, React, Vite, Qdrant, LangGraph, Gemini, Groq, Docling
- **Details:**
  - *The problem* — Most RAG systems only handle text. Waldo is built for real-world docs where the answer might live in a table, bar chart or figure caption — research papers, medical reports, technical spec sheets.
  - *Ingestion pipeline* — IBM Docling extracts document structure with high fidelity; RapidOCR falls back for scanned pages; Gemini VLM transcribes figures to searchable semantic text; Sentence Transformers (all-MiniLM-L6-v2) embed chunks into Qdrant.
  - *Agentic retrieval* — LangGraph routes between direct response and retrieval; every retrieved doc gets LLM-graded for relevance; failed queries are rewritten (max 2 retries); visual-query detection auto-includes figure transcriptions; Groq serves the final generation for low latency.
  - *Guardrails* — Out-of-scope questions are refused, not fabricated. When Gemini quota runs out, the system falls back to Docling's own captions rather than making something up.

### DryRunVisualised
- **Language:** TypeScript · **Stars:** 1 · **Live:** https://visualdsa.vasudev.live
- **URL:** https://github.com/vasu-devs/DryRunVisualised
- **Summary:** Real-time algorithm visualizer that renders data-structure operations in both 2D (SVG) and 3D (WebGL via Three.js). Write Python or C++ in Monaco, hit Run, watch each line execute with full variable inspection.
- **Highlights:**
  - Dual 2D / 3D view toggle with draggable nodes in the 3D scene
  - 50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking
  - Per-line trace replay with step forward/backward and speed slider
- **Tech:** Next.js 16, React 19, Three.js, TypeScript, Pyodide, Monaco Editor, Zustand, Tailwind
- **Details:**
  - *What it does* — Write an algorithm, step through its execution, and watch arrays sort, graphs traverse, linked lists re-wire and matrices transform — step by step, with every variable's current state rendered live. Toggle between an interactive 2D view (SVG/DOM) and an immersive 3D scene (Three.js + React Three Fiber) with orbit controls and draggable nodes.
  - *Execution pipeline* — Python runs client-side in Pyodide (WebAssembly); C++ compiles remotely via Godbolt Compiler Explorer API (GCC 14.1); instrumentation injects `sys.settrace` (Python) and stderr macros (C++); each line emits a JSON snapshot `{ line, stack, heap, stdout }`; `vizDetector.ts` classifies variables (array/grid/graph/linked-list/tree/scalar) and routes them.
  - *Experience details* — 50+ pre-built algorithms; resizable panels (editor, variables, visualization); amber glow on modified cells, strikethrough on previous values; force-directed graph layouts for adjacency-list graphs; SVG linked-list nodes with data|next compartments and curved arrow connectors.

### A18-INFINION-
- **Language:** Python · **Stars:** 1
- **URL:** https://github.com/vasu-devs/A18-INFINION-
- **Summary:** Multi-agent static bug detector for specialized C++ (Infineon RDI API). A central Orchestrator dispatches Code Parser, MCP Lookup, Bug Detector and Bug Describer agents through a two-layer detection strategy that boosts confidence when pattern matching and LLM reasoning agree.
- **Highlights:**
  - Context-first — pulls API docs via MCP before inspecting the code
  - Two-layer detection (pattern + LLM) with consensus-based confidence
  - Multi-bug support, per-snippet isolation, CSV in / CSV out
- **Tech:** Python, Gemini, OpenAI, DeepSeek, FastMCP
- **Details:**
  - *The task* — Generic linters miss domain-specific mistakes in specialized C++ because they don't know the API's rules. The Infineon A18 Challenge was to build a reviewer that does.
  - *Context-first design* — Before any LLM sees the code, the MCP Lookup Agent queries an MCP server (FastMCP + BGE embeddings) against the RDI API documentation and pulls the relevant rules. Only then does the Bug Detector run — with the API manual already in context.
  - *Pipeline* — Orchestrator dispatches agents per snippet; Code Parser classifies each line (code/comment/preprocessor) + 1-indexed numbering; MCP Lookup queries the docs server with caching; Bug Detector runs pattern-match + LLM-reasoning layers and boosts confidence on consensus; Bug Describer produces human-readable explanations citing the manual.
  - *Multi-provider* — Gemini 2.0, DeepSeek V3 and GPT-4o interchangeable. Detections below 70% confidence dropped. CSV in → CSV out for batch evaluation.

### GitArt
- **Language:** TypeScript · **Live:** https://git-art-iota.vercel.app
- **URL:** https://github.com/vasu-devs/GitArt
- **Summary:** Browser-based tool that lets you paint your GitHub contribution graph like a canvas. Design a 52×7 heatmap, the app builds a real Git repository — in-browser via isomorphic-git on memfs, zipped with JSZip — whose commit timestamps reproduce that design when pushed.
- **Highlights:**
  - Runs entirely in-browser — no server, no GitHub API, no fake identities
  - 30+ built-in templates (Pac-Man, QR code, Christmas tree, Nyan trail…)
  - Image drop-in with 5-band quantization + text-to-pixels bitmap font
- **Tech:** Next.js 16, React 19, TypeScript, Tailwind, isomorphic-git, memfs, JSZip
- **Details:**
  - *The concept* — GitHub's profile page renders your commit activity as a 52-week × 7-day heatmap. GitArt treats that grid as a painter's canvas.
  - *Everything runs in the browser* — isomorphic-git on a memfs virtual filesystem; JSZip packages `.git/` + files into a single zip; no server writes, no GitHub API calls, no fake identities.
  - *Intensity mapping* — Cells have intensity 0–4 mapping to 0 / 1 / 5 / 10 / 20 commits per day. The brightest cell stays within GitHub's "active user" bucket so the graph looks dramatic without looking synthetic.
  - *Design tools* — Brush (levels 0–4) + eraser; drop-in images quantized to 5 intensity bands; text-to-pixels via bitmap font; 30+ templates — Pac-Man Chase, QR Code, Matrix Rain, Nyan Trail, Christmas Tree, Fireworks; Time Machine targets any year 2022–2027, anchoring to the first Sunday.

### Kyoka
- **Language:** Python
- **URL:** https://github.com/vasu-devs/Kyoka
- **Description:** Elite behavioral intelligence unit that transforms raw OSINT into deep psychological dossiers and actionable negotiation strategies using multi-agent AI.
- **Summary:** OSINT-driven behavioral intelligence app. A tri-agent LangChain pipeline reads a target's digital footprint, synthesizes DISC and Big-Five traits, then produces actionable "Battle Cards" with DOs, DON'Ts and opening lines.
- **Highlights:**
  - Tri-agent pipeline: researcher → analyst → tactician
  - DISC + Big-Five + ego-hook detection from LinkedIn / GitHub / Twitter content
  - Luxury-tool UI with radar charts, magnetic hovers, chat simulator
- **Tech:** React, Vite, Tailwind, Framer Motion, FastAPI, Python, LangChain, Gemini, DeepSeek, Tavily
- **Details:**
  - *The premise* — In most high-stakes meetings you know someone's title but not their core drivers, shadow traits or preferred communication protocol. Kyoka closes that gap.
  - *Tri-agent pipeline* — Deep Diver (Tavily Search) does OSINT across LinkedIn, GitHub, X, YouTube; PsychProfiler (DeepSeek-V3 / Gemini) produces DISC, Big-Five, archetypes, ego hooks; Strategist (GPT-4o / Gemini) writes the Battle Card with DOs, DON'Ts, opening lines.
  - *Backend* — FastAPI + LangChain. A unified `run.py` creates the venv, installs both Python and Node deps, and launches backend + frontend in parallel.
  - *Frontend* — "Charcoal & Gold" luxury-concierge aesthetic — Playfair Display for headings, Inter for data. Radar charts visualize personality skew. Reveal cards, magnetic hovers, and a chat simulator let you rehearse the conversation before it happens.

### SSS — Screen Shot Sorter
- **Language:** Python · **Stars:** 1
- **URL:** https://github.com/vasu-devs/SSS
- **Summary:** Local AI-powered screenshot organizer. Qwen2-VL-2B runs on your GPU, classifying images into nine semantic buckets, extracting URLs, cleaning text and generating per-image markdown logs.
- **Highlights:**
  - Fully local inference — no cloud API calls
  - Qwen2-VL vision pipeline + URL extraction + text cleaning
  - GPU-memory managed: cache clear every 5 images, bfloat16 weights
- **Tech:** Python, PyTorch, Qwen2-VL, Transformers
- **Details:**
  - *The problem* — 4,000-file screenshot folders with zero structure. Manual sorting is unrealistic.
  - *Pipeline* — Vision model (Qwen2-VL-2B via Transformers/PyTorch) ingests each image → structured understanding; classifier routes to anime, tech, hiring, finance, learning, health, news, memes, misc; link extractor pulls every URL; text cleaner strips hashtags, emojis, formatting noise; per-image `.txt` log in `./output/extracted/` + master `links.md` index.
  - *Performance tuning* — Model loads once at startup; GPU cache clears every 5 images; uses `bfloat16` for reduced VRAM footprint; ~5–10 sec per image on RTX 4060 (8 GB VRAM target); no cloud API calls.

### RupeeRoast
- **Language:** TypeScript · **Stars:** 1
- **URL:** https://github.com/vasu-devs/RupeeRoast
- **Description:** The AI-powered financial forensic tool that turns messy bank PDFs into actionable insights—and roasts your spending habits.
- **Summary:** AI financial forensic tool that parses messy Indian bank PDFs (including UPI), categorizes every transaction via an LLM, and produces both a dashboard and a Groq-powered "Indian Dad / Gen-Z" roast of your impulsive purchases.
- **Highlights:**
  - Universal PDF extraction for messy bank statements incl. UPI transactions
  - Roaster persona critiques impulsive spending with data-backed sass
  - Interactive charts: category breakdowns, monthly trends, impulsive vs necessary
- **Tech:** Next.js 15, React 19, Tailwind, Framer Motion, Recharts, FastAPI, Python, Groq, Gemini
- **Details:**
  - *What it does* — Hand it a bank statement PDF (Kotak, HDFC, SBI, whatever). It extracts every transaction including UPI, classifies into categories, and produces two artifacts: an interactive dashboard and a roast of your impulsive spending.
  - *Extraction* — PyMuPDF4LLM primary parser (much better than plain PyPDF for complex layouts); PyPDF fallback for edge cases; Pydantic-validated schemas throughout.
  - *AI layer* — Groq Llama-3 for fast categorization; Gemini for the "Indian Dad / Gen-Z" persona roast.
  - *Frontend* — Next.js 15 App Router + React 19 + Tailwind 4 + Framer Motion. Recharts for the dashboard, Plotly for the complex interactive views. Featured chart: impulsive-vs-necessary. One `python run_delulu.py` boots both services.


### GhostSync
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/GhostSync
- **Description:** Control Antigravity IDE remotely via Telegram — from anywhere in the world.
- **Summary:** Windows app that exposes Antigravity IDE to a private Telegram bot over a Cloudflare Tunnel, so you can trigger AI prompts and receive live IDE screenshots — with a strict user whitelist and rate limiting.
- **Highlights:**
  - Auto-generated Cloudflare tunnel — no port-forwarding required
  - Live IDE screenshots streamed back over Telegram
  - User-ID whitelist, rate limits, auto-deleted screenshots
- **Tech:** Python, python-telegram-bot, CustomTkinter, Cloudflared, PyAutoGUI
- **Details:**
  - *What it does* — Run Antigravity on your PC, configure GhostSync with your Telegram bot token and user ID, click Connect. From any Telegram client you can now send a folder path to open, fire AI prompts, and receive live screenshots of your IDE.
  - *Bridge* — Auto-downloads `cloudflared.exe` and spawns a Cloudflare Tunnel; python-telegram-bot listens for authorized commands; PyAutoGUI automates IDE input (window detection via `%LOCALAPPDATA%`); CustomTkinter GUI; single PyInstaller `.exe`.
  - *Security* — User-ID whitelist; 10 req/min rate limit; screenshots auto-deleted after sending; logs sanitize sensitive data; credentials in `%USERPROFILE%\.ghostsync\.env`.

### BranchGPT-Extension
- **Language:** TypeScript
- **URL:** https://github.com/vasu-devs/BranchGPT-Extension
- **Summary:** Chrome extension that turns ChatGPT into a DAG-based chat tool. Fork any message into a parallel branch, visualize the tree in a side panel, and keep context clean. All data stored locally via IndexedDB.
- **Highlights:**
  - True branching — fork any message into a parallel reality
  - Conversation tree rendered in a sleek side panel
  - Local-only IndexedDB storage; injects directly into the ChatGPT UI
- **Tech:** Vite, React, TypeScript, Tailwind, Dexie.js, CRXJS
- **Details:**
  - *What it does* — Injects directly into the ChatGPT UI. Adds a Fork button to every message. Clicking it spawns a parallel branch from that point; the parent chat stays intact. A side panel visualizes the whole conversation tree.
  - *Tech* — Vite + CRXJS for Manifest V3 native build; React + TypeScript + Tailwind; Dexie.js over IndexedDB for local storage.
  - *Privacy* — Everything local. No external servers, no analytics, no telemetry.

### PixelForge
- **Language:** Java
- **URL:** https://github.com/vasu-devs/PixelForge
- **Description:** JavaFX image-to-ASCII art converter with a sleek "Matrix-style" dark interface.
- **Summary:** Multi-threaded rendering engine with real-time preview, debounced sliders, full-color per-character mode, and HD PNG export at original image dimensions.
- **Highlights:**
  - Multi-threaded canvas engine — UI stays smooth while rendering
  - Full-color per-character mode based on original image data
  - Ultra-HD PNG export at source image dimensions
- **Tech:** Java 17, JavaFX, Maven
- **Details:**
  - *Engine* — Multi-threaded background rendering; smart slider debouncing (one render fires when you stop dragging); adaptive viewport; dark-theme UI.
  - *Output* — Full-color mode samples the original image's pixel colors and applies them per-character. Download triggers a dedicated HD render pass at source resolution — so a 4K input gives you a 4K ASCII PNG.
  - *Build* — Java 17 + JavaFX 17, packaged with Maven. Run via `mvn javafx:run`.

### Maze-Pathfinder-Visualizer
- **Language:** Python
- **URL:** https://github.com/vasu-devs/Maze-Pathfinder-Visualizer
- **Description:** Interactive Pygame-based maze pathfinding visualizer for BFS, DFS, Dijkstra, A*.
- **Summary:** Compares BFS, DFS, Dijkstra and A* side-by-side on procedurally generated mazes. Per-algorithm color coding, 60 FPS step-by-step exploration.
- **Highlights:**
  - 4 classic algorithms with Manhattan heuristic on A*
  - Procedural maze generation via recursive backtracking
  - 60 FPS visualization with per-algorithm metrics
- **Tech:** Python, Pygame
- **Details:**
  - *How it works* — Recursive-backtracking mazes (stack-based DFS, one solution); 45×45 cell grid at 15 px/cell (675×675 window) at 60 FPS; path reconstruction via parent pointers in `visited: {cell: parent}`; A* uses Manhattan distance.
  - *Color coding* — Blue = BFS; Red = DFS; Green = Dijkstra; Yellow = A*; Orange = final shortest path.
  - *Controls* — 1–4 select algorithm, SPACE runs, R regenerates, ESC quits. Each run shows path length + wall-clock time.

### EmailDrafter
- **Language:** JavaScript · **Live:** https://email-drafter-three.vercel.app
- **URL:** https://github.com/vasu-devs/EmailDrafter
- **Description:** AI-assisted email drafting app with a Python backend and a modern React + Vite + Tailwind frontend.
- **Summary:** FastAPI backend, React + Vite + Tailwind frontend. Users enter context and tone/length preferences; backend calls an LLM to draft or refine; the UI shows live previews.
- **Highlights:**
  - Separate `/draft` and `/refine` endpoints with prompt-level control
  - Hot-reload dev loop via Vite + uvicorn --reload
  - Swappable backend — frontend only talks to a thin `api.js` wrapper
- **Tech:** React, Vite, Tailwind, Python, FastAPI
- **Details:**
  - *What it does* — Two modes: draft from scratch (prompt + optional tone/length hints) and refine (existing draft + instructions). Live preview before copy/send.
  - *API surface* — `POST /api/draft` → `{ prompt, tone?, length? } → { draft }`; `POST /api/refine` → `{ draft, instructions } → { draft }`.
  - *Architecture* — Monorepo with `backend/` (Python + venv + requirements.txt) and `frontend/my-app/` (Vite). API calls funneled through `src/api.js`. Hot reload on both sides.

### Korosuke
- **Language:** Python
- **URL:** https://github.com/vasu-devs/Korosuke
- **Description:** A personal AI sidebar assistant built with PyQt5 and Ollama.
- **Summary:** Sliding-sidebar desktop assistant. Chat with a local LLaMA via Ollama, toggle with a hotkey, inference on a background thread so the UI never blocks.
- **Highlights:**
  - Sliding sidebar UI with non-blocking background worker
  - Local Ollama inference — no cloud round-trips
  - ESC to hide, re-run to toggle behavior
- **Tech:** Python, PyQt5, Ollama, LLaMA
- **Details:**
  - *What it does* — A sidebar that slides in from the screen edge for AI chat. All inference runs against local Ollama (default `llama3.2:1b`).
  - *Details* — PyQt5 with smooth slide animations and styled chat bubbles; background QThread worker; PID-based hotkey toggle (re-running the script flips visibility); ESC hides the sidebar.

### Health-os
- **Language:** TypeScript
- **URL:** https://github.com/vasu-devs/Health-os
- **Summary:** Mobile-first PWA dashboard for workouts and meals. Next.js 14 App Router with a viewport-locked layout where only internal panes scroll — the page itself never grows a scrollbar.
- **Highlights:**
  - Installable PWA with offline-ready service worker
  - Viewport-locked (100dvh) layout with internal scroll panes only
  - Mobile-first responsive design
- **Tech:** Next.js 14, TypeScript, Tailwind, next-pwa
- **Details:**
  - *What it is* — A progressive web app. Add to home screen on mobile and it runs like a native app. Service worker generated only in production build.
  - *Layout trick* — Whole page is locked to `h-[100dvh]` with `overflow-hidden` on the outer body. Only workout and meal lists scroll internally.
  - *Stack* — Next.js 14 App Router, TypeScript, Tailwind, next-pwa.

### ASCIIRealTime
- **Language:** HTML · **Live:** https://ascii-real-time.vercel.app
- **URL:** https://github.com/vasu-devs/ASCIIRealTime
- **Description:** Real-time ASCII video streaming using user camera.
- **Summary:** Browser demo that turns your webcam feed into real-time ASCII or emoji art. Optional MediaPipe Selfie Segmentation masks the background. Zero build — vanilla JS + Tailwind via CDN.
- **Highlights:**
  - ASCII text mode + emoji-canvas mode with per-glyph caching
  - MediaPipe Selfie Segmentation for optional background removal
  - Privacy — all processing in-browser, video never leaves your device
- **Tech:** JavaScript, Tailwind, MediaPipe
- **Details:**
  - *How it works* — Samples camera frames to an offscreen canvas at a dynamic grid size; per-cell luminance via perceptual luma `0.2126R + 0.7152G + 0.0722B`; maps brightness → character (light → dark); image smoothing disabled for pixel-crisp edges.
  - *Modes* — ASCII text (`<pre>` with dynamically-sized font); Emoji (`<canvas>` grid with per-glyph bitmap caching); Palettes: Basic, Extended, Blocks, Emoji, Custom.
  - *Privacy* — All processing in-browser. Video never leaves the device.

### Portfolio-cool (this site)
- **Language:** TypeScript · **Stars:** 1 · **Live:** https://www.vasudev.live/
- **URL:** https://github.com/vasu-devs/Portfolio-cool
- **Summary:** This portfolio site. Vite + React + TypeScript with Tailwind and Framer Motion. Radial theme toggle, context-aware custom cursor with paint trails, magnetic buttons, live GitHub stats.
- **Highlights:**
  - Radial theme transition tied to click coordinates
  - Custom cursor with contrast-aware color + paint trails
  - Sticky-hero stacked-section scroll pattern powered by Lenis
- **Tech:** Vite, React, TypeScript, Tailwind, Framer Motion, Lenis, Vercel
- **Details:**
  - *Signature interactions* — Radial theme transition (click-coordinate-anchored circle expansion); custom cursor with contrast-aware color + paint trails + eater bot; magnetic buttons; film-grain SVG overlay at 3% opacity; sticky-hero stacked-section scroll pattern via Lenis.
  - *Live data* — Stars via Cloudflare Workers counter (bypasses GitHub rate limits); commits via the jogruber contributions proxy; PRs via GitHub's search endpoint.
  - *Build* — Lazy-loaded sections via React.lazy + Suspense; TypeScript strict mode; 100dvh mobile layouts, AA-contrast foreground colors; deployed to Vercel.

### HireMe
- **Language:** —  · **Stars:** 6
- **URL:** https://github.com/vasu-devs/HireMe
- **Description:** Automating Hiring Process.
- **Summary:** Experiment in automating the hiring loop end-to-end — job-description parsing, candidate screening and shortlisting via LLMs.

### GhostSyncWeb
- **Language:** HTML · **Live:** https://ghost-sync-web.vercel.app
- **URL:** https://github.com/vasu-devs/GhostSyncWeb
- **Summary:** Web companion for the GhostSync desktop app — landing page and setup walkthrough for the Telegram-controlled Antigravity IDE bridge.
- **Tech:** HTML, CSS

### fastapi-cheatsheet
- **Stars:** 0 · **Forks:** 1
- **URL:** https://github.com/vasu-devs/fastapi-cheatsheet
- **Description:** 📘 A comprehensive FastAPI Cheat Sheet (Markdown + PDF).
- **Summary:** Single-page FastAPI reference. Snippets organized by topic — not a product, just a scratchpad you keep open while building.
- **Highlights:**
  - Copy-paste snippets for every common FastAPI pattern
  - Covers auth (OAuth2, API keys), background tasks, testing, CORS
  - Includes a SQLAlchemy integration example
- **Tech:** Python, FastAPI, Pydantic, SQLAlchemy
- **Coverage:** Routing + path/query params; Pydantic models (request bodies, `response_model`, Query/Path validation); `Depends()` DI; OAuth2 JWT + API-key security; file uploads + form data; cookies + headers; background tasks; middleware + startup/shutdown events; SQLAlchemy integration; testing via TestClient; CORS + auto-docs (`/docs`, `/redoc`).
- **Performance tips:** `async def` for I/O; `response_model` to filter outputs; lifespan events for DB connections; BackgroundTasks or Celery for heavy work.

### HoleEmAll
- **Language:** Python
- **URL:** https://github.com/vasu-devs/HoleEmAll
- **Description:** A simple Python 2D game.
- **Summary:** Casual mouse-driven Pygame arcade. Grow a black hole by absorbing red fruits scattered on the field; each catch grows the hole by 1 pixel, creating a natural difficulty curve.
- **Highlights:**
  - Dynamic difficulty — hole grows 1px per fruit absorbed
  - Randomized fruit placement each round
  - Win/lose overlay with instant restart
- **Tech:** Python, Pygame

### password-generator-and-validator
- **Language:** Python
- **URL:** https://github.com/vasu-devs/password-generator-and-validator
- **Summary:** Interactive Python CLI: validate password strength against composition rules, or generate random passwords of length 6–10 that satisfy those rules. Standard library only.
- **Highlights:**
  - Validation returns targeted hints when specific rules fail
  - Generator seeds upper + lower + digit + special before filling
  - Pure stdlib — zero external dependencies
- **Tech:** Python
- **Rules:** Uppercase A–Z, lowercase a–z, digit 0–9, special from `!@#$%^&*`, no whitespace.
- **Caveats:** Uses Python's `random` module (not cryptographically secure).

### waterBuddyV1
- **Language:** Python
- **URL:** https://github.com/vasu-devs/waterBuddyV1
- **Summary:** Background Python script that sends periodic desktop notifications to drink water. Cross-platform via the plyer library; interval and message configurable in a single file.
- **Tech:** Python, plyer

### habiTurtle
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/habiTurtle
- **Summary:** Minimalist PyQt5 desktop habit tracker where a turtle mascot's mood reflects your streak state — happy on completion, angry when you're late, sad when you break it.
- **Moods:** Happy / Nervous / Angry / Sad / Sleepy / Excited.
- **Tech:** Python, PyQt5

### ChatBotUI
- **Language:** JavaScript · **Forks:** 2
- **URL:** https://github.com/vasu-devs/ChatBotUI
- **Summary:** React + Vite college-assistant front-end with three portals sharing a unified theme — landing, student chat with voice input, and admin dashboard for PDF document management.
- **Highlights:** Three-portal design (landing/student/admin); drag-and-drop PDF ingestion with real-time processing status; voice-mode overlay.
- **Tech:** React, Vite, Tailwind, FastAPI

### Folder-Summary-Parser
- **Language:** Python
- **URL:** https://github.com/vasu-devs/Folder-Summary-Parser
- **Summary:** Python GUI utility that recursively scans a folder and reports file/folder counts, human-readable total size, and a file-type breakdown. Tkinter interface, standard library only.
- **Tech:** Python, Tkinter

### weather-dashboard-ai
- **Language:** JavaScript · **Live:** https://weather-dashboard-ai.vercel.app
- **URL:** https://github.com/vasu-devs/weather-dashboard-ai
- **Summary:** React + FastAPI weather dashboard combining OpenWeatherMap data with AI-generated lifestyle suggestions (clothing, activity, precaution) from OpenRouter's DeepSeek model.
- **Highlights:** Fused weather data + AI suggestions; JSON-only LLM prompt for reliable structured output; CORS-ready split frontend/backend, Heroku-style Procfile included.
- **Tech:** React 19, Vite, Tailwind, Axios, FastAPI, Python, DeepSeek, OpenWeatherMap

### MaintMaster
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/MaintMaster
- **Description:** A chatbot integrating Gemini API to help with house maintenance and tracking.
- **Summary:** Single-page front-end seed for maintenance scheduling and task tracking. Plain HTML/CSS/JS with zero build step.
- **Tech:** HTML, CSS, JavaScript

### RealTimeMemoryAllocationSimulator
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/RealTimeMemoryAllocationSimulator
- **Summary:** Browser-based memory-allocation simulator running from a single `index.html`. Explore OS concepts like fragmentation and allocation strategies.
- **Tech:** HTML, CSS, JavaScript

### CultureCompass
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/CultureCompass
- **Description:** A chatbot using Gemini API to teach etiquettes and customs around the world.
- **Summary:** Minimal static-site seed built around a single `index.html` — a starting point for cultural storytelling, interactive exhibits, or portfolio microsites.
- **Tech:** HTML, CSS

### travel-Vlog
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/travel-Vlog
- **Summary:** Static travel site documenting trips across India. One HTML page per destination (Goa, Hampi, Munnar, Ziro Valley, Amritsar, and more). Deployable to GitHub Pages with no build step.
- **Tech:** HTML, CSS, JavaScript

### sidz-cafe
- **Language:** CSS
- **URL:** https://github.com/vasu-devs/sidz-cafe
- **Summary:** Static restaurant website with home + 8 category pages (Italian, Chinese, American, Indian, Breakfast, Lunch, Shakes, Mocktails), driven by a single `dishes.json` with 700+ items. Client-side cart panel, embedded Google Map. No build.
- **Tech:** HTML, CSS, JavaScript

### air-aware-website
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/air-aware-website
- **Summary:** Educational static landing page about air quality awareness. Curated sections on pollution disasters, WHO/EPA/NRDC resources, and actionable guidance. Plain HTML/CSS.
- **Tech:** HTML, CSS

### LEETCODE
- **Language:** C++
- **URL:** https://github.com/vasu-devs/LEETCODE
- **Description:** LeetCode solutions — a personal archive updated as problems are solved.
- **Tech:** C++

### Roadmap-Walkthrough-2025
- **Language:** TypeScript
- **URL:** https://github.com/vasu-devs/Roadmap-Walkthrough-2025

### Ocular
- **URL:** https://github.com/vasu-devs/Ocular
- **Description:** Demo / screen-recording software (early stage).

### InfoVis
- **Language:** TypeScript · **Live:** https://info-vis-ten.vercel.app
- **URL:** https://github.com/vasu-devs/InfoVis
- **Summary:** Minimal React + Vite + TypeScript setup with HMR and ESLint.
- **Tech:** React, Vite, TypeScript

### Kritrim
- **Language:** Python · **Stars:** 1
- **URL:** https://github.com/vasu-devs/Kritrim

### MoltBattles
- **Stars:** 1
- **URL:** https://github.com/vasu-devs/MoltBattles

### Rehab
- **Stars:** 1
- **URL:** https://github.com/vasu-devs/Rehab

### Portfolio-min
- **Stars:** 1
- **URL:** https://github.com/vasu-devs/Portfolio-min

### Aura-Portfolio
- **URL:** https://github.com/vasu-devs/Aura-Portfolio

### Portfolio
- **Language:** HTML
- **URL:** https://github.com/vasu-devs/Portfolio

---

## 04 / Technical Expertise (Skills)

**Section label:** `04 /` Technical Expertise
**Intro:** The tools I reach for when building — grouped by where they sit in the stack. Hover any badge to see its brand color.

### 01 — Languages (4 tools)
Python · TypeScript · JavaScript · C++

### 02 — Frontend (7 tools)
Next.js · React · Vite · Tailwind · Framer Motion · Three.js · D3.js

### 03 — Backend (5 tools)
Node.js · Express · FastAPI · Prisma · Drizzle

### 04 — Data & Vector (6 tools)
PostgreSQL · MongoDB · Supabase · Neon · Qdrant · ChromaDB

### 05 — AI / LLM (10 tools)
OpenAI · Claude · Gemini · Groq · DeepSeek · LangChain · LangGraph · Ollama · Hugging Face · PyTorch

### 06 — Voice & Realtime (2 tools)
LiveKit · Deepgram

### 07 — DevOps (6 tools)
Git · Docker · Linux · Vercel · Cloudflare · Postman

---

## 05 / Open Source Impact (Community)

**Section label:** `05 / Community`
**Headline:** Open Source Impact
**Sub-headline:** 8 merged PRs across 5 external repositories

### Featured contributions (3 headline cards)

**kana-dojo** — 4 PRs merged · Design System
https://github.com/lingdojo/kana-dojo
Authored four themes — Wabi, Wasabi Garden, Mirage Solis and Moonlit Waterfall — plus design documentation. Recurring contributor across the theme system.

**free-programming-books** — 275k★ · Developer Resources
https://github.com/EbookFoundation/free-programming-books
Added FastAPI to the programming cheatsheets index in EbookFoundation's famously selective developer-resource collection.

**pqoqubbw/icons** — Animated Icon Library
https://github.com/pqoqubbw/icons
Contributed an animated corner-down-left icon with a path-draw animation to one of the most popular open-source animated-icon libraries.

### Secondary contributions (compact rows)

(None currently listed)

### Full merged-PR list (8 total)

1. **Added Timetable Scheduler Core logic** — SAYOUNCDR/auto-timetable #1 — merged 2025-12-08 — https://github.com/SAYOUNCDR/auto-timetable/pull/1
2. **[FEATURE] Moonlit Waterfall Theme #144** — lingdojo/kana-dojo #197 — merged 2025-11-17 — https://github.com/lingdojo/kana-dojo/pull/197
3. **[FEATURE] Add Mirage Solis (Stellar Mirage) Theme #143** — lingdojo/kana-dojo #196 — merged 2025-11-16 — https://github.com/lingdojo/kana-dojo/pull/196
4. **[FEATURE] Add Wasabi Garden Theme #155** — lingdojo/kana-dojo #195 — merged 2025-11-16 — https://github.com/lingdojo/kana-dojo/pull/195
5. **Add Wabi dark theme + design documentation** — lingdojo/kana-dojo #191 — merged 2025-11-15 — https://github.com/lingdojo/kana-dojo/pull/191
6. **feat(icon): add animated corner-down-left icon (path draw animation)** — pqoqubbw/icons #176 — merged 2025-11-14 — https://github.com/pqoqubbw/icons/pull/176
7. **Added Backend and restructured the file structure** — SAYOUNCDR/NyaySaathi #1 — merged 2025-11-04 — https://github.com/SAYOUNCDR/NyaySaathi/pull/1
8. **Add FastAPI to programming cheatsheets** — EbookFoundation/free-programming-books #12219 — merged 2025-10-06 — https://github.com/EbookFoundation/free-programming-books/pull/12219

### Live stats tiles (animated counters)
- **Total Commits** — fetched from github-contributions-api.jogruber.de (last-year total)
- **Stars Earned** — fetched from api.github-star-counter.workers.dev
- **PRs Merged** — fetched from GitHub search: `type:pr+author:vasu-devs`

---

## 06 / Contact — Footer

**Section label:** `06 /` Contact
**Heading:** Let's Talk.

### GitHub heatmap widget
- Pulls `vasu-devs` contribution graph for the last year via github-contributions-api.jogruber.de
- Draggable/scrollable horizontal grid that auto-scrolls to the current month
- Legend: Less → More (5 shades, theme-aware)
- Caption: `{total} contributions in the last year`

### Action buttons (single row)
- **Primary:** Mail — siddhvasudev1402@gmail.com → `mailto:siddhvasudev1402@gmail.com`
- **Calendar:** Book a call → https://cal.com/vasu-devs
- **Buy me a coffee** → https://buymeacoffee.com/vasu.devs (yellow `#FFDD00` button)
- **Resume** (opens embedded Google Drive preview modal)

### Footer bar
- Left: `© 2025 Vasu-DevS`
- Right: GitHub · Twitter · LinkedIn

### Watermark
Oversized faded word-mark: **Vasu-DevS** (gradient fade to transparent).

---

## Resume Modal (opens when "Resume" is clicked)

- Title: **My Resume**
- Kicker: **Curriculum Vitae**
- Embeds the Google Drive preview of the resume PDF at `https://drive.google.com/file/d/1YK8o65wTso2_l2e9bwZo46daonm6-P7x/preview`
- Controls: Open in new tab, Close, Download PDF (mobile footer)
