// Copy and facts come from Vasu's master profile (~/archive/e/content.md, 21 Oct 2026): the portfolio voice and
// approved experience copy (§3), principles (§15) and only numbers from the Evidence Ledger (§16).
// No numbers ever sit next to withlayer.ai; clients stay confidential.

export const person = {
  name: 'Vasudev Siddh',
  handle: 'Vasu-Devs',
  intro: "I'm Vasu, an AI and full-stack engineer based in India. I build voice tools, desktop apps, and software for clients.",
  about: "I build voice tools, desktop apps, and software for clients. Currently an AI Engineering intern at withlayer.ai. Outside work, I'm building JustHireMe, Svara, and Dreamer, and sharing what I learn through code and videos.",
  email: 'siddhvasudev1402@gmail.com',
  call: 'https://cal.com/vasu-devs',
  coffee: 'https://buymeacoffee.com/vasu.devs',
  resume: '/resume.html',
  socials: [
    { label: 'GitHub', url: 'https://github.com/vasu-devs' },
    { label: 'X', url: 'https://x.com/vasu_devs' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/vasu-devs/' },
    { label: 'YouTube', url: 'https://www.youtube.com/@Vasu-Devs' },
    { label: 'Instagram', url: 'https://www.instagram.com/vasu_._devs/' },
  ],
};

export type Link = { label: string; url: string };
export type Fact = { value: string; label: string };

export const openSource = {
  headline: '8 merged PRs across 5 external repositories',
  items: [
    { repo: 'kana-dojo', count: '4 PRs merged', text: 'Authored four themes plus design documentation.', url: 'https://github.com/lingdojo/kana-dojo' },
    { repo: 'free-programming-books', count: '275k★ repo', text: 'Added a FastAPI cheat sheet to the developer-resource index.', url: 'https://github.com/EbookFoundation/free-programming-books' },
    { repo: 'pqoqubbw/icons', count: 'Animated icon', text: 'An animated corner-down-left icon with a path-draw animation.', url: 'https://github.com/pqoqubbw/icons' },
  ],
};

export const principles = [
  { title: 'Measure before optimizing', text: 'A latency waterfall before a speed-up, an eval gate before a prompt ships.' },
  { title: 'Mechanisms, not instructions', text: 'LLM reliability comes from contracts, reason codes and tests, not from asking the model nicely.' },
  { title: 'A regression test for every bug', text: 'Reproduce it first. A fix without a test is unfinished.' },
  { title: 'Ship behind flags', text: 'Default off, one-variable rollback, no redeploy.' },
  { title: 'Say what wasn’t verified', text: 'If my own experiment loses, I report that it lost.' },
  { title: 'Ship the whole slice', text: 'Packaging, CI, signed releases and docs. A demo is not a product.' },
];
