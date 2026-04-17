#!/usr/bin/env node
// Applies hand-written summaries / details / highlights / tech to projects.json.
// `details` is a structured array of sections: { title, body?, bullets? }.
// Scanning a sectioned layout is much faster than reading one long paragraph.
//
// Also strips the transient `readmeRaw` field so the committed JSON stays lean.
//
// Safe to re-run — idempotent. If you re-run `npm run fetch-repos` you'll
// need to re-run this (the fetch overwrites the file).

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '..', 'src', 'data', 'projects.json');

// Relevance ranking for the MoreProjects grid. Lower = shown earlier.
// Tier 1: most aligned with the AI / full-stack profile.
// Tier 5: thin / placeholder.
const RANKS = {
    // Tier 1 — AI / full-stack headliners
    Socratis: 1,
    Waldo: 1,
    'A18-INFINION-': 1,
    Kyoka: 1,
    DryRunVisualised: 1,
    GitArt: 1,

    // Tier 2 — solid AI / full-stack work
    NyaySaathi: 2,
    'BranchGPT-Extension': 2,
    GhostSync: 2,
    RupeeRoast: 2,
    SSS: 2,
    ChatBotUI: 2,
    PixelForge: 2,

    // Tier 3 — focused / smaller-scope projects
    Korosuke: 3,
    'Maze-Pathfinder-Visualizer': 3,
    EmailDrafter: 3,
    'Folder-Summary-Parser': 3,
    'weather-dashboard-ai': 3,
    'Health-os': 3,
    ASCIIRealTime: 3,

    // Tier 4 — learning / small utilities
    habiTurtle: 4,
    HoleEmAll: 4,
    'fastapi-cheatsheet': 4,
    'password-generator-and-validator': 4,
    waterBuddyV1: 4,

    // Tier 5 — static sites / placeholders / own portfolio work
    'sidz-cafe': 5,
    'air-aware-website': 5,
    'travel-Vlog': 5,
    CultureCompass: 5,
    MaintMaster: 5,
    RealTimeMemoryAllocationSimulator: 5,
    'Portfolio-cool': 5,
    'Portfolio-min': 5,
    Portfolio: 5,
    'Aura-Portfolio': 5,
    HireMe: 5,
    LEETCODE: 5,
    GhostSyncWeb: 5,
    Ocular: 5,
    MoltBattles: 5,
    Rehab: 5,
    Kritrim: 5,
    'Roadmap-Walkthrough-2025': 5,
};

