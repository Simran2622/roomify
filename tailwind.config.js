/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#262522",
        sand: "#F6F3EE",
        stone: "#E8E3DA",
        accent: "#8B6F47",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(38, 37, 34, 0.08)",
      },
    },
  },
  plugins: [],
};
