/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      // Mirrors the custom properties in `index.css` — see the theme note there.
      colors: {
        ink: "#03060F",
        abyss: "#01030A",
        surface: "#070C1A",
        hairline: "rgba(96,165,250,0.13)",
        brand: {
          royal: "#1D4ED8",
          deep: "#2563EB",
          blue: "#3B82F6",
          soft: "#60A5FA",
          sky: "#38BDF8",
          skysoft: "#7DD3FC",
          cyan: "#22D3EE",
          ice: "#A5F3FC",
          green: "#34D399",
          amber: "#F59E0B",
        },
        ink0: "#E9F1FF",
        ink1: "#8FA8C8",
        ink2: "#607E9E",
        ink3: "#2E4560",
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
