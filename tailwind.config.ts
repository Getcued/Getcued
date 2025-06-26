import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

const config: Config = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        pink: {
          500: "#FF1493", // hot pink
        },
        orange: {
          400: "#FF8C00", // orange
        },
        yellow: {
          400: "#FFD700", // gold
        },
        blue: {
          500: "#1E90FF", // blue
        },
        purple: {
          500: "#9370DB", // purple
        },
      },
      keyframes: {
        ...defaultConfig.theme.extend.keyframes,
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        ...defaultConfig.theme.extend.animation,
        "gradient-flow": "gradient-flow 8s ease infinite",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}

export default config