const CURATED = {
    Socratis: {
        summary:
            "Real-time AI interviewer that runs live coding interviews over WebRTC voice. Candidates code in Monaco while a Python agent watches every keystroke via chat-context injection, asks Socratic hints only when needed, and writes a forensic post-interview report.",
        details: [
            {
                title: "The setup",
                body:
                    "Candidate codes in Monaco. A Python voice agent drives the interview over WebRTC with LiveKit for transport, Deepgram for STT and aura-helios TTS, and Silero for voice-activity detection. The model is Groq's Llama-3.3 70B. Frontend is Next.js 14; an Express + MongoDB backend holds sessions.",
            },
            {
                title: "Real-time code awareness",
                body:
                    "Earlier versions hallucinated about the candidate's code. V3's fix was Chat Context Injection: every edit in the Monaco editor pushes an explicit system message into the agent's context, so the model literally sees every diff instead of guessing.",
            },
            {
                title: "Behavior rules",
                bullets: [
                    "Socratic — hint, don't solve",
                    "Speaks only when detecting bugs, approach changes or stalls",
                    "Adapts to any coding problem; asks for a description when missing",
                    "Cross-references verbal claims against the code to catch overclaims",
                ],
            },
            {
                title: "Post-interview forensics",
                body:
                    "The same agent runs a second pass after the call ends. Strict Big-O on time and space. Line-by-line bug fixes in \"Line X: [Issue] → [Fix]\" format. Communication analysis citing exact transcript quotes. A hallucination check cross-references the candidate's claims against their actual code. Output renders on a radar-chart result page.",
            },
        ],
        highlights: [
            "Real-time code awareness — agent sees every edit via chat-context injection",
            "Socratic method — only speaks when detecting bugs, approach changes or stalls",
            "Forensic report with exact-quote communication analysis and hallucination cross-checks",
        ],
        tech: ["Next.js 14", "Python", "LiveKit", "Deepgram", "Groq", "MongoDB", "TypeScript", "Express"],
    },
    Waldo: {
        summary:
            "Production-grade agentic RAG pipeline that ingests complex PDFs with text, tables, charts and diagrams. Figures are transcribed by Gemini VLM, and a LangGraph agent routes, grades and rewrites queries with strict anti-hallucination guardrails.",
        details: [
            {
                title: "The problem",
                body:
                    "Most RAG systems only handle text. Waldo is built for real-world docs where the answer might live in a table, bar chart or figure caption — research papers, medical reports, technical spec sheets.",
            },
            {
                title: "Ingestion pipeline",
                bullets: [
                    "IBM Docling extracts document structure with high fidelity",
                    "RapidOCR falls back for scanned pages",
                    "Gemini VLM transcribes figures to searchable semantic text",
                    "Sentence Transformers (all-MiniLM-L6-v2) embed chunks into Qdrant",
                ],
            },
            {
                title: "Agentic retrieval",
                bullets: [
                    "LangGraph routes between direct response and retrieval",
                    "Every retrieved doc gets LLM-graded for relevance",
                    "Failed queries are rewritten (max 2 retries)",
                    "Visual-query detection auto-includes figure transcriptions",
                    "Groq serves the final generation for low latency",
                ],
            },
            {
                title: "Guardrails",
                body:
                    "Out-of-scope questions are refused, not fabricated. When Gemini quota runs out, the system falls back to Docling's own captions rather than making something up.",
            },
        ],
        highlights: [
            "Multimodal ingestion — text + tables + figures in a single pipeline",
            "LangGraph agent with query rewriting, relevance grading and retry logic",
            "Refuses out-of-scope questions instead of hallucinating",
        ],
        tech: ["Python", "FastAPI", "React", "Vite", "Qdrant", "LangGraph", "Gemini", "Groq", "Docling"],
    },
    "A18-INFINION-": {
        summary:
            "Multi-agent static bug detector for specialized C++ (Infineon RDI API). A central Orchestrator dispatches Code Parser, MCP Lookup, Bug Detector and Bug Describer agents through a two-layer detection strategy that boosts confidence when pattern matching and LLM reasoning agree.",
        details: [
            {
                title: "The task",
                body:
                    "Generic linters miss domain-specific mistakes in specialized C++ because they don't know the API's rules. The Infineon A18 Challenge was to build a reviewer that does.",
            },
            {
                title: "Context-first design",
                body:
                    "Before any LLM sees the code, the MCP Lookup Agent queries an MCP server (FastMCP + BGE embeddings) against the RDI API documentation and pulls the relevant rules. Only then does the Bug Detector run — with the API manual already in context.",
            },
            {
                title: "Pipeline",
                bullets: [
                    "Orchestrator dispatches agents per snippet",
                    "Code Parser classifies each line (code/comment/preprocessor) + 1-indexed numbering",
                    "MCP Lookup queries the docs server with caching",
                    "Bug Detector runs pattern-match + LLM-reasoning layers; boosts confidence on consensus",
                    "Bug Describer produces human-readable explanations citing the manual",
                ],
            },
            {
                title: "Multi-provider",
                body:
                    "Gemini 2.0, DeepSeek V3 and GPT-4o are interchangeable. Detections below 70% confidence are dropped. CSV in → CSV out for batch evaluation.",
            },
        ],
        highlights: [
            "Context-first — pulls API docs via MCP before inspecting the code",
            "Two-layer detection (pattern + LLM) with consensus-based confidence",
            "Multi-bug support, per-snippet isolation, CSV in / CSV out",
        ],
        tech: ["Python", "Gemini", "OpenAI", "DeepSeek", "FastMCP"],
    },
    DryRunVisualised: {
        summary:
            "Real-time algorithm visualizer that renders data-structure operations in both 2D (SVG) and 3D (WebGL via Three.js). Write Python or C++ in Monaco, hit Run, watch each line execute with full variable inspection.",
        details: [
            {
                title: "What it does",
                body:
                    "Write an algorithm, step through its execution, and watch arrays sort, graphs traverse, linked lists re-wire and matrices transform — step by step, with every variable's current state rendered live. Toggle between an interactive 2D view (SVG/DOM) and an immersive 3D scene (Three.js + React Three Fiber) with orbit controls and draggable nodes.",
            },
            {
                title: "Execution pipeline",
                bullets: [
                    "Python runs client-side in Pyodide (WebAssembly)",
                    "C++ compiles remotely via Godbolt Compiler Explorer API (GCC 14.1)",
                    "Instrumentation injects `sys.settrace` (Python) and stderr macros (C++)",
                    "Each line emits a JSON snapshot: `{ line, stack, heap, stdout }`",
                    "`vizDetector.ts` classifies variables (array/grid/graph/linked-list/tree/scalar) and routes them",
                ],
            },
            {
                title: "Experience details",
                bullets: [
                    "50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking",
                    "Resizable panels — editor, variables, visualization",
                    "Amber glow on modified cells, strikethrough on previous values",
                    "Force-directed graph layouts for adjacency-list graphs",
                    "SVG linked-list nodes with data | next compartments and curved arrow connectors",
                ],
            },
        ],
        highlights: [
            "Dual 2D / 3D view toggle with draggable nodes in the 3D scene",
            "50+ pre-built algorithms across searching, sorting, graphs, DP, backtracking",
            "Per-line trace replay with step forward/backward and speed slider",
        ],
        tech: ["Next.js 16", "React 19", "Three.js", "TypeScript", "Pyodide", "Monaco Editor", "Zustand", "Tailwind"],
    },
    GitArt: {
        summary:
            "Browser-based tool that lets you paint your GitHub contribution graph like a canvas. Design a 52×7 heatmap, the app builds a real Git repository — in-browser via isomorphic-git on memfs, zipped with JSZip — whose commit timestamps reproduce that design when pushed.",
        details: [
            {
                title: "The concept",
                body:
                    "GitHub's profile page renders your commit activity as a 52-week × 7-day heatmap. GitArt treats that grid as a painter's canvas: pick colors, draw a design, and the app builds a real Git repo whose commit timestamps reproduce the design when pushed to a fresh empty repo.",
            },
            {
                title: "Everything runs in the browser",
                bullets: [
                    "isomorphic-git on a memfs virtual filesystem",
                    "JSZip packages .git/ + files into a single zip",
                    "No server writes, no GitHub API calls, no fake identities",
                ],
            },
            {
                title: "Intensity mapping",
                body:
                    "Cells have intensity 0–4 mapping to 0 / 1 / 5 / 10 / 20 commits per day. The brightest cell (20 commits) stays within GitHub's \"active user\" bucket so the graph looks dramatic without looking synthetic.",
            },
            {
                title: "Design tools",
                bullets: [
                    "Brush (levels 0–4) + eraser",
                    "Drop-in images quantized to 5 intensity bands",
                    "Text-to-pixels via bitmap font",
                    "30+ templates — Pac-Man Chase, QR Code, Matrix Rain, Nyan Trail, Christmas Tree, Fireworks…",
                    "Time Machine — target any year 2022–2027, anchors to the first Sunday of that year",
                ],
            },
        ],
        highlights: [
            "Runs entirely in-browser — no server, no GitHub API, no fake identities",
            "30+ built-in templates (Pac-Man, QR code, Christmas tree, Nyan trail…)",
            "Image drop-in with 5-band quantization + text-to-pixels bitmap font",
        ],
        tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "isomorphic-git", "memfs", "JSZip"],
    },
    GhostSync: {
        summary:
            "Windows app that exposes Antigravity IDE to a private Telegram bot over a Cloudflare Tunnel, so you can trigger AI prompts and receive live IDE screenshots from anywhere — with a strict user whitelist and rate limiting.",
        details: [
            {
                title: "What it does",
                body:
                    "Run Antigravity on your PC, configure GhostSync with your Telegram bot token and user ID, click Connect. From any Telegram client you can now send a folder path to open, fire AI prompts, and receive live screenshots of your IDE.",
            },
            {
                title: "How the bridge works",
                bullets: [
                    "Auto-downloads `cloudflared.exe` and spawns a Cloudflare Tunnel",
                    "python-telegram-bot listens for authorized commands",
                    "PyAutoGUI automates IDE input (window detection via %LOCALAPPDATA%)",
                    "CustomTkinter GUI; single PyInstaller .exe for non-Python users",
                ],
            },
            {
                title: "Security",
                bullets: [
                    "User-ID whitelist — only your Telegram account can issue commands",
                    "10 req/min rate limit",
                    "Screenshots auto-deleted after sending",
                    "Logs sanitize sensitive data",
                    "Credentials in %USERPROFILE%\\.ghostsync\\.env — never uploaded",
                ],
            },
        ],
        highlights: [
            "Auto-generated Cloudflare tunnel — no port-forwarding required",
            "Live IDE screenshots streamed back over Telegram",
            "User-ID whitelist, rate limits, auto-deleted screenshots",
        ],
        tech: ["Python", "python-telegram-bot", "CustomTkinter", "Cloudflared", "PyAutoGUI"],
    },
    Kyoka: {
        summary:
            "OSINT-driven behavioral intelligence app. A tri-agent LangChain pipeline reads a target's digital footprint, synthesizes DISC and Big-Five traits, then produces actionable 'Battle Cards' with DOs, DON'Ts and opening lines.",
        details: [
            {
                title: "The premise",
                body:
                    "In most high-stakes meetings you know someone's title but not their core drivers, shadow traits or preferred communication protocol. Kyoka closes that gap.",
            },
            {
                title: "Tri-agent pipeline",
                bullets: [
                    "Deep Diver (Tavily Search) — OSINT across LinkedIn, GitHub, X, YouTube",
                    "PsychProfiler (DeepSeek-V3 / Gemini) — DISC, Big-Five, archetypes, ego hooks",
                    "Strategist (GPT-4o / Gemini) — Battle Card with DOs, DON'Ts, opening lines",
                ],
            },
            {
                title: "Backend",
                body:
                    "FastAPI + LangChain. A unified `run.py` creates the venv, installs both Python and Node deps, and launches backend + frontend in parallel.",
            },
            {
                title: "Frontend",
                body:
                    '"Charcoal & Gold" luxury-concierge aesthetic — Playfair Display for headings, Inter for data. Radar charts visualize personality skew. Reveal cards, magnetic hovers, and a chat simulator let you rehearse the conversation before it happens.',
            },
        ],
        highlights: [
            "Tri-agent pipeline: researcher → analyst → tactician",
            "DISC + Big-Five + ego-hook detection from LinkedIn / GitHub / Twitter content",
            "Luxury-tool UI with radar charts, magnetic hovers, chat simulator",
        ],
        tech: ["React", "Vite", "Tailwind", "Framer Motion", "FastAPI", "Python", "LangChain", "Gemini", "DeepSeek", "Tavily"],
    },
    NyaySaathi: {
        summary:
            "RAG-based legal assistant for Indian law. Admins upload PDFs/DOCX through a portal; the backend chunks, embeds and stores locally in Qdrant. Citizens chat with citation-backed answers in English or Indian languages. Zero Docker — runs natively.",
        details: [
            {
                title: "What it is",
                body:
                    "Upload legal PDFs (Constitution of India, bare acts, case summaries), chat with citation-backed answers. Designed to be stood up by someone non-technical on a single machine.",
            },
            {
                title: "Architecture — local everything",
                bullets: [
                    "Qdrant in local mode (no server, no Docker)",
                    "Sentence Transformers (all-MiniLM-L6-v2 or bge-m3) for embeddings",
                    "PyMuPDF / python-docx for extraction; background tasks keep the UI responsive",
                    "Gemini 2.0 Flash or OpenAI GPT-4o for generation",
                    "FastAPI + React 19 + Vite + Tailwind 4",
                ],
            },
            {
                title: "Modes",
                bullets: [
                    "Main chat — query the whole corpus",
                    "NyayLens — scope the query to a single uploaded document",
                    "NyayShala — daily curated legal snippets to improve legal literacy",
                ],
            },
            {
                title: "Delivery",
                body:
                    "SSE-streamed typewriter responses. Default admin login out of the box. Resetting the index is as simple as deleting the `.qdrant_data` folder.",
            },
        ],
        highlights: [
            "Local Qdrant — zero-infra RAG setup",
            "Document-scoped NyayLens mode for deep-diving a single uploaded file",
            "SSE-streamed typewriter-style responses",
        ],
        tech: ["FastAPI", "Python", "React 19", "Vite", "Tailwind", "Qdrant", "Gemini", "Sentence Transformers"],
    },
    RupeeRoast: {
        summary:
            "AI financial forensic tool that parses messy Indian bank PDFs (including UPI), categorizes every transaction via an LLM, and produces both a dashboard and a Groq-powered 'Indian Dad / Gen-Z' roast of your impulsive purchases.",
        details: [
            {
                title: "What it does",
                body:
                    "Hand it a bank statement PDF (Kotak, HDFC, SBI, whatever). It extracts every transaction including UPI, classifies into categories, and produces two artifacts: an interactive dashboard and a roast of your impulsive spending.",
            },
            {
                title: "Extraction",
                bullets: [
                    "PyMuPDF4LLM as the primary parser — much better than plain PyPDF for complex layouts",
                    "PyPDF as fallback for edge cases",
                    "Pydantic-validated schemas throughout",
                ],
            },
            {
                title: "AI layer",
                bullets: [
                    "Groq Llama-3 for fast categorization",
                    "Gemini generates the 'Indian Dad / Gen-Z' persona roast",
                ],
            },
            {
                title: "Frontend",
                body:
                    "Next.js 15 App Router + React 19 + Tailwind 4 + Framer Motion. Recharts for the dashboard, Plotly for the complex interactive views. The featured chart is impulsive-vs-necessary. One `python run_delulu.py` boots both services.",
            },
        ],
        highlights: [
            "Universal PDF extraction for messy bank statements incl. UPI transactions",
            "Roaster persona critiques impulsive spending with data-backed sass",
            "Interactive charts: category breakdowns, monthly trends, impulsive vs necessary",
        ],
        tech: ["Next.js 15", "React 19", "Tailwind", "Framer Motion", "Recharts", "FastAPI", "Python", "Groq", "Gemini"],
    },
    EmailDrafter: {
        summary:
            "AI-assisted email drafting app — FastAPI backend, React + Vite + Tailwind frontend. Users enter context and tone/length preferences; the backend calls an LLM to draft or refine; the UI shows live previews.",
        details: [
            {
                title: "What it does",
                body:
                    "Two modes: draft from scratch (prompt + optional tone/length hints) and refine (existing draft + instructions). Live preview in the UI before you copy or send.",
            },
            {
                title: "API surface",
                bullets: [
                    "POST /api/draft — { prompt, tone?, length? } → { draft }",
                    "POST /api/refine — { draft, instructions } → { draft }",
                ],
            },
            {
                title: "Architecture",
                body:
                    "Monorepo with `backend/` (Python + venv + requirements.txt) and `frontend/my-app/` (Vite). All API calls funneled through `src/api.js` so the base URL is environment-swappable. Hot reload on both sides.",
            },
        ],
        highlights: [
            "Separate /draft and /refine endpoints with prompt-level control",
            "Hot-reload dev loop via Vite + uvicorn --reload",
            "Swappable backend — frontend only talks to a thin api.js wrapper",
        ],
        tech: ["React", "Vite", "Tailwind", "Python", "FastAPI"],
    },
    "Folder-Summary-Parser": {
        summary:
            "Python GUI utility that recursively scans a folder and reports file/folder counts, human-readable total size, and a file-type breakdown. Tkinter interface, standard library only.",
        details: [
            {
                title: "What it does",
                body:
                    "Point it at a directory. It walks the tree via `os.walk()`, tallies total files, total folders, total size, and a per-extension breakdown. Permission-denied paths are caught gracefully so the scan never crashes.",
            },
            {
                title: "Module split",
                bullets: [
                    "main.py — entrypoint, launches the GUI",
                    "gui.py — Tkinter window",
                    "parser.py — os.walk aggregation logic",
                    "utils.py — pure helpers (e.g. human-readable size formatting)",
                ],
            },
            {
                title: "Dependencies",
                body:
                    "Python standard library only. Tkinter ships with Python. No pip install, no build step.",
            },
        ],
        highlights: [
            "Recursive os.walk traversal with permission-error handling",
            "Human-readable size formatting (B/KB/MB/GB/TB)",
            "Pure stdlib — no external packages required",
        ],
        tech: ["Python", "Tkinter"],
    },
    "BranchGPT-Extension": {
        summary:
            "Chrome extension that turns ChatGPT into a DAG-based chat tool. Fork any message into a parallel branch, visualize the tree in a side panel, and keep context clean. All data stored locally via IndexedDB.",
        details: [
            {
                title: "What it does",
                body:
                    "Injects directly into the ChatGPT UI — no new surface to learn. Adds a Fork button to every message. Clicking it spawns a parallel branch from that point; the parent chat stays intact. A side panel visualizes the whole conversation tree so you can flip between branches or prune the ones that didn't pan out.",
            },
            {
                title: "Tech",
                bullets: [
                    "Vite + CRXJS — Manifest V3 native build",
                    "React + TypeScript + Tailwind",
                    "Dexie.js over IndexedDB for local storage",
                ],
            },
            {
                title: "Privacy",
                body:
                    "Everything local. No external servers, no analytics, no telemetry. Every branch, every message, every tree structure stays on your machine.",
            },
        ],
        highlights: [
            "True branching — fork any message into a parallel reality",
            "Conversation tree rendered in a sleek side panel",
            "Local-only IndexedDB storage; injects directly into the ChatGPT UI",
        ],
        tech: ["Vite", "React", "TypeScript", "Tailwind", "Dexie.js", "CRXJS"],
    },
    Korosuke: {
        summary:
            "PyQt5 sliding-sidebar desktop assistant. Chat with a local LLaMA via Ollama, toggle with a hotkey, runs inference on a background thread so the UI never blocks.",
        details: [
            {
                title: "What it does",
                body:
                    "A sidebar that slides in from the screen edge for AI chat, and slides away when dismissed. All inference runs against local Ollama (default `llama3.2:1b`) so it works offline with zero API keys.",
            },
            {
                title: "Details",
                bullets: [
                    "PyQt5 with smooth slide animations and styled chat bubbles",
                    "Background QThread worker — UI never freezes during generation",
                    "PID-based hotkey toggle: re-running the script flips visibility",
                    "ESC hides the sidebar",
                ],
            },
        ],
        highlights: [
            "Sliding sidebar UI with non-blocking background worker",
            "Local Ollama inference — no cloud round-trips",
            "ESC to hide, re-run to toggle behavior",
        ],
        tech: ["Python", "PyQt5", "Ollama", "LLaMA"],
    },
    habiTurtle: {
        summary:
            "Minimalist PyQt5 desktop habit tracker where a turtle mascot's mood reflects your streak state — happy on completion, angry when you're late, sad when you break it.",
        details: [
            {
                title: "The idea",
                body:
                    "Mark a habit done, the turtle is happy. Miss a day, the turtle is sad. Close to end-of-day without completing? Nervous. Long streak? Excited.",
            },
            {
                title: "Moods",
                bullets: [
                    "Happy — today's habit done",
                    "Nervous — day is almost over",
                    "Angry — very late, streak at risk",
                    "Sad — missed a day",
                    "Sleepy — still early in the day",
                    "Excited — long streaks or early solves",
                ],
            },
            {
                title: "Build",
                body:
                    "`main.py` + `gui.py` + `storage.py` over PyQt5. Habits persist to `habits.json`. Mascot images live in `assets/`. One-command PyInstaller build produces a standalone Windows .exe.",
            },
        ],
        highlights: [
            "Turtle mascot mood reflects streak state across 6+ moods",
            "JSON-backed habit log — no database needed",
            "One-command PyInstaller build for a standalone .exe",
        ],
        tech: ["Python", "PyQt5"],
    },
    "Maze-Pathfinder-Visualizer": {
        summary:
            "Pygame-based pathfinding visualizer comparing BFS, DFS, Dijkstra and A* side-by-side on procedurally generated mazes. Per-algorithm color coding, 60 FPS step-by-step exploration.",
        details: [
            {
                title: "How it works",
                bullets: [
                    "Mazes generated via recursive backtracking (stack-based DFS → one solution)",
                    "45×45 cell grid at 15 px/cell (675×675 window) — 60 FPS animation",
                    "Path reconstruction via parent pointers stored in `visited: {cell: parent}`",
                    "A* uses Manhattan distance as its admissible heuristic",
                ],
            },
            {
                title: "Color coding",
                bullets: [
                    "Blue — BFS explored cells",
                    "Red — DFS explored cells",
                    "Green — Dijkstra explored cells",
                    "Yellow — A* explored cells",
                    "Orange — final shortest path",
                ],
            },
            {
                title: "Controls",
                body:
                    "Press 1–4 to select algorithm, SPACE to run, R to generate a new maze, ESC to quit. Each run displays path length and wall-clock execution time.",
            },
        ],
        highlights: [
            "4 classic algorithms: BFS, DFS, Dijkstra, A* with Manhattan heuristic",
            "Procedural maze generation via recursive backtracking",
            "60 FPS visualization with per-algorithm metrics",
        ],
        tech: ["Python", "Pygame"],
    },
    HoleEmAll: {
        summary:
            "Casual mouse-driven Pygame arcade. Grow a black hole by absorbing red fruits scattered on the field; each catch grows the hole by 1 pixel, creating a natural difficulty curve.",
        details: [
            {
                title: "The loop",
                body:
                    "Thirty fruits are randomly scattered on an 800×600 field. Your hole follows the cursor. Absorb them all before time runs out; each absorption grows the hole and increases your score.",
            },
            {
                title: "Under the hood",
                bullets: [
                    "Euclidean distance check between cursor center and each fruit",
                    "Hole grows 1 px per fruit absorbed",
                    "Win: all fruits absorbed before timer expires",
                    "Lose: timer expires with fruits remaining",
                    "SPACE restarts from either end state",
                ],
            },
        ],
        highlights: [
            "Dynamic difficulty — hole grows 1px per fruit absorbed",
            "Randomized fruit placement each round",
            "Win/lose overlay with instant restart",
        ],
        tech: ["Python", "Pygame"],
    },
    "Health-os": {
        summary:
            "Mobile-first PWA dashboard for workouts and meals. Next.js 14 App Router with a viewport-locked layout where only internal panes scroll — the page itself never grows a scrollbar.",
        details: [
            {
                title: "What it is",
                body:
                    "A progressive web app. Add to home screen on mobile and it runs like a native app. Service worker is only generated in production build (next-pwa is disabled in dev by design).",
            },
            {
                title: "The layout trick",
                body:
                    "Whole page is locked to `h-[100dvh]` with `overflow-hidden` on the outer body. Only the workout list and meal list scroll internally. On mobile, `100dvh` handles the browser chrome properly so the app uses the full available screen at all times.",
            },
            {
                title: "Stack",
                bullets: [
                    "Next.js 14 App Router",
                    "TypeScript",
                    "Tailwind",
                    "next-pwa for the service worker generation",
                ],
            },
        ],
        highlights: [
            "Installable PWA with offline-ready service worker",
            "Viewport-locked (100dvh) layout with internal scroll panes only",
            "Mobile-first responsive design",
        ],
        tech: ["Next.js 14", "TypeScript", "Tailwind", "next-pwa"],
    },
    MaintMaster: {
        summary:
            "Single-page front-end seed for maintenance scheduling and task tracking. Plain HTML/CSS/JS with zero build step — drop onto any static host and it serves.",
        details: [
            {
                title: "What it is",
                body:
                    "Deliberately minimal: one `index.html` with supporting styles, optimized for quick deployment of a maintenance-tracking UI. No framework, no build tool, no package.json.",
            },
            {
                title: "Deploy",
                bullets: [
                    "Drop onto GitHub Pages, Netlify, or S3",
                    "Or preview locally with `python -m http.server 8000`",
                ],
            },
        ],
        highlights: [
            "Zero build pipeline — pure static HTML/CSS/JS",
            "Deployable to GitHub Pages / Netlify / S3 out of the box",
            "Starting point for small-team maintenance workflows",
        ],
        tech: ["HTML", "CSS", "JavaScript"],
    },
    SSS: {
        summary:
            "Local AI-powered screenshot organizer. Qwen2-VL-2B runs on your GPU, classifying images into nine semantic buckets, extracting URLs, cleaning text and generating per-image markdown logs.",
        details: [
            {
                title: "The problem",
                body:
                    "4,000-file screenshot folders with zero structure. Manual sorting is unrealistic.",
            },
            {
                title: "Pipeline",
                bullets: [
                    "Vision model (Qwen2-VL-2B via Transformers/PyTorch) ingests each image → structured understanding",
                    "Classifier routes to one of nine categories — anime, tech, hiring, finance, learning, health, news, memes, misc",
                    "Link extractor pulls every URL in the image",
                    "Text cleaner strips hashtags, emojis, formatting noise",
                    "Per-image .txt log in `./output/extracted/` + master `links.md` index",
                ],
            },
            {
                title: "Performance tuning",
                bullets: [
                    "Model loads once at startup, images process one at a time",
                    "GPU cache clears every 5 images",
                    "Uses `bfloat16` for reduced VRAM footprint",
                    "~5–10 sec per image on RTX 4060 (8 GB VRAM target)",
                    "No cloud API calls — fully local inference",
                ],
            },
        ],
        highlights: [
            "Fully local inference — no cloud API calls",
            "Qwen2-VL vision pipeline + URL extraction + text cleaning",
            "GPU-memory managed: cache clear every 5 images, bfloat16 weights",
        ],
        tech: ["Python", "PyTorch", "Qwen2-VL", "Transformers"],
    },
    PixelForge: {
        summary:
            "JavaFX image-to-ASCII converter with a multi-threaded rendering engine. Real-time preview with debounced slider, full-color per-character mode, and HD PNG export at original image dimensions.",
        details: [
            {
                title: "Engine",
                bullets: [
                    "Multi-threaded background rendering — UI thread never blocks",
                    "Smart slider debouncing — one render fires when you stop dragging",
                    "Adaptive viewport — art scales to window dimensions",
                    "Dark-theme UI with smooth animations",
                ],
            },
            {
                title: "Output",
                body:
                    "Full-color mode samples the original image's pixel colors and applies them per-character, creating the illusion of the original image through typography. Download triggers a dedicated HD render pass at the source image's original resolution — so a 4K input gives you a 4K ASCII PNG, not a screenshot.",
            },
            {
                title: "Build",
                body:
                    "Java 17 + JavaFX 17, packaged with Maven. Run via `mvn javafx:run`.",
            },
        ],
        highlights: [
            "Multi-threaded canvas engine — UI stays smooth while rendering",
            "Full-color per-character mode based on original image data",
            "Ultra-HD PNG export at source image dimensions",
        ],
        tech: ["Java 17", "JavaFX", "Maven"],
    },
    ChatBotUI: {
        summary:
            "React + Vite college-assistant front-end with three portals sharing a unified theme — landing, student chat with voice input, and admin dashboard for PDF document management.",
        details: [
            {
                title: "Portals",
                bullets: [
                    "Landing — marketing page with feature cards and usage-stats tiles",
                    "Student Chat — message bubbles, typing indicators, department context switching, voice-mode overlay",
                    "Admin — drag-and-drop PDF upload with real-time processing, knowledge-base management, analytics",
                ],
            },
            {
                title: "Architecture",
                body:
                    "Shared `ThemeContext` and `useTheme` hook keep all three portals visually consistent through dark/light switches. A root layout wraps everything in the theme provider; `AppRouter.jsx` handles portal-level navigation.",
            },
            {
                title: "Stack",
                body:
                    "React 19+ with hooks + context API, Vite for dev and build, Tailwind for styling. API layer structured for FastAPI backend integration.",
            },
        ],
        highlights: [
            "Three-portal design: landing / student chat / admin",
            "Drag-and-drop PDF ingestion with real-time processing status",
            "Voice-mode overlay for accessibility",
        ],
        tech: ["React", "Vite", "Tailwind", "FastAPI"],
    },
    ASCIIRealTime: {
        summary:
            "Browser demo that turns your webcam feed into real-time ASCII or emoji art. Optional MediaPipe Selfie Segmentation masks the background. Zero build — vanilla JS + Tailwind via CDN.",
        details: [
            {
                title: "How it works",
                bullets: [
                    "Samples camera frames to an offscreen canvas at a dynamic grid size",
                    "Per-cell luminance via perceptual luma: `0.2126R + 0.7152G + 0.0722B`",
                    "Maps brightness → character from active palette (light → dark)",
                    "Image smoothing disabled everywhere for pixel-crisp edges",
                ],
            },
            {
                title: "Modes",
                bullets: [
                    "ASCII text — `<pre>` with dynamically-sized font",
                    "Emoji — `<canvas>` grid with per-glyph bitmap caching for alignment",
                    "Palettes: Basic, Extended, Blocks, Emoji, Custom",
                ],
            },
            {
                title: "Privacy",
                body:
                    "All processing in-browser. Video never leaves the device. External libraries load from CDNs.",
            },
        ],
        highlights: [
            "ASCII text mode + emoji-canvas mode with per-glyph caching",
            "MediaPipe Selfie Segmentation for optional background removal",
            "Privacy — all processing in-browser, video never leaves your device",
        ],
        tech: ["JavaScript", "Tailwind", "MediaPipe"],
    },
    "weather-dashboard-ai": {
        summary:
            "React + FastAPI weather dashboard combining OpenWeatherMap data with AI-generated lifestyle suggestions (clothing, activity, precaution) from OpenRouter's DeepSeek model.",
        details: [
            {
                title: "Flow",
                bullets: [
                    "User enters a city in the frontend",
                    "Frontend hits GET `/weather/{city}`",
                    "Backend fetches current weather from OpenWeatherMap",
                    "Backend passes weather JSON to OpenRouter DeepSeek with a JSON-only prompt",
                    "AI returns structured JSON (activity/precaution/clothing) → merged with weather data",
                ],
            },
            {
                title: "Reliability",
                body:
                    "Constrained JSON-only prompting means the LLM can't free-form — parsing the response into typed fields is deterministic.",
            },
            {
                title: "Stack",
                body:
                    "Frontend: React 19 + Vite 7 + Axios + Tailwind. Backend: FastAPI + Uvicorn + Requests + Pydantic. Procfile included for Heroku-style deploy.",
            },
        ],
        highlights: [
            "Fused weather data + AI-generated daily suggestions",
            "JSON-only LLM prompt for reliable structured output",
            "CORS-ready split frontend/backend, Heroku-style Procfile included",
        ],
        tech: ["React 19", "Vite", "Tailwind", "Axios", "FastAPI", "Python", "DeepSeek", "OpenWeatherMap"],
    },
    "fastapi-cheatsheet": {
        summary:
            "Single-page FastAPI reference. Snippets organized by topic — not a product, just a scratchpad you keep open while building.",
        details: [
            {
                title: "Coverage",
                bullets: [
                    "Routing + path/query params",
                    "Pydantic models — request bodies, response_model, Query/Path validation",
                    "Depends() dependency injection",
                    "OAuth2 JWT + API-key security",
                    "File uploads + form data",
                    "Cookies + headers",
                    "Background tasks",
                    "Middleware & startup/shutdown events",
                    "SQLAlchemy integration",
                    "Testing via TestClient",
                    "CORS + auto-docs (/docs, /redoc)",
                ],
            },
            {
                title: "Performance tips included",
                bullets: [
                    "`async def` for I/O tasks",
                    "`response_model` to filter outputs",
                    "Lifespan events for DB connections",
                    "BackgroundTasks or Celery for heavy work",
                ],
            },
        ],
        highlights: [
            "Copy-paste snippets for every common FastAPI pattern",
            "Covers auth (OAuth2, API keys), background tasks, testing, CORS",
            "Includes a SQLAlchemy integration example",
        ],
        tech: ["Python", "FastAPI", "Pydantic", "SQLAlchemy"],
    },
    "sidz-cafe": {
        summary:
            "Static restaurant website with home + 8 category pages, driven by a single dishes.json with 700+ items. Client-side cart panel, embedded Google Map. No build.",
        details: [
            {
                title: "Content model",
                body:
                    "All menu items live in `dishes.json` (id, name, price, category) — adding items is a JSON edit, no HTML changes needed. `shoppingcartjs.js` fetches it on page load.",
            },
            {
                title: "Pages",
                bullets: [
                    "Home — hero + category tiles + embedded Google Map",
                    "Eight category pages — Italian, Chinese, American, Indian, Breakfast, Lunch, Shakes, Mocktails",
                    "Each category has its own CSS file for distinct styling",
                ],
            },
            {
                title: "UI details",
                body:
                    "Horizontal-scroll dish carousels with next/prev buttons. Cart UI toggles a `showcart` class on the body. Preview locally via `python -m http.server 8000` (the JSON fetch needs HTTP, not `file://`).",
            },
        ],
        highlights: [
            "Menu driven entirely by dishes.json — no build step",
            "Eight category pages with dedicated styling",
            "Horizontal-scroll dish carousels with next/prev navigation",
        ],
        tech: ["HTML", "CSS", "JavaScript"],
    },
    "air-aware-website": {
        summary:
            "Educational static landing page about air quality awareness. Curated sections on pollution disasters, WHO/EPA/NRDC resources, and actionable guidance. Plain HTML/CSS.",
        details: [
            {
                title: "Sections",
                bullets: [
                    "Hero banner with city suggestions via `<datalist>`",
                    "Featured air pollution disasters with external references",
                    "Information + solutions (WHO, EPA, NRDC)",
                    "About section describing the mission",
                ],
            },
            {
                title: "Stack",
                bullets: [
                    "HTML5 + CSS3",
                    "Google Fonts: Satisfy, Barlow Condensed, Roboto",
                    "Responsive semantic markup",
                    "No JavaScript yet — datalist suggestions need a small JS enhancement",
                ],
            },
        ],
        highlights: [
            "Curated sections on disasters, resources, and actionable guidance",
            "Responsive semantic HTML with Google Fonts typography",
            "Static — deployable to any static host",
        ],
        tech: ["HTML", "CSS"],
    },
    "password-generator-and-validator": {
        summary:
            "Interactive Python CLI: validate password strength against composition rules, or generate random passwords of length 6–10 that satisfy those rules. Standard library only.",
        details: [
            {
                title: "Rules",
                bullets: [
                    "At least one uppercase A–Z",
                    "At least one lowercase a–z",
                    "At least one digit 0–9",
                    "At least one special character from !@#$%^&*",
                    "No whitespace",
                ],
            },
            {
                title: "Generator",
                body:
                    "Seeds the first four characters — one of each required class — then fills the remaining characters from a mixed pool. Length 6 passwords always have all four required classes covered.",
            },
            {
                title: "Caveats",
                body:
                    "Uses Python's `random` module which is not cryptographically secure — for high-security use cases, swap in `secrets` from the stdlib.",
            },
        ],
        highlights: [
            "Validation returns targeted hints when specific rules fail",
            "Generator seeds upper + lower + digit + special before filling",
            "Pure stdlib — zero external dependencies",
        ],
        tech: ["Python"],
    },
    "travel-Vlog": {
        summary:
            "Static travel site documenting trips across India. One HTML page per destination (Goa, Hampi, Munnar, Ziro Valley, Amritsar, and more). Deployable to GitHub Pages with no build step.",
        details: [
            {
                title: "Structure",
                bullets: [
                    "Home page (`index.html`)",
                    "One HTML page per destination",
                    "Optional login UI (login.html + login.js)",
                    "`image/` and `video/` directories for media",
                ],
            },
            {
                title: "Styling",
                body:
                    "Split across multiple CSS files by region — `south india.css`, `north india.css`, `north east.css` — plus page-specific files. Known cleanup: some filenames contain spaces which work locally but aren't URL-portable.",
            },
        ],
        highlights: [
            "One HTML page per destination with shared styling",
            "Deployable to GitHub Pages out of the box",
            "Optional login scaffold via login.js",
        ],
        tech: ["HTML", "CSS", "JavaScript"],
    },
    CultureCompass: {
        summary:
            "Minimal static-site seed built around a single index.html — a starting point for cultural storytelling, interactive exhibits, or portfolio microsites.",
        details: [
            {
                title: "Philosophy",
                body:
                    "Simple, fast, and accessible by default. Opinion-free — extend with JavaScript, a CSS framework, or wrap in a static-site generator when the project outgrows a single HTML file.",
            },
            {
                title: "Workflow",
                bullets: [
                    "Open in VS Code",
                    "Live Server for auto-reload",
                    "Edit index.html, refresh",
                    "No dependencies, no build step",
                ],
            },
        ],
        highlights: [
            "Minimal single-file scaffold, opinion-free",
            "Accessibility-focused semantic HTML",
            "Ready to be extended with any static-site toolchain",
        ],
        tech: ["HTML", "CSS"],
    },
    RealTimeMemoryAllocationSimulator: {
        summary:
            "Browser-based memory-allocation simulator running from a single index.html. A concrete, visual way to explore OS concepts like fragmentation and allocation strategies.",
        details: [
            {
                title: "What it is",
                body:
                    "One HTML file that opens in a browser and lets you visualize allocation/deallocation behavior in real time. Pairs well with an OS course.",
            },
            {
                title: "Setup",
                bullets: [
                    "Open `index.html` directly or serve over HTTP",
                    "`python -m http.server 8000` for a local server",
                    "No build step, no dependencies",
                ],
            },
        ],
        highlights: [
            "Single-file HTML — runs anywhere",
            "No build pipeline, no dependencies",
            "Refresh-to-see-changes dev loop",
        ],
        tech: ["HTML", "CSS", "JavaScript"],
    },
    waterBuddyV1: {
        summary:
            "Background Python script that sends periodic desktop notifications to drink water. Cross-platform via the plyer library; interval and message configurable in a single file.",
        details: [
            {
                title: "Files",
                bullets: [
                    "main.py — entrypoint, starts the reminder loop",
                    "reminder_logic.py — timing + message formatting",
                    "notifier.py — plyer wrapper for cross-platform notifications",
                    "config.py — interval and message text",
                ],
            },
            {
                title: "Usage",
                body:
                    "`pip install plyer` then `python main.py`. Drop `INTERVAL_MINUTES` to 0.1 for quick testing; 60–90 for daily use. Ctrl+C to stop.",
            },
        ],
        highlights: [
            "Cross-platform desktop notifications via plyer",
            "Interval and message fully config-driven",
            "Minimal footprint — runs quietly in the background",
        ],
        tech: ["Python", "plyer"],
    },
    "Portfolio-cool": {
        summary:
            "This portfolio site. Vite + React + TypeScript with Tailwind and Framer Motion. Radial theme toggle, context-aware custom cursor with paint trails, magnetic buttons, live GitHub stats.",
        details: [
            {
                title: "Signature interactions",
                bullets: [
                    "Radial theme transition — click-coordinate-anchored circle expansion",
                    "Custom cursor with contrast-aware color + paint trails + eater bot",
                    "Magnetic buttons that pull toward the cursor",
                    "Film-grain SVG overlay at 3% opacity for analog texture",
                    "Sticky-hero stacked-section scroll pattern via Lenis",
                ],
            },
            {
                title: "Live data",
                bullets: [
                    "Stars via Cloudflare Workers counter (bypasses GitHub rate limits)",
                    "Commits via the jogruber contributions proxy",
                    "PRs via GitHub's search endpoint",
                ],
            },
            {
                title: "Build",
                body:
                    "Lazy-loaded sections via React.lazy + Suspense. TypeScript strict mode throughout. 100dvh mobile layouts, AA-contrast foreground colors. Deployed to Vercel.",
            },
        ],
        highlights: [
            "Radial theme transition tied to click coordinates",
            "Custom cursor with contrast-aware color + paint trails",
            "Sticky-hero stacked-section scroll pattern powered by Lenis",
        ],
        tech: ["Vite", "React", "TypeScript", "Tailwind", "Framer Motion", "Lenis", "Vercel"],
    },
    HireMe: {
        summary:
            "Experiment in automating the hiring loop end-to-end — job-description parsing, candidate screening and shortlisting via LLMs.",
        details: [],
        highlights: [],
        tech: [],
    },
    LEETCODE: {
        summary:
            "Personal archive of LeetCode solutions in C++. Updated as I solve problems — a reference for my own review, not a product.",
        details: [],
        highlights: [],
        tech: ["C++"],
    },
    GhostSyncWeb: {
        summary:
            "Web companion for the GhostSync desktop app — landing page and setup walkthrough for the Telegram-controlled Antigravity IDE bridge.",
        details: [],
        highlights: [],
        tech: ["HTML", "CSS"],
    },
    Ocular: {
        summary: "Early-stage demo / screen-recording software.",
        details: [],
        highlights: [],
        tech: [],
    },
};

async function main() {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);

    let applied = 0;
    let stripped = 0;

    for (const p of data.projects) {
        if (CURATED[p.name]) {
            Object.assign(p, CURATED[p.name]);
            applied++;
        }
        p.rank = RANKS[p.name] ?? 5;
        if (p.readmeRaw !== undefined) {
            delete p.readmeRaw;
            stripped++;
        }
    }

    data.curatedAt = new Date().toISOString();

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
    console.log(`Applied curated data to ${applied} projects.`);
    console.log(`Stripped readmeRaw from ${stripped} projects.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
