/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          300: '#fde047',
          400: '#f5c518',  // Batman yellow
          500: '#e6b800',
          600: '#cc9f00',
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        raj:   ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        bat: '0 0 20px rgba(245, 197, 24, 0.3), 0 0 40px rgba(245, 197, 24, 0.1)',
      },
    },
  },
  plugins: [],
}
