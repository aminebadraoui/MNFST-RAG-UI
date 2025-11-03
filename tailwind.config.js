/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark orange primary palette
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Dark theme background colors - using softer colors instead of full black
        dark: {
          bg: {
            primary: '#1a1a1a',
            secondary: '#2a2a2a',
            tertiary: '#3a3a3a',
            quaternary: '#4a4a4a',
          },
          text: {
            primary: '#f0f0f0',
            secondary: '#d0d0d0',
            tertiary: '#a0a0a0',
            quaternary: '#808080',
          },
          border: {
            primary: '#4a4a4a',
            secondary: '#5a5a5a',
            tertiary: '#6a6a6a',
          },
          accent: {
            orange: '#f97316',
            orangeHover: '#ea580c',
            orangeLight: '#fed7aa',
          }
        },
        // Light theme adjustments for orange accent
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#fafafa',
            tertiary: '#f5f5f5',
            quaternary: '#e5e5e5',
          },
          text: {
            primary: '#0a0a0a',
            secondary: '#171717',
            tertiary: '#404040',
            quaternary: '#737373',
          },
          border: {
            primary: '#e5e5e5',
            secondary: '#d4d4d4',
            tertiary: '#a3a3a3',
          },
          accent: {
            orange: '#ea580c',
            orangeHover: '#dc2626',
            orangeLight: '#fed7aa',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}