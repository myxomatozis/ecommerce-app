import React, { ButtonHTMLAttributes, forwardRef, ElementType } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "gold"
    | "premium";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: ElementType;
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      as: Component = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0";

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-warm hover:shadow-warm-lg",
      secondary:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 shadow-sharp hover:shadow-sharp-lg border border-gray-300",
      outline:
        "border-2 border-primary-500 text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-orange-50 focus:ring-primary-500 hover:border-primary-600",
      ghost:
        "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-primary-50 hover:text-primary-700 focus:ring-primary-500",
      danger:
        "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-warm hover:shadow-warm-lg",
      gold: "bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:from-gold-500 hover:to-gold-600 focus:ring-gold-500 shadow-warm hover:shadow-glow",
      premium:
        "bg-gradient-to-r from-gold-400 via-primary-500 to-gold-400 text-white hover:from-gold-500 hover:via-primary-600 hover:to-gold-500 focus:ring-primary-500 shadow-glow hover:shadow-glow-lg relative overflow-hidden",
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-4 text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";

    // Add shimmer effect for premium variant
    const shimmerClass =
      variant === "premium"
        ? "before:absolute before:inset-0 before:bg-shimmer-gradient before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
        : "";

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${shimmerClass} ${className}`;

    return (
      <Component
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}

        <span className="relative z-10">{children}</span>

        {rightIcon && !isLoading && (
          <span className="ml-2 relative z-10">{rightIcon}</span>
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
