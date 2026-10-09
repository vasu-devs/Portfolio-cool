/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: {
          black: '#000000',
          dark: '#050505',
          gray: '#111111',
          light: '#222222',
        },
        warrior: {
          crimson: '#8B0000',
          blood: '#4a0404',
          gold: '#C5A059',
          silver: '#8a8a8a',
        },
        // Keep aura purple for legacy/accents if needed, or remove. 
        // Keeping it for safety but muting it.
        aura: {
          purple: '#4a0404' // Re-mapped to blood for safety
        }
      },
      animation: {
        'glitch': 'glitch 0.2s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'unsheathe': 'unsheathe 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        unsheathe: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        }
      }
    },
  },
  plugins: [],
}
