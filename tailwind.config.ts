import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.25)",
        card: "0 20px 80px rgba(2, 6, 23, 0.75)",
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.08), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
