import React, { ButtonHTMLAttributes, forwardRef, ElementType } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "minimal" | "text";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: ElementType;
  to?: string;
  href?: string;
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
    const baseClasses = `
      inline-flex items-center justify-center font-medium cursor-pointer
      transition-all duration-300 focus:outline-none focus:ring-1 
      disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
      border-transparent
    `;

    const variantClasses = {
      primary: `
        bg-neutral-900 text-white hover:bg-neutral-800 
        focus:ring-neutral-900 shadow-minimal hover:shadow-soft
      `,
      secondary: `
        bg-white text-neutral-900 border-neutral-200 
        hover:border-neutral-300 hover:bg-neutral-50
        focus:ring-neutral-900 shadow-minimal hover:shadow-soft
      `,
      outline: `
        bg-transparent text-neutral-900 border-neutral-900 
        hover:bg-neutral-900 hover:text-white
        focus:ring-neutral-900
      `,
      ghost: `
        bg-transparent text-neutral-600 hover:bg-neutral-100 
        hover:text-neutral-900 focus:ring-neutral-900 border-none
      `,
      minimal: `
        bg-transparent text-neutral-600 hover:text-neutral-900
        focus:ring-neutral-900 border-none
      `,
      text: `
        bg-transparent text-neutral-600 hover:text-neutral-900
        focus:ring-neutral-900 border-none p-0 h-auto
      `,
    };

    const sizeClasses = {
      xs: "px-0 py-1 text-xs h-4",
      sm: "px-4 py-2 text-sm h-9",
      md: "px-6 py-3 text-sm h-11",
      lg: "px-8 py-4 text-base h-13",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes = `
      ${baseClasses} 
      ${variantClasses[variant]} 
      ${variant !== "text" ? sizeClasses[size] : ""}
      ${widthClass} 
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <Component
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2
              size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
              className="animate-spin"
            />
          </div>
        )}

        {/* Content wrapper - hidden when loading */}
        <div
          className={`flex items-center justify-center ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {leftIcon && !isLoading && (
            <span className="mr-2 flex-shrink-0">{leftIcon}</span>
          )}

          {children && <span className="truncate">{children}</span>}

          {rightIcon && !isLoading && (
            <span className="ml-2 flex-shrink-0">{rightIcon}</span>
          )}
        </div>

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100" />
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
