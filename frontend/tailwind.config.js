/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plane: '#0d0d0d',
        surface: '#1a1a19',
        raised: '#232322',
        border: 'rgba(255,255,255,0.10)',
        gridline: '#2c2c2a',
        baseline: '#383835',
        ink: {
          primary: '#ffffff',
          secondary: '#c3c2b7',
          muted: '#898781',
        },
        accent: {
          DEFAULT: '#3987e5',
          hover: '#5598e7',
        },
        good: '#0ca30c',
        bad: '#e66767',
      },
    },
  },
  plugins: [],
};
