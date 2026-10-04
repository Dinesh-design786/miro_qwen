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
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        miro: {
          yellow: "#FFD02F",
          dark: "#050038",
          blue: "#2B56F5",
        },
        qwen: {
          purple: "#7C3AED",
          cyan: "#06B6D4",
          gradient: "linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #06B6D4 100%)",
        },
        critique: {
          red: "#EF4444",
          amber: "#F59E0B",
          emerald: "#10B981",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2.5s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        glow: {
          from: { boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" },
          to: { boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)" },
        }
      }
    },
  },
  plugins: [],
};
