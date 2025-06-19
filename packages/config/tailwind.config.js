/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        // TOTEME Sans - actual font from website
        sans: [
          "TOTEME Sans",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
        // Brand display font
        display: ["TOTEME Sans", "Helvetica Neue", "system-ui", "sans-serif"],
      },
      colors: {
        // TOTEME inspired ultra-minimal palette
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c", // Primary brand color
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        // Warm off-whites like TOTEME
        cream: {
          50: "#fefefe",
          100: "#fefefe",
          200: "#fdfdfc",
          300: "#fbfbf9",
          400: "#f8f8f6",
          500: "#f5f5f2",
          600: "#e8e8e5",
          700: "#d6d3d1",
        },
        // Desert tones for leather/accent elements
        sand: {
          50: "#faf9f7",
          100: "#f4f3f0",
          200: "#e9e6e0",
          300: "#ddd8d0",
          400: "#c4bdb1",
          500: "#ab9f8f",
          600: "#8b7d6b",
          700: "#6b5d4f",
        },
        // Minimal accent - use sparingly
        accent: {
          50: "#fefcf8",
          100: "#fef7ed",
          200: "#feeddb",
          300: "#fddfb8",
          400: "#fbc985",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Semantic colors using stone palette
        semantic: {
          success: "#44403c",
          warning: "#57534e",
          danger: "#292524",
          info: "#78716c",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        50: "12.5rem",
      },
      maxWidth: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        "mobile-xs": "16rem",
        "mobile-sm": "18rem",
        "mobile-md": "20rem",
      },
      // Sharp edges like TOTEME's aesthetic
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "1px",
        lg: "2px",
        xl: "3px",
        "2xl": "4px",
        "3xl": "6px",
        full: "9999px",
      },
      // TOTEME Sans inspired typography
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        sm: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.6", letterSpacing: "0.005em" }],
        "2xl": ["1.5rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "3xl": ["1.875rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "4xl": ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.045em" }],
      },
      // Wide spacing for brand headers like TOTEME
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        "ultra-wide": "0.15em",
        "mega-wide": "0.25em", // For "THE FOLK" style headers
      },
      lineHeight: {
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
      },
      backgroundImage: {
        "gradient-minimal": "linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)",
        "gradient-subtle": "linear-gradient(135deg, #ffffff 0%, #fafaf9 100%)",
        "gradient-warm": "linear-gradient(135deg, #fefefe 0%, #f5f5f2 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      },
      // Subtle shadows using stone colors
      boxShadow: {
        xs: "0 1px 2px 0 rgba(28, 25, 23, 0.02)",
        sm: "0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.04)",
        DEFAULT:
          "0 4px 6px -1px rgba(28, 25, 23, 0.05), 0 2px 4px -2px rgba(28, 25, 23, 0.05)",
        md: "0 10px 15px -3px rgba(28, 25, 23, 0.05), 0 4px 6px -4px rgba(28, 25, 23, 0.05)",
        lg: "0 20px 25px -5px rgba(28, 25, 23, 0.05), 0 8px 10px -6px rgba(28, 25, 23, 0.05)",
        xl: "0 25px 50px -12px rgba(28, 25, 23, 0.08)",
        "2xl": "0 25px 50px -12px rgba(28, 25, 23, 0.1)",
        inner: "inset 0 2px 4px 0 rgba(28, 25, 23, 0.02)",
        none: "none",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)", // Luxury easing
        "out-circ": "cubic-bezier(0.08, 0.82, 0.17, 1)",
        "in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        elegant: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.19, 1, 0.22, 1)",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
        float: "float 3s ease-in-out infinite",
      },
      // Product image ratios like TOTEME
      aspectRatio: {
        "4/5": "4 / 5",
        "3/4": "3 / 4",
        "5/6": "5 / 6",
      },
    },
  },
  plugins: [],
};
