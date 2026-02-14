/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  
theme: {
    extend: {
      colors: {
        silk: {
          maroon: "#7a1f2a",
          gold: "#c6a34f",
        },
      },
    },
  },
  plugins: [],
}
