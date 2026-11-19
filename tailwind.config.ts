import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#38a5f6",
          500: "#0e87eb",
          600: "#026ac8",
          700: "#0354a1",
          800: "#074785",
          900: "#0c3b6e",
          950: "#082548",
        },
        academic: {
          teal: "#0f766e",
          amber: "#d97706",
          navy: "#1e293b",
          emerald: "#059669",
          rose: "#e11d48",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
