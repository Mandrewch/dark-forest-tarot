import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fbf8f1',
          100: '#f5efe0',
          200: '#ebdebf',
          300: '#dfcb9b',
          400: '#d1b374',
          500: '#be9952',
          600: '#a57e42',
          700: '#846036',
          800: '#6d4e30',
          900: '#5c412b',
          950: '#342215',
        },
        occult: {
          bg: '#0c0a09',
          surface: '#171412',
          card: '#1f1b17',
          border: '#382f25',
          gold: '#d4af37',
          'gold-light': '#f3e5ab',
          'gold-dark': '#997d25',
          crimson: '#6b1d24',
          sepia: '#2b231c',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'Cambria', 'serif'],
        gothic: ['UnifrakturMaguntia', 'Cinzel Decorative', 'serif'],
        body: ['Spectral', 'Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        parchment: '0 4px 20px -2px rgba(18, 14, 10, 0.7), 0 0 15px rgba(212, 175, 55, 0.15)',
        'parchment-glow': '0 0 25px 3px rgba(212, 175, 55, 0.35)',
        'card-elevated': '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 175, 55, 0.3)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
