import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F5B45",
        "primary-dark": "#005500",
        "accent-red": "#550000",
        "accent-orange": "#FFAA00",
        ink: "#121C2A",
        // Token warna khusus halaman LKBB Bramasta 4.0 (Vintage Newspaper)
        paper: {
          DEFAULT: "#D9D3A1",
          light: "#E6E1BC",
          dark: "#C9C28A",
          deep: "#B5AD73",
        },
        "bramasta-ink": {
          DEFAULT: "#141210",
          soft: "#3A362B",
          mute: "#6B6548",
        },
        sepia: {
          1: "#8A7B5C",
          2: "#4A402E",
        },
        "bramasta-accent": {
          DEFAULT: "#0F5257",
          hover: "#0B3F43",
          soft: "#CFE0D2",
          on: "#F4F1DC",
        },
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        masthead: ["var(--font-blackletter)", "serif"],
        bodoni: ["var(--font-bodoni)", "serif"],
      },
      maxWidth: {
        content: "1152px",
      },
      letterSpacing: {
        "extra-wide": "0.2em",
        "ultra-wide": "0.3em",
        "mega-wide": "0.4em",
      },
    },
  },
  plugins: [],
};

export default config;
