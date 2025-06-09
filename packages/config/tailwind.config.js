/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Mobile-first breakpoints with better xs handling
    screens: {
      xs: "475px", // Extra small devices
      sm: "640px", // Small devices
      md: "768px", // Medium devices
      lg: "1024px", // Large devices
      xl: "1280px", // Extra large devices
      "2xl": "1536px", // 2X large devices
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Refined neutral palette - modern and sophisticated
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Sophisticated primary - subtle and elegant
        primary: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c", // Main primary - sophisticated stone
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        // Very subtle accent - barely noticeable for special cases
        accent: {
          50: "#fefcf8",
          100: "#fef7ed",
          200: "#feeddb",
          300: "#fddfb8",
          400: "#fbc985",
          500: "#f59e0b", // Very muted warm accent - use sparingly
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Minimal semantic colors - very subtle when needed
        semantic: {
          success: "#404040", // Dark gray instead of green
          warning: "#525252", // Medium gray instead of yellow
          danger: "#262626", // Very dark gray instead of red
          info: "#737373", // Medium gray instead of blue
        },
      },
      // Mobile-friendly max-width utilities
      maxWidth: {
        xs: "20rem", // 320px
        sm: "24rem", // 384px
        md: "28rem", // 448px
        lg: "32rem", // 512px
        xl: "36rem", // 576px
        "2xl": "42rem", // 672px
        "3xl": "48rem", // 768px
        "4xl": "56rem", // 896px
        "5xl": "64rem", // 1024px
        "6xl": "72rem", // 1152px
        "7xl": "80rem", // 1280px
        // Mobile-specific sizes
        "mobile-xs": "16rem", // 256px - very small modals
        "mobile-sm": "18rem", // 288px - small modals
        "mobile-md": "20rem", // 320px - medium modals
      },
      // Minimal border radius - very clean
      borderRadius: {
        none: "0px",
        sm: "0px", // No rounding for modern look
        DEFAULT: "0px", // Sharp edges
        md: "2px", // Very minimal
        lg: "4px", // Slightly rounded for cards
        xl: "6px", // For special elements
        "2xl": "8px", // For modals
        "3xl": "12px", // Rare use
        full: "9999px", // Keep for pills/avatars
      },
      // Refined animations - subtle and purposeful
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        shimmer: "shimmer 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      // Subtle, modern shadows
      boxShadow: {
        minimal: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        soft: "0 4px 20px 0 rgba(0, 0, 0, 0.08)",
        elegant: "0 8px 40px 0 rgba(0, 0, 0, 0.12)",
        crisp: "0 2px 8px 0 rgba(0, 0, 0, 0.1)",
      },
      // Modern spacing scale
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      // Typography scale
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      // Letter spacing
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      // Line height
      lineHeight: {
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
      },
      // Modern gradients - very subtle
      backgroundImage: {
        "gradient-minimal": "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        "gradient-subtle": "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      },
      // Backdrop blur
      backdropBlur: {
        xs: "2px",
      },
      // Modern transitions
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "out-circ": "cubic-bezier(0.08, 0.82, 0.17, 1)",
        "in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
    },
  },
  plugins: [],
};
