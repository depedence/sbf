/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        base: {
          950: '#0e0f13',
          900: '#15161b',
          800: '#1c1e25',
          700: '#252831',
          600: '#31343f',
          500: '#3d4150',
        },
        ink: {
          primary: '#f2f2f5',
          secondary: '#a8acba',
          muted: '#686c7a',
        },
        accent: {
          DEFAULT: '#7c6cf6',
          hover: '#8f81f8',
          soft: 'rgba(124,108,246,0.14)',
        },
        cyan: {
          glow: '#38e8e0',
        },
        income: {
          DEFAULT: '#34d399',
          soft: 'rgba(52,211,153,0.14)',
        },
        expense: {
          DEFAULT: '#fb7185',
          soft: 'rgba(251,113,133,0.14)',
        },
        warn: {
          DEFAULT: '#fbbf24',
          soft: 'rgba(251,191,36,0.14)',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,108,246,0.25), 0 8px 30px -8px rgba(124,108,246,0.35)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(2%, -3%) scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-3%, 3%) scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 14s ease-in-out infinite',
        floatSlow: 'floatSlow 18s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
