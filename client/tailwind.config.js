/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        weather: {
          background: "#080f1d",
          panel: "#111d30",
          card: "#172438",
          accent: "#ffa52f",
          muted: "#91a5bf",
          border: "#293a52"
        }
      }
    }
  },
  plugins: []
};
