/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#dbe6f3',
          200: '#bad0e8',
          300: '#8eb3d9',
          400: '#5c92c5',
          500: '#3875b2',
          600: '#275c96',
          700: '#1f4a7a',
          800: '#1a3e66',
          900: '#0f2646',
          950: '#09182d',
        },
        pec: {
          navy: '#0b2545',
          darkBlue: '#133e6f',
          blue: '#1d5fa7',
          lightBlue: '#2e7dd1',
          sky: '#eef5fc',
          surface: '#ffffff',
          card: '#fcfdfd',
          border: '#e2e8f0',
          borderSubtle: '#edf2f7',
          gold: '#c27803',
          goldLight: '#fef3c7',
          silver: '#475569',
          silverLight: '#f1f5f9',
          bronze: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 38, 70, 0.05), 0 1px 2px -1px rgba(15, 38, 70, 0.03)',
        'card': '0 2px 8px -1px rgba(15, 38, 70, 0.06), 0 1px 4px -1px rgba(15, 38, 70, 0.04)',
        'elevated': '0 10px 25px -5px rgba(15, 38, 70, 0.08), 0 8px 10px -6px rgba(15, 38, 70, 0.04)',
      }
    },
  },
  plugins: [],
}
