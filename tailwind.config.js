/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        studio: {
          950: "#080808",
          900: "#0B0B0B",
          850: "#101010",
          800: "#121212",
          700: "#151515",
          600: "#1A1A1A",
          500: "#222222",
          400: "#333333",
          border: "rgba(255, 255, 255, 0.08)",
          "border-subtle": "rgba(255, 255, 255, 0.04)",
          "border-active": "rgba(255, 77, 0, 0.4)",
        },
        flame: {
          DEFAULT: "#FF4D00",
          light: "#FF6A00",
          intense: "#FF2D00",
          dark: "#B82E00",
          50: "#FFF5F0",
          100: "#FFE6D9",
          400: "#FF6A00",
          500: "#FF4D00",
          600: "#FF2D00",
          700: "#CC2700",
        },
        miro: {
          yellow: "#FFD02F",
          dark: "#050038",
        },
      },
      fontFamily: {
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        editorial: "-0.04em",
        tightest: "-0.06em",
        widest: "0.2em",
      },
      boxShadow: {
        flame: "0 0 35px -5px rgba(255, 77, 0, 0.35)",
        "flame-lg": "0 0 60px -10px rgba(255, 77, 0, 0.45)",
        "flame-sm": "0 0 15px -3px rgba(255, 77, 0, 0.3)",
        card: "0 8px 30px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-flame": "glowFlame 3s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glowFlame: {
          from: { boxShadow: "0 0 20px rgba(255, 77, 0, 0.15)" },
          to: { boxShadow: "0 0 45px rgba(255, 77, 0, 0.35)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
