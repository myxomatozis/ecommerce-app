import plugin from "tailwindcss/plugin";

/**
 * The Folk UI Components Plugin
 * Adds utility classes for common component patterns
 */
export const folkComponentsPlugin = plugin(function ({
  addBase,
  addComponents,
  addUtilities,
  theme,
}) {
  // Base styles
  addBase({
    // Custom scrollbar
    "::-webkit-scrollbar": {
      width: theme("spacing.2"),
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: theme("colors.gray.100"),
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: theme("colors.gray.300"),
      borderRadius: theme("borderRadius.full"),
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: theme("colors.gray.400"),
    },
  });

  // Component styles
  addComponents({
    // Focus ring utility
    ".folk-focus-ring": {
      "&:focus": {
        outline: "none",
        boxShadow: `0 0 0 2px ${theme("colors.folk.500")}, 0 0 0 4px ${theme(
          "colors.folk.200"
        )}`,
      },
    },

    // Transition utility
    ".folk-transition": {
      transitionProperty: "all",
      transitionDuration: theme("transitionDuration.200"),
      transitionTimingFunction: theme("transitionTimingFunction.out"),
    },

    // Button base
    ".folk-btn-base": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
      fontSize: theme("fontSize.sm[0]"),
      fontWeight: theme("fontWeight.medium"),
      borderRadius: theme("borderRadius.lg"),
      transitionProperty: "all",
      transitionDuration: theme("transitionDuration.200"),
      transitionTimingFunction: theme("transitionTimingFunction.out"),
      "&:focus": {
        outline: "none",
        boxShadow: `0 0 0 2px ${theme("colors.folk.500")}, 0 0 0 4px ${theme(
          "colors.folk.200"
        )}`,
      },
      "&:disabled": {
        opacity: theme("opacity.50"),
        cursor: "not-allowed",
      },
    },

    // Button variants
    ".folk-btn-primary": {
      backgroundColor: theme("colors.folk.900"),
      color: theme("colors.white"),
      "&:hover:not(:disabled)": {
        backgroundColor: theme("colors.folk.800"),
      },
      "&:active:not(:disabled)": {
        backgroundColor: theme("colors.folk.700"),
      },
    },

    ".folk-btn-secondary": {
      backgroundColor: theme("colors.folk.100"),
      color: theme("colors.folk.900"),
      "&:hover:not(:disabled)": {
        backgroundColor: theme("colors.folk.200"),
      },
      "&:active:not(:disabled)": {
        backgroundColor: theme("colors.folk.300"),
      },
    },

    ".folk-btn-outline": {
      borderWidth: theme("borderWidth.DEFAULT"),
      borderColor: theme("colors.folk.300"),
      color: theme("colors.folk.700"),
      backgroundColor: "transparent",
      "&:hover:not(:disabled)": {
        backgroundColor: theme("colors.folk.50"),
      },
      "&:active:not(:disabled)": {
        backgroundColor: theme("colors.folk.100"),
      },
    },

    ".folk-btn-ghost": {
      color: theme("colors.folk.700"),
      backgroundColor: "transparent",
      "&:hover:not(:disabled)": {
        backgroundColor: theme("colors.folk.100"),
      },
      "&:active:not(:disabled)": {
        backgroundColor: theme("colors.folk.200"),
      },
    },

    // Input styles
    ".folk-input": {
      width: "100%",
      padding: `${theme("spacing.2")} ${theme("spacing.3")}`,
      borderWidth: theme("borderWidth.DEFAULT"),
      borderColor: theme("colors.folk.300"),
      borderRadius: theme("borderRadius.lg"),
      backgroundColor: theme("colors.white"),
      fontSize: theme("fontSize.sm[0]"),
      transitionProperty: "border-color, box-shadow",
      transitionDuration: theme("transitionDuration.200"),
      transitionTimingFunction: theme("transitionTimingFunction.out"),
      "&::placeholder": {
        color: theme("colors.folk.400"),
      },
      "&:focus": {
        outline: "none",
        borderColor: theme("colors.folk.500"),
        boxShadow: `0 0 0 2px ${theme("colors.folk.200")}`,
      },
      "&:disabled": {
        backgroundColor: theme("colors.gray.50"),
        cursor: "not-allowed",
      },
    },

    // Card styles
    ".folk-card": {
      backgroundColor: theme("colors.white"),
      borderRadius: theme("borderRadius.xl"),
      borderWidth: theme("borderWidth.DEFAULT"),
      borderColor: theme("colors.folk.200"),
      boxShadow: theme("boxShadow.sm"),
      padding: theme("spacing.6"),
    },

    ".folk-card-hover": {
      transitionProperty: "box-shadow, transform",
      transitionDuration: theme("transitionDuration.200"),
      transitionTimingFunction: theme("transitionTimingFunction.out"),
      "&:hover": {
        boxShadow: theme("boxShadow.md"),
        transform: "translateY(-2px)",
      },
    },

    // Badge styles
    ".folk-badge": {
      display: "inline-flex",
      alignItems: "center",
      padding: `${theme("spacing.1")} ${theme("spacing.2")}`,
      fontSize: theme("fontSize.xs[0]"),
      fontWeight: theme("fontWeight.medium"),
      borderRadius: theme("borderRadius.full"),
    },

    ".folk-badge-primary": {
      backgroundColor: theme("colors.folk.100"),
      color: theme("colors.folk.800"),
    },

    ".folk-badge-success": {
      backgroundColor: theme("colors.green.100"),
      color: theme("colors.green.800"),
    },

    ".folk-badge-warning": {
      backgroundColor: theme("colors.yellow.100"),
      color: theme("colors.yellow.800"),
    },

    ".folk-badge-error": {
      backgroundColor: theme("colors.red.100"),
      color: theme("colors.red.800"),
    },
  });

  // Utility classes
  addUtilities({
    // Glass effect
    ".folk-glass": {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(255, 255, 255, 0.2)",
    },

    // Text gradients
    ".folk-text-gradient": {
      background: `linear-gradient(135deg, ${theme(
        "colors.folk.900"
      )} 0%, ${theme("colors.folk.600")} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },

    // Animations
    ".folk-animate-fade-in": {
      animation: "fadeIn 0.2s ease-in-out",
    },

    ".folk-animate-slide-up": {
      animation: "slideUp 0.3s ease-out",
    },

    ".folk-animate-scale-in": {
      animation: "scaleIn 0.2s ease-out",
    },

    // Loading state
    ".folk-loading": {
      position: "relative",
      color: "transparent",
      pointerEvents: "none",
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: theme("spacing.4"),
        height: theme("spacing.4"),
        marginTop: `-${theme("spacing.2")}`,
        marginLeft: `-${theme("spacing.2")}`,
        border: `2px solid ${theme("colors.gray.300")}`,
        borderTopColor: theme("colors.folk.500"),
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      },
    },
  });
});

export default folkComponentsPlugin;
