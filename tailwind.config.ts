import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        preto: {
          DEFAULT: "#0B0B0C",
          soft: "#17171A",
        },
        dourado: {
          DEFAULT: "#B8912F",
          bright: "#D4AF37",
          dim: "#8A6D24",
        },
        osso: "#F7F5F0",
        texto: "#1C1C1C",
        grafite: "#6B6B6B",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
