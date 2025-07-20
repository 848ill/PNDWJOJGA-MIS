import type { Config } from 'tailwindcss'

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          },
          "33%": {
            transform: "translate(80px, -100px) scale(1.2) rotate(60deg)",
          },
          "66%": {
            transform: "translate(-50px, 70px) scale(0.9) rotate(-30deg)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          },
        },
        blob2: {
          "0%": {
            transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          },
          "50%": {
            transform: "translate(-60px, 80px) scale(1.3) rotate(-45deg)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        "collapsible-up": {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: "0" },
        },
        "slide-down-and-fade": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up-and-fade": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-4px)" },
        },
        "fade-in-up": {
            "0%": { opacity: "0", transform: "translateY(10px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blob: "blob 12s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        blob2: "blob2 15s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "slide-down-and-fade": "slide-down-and-fade 0.3s ease-in-out",
        "slide-up-and-fade": "slide-up-and-fade 0.3s ease-in-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config 