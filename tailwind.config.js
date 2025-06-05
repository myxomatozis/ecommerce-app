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
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899", // Main primary - rose/pink
          600: "#db2777", // Deeper rose
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        // Warm accent colors
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15", // Bright warm yellow
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        // Warm success - coral red
        success: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Bright warm red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
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
