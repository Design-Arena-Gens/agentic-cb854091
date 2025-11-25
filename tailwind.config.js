/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fashion: {
          primary: '#FF6B9D',
          secondary: '#C44569',
          accent: '#FFC312',
          dark: '#2C3A47',
          light: '#F8F9FA',
        }
      }
    },
  },
  plugins: [],
}
