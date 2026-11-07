// The look of the named cursor agents, shared by the swarm opening and the mascot's mood swap.
export const NAMES = ['Kai', 'Mira', 'Juno', 'Odin', 'Nova', 'Iris', 'Leo', 'Zara', 'Finn', 'Luna', 'Remy', 'Sol', 'Ivy', 'Tao', 'Uma', 'Rex',
  'Wren', 'Ezra', 'Noor', 'Pip', 'Rio', 'Sage', 'Yuki', 'Ash', 'Cleo', 'Dex', 'Echo', 'Milo', 'Nia', 'Otto'];
export const COLORS = ['#ff5a1f', '#7c5cff', '#ff4f9a', '#ffc400', '#00c27a', '#2bb8ff', '#ff3b3b', '#c6ff2e', '#ff8a00', '#b05cff', '#00d1c1', '#ff6fd8'];
export const ARROW = '<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1.5v16.2l4.4-4 3 6.8 3-1.3-3-6.6h6.2z" fill="currentColor" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

/** Dark or white text, whichever reads on this tag colour. */
export const fgFor = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0d0d12' : '#fff';
};
