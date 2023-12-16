/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: "#ececf4",
        "hover-gray": "#f1f0ff",
        purple: "#6965db",
        "hover-purple": "#5b57d1",
      },
    },
  },
  plugins: [],
};
