/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan these files for Tailwind classes
    "./public/index.html"
  ],
  darkMode: 'class', // Enables class-based dark mode (used in your code)
  theme: {
    extend: {},
  },
  plugins: [],
}
