/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#000537",
          default: "#112CA3",
          light: "#16294E",
          accent: "#0464ED",
          muted: "#3F4661",
        },
        accent: {
          gold: "#EBC359",
          yellow: "#FFC324",
          cyan: "#10FAF8",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-stat-1": "linear-gradient(65.02deg, #16294E 2.2%, #0464ED 97.07%)",
        "gradient-stat-2": "linear-gradient(65.02deg, rgba(20, 35, 61, 0.65) 2.2%, #112CA3 97.07%)",
        "gradient-stat-3": "linear-gradient(242.81deg, #112CA3 2.68%, #000537 97.74%)",
        "gradient-login":
          "linear-gradient(135deg, #000537 0%, #112CA3 50%, #16294E 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
