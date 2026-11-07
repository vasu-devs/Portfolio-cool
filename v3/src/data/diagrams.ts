// System diagrams for each flagship, checked against each project's code (Oct 2026). Client diagrams stay generic:
// no vendor, client, table or function names.
// Coordinates are in a 1000 x 540 viewBox; kind changes how a box is drawn.
export type Kind = 'io' | 'step' | 'model' | 'store' | 'gate';
export type DNode = { id: string; label: string; sub?: string; x: number; y: number; w?: number; kind?: Kind };
export type Diagram = { nodes: DNode[]; edges: [string, string][]; caption: string };

export const diagrams: Record<string, Diagram> = {
  fintech: {
    nodes: [
      { id: 'stripe', label: '2 processors', sub: 'payments, fees, refunds', x: 20, y: 30, kind: 'io' },
      { id: 'shop', label: 'Store API', sub: 'orders', x: 20, y: 160, kind: 'io' },
      { id: 'meta', label: 'Ad platform', sub: 'spend', x: 20, y: 290, kind: 'io' },
      { id: 'ful', label: 'Fulfilment', sub: 'costs', x: 20, y: 420, kind: 'io' },
      { id: 'sync', label: 'Sync engine', sub: 'chunked, resumable', x: 330, y: 225, kind: 'step' },
      { id: 'pg', label: 'Postgres', sub: 'USD + EUR, decimal.js', x: 600, y: 120, kind: 'store' },
      { id: 'roll', label: 'Daily rollup', sub: 'pre-aggregated', x: 600, y: 330, kind: 'gate' },
      { id: 'dash', label: 'P&L dashboard', sub: 'instant USD/EUR', x: 800, y: 225, w: 190, kind: 'model' },
    ],
    edges: [['stripe', 'sync'], ['shop', 'sync'], ['meta', 'sync'], ['ful', 'sync'], ['sync', 'pg'], ['pg', 'roll'], ['roll', 'dash'], ['pg', 'dash']],
    caption: 'Signed continuation tokens let multi-year imports outlive the 300-second serverless limit.',
  },
  justhireme: {
    nodes: [
      { id: 'src', label: 'Job sources', sub: 'source adapters', x: 20, y: 40, kind: 'io' },
      { id: 'norm', label: 'Normalize', sub: 'dedupe, clean', x: 270, y: 40 },
      { id: 'gate', label: 'Quality gate', sub: 'rejects with reasons', x: 520, y: 40, kind: 'gate' },
      { id: 'crm', label: 'Local CRM', sub: 'SQLite', x: 770, y: 40, kind: 'store' },
      { id: 'graph', label: 'Profile graph', sub: 'KuzuDB', x: 270, y: 240, kind: 'store' },
      { id: 'vec', label: 'Vectors', sub: 'LanceDB + ONNX', x: 520, y: 240, kind: 'store' },
      { id: 'rank', label: 'Fit ranker', sub: 'explains every score', x: 770, y: 240, kind: 'model' },
      { id: 'draft', label: 'Drafts', sub: 'résumé, letter, outreach', x: 770, y: 440, kind: 'model' },
      { id: 'you', label: 'You review', sub: 'nothing auto-sent', x: 520, y: 440, kind: 'io' },
    ],
    edges: [['src', 'norm'], ['norm', 'gate'], ['gate', 'crm'], ['crm', 'rank'], ['graph', 'vec'], ['vec', 'rank'], ['rank', 'draft'], ['draft', 'you']],
    caption: 'Runs on your machine: Tauri shell, React workbench, Python FastAPI sidecar.',
  },
  branchgpt: {
    nodes: [
      { id: 'q', label: 'Question', sub: 'main thread', x: 20, y: 300, kind: 'io' },
      { id: 'a', label: 'Answer', x: 270, y: 300 },
      { id: 'f', label: 'Follow-up', x: 520, y: 300 },
      { id: 'm', label: 'Merge', sub: 'summary as a system event', x: 730, y: 300, kind: 'store' },
      { id: 'fork', label: 'Fork', sub: 'inherits history', x: 270, y: 60, kind: 'gate' },
      { id: 't', label: 'Tangent', sub: 'own branch', x: 520, y: 60 },
      { id: 's', label: 'Llama 3.3 summary', sub: 'via Groq', x: 730, y: 60, kind: 'model' },
    ],
    edges: [['q', 'a'], ['a', 'f'], ['f', 'm'], ['a', 'fork'], ['fork', 't'], ['t', 's'], ['s', 'm']],
    caption: 'Every message is a node in Neon Postgres; a Git-style tree lets you jump to any branch.',
  },
  vaani: {
    nodes: [
      { id: 'caller', label: 'Caller', sub: 'phone, SIP', x: 20, y: 230, kind: 'io' },
      { id: 'lk', label: 'LiveKit', sub: 'WebRTC transport', x: 270, y: 230 },
      { id: 'stt', label: 'Deepgram STT', sub: 'Nova-2, 8 kHz', x: 520, y: 60, kind: 'model' },
      { id: 'llm', label: 'Groq LLM', sub: 'Llama 3.1 8B', x: 770, y: 230, kind: 'model' },
      { id: 'tts', label: 'Deepgram TTS', sub: 'speaks back', x: 520, y: 400, kind: 'model' },
      { id: 'sh', label: 'Risk review', sub: 'after the call', x: 770, y: 400, kind: 'gate' },
    ],
    edges: [['caller', 'lk'], ['lk', 'stt'], ['stt', 'llm'], ['llm', 'tts'], ['tts', 'lk'], ['llm', 'sh']],
    caption: 'Outbound calls over SIP. When a call ends, a 70B model scores risk, legal flags and the outcome.',
  },
  odeon: {
    nodes: [
      { id: 'p', label: 'Personas', sub: 'generated per scenario', x: 20, y: 60, kind: 'io' },
      { id: 'sim', label: 'Simulation', sub: 'streamed over WebSocket', x: 330, y: 60 },
      { id: 'j', label: 'LLM judge', sub: 'empathy, negotiation, repetition', x: 640, y: 60, w: 330, kind: 'model' },
      { id: 'pass', label: 'All pass?', sub: 'every threshold', x: 700, y: 330, kind: 'gate' },
      { id: 'opt', label: 'Optimizer', sub: 'rewrites the prompt', x: 390, y: 330, kind: 'model' },
      { id: 'agent', label: 'Agent prompt', sub: 'word-level diff', x: 80, y: 330, kind: 'store' },
    ],
    edges: [['p', 'sim'], ['sim', 'j'], ['j', 'pass'], ['pass', 'opt'], ['opt', 'agent'], ['agent', 'sim']],
    caption: 'Runs cycles until the averages meet every threshold; SQLite keeps each run and every prompt version.',
  },
  svara: {
    nodes: [
      { id: 'key', label: 'Hotkey', sub: 'system-wide', x: 20, y: 230, kind: 'io' },
      { id: 'buf', label: 'Pre-roll buffer', sub: 'first syllable kept', x: 250, y: 230 },
      { id: 'stt', label: 'On-device STT', sub: 'CPU or GPU', x: 520, y: 60, kind: 'model' },
      { id: 'llm', label: 'Cleanup', sub: 'optional, Ollama', x: 520, y: 400, kind: 'gate' },
      { id: 'out', label: 'Your cursor', sub: 'terminal-safe insert', x: 780, y: 230, kind: 'io' },
    ],
    edges: [['key', 'buf'], ['buf', 'stt'], ['stt', 'llm'], ['llm', 'out'], ['stt', 'out']],
    caption: 'Recognition never leaves the machine. CPU is a first-class path, not a fallback.',
  },
  mapmyrepo: {
    nodes: [
      { id: 'in', label: 'GitHub URL', sub: 'or a dropped folder', x: 20, y: 230, kind: 'io' },
      { id: 'parse', label: 'Repo tree', sub: 'GitHub tree API', x: 270, y: 230 },
      { id: 'graph', label: 'D3 force graph', sub: 'click to expand', x: 520, y: 70, kind: 'store' },
      { id: 'gem', label: 'Gemini', sub: 'summary + functions', x: 520, y: 390, kind: 'model' },
      { id: 'chat', label: 'Ask a node', sub: 'file or folder', x: 770, y: 230, kind: 'io' },
    ],
    edges: [['in', 'parse'], ['parse', 'graph'], ['parse', 'gem'], ['graph', 'chat'], ['gem', 'chat']],
    caption: 'A file explodes into its functions and classes; an optional token lifts GitHub’s rate limit.',
  },
  // From the project write-up (Open Kernel Challenge entry, Oct 2026).
  gpukernels: {
    nodes: [
      { id: 'probs', label: '5 problems', sub: 'decode, prefill, MoE', x: 20, y: 60, kind: 'io' },
      { id: 'lead', label: 'Lead agent', sub: 'one agent per problem', x: 270, y: 60, kind: 'model' },
      { id: 'file', label: 'Kernel file', sub: 'CUDA + Triton fallback', x: 520, y: 60 },
      { id: 'rev', label: 'Reviewers', sub: 'apart from the authors', x: 270, y: 250, kind: 'gate' },
      { id: 'local', label: 'Local check', sub: 'laptop GPU, must pass', x: 520, y: 250, kind: 'gate' },
      { id: 'sass', label: 'SASS check', sub: '3 compiler versions', x: 770, y: 60, kind: 'gate' },
      { id: 'judge', label: 'H200 judge', sub: 'vs SGLang, same run', x: 770, y: 250, kind: 'io' },
      { id: 'win', label: '1.25–1.77×', sub: 'faster on all five', x: 770, y: 440, kind: 'store' },
    ],
    edges: [['probs', 'lead'], ['lead', 'file'], ['lead', 'rev'], ['rev', 'file'], ['file', 'local'], ['file', 'sass'], ['local', 'judge'], ['sass', 'judge'], ['judge', 'win']],
    caption: 'No H200 at hand: check runs double as timing probes, so nothing reaches the judge without passing locally.',
  },
  // Client work: generic, no vendor or model names.
  visualsearch: {
    nodes: [
      { id: 'photo', label: 'Outfit photo', sub: 'one upload', x: 20, y: 60, kind: 'io' },
      { id: 'det', label: 'Per garment', sub: 'each item on its own', x: 270, y: 60 },
      { id: 'emb', label: 'Embedding', sub: 'chosen by benchmark', x: 520, y: 60, kind: 'model' },
      { id: 'route', label: 'GPU router', sub: 'exact or two-stage', x: 770, y: 60, kind: 'gate' },
      { id: 'ver', label: 'Verifier', sub: 're-embeds a sample', x: 270, y: 250, kind: 'gate' },
      { id: 'idx', label: '3.48M vectors', sub: '617K products, one GPU', x: 520, y: 250, kind: 'store' },
      { id: 'score', label: 'Scoring', sub: 'bonus for a 2nd angle', x: 770, y: 250 },
      { id: 'out', label: 'Matches', sub: '~15–21 ms retrieval', x: 770, y: 440, kind: 'io' },
    ],
    edges: [['photo', 'det'], ['det', 'emb'], ['emb', 'route'], ['ver', 'idx'], ['idx', 'route'], ['route', 'score'], ['score', 'out']],
    caption: 'Measured with the query photo’s own vector hidden, so a product must be found through its other angles.',
  },
};
