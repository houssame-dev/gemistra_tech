import type { Config } from "tailwindcss";
import { colors, gradients } from "./lib/tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        surface: colors.surface,
        elevated: colors.elevated,
        border: colors.border,
        "border-hover": colors.borderHover,
        violet: {
          DEFAULT: colors.violet,
          dim: colors.violetDim,
          soft: colors.violetSoft,
        },
        teal: {
          DEFAULT: colors.teal,
          soft: colors.tealSoft,
        },
        ink: {
          DEFAULT: colors.ink,
          secondary: colors.inkSecondary,
          muted: colors.inkMuted,
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "facet-glow": gradients.facetGlow,
      },
      maxWidth: {
        content: "1180px",
      },
      width: {
        "team-card": "280px",
      },
    },
  },
  plugins: [],
};
export default config;
