// Voice-written copy for the /test portfolio. Facts stay grounded in src/data;
// this file only decides what is said, how, and in which group.
// group: 'work' (built to ship), 'earlier' (older tools), 'play' (for fun).

export const COVER_VERSION = 'v15';
export const coverPath = (slug, realm) => `/test/covers/${slug}-scene-${realm}-${COVER_VERSION}.webp`;

export const groups = {
  work: {
    title: 'Built to ship',
    lead: 'The projects I treat like products: real users or a real path to them, tests, releases, and the boring parts done properly.'
  },
  earlier: {
    title: 'Earlier tools',
    lead: 'Smaller builds from the last couple of years. Still public, still useful for seeing how I think.'
  },
  play: {
    title: 'For fun',
    lead: 'Things I built because I wanted them to exist. Origami, games, wallpapers, a turtle.'
  }
};

export const projects = [
  {
    slug: 'justhireme', name: 'JustHireMe', group: 'work', featured: true,
    kind: 'Open source · Desktop app', status: '2,200+ stars · Windows, macOS, Linux',
    hook: 'A desktop app that finds jobs, explains why each one fits you, and drafts the application. Your data never leaves your machine.',
    deck: 'Job hunting is mostly tabs. I wanted one place that pulls in leads, scores them against my actual profile, tells me why, and writes the first draft, without shipping my career history to someone else’s server.',
    url: 'https://github.com/vasu-devs/JustHireMe',
    tech: ['Tauri', 'Rust', 'React', 'Python', 'FastAPI', 'Kuzu', 'LanceDB'],
    sections: [
      { title: 'What it does', bullets: [
        'Pulls job leads from several sources, normalizes them, and runs a deterministic quality gate before anything reaches your list.',
        'Ranks each lead against your profile with a graph of your experience plus vector similarity, and shows the reasoning instead of a bare score.',
        'Drafts a tailored resume, cover letter, and outreach message that you review before anything goes out.'
      ]},
      { title: 'How it’s built', body: 'A Tauri shell hosts a React workbench and a bundled Python FastAPI sidecar bound to localhost behind a per-run token. Career data lives in a local SQLite CRM; a bundled ONNX embedding model means matching works with no API key. External AI providers are optional and only used when you configure them.' },
      { title: 'Where it stands', body: 'Open source under AGPL, with CI-built installers for all three desktop platforms and a few hundred backend and frontend tests. The launch went further than I expected: 800 to 2,000+ stars in about two weeks. A native iPhone version is a separate project below.' }
    ]
  },
  {
    slug: 'svara', name: 'Svara', group: 'work', featured: true,
    kind: 'Open source · Windows dictation', status: 'Released · runs fully on-device',
    hook: 'Talk instead of type. Svara listens, transcribes on your own CPU or GPU, and drops the text wherever your cursor is.',
    deck: 'Most dictation tools are fine until you use them in a terminal, or your first word gets clipped, or a recording vanishes. Svara is my attempt at dictation that survives real use.',
    url: 'https://github.com/vasu-devs/Svara',
    tech: ['Python', 'faster-whisper', 'CTranslate2', 'Windows APIs', 'SQLite', 'Ollama'],
    sections: [
      { title: 'What it does', bullets: [
        'System-wide hotkey, a pre-roll buffer so the first syllable is never lost, streaming transcription, and insertion at the active cursor.',
        'Knows what app it is typing into: terminal-safe handling, editor-aware paste, and a clipboard fallback when Windows privilege boundaries block input.',
        'Personal vocabulary, local history, optional LLM cleanup through Ollama, tray controls, and a packaged release with an update flow that waits for you.'
      ]},
      { title: 'Decisions I’d defend', bullets: [
        'Recognition stays on the device. CPU inference is a first-class path, not a fallback, so it runs on a laptop without a GPU.',
        'Unfinished dictation is protected with temporary recovery audio, and transcript content is redacted from ordinary logs.',
        'A benchmark harness measures latency and accuracy on your hardware rather than quoting numbers from mine.'
      ]},
      { title: 'Where it stands', body: 'Shipped and in daily use. Regression tests cover cleanup, insertion, configuration, and log redaction. Performance depends on the model and machine you pick, which is why the benchmark ships with it.' }
    ]
  },
  {
    slug: 'odeon', name: 'Odeon', group: 'work', featured: true,
    kind: 'Open source · Agent evaluation', status: 'Prototype · public repository',
    hook: 'Throw hard conversations at a voice agent, score what happened, rewrite the prompt, and run it again.',
    deck: 'Changing a prompt and reading three transcripts is not evaluation. Odeon simulates adversarial callers, judges the results per metric, proposes a revision, and keeps the diff so you can see what actually changed.',
    url: 'https://github.com/vasu-devs/Odeon',
    tech: ['Python', 'FastAPI', 'WebSockets', 'React', 'SQLite', 'Groq'],
    sections: [
      { title: 'The loop', bullets: [
        'Simulate: generated personas push the agent through difficult, off-script conversations.',
        'Score: an LLM judge grades each run against per-metric thresholds you set.',
        'Revise: the prompt is rewritten toward the failing metrics, then the loop runs again.'
      ]},
      { title: 'How it’s built', body: 'Simulation, judging, and revision are separate stages so each can be swapped. Progress streams over WebSockets; run history and word-level prompt diffs are persisted so every optimization cycle can be inspected later.' },
      { title: 'Where it stands', body: 'A working prototype. Simulated callers and judge scores are a fast way to compare prompt versions, not a substitute for listening to real calls, and I say so in the README.' }
    ]
  },
  {
    slug: 'dreamer', name: 'Dreamer', group: 'work',
    kind: 'Private · Idea workspace', status: 'Running locally · pre-release',
    hook: 'Save an idea, let agents research and argue with it overnight, and wake up to a document you can actually edit.',
    deck: 'Ideas die in notes apps, and long AI chats are impossible to audit later. Dreamer turns research, planning, and critique into a durable document where every agent edit is a reviewable proposal.',
    url: null,
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'React Native', 'Docker', 'Vitest'],
    sections: [
      { title: 'What it does', bullets: [
        'An idea vault with an API, a web client, and a mobile client sharing one worker system for research, planning, critique, and refinement.',
        'Agents never overwrite. They propose attributed section changes with version history; the owner accepts or rejects.',
        'An opt-in discovery mode investigates an idea, records evidence for and against, and applies explicit acceptance rules.'
      ]},
      { title: 'Decisions I’d defend', bullets: [
        'PostgreSQL-backed work records with leases, heartbeats, retries, and idempotent scheduling so a multi-hour job can crash and resume.',
        'Provider routing and usage accounting live outside the workflow, so swapping a model does not touch orchestration.',
        'Evidence checks and a publication quarantine: a model saying an idea is good is not treated as proof that it is.'
      ]},
      { title: 'Where it stands', body: 'Private and running on my machine. Unit and database integration tests cover proposals, workers, migrations, and recovery. Managed staging and mobile device acceptance are still ahead of a public release.' }
    ]
  },
  {
    slug: 'deep-researcher', name: 'Deep Researcher', group: 'work',
    kind: 'Private · Research engine', status: 'Working prototype',
    hook: 'Ask a question, get a report where every claim points at a quote that really exists in a source.',
    deck: 'A report can look well cited while the sources say something else. This engine keeps the evidence attached to each claim from retrieval to the final page, and stops when it cannot back something up.',
    url: null,
    tech: ['Python', 'FastAPI', 'Pydantic', 'SQLite', 'HTTPX', 'pytest'],
    sections: [
      { title: 'What it does', bullets: [
        'A planner splits the question into bounded workstreams, searches iteratively, and extracts full pages and PDFs.',
        'A claim ledger stores each claim with its source, quoted passage, document location, and a provenance hash.',
        'Checkpoints in SQLite, cancel and restart, live progress events, a REST API, a dashboard, and a CLI.'
      ]},
      { title: 'Decisions I’d defend', bullets: [
        'Two gates, not one: the quote must exist verbatim in the retrieved text, and the claim must be supported by that quote in context.',
        'Passages are picked for relevance to the sub-question instead of truncating documents from the top.',
        'When an evidence gate fails the pipeline stops and keeps the rejected material for inspection rather than papering over it.'
      ]},
      { title: 'Where it stands', body: 'Private source, working locally. Tests exercise evidence persistence, fabricated-quote rejection, passage selection, and PDF extraction with controlled fixtures. They prove the pipeline behaves; they do not make the internet truthful, so live output still gets read.' }
    ]
  },
  {
    slug: 'waldo', name: 'Waldo', group: 'work',
    kind: 'Public source · Multimodal RAG', status: 'Assessment prototype',
    hook: 'Ask questions about a PDF and get answers from its tables and figures, not just its paragraphs.',
    deck: 'Most retrieval systems only read text. The answer in a research paper or spec sheet is often in a bar chart or a table, so Waldo ingests those too and makes them searchable.',
    url: 'https://github.com/vasu-devs/Waldo',
    tech: ['Python', 'FastAPI', 'React', 'Qdrant', 'LangGraph', 'Gemini', 'Groq', 'Docling'],
    sections: [
      { title: 'Ingestion', bullets: [
        'Docling extracts document structure; RapidOCR covers scanned pages.',
        'A vision model transcribes figures into searchable text, with extracted captions as a fallback when quota runs out.',
        'Chunks are embedded with a small sentence-transformer into Qdrant, linked back to page and image metadata.'
      ]},
      { title: 'Retrieval', bullets: [
        'A LangGraph agent routes between direct answers and retrieval, grades every retrieved chunk for relevance, and rewrites failed queries with a bounded retry.',
        'Visual questions automatically pull in figure transcriptions; Groq serves the final generation for low latency.',
        'A no-context refusal path keeps it from inventing answers the document does not contain.'
      ]},
      { title: 'Where it stands', body: 'A single-document prototype with in-memory retrieval, built for an assessment. It shows the ingestion and orchestration; persistence and multi-user isolation are out of scope for this version.' }
    ]
  },
  {
    slug: 'socratis', name: 'Socratis', group: 'work',
    kind: 'Public source · Voice interviewer', status: 'Prototype',
    hook: 'A voice interviewer that watches you code in real time, nudges only when you stall, and writes a forensic report afterwards.',
    deck: 'Earlier versions hallucinated about the candidate’s code. The fix was simple and effective: every edit in the editor is injected into the agent’s context, so it sees the diff instead of guessing.',
    url: 'https://github.com/vasu-devs/Socratis',
    tech: ['Next.js', 'Python', 'LiveKit', 'Deepgram', 'Groq', 'MongoDB', 'Express'],
    sections: [
      { title: 'The setup', body: 'The candidate codes in Monaco. A Python voice agent runs the interview over WebRTC with LiveKit for transport, Deepgram for speech in and out, Silero for voice activity, and Llama 3.3 70B on Groq for reasoning. Next.js in front, Express and MongoDB holding sessions.' },
      { title: 'Behavior rules', bullets: [
        'Socratic: hint, never solve.',
        'Speaks only on a bug, an approach change, or a stall.',
        'Cross-checks what the candidate says against what they typed.'
      ]},
      { title: 'After the call', body: 'The same agent does a second pass: strict Big-O on time and space, line-by-line fixes, communication analysis quoting the transcript, and a hallucination check comparing claims to code. It renders as a radar chart on the results page.' }
    ]
  },
  {
    slug: 'forge', name: 'Forge', group: 'work',
    kind: 'Public source · Claude Code plugin', status: 'v1 · memory layer split into engram',
    hook: 'Sixteen linked engineering skills for Claude Code, plus a memory layer that learns from your sessions and a live map of your codebase.',
    deck: 'A raw coding agent assumes silently, over-builds, and claims success it never verified. Forge is one namespaced lifecycle, understand through ship, where each skill encodes a rule you can actually check.',
    url: 'https://github.com/vasu-devs/Forge',
    tech: ['Claude Code plugin', 'Node.js', 'JSONL', 'ONNX embeddings'],
    sections: [
      { title: 'Falsifiable, not aspirational', bullets: [
        'tdd: no production code without a failing test first, and you watch it fail.',
        'debug: after three failed fixes, question the architecture instead of trying a fourth.',
        'verify: a claim-to-proof table before “done” is allowed. Each skill names the excuse it forbids.'
      ]},
      { title: 'The memory loop', body: 'Lifecycle hooks log every edit and command as compact JSONL. A throttled background distiller extracts trigger-to-action lessons through a strict quality gate, and the highest-confidence ones are injected at the next session start. That subsystem later became its own plugin, engram.' },
      { title: 'The code graph', body: 'A dependency graph of the repo with god nodes, modules, blast radius, and cycles, patched incrementally after each change so it never goes stale.' }
    ]
  },
  {
    slug: 'justhireme-ios', name: 'JustHireMe iOS', group: 'work',
    kind: 'Private · Native iPhone app', status: 'In development · not yet released',
    hook: 'The job-search workflow on a phone, with its own account-scoped backend instead of a hole punched into the desktop app.',
    deck: 'The desktop app keeps everything on one machine. A phone needs accounts, sessions, purchase recovery, and a backend built for many users. Reusing the local desktop API would cross the wrong trust boundary, so this is a separate build.',
    url: null,
    tech: ['Swift', 'SwiftUI', 'StoreKit', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase'],
    sections: [
      { title: 'What it does', bullets: [
        'Email-code sign-in, profile editing, saved opportunities, application tracking, reviewable drafts, sharing, export, and account deletion.',
        'Native subscriptions and credits with StoreKit, server-side purchase records, and recovery of unfinished transactions.',
        'A clearly labelled demo mode with fictional data so the app can be explored without an account or payment.'
      ]},
      { title: 'Decisions I’d defend', bullets: [
        'The mobile cloud service is separate from the desktop sidecar and scopes everything through authenticated endpoints.',
        'Session credentials sit in the Keychain; account content stays in memory over an ephemeral networking session.',
        'A purchase is not complete until the server says so.'
      ]},
      { title: 'Where it stands', body: 'Compiles and passes demo UI tests on a hosted simulator, including onboarding, tracking, dark mode, and larger text. Real auth, payments, device testing, signing, and TestFlight are still ahead.' }
    ]
  },

  // Earlier tools
  { slug: 'vaani', name: 'Vaani', group: 'earlier', kind: 'Public source · Voice agent', status: 'Prototype with demo video',
    hook: 'A phone-call voice agent with live transcripts and two personas that handle a difficult conversation differently.',
    url: 'https://github.com/vasu-devs/Vaani', demo: 'https://www.youtube.com/watch?v=VsEfOfwh8XM', tech: ['LiveKit', 'Deepgram', 'Groq', 'FastAPI', 'React'] },
  { slug: 'branchgpt', name: 'BranchGPT', group: 'earlier', kind: 'Public source · Chat tool', status: 'Public repository',
    hook: 'Fork an AI conversation to explore a side thought, then merge it back without losing the main thread.',
    url: 'https://github.com/vasu-devs/BranchGPT', demo: 'https://www.youtube.com/watch?v=RB3zvAXbpL0', tech: ['Next.js', 'PostgreSQL', 'Drizzle'] },
  { slug: 'mapmyrepo', name: 'MapMyRepo', group: 'earlier', kind: 'Public source · Dev tool', status: 'Public repository',
    hook: 'Drop in a repo and walk it as a graph, with a summary and a few smart questions for every file.',
    url: 'https://github.com/vasu-devs/MapMyRepo', demo: 'https://www.youtube.com/watch?v=EmTDrPzAo40', tech: ['D3', 'Gemini', 'React'] },
  { slug: 'leetbot', name: 'LeetBot', group: 'earlier', kind: 'Public source · Browser extension', status: 'Public repository',
    hook: 'Hints, a tutor mode, and zoomable explanation diagrams next to the coding problem you are stuck on.',
    url: 'https://github.com/vasu-devs/LeetBot', tech: ['Browser extension', 'Mermaid'] },
  { slug: 'sss', name: 'SSS', group: 'earlier', kind: 'Public source · Local vision', status: 'Public repository',
    hook: 'Point a local vision model at your screenshots folder and get it sorted, with the links pulled out into a searchable index.',
    url: 'https://github.com/vasu-devs/SSS', tech: ['Python', 'PyTorch', 'Qwen2-VL'] },

  // For fun
  {
    slug: 'ori-no-michi', name: 'Ori no Michi', group: 'play', featured: true,
    kind: 'Private · Origami in 3D', status: 'Personal learning app',
    hook: 'Learn origami from a 3D model you can orbit, scrub, and pause while you fold along with real paper.',
    deck: 'A flat diagram hides which layer moves and where it should land. I wanted a fold you can look at from any angle, replay, and slow down.',
    url: null,
    tech: ['TypeScript', 'React', 'Three.js', 'GSAP', 'Python'],
    sections: [
      { title: 'The engine', bullets: [
        'Rigid polygon clipping and folding with layer selection, mountain and valley motion, unfolding, and turn-over steps.',
        'The moving layer is chosen from the authored crease segment so a fold on one flap does not drag unrelated paper along.',
        'Previews are generated from the same geometry as playback, so the picture and the animation never disagree.'
      ]},
      { title: 'The lessons', body: 'Crease guides, moving-flap highlights, alignment targets, and a tutorial theater with camera moves, chapters, captions, narration, speed control, and a fold-along pause mode. Reduced motion and keyboard controls are built in.' },
      { title: 'Honest limits', body: 'It models rigid folds, not paper physics or collisions. Complex workshop diagrams deliberately simplify hidden layers. Tests check paper-area conservation, edge lengths, layer selection, and chapter coverage.' }
    ]
  },
  {
    slug: 'learnai', name: 'LearnAI', group: 'play', featured: true,
    kind: 'Private · Interactive handbook', status: 'Personal project',
    hook: 'An applied-AI handbook where you can poke at tokens, embeddings, retrieval, and prompt injection instead of reading about them.',
    deck: 'Definitions do not show how embeddings or tool use behave. Every concept here has a small toy you can break, next to the explanation and a lesson you can listen to.',
    url: null,
    tech: ['JavaScript', 'HTML', 'CSS', 'Web Audio'],
    sections: [
      { title: 'What’s inside', bullets: [
        'A standalone docs site with topic navigation, themes, and progress tracking, no build step required.',
        'Playgrounds for token sampling, embedding space, retrieval pipelines, prompt-injection awareness, agent failures, and model-based evaluation.',
        'Quizzes, interview practice, and audio and video lessons with transcripts and saved playback position.'
      ]},
      { title: 'Honest limits', body: 'The demos are simplified on purpose to expose cause and effect. They are not production tokenizers or retrieval engines, and I have not evaluated it as a formal course.' }
    ]
  },
  {
    slug: 'estimateio', name: 'EstimateIO', group: 'play', featured: true,
    kind: 'Private · Browser game', status: 'Personal project',
    hook: 'How big is a blue whale next to a bus? Guess by resizing, measuring, or placing things on a scale, then see how far off you were.',
    deck: 'Numbers do not build intuition for size. Dragging an object next to something familiar and being shown your error at a shared baseline does.',
    url: null,
    tech: ['TypeScript', 'React', 'Pointer Events', 'Web Audio'],
    sections: [
      { title: 'Three modes', bullets: [
        'Relative size: resize an object beside a reference.',
        'Make a measurement: construct a length with your hands.',
        'Place it: drop an object on a logarithmic size line.'
      ]},
      { title: 'Decisions I’d defend', bullets: [
        'Every measurement is stored in centimetres with explicit conversions and a reference source attached.',
        'Scoring is symmetric: guessing half the size and double the size are equally wrong.',
        'Pinch and drag handle pointer add, release, cancel, and near-coincident fingers without jumps. Keyboard and buttons work too.'
      ]},
      { title: 'Honest limits', body: 'Artwork is stylized and screen pixels are not life-size units. Logic tests cover scoring, conversions, log mapping, challenge rotation, and gesture transitions.' }
    ]
  },
  { slug: 'reiatsu', name: 'Reiatsu', group: 'play', kind: 'Private · Windows wallpaper studio', status: 'Personal experiment',
    hook: 'Live wallpapers behind your desktop icons: still images with WebGL drift, refraction, and light, picked from a floating scene panel.',
    url: null, tech: ['Electron', 'WebGL', 'Windows'] },
  { slug: 'asciirealtime', name: 'ASCIIRealTime', group: 'play', kind: 'Public source · Webcam toy', status: 'Public repository',
    hook: 'Your webcam as live ASCII or emoji art, with background segmentation so only you get turned into characters.',
    url: 'https://github.com/vasu-devs/ASCIIRealTime', tech: ['JavaScript', 'MediaPipe'] },
  { slug: 'pixelforge', name: 'PixelForge', group: 'play', kind: 'Public source · Desktop tool', status: 'Public repository',
    hook: 'Image to full-colour ASCII in JavaFX, with a proper HD render pass so a 4K photo gives you a 4K ASCII PNG.',
    url: 'https://github.com/vasu-devs/PixelForge', tech: ['Java 17', 'JavaFX'] },
  { slug: 'gitart', name: 'GitArt', group: 'play', kind: 'Public source · Browser tool', status: 'Public repository',
    hook: 'Paint a picture on a contribution grid and download a real Git repo that draws it. Everything runs in the browser.',
    url: 'https://github.com/vasu-devs/GitArt', tech: ['Next.js', 'isomorphic-git', 'JSZip'] },
  { slug: 'habiturtle', name: 'habiTurtle', group: 'play', kind: 'Public source · Desktop app', status: 'Public repository',
    hook: 'A habit tracker with streaks and a turtle that looks happier the more you show up.',
    url: 'https://github.com/vasu-devs/habiTurtle', tech: ['Python', 'PyQt'] },
  { slug: 'maze-pathfinder', name: 'Maze Pathfinder Visualizer', group: 'play', kind: 'Public source · Visualizer', status: 'Public repository',
    hook: 'Watch BFS, DFS, Dijkstra, and A* race through the same maze, each in its own colour.',
    url: 'https://github.com/vasu-devs/Maze-Pathfinder-Visualizer', tech: ['Python', 'Pygame'] },
  { slug: 'holeemall', name: 'HoleEmAll', group: 'play', kind: 'Public source · Arcade game', status: 'Public repository',
    hook: 'A tiny Pygame arcade loop: move, swallow, grow, beat the countdown.',
    url: 'https://github.com/vasu-devs/HoleEmAll', tech: ['Python', 'Pygame'] }
];

// Names as they appear in src/data/work-archive.json for the small entries.
export const archiveNames = {
  vaani: 'Vaani', branchgpt: 'BranchGPT', mapmyrepo: 'MapMyRepo', leetbot: 'LeetBot', sss: 'SSS',
  reiatsu: 'Reiatsu', asciirealtime: 'ASCIIRealTime', pixelforge: 'PixelForge', gitart: 'GitArt',
  habiturtle: 'habiTurtle', 'maze-pathfinder': 'Maze-Pathfinder-Visualizer', holeemall: 'HoleEmAll'
};

export const pageCopy = {
  eyebrow: 'Selected work',
  intro: 'Most of this is AI tooling and desktop software, built end to end by me. Cards open a case study; the ones with a source link are public.',
  featuredLead: 'Three I would show first.',
  videosLead: 'Recorded walkthroughs. I talk through the interface, the idea, and how the pieces fit.'
};
