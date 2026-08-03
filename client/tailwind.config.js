/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#060A12",
        surface: "#0D1117",
        hairline: "rgba(255,255,255,0.07)",
        brand: {
          blue: "#60A5FA",
          deep: "#2563EB",
          cyan: "#22D3EE",
          green: "#34D399",
          violet: "#7C3AED",
          amber: "#F59E0B",
        },
        ink0: "#F1F5F9",
        ink1: "#94A3B8",
        ink2: "#64748B",
        ink3: "#334155",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      screens: {
        xs: "420px",
      },
      maxWidth: {
        shell: "1200px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
