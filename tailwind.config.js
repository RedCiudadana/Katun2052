/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        euclid: ['Euclid Circular A', 'Arial', 'sans-serif'],
      },
      colors: {
        blue: {
          800: '#71aae2',
          500: 'rgba(113, 170, 226, 0.2)',
        },
        gray: {
          50: '#e4e8ed'
        }
      },
    },
  },
  plugins: [],
};