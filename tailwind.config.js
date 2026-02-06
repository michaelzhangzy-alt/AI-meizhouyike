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
          DEFAULT: "#2563EB", // Standard Professional Blue
          hover: "#1D4ED8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F8FAFC", // Slate 50
          foreground: "#0F172A", // Slate 900
        },
        accent: {
          DEFAULT: "#3B82F6", // Lighter Blue
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#0F172A", // Slate 900
        muted: {
          DEFAULT: "#F1F5F9", // Slate 100
          foreground: "#64748B", // Slate 500
        },
        border: "#E2E8F0", // Slate 200
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        'subtle-grid': 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
