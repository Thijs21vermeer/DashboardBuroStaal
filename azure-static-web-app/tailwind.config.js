/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#280bc4',
        accent: '#7ef769',
        dark: '#000000',
      },
    },
  },
  plugins: [],
}
