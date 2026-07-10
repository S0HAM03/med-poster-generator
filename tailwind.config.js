/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /bg-(amber|orange|indigo)-(50|400)/ },
    { pattern: /border-(amber|orange|indigo)-(200|300|400)/ },
    { pattern: /text-(amber|orange|indigo)-(400|950)/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['1.125rem', '1.75'],
        lg: ['1.25rem', '1.75'],
        xl: ['1.5rem', '1.75'],
        '2xl': ['1.875rem', '1.5'],
        '3xl': ['2.25rem', '1.5'],
        '4xl': ['3rem', '1.3'],
      },
      colors: {
        amber: {
          50: '#fffbeb',
          400: '#fbbf24',
          950: '#451a03',
        },
        orange: {
          50: '#fff7ed',
          400: '#fb923c',
          950: '#431407',
        },
        indigo: {
          50: '#eef2ff',
          400: '#818cf8',
          950: '#1e1b4b',
        },
        rose: {
          50: '#fff1f2',
          400: '#fb7185',
          950: '#4c0519',
        }
      }
    },
  },
  plugins: [],
}
