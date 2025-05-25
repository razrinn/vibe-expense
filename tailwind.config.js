import tailwindSafeArea from 'tailwindcss-safe-area';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: {
          950: '#000000',
          900: '#0A0A0A',
          800: '#1A1A1A',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4CAF50', // Primary color
          600: '#3f9142',
          700: '#337538',
          800: '#2c5e2e',
          900: '#1f3d1f',
          950: '#0d200f',
        },
      },
      boxShadow: {
        top: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
      },
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [tailwindSafeArea],
};
