import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Primary woodland palette ---
        'deep-brown':  '#7B3F00',
        'coffee':      '#6F4E37',
        'forest':      '#355E3B',
        'moss':        '#40826D',
        'sage':        '#5F8575',
        'rust':        '#954535',
        'golden':      '#E5AA70',
        'ochre':       '#CC7722',
        'lichen':      '#C9CC3F',
        'parchment':   '#E9DCC9',
        'offwhite':    '#FAF9F6',
        // --- Subtle accent tones (use sparingly) ---
        'aqua':        '#96DED1',
        'teal':        '#40B5AD',
        'periwinkle':  '#8A9AFB',
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans:  ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 32px rgba(123, 63, 0, 0.08), 0 1px 4px rgba(123, 63, 0, 0.06)',
        'btn':  '0 2px 12px rgba(123, 63, 0, 0.20)',
      },
    },
  },
  plugins: [],
}

export default config
