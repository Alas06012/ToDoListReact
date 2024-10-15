/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary" : "#121212",
        "secundary" : "#3f5f95",
        "third" : "#01a383",
        "fourth": "#e73d18",
        "fifth" : "#482262",
        "custom-gray": "#292929"
      }
    },
  },
  plugins: [],
}

