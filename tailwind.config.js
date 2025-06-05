/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Bright warm primary - coral/orange
        primary: {
          50: "#faf7f4",
          100: "#f4ede6",
          200: "#e7d6c7",
          300: "#d6b8a1",
          400: "#c49577",
          500: "#b67c5a", // Main primary - sophisticated terracotta
          600: "#a66a4a", // Deeper warm brown
          700: "#8b5a3f",
          800: "#704a37",
          900: "#5c3d2e",
        },
        // Muted warm accent colors
        accent: {
          50: "#fefdf8",
          100: "#fefaf0",
          200: "#fcf3d9",
          300: "#f9e8b8",
          400: "#f4d888", // Muted warm gold
          500: "#e6c564",
          600: "#d4b146",
          700: "#b8973a",
          800: "#967a32",
          900: "#7a632c",
        },
        // Sophisticated warm success - muted green
        success: {
          50: "#f7faf8",
          100: "#eef5f0",
          200: "#d6e7dc",
          300: "#b5d3c1",
          400: "#8db89f",
          500: "#6b9d81", // Sophisticated warm green
          600: "#578468",
          700: "#486d56",
          800: "#3c5847",
          900: "#33493c",
        },
        // Keep some cooler tones for balance
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Luxury gold for special elements
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Rich gold
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Warning - bright amber
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Info - keep blue but warmer
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      // Sharp, minimal border radius for posh look
      borderRadius: {
        none: "0px",
        sm: "1px", // Very sharp
        DEFAULT: "2px", // Sharp
        md: "4px", // Slightly rounded
        lg: "6px", // Less rounded than default
        xl: "8px", // Still sharp but elegant
        "2xl": "12px", // For cards
        "3xl": "16px", // For modals
        full: "9999px", // Keep for pills/avatars
      },
      // Enhanced animations for posh feel
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(249, 115, 22, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      // Enhanced shadows for depth
      boxShadow: {
        warm: "0 4px 14px 0 rgba(249, 115, 22, 0.1)",
        "warm-lg":
          "0 10px 25px -3px rgba(249, 115, 22, 0.1), 0 4px 6px -2px rgba(249, 115, 22, 0.05)",
        glow: "0 0 20px rgba(249, 115, 22, 0.3)",
        "glow-lg": "0 0 40px rgba(249, 115, 22, 0.4)",
        sharp: "0 2px 8px 0 rgba(0, 0, 0, 0.12)",
        "sharp-lg": "0 4px 16px 0 rgba(0, 0, 0, 0.12)",
      },
      // Warm gradients
      backgroundImage: {
        "warm-gradient":
          "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
        "sunset-gradient":
          "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
    },
  },
  plugins: [],
};
