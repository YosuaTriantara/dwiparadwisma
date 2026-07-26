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
        "primary-dark": "#00432F",
        "accent-red": "#B3363C",
        "accent-orange": "#F39A2E",
        ink: "#121C2A",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
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
