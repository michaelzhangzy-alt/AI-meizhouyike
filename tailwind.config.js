/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB", // blue-600
          hover: "#1D4ED8",   // blue-700
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6", // gray-100
          foreground: "#111827", // gray-900
        },
        accent: {
          DEFAULT: "#F59E0B", // amber-500
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#111827", // gray-900
        muted: {
          DEFAULT: "#F9FAFB", // gray-50
          foreground: "#6B7280", // gray-500
        },
        border: "#E5E7EB", // gray-200
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
    },
  },
  plugins: [],
};
