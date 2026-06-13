/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEEEFF',
          100: '#E0E1FF',
          200: '#C7C8FE',
          300: '#A5A7FC',
          400: '#8689F7',
          500: '#6366F1',
          600: '#3B40CE',
          700: '#2E3188',
          800: '#1F2142',
          900: '#0F172A',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          500: '#8B5CF6',
        },
        accent: {
          DEFAULT: '#06B6D4',
          500: '#06B6D4',
        },
        dark: {
          DEFAULT: '#0F172A',
          100: '#1E293B',
          200: '#334155',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
