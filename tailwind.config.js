/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cream: { DEFAULT: '#FAF6F0', dark: '#F0E9DC' },
        green: { DEFAULT: '#4A7C59', light: '#E8F0EB', mid: '#6B9E7A' },
        gold: { DEFAULT: '#C9963A', light: '#F5E9D3' },
        charcoal: { DEFAULT: '#2C2C2C', deep: '#1A1A1A' },
        'warm-gray': { DEFAULT: '#6E6860', 2: '#9C9188' },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        afacad: ['Afacad Flux', 'sans-serif'],
        'momo-trust': ['Momo Trust Display', 'sans-serif'],
      },
      borderRadius: {
        sharp: '4px',
      },
    },
  },
  plugins: [],
}
