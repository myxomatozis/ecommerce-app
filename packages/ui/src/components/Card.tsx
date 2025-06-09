import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "outlined"
    | "minimal"
    | "elevated"
    | "interactive"
    | "brutalist";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  border?: "none" | "subtle" | "visible" | "bold";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  border = "subtle",
  ...props
}) => {
  // Base classes following 2025 minimalist principles
  const baseClasses = clsx(
    "bg-white transition-all duration-500 relative overflow-hidden",
    "group" // Enable group hover states
  );

  // Modern variant classes embracing 2025 trends
  const variantClasses = {
    default: clsx("shadow-sm border border-neutral-100", "hover:shadow-md"),
    outlined: clsx("border border-neutral-200", "hover:border-neutral-300"),
    minimal: clsx("border-none shadow-none", "hover:bg-neutral-50/50"),
    elevated: clsx(
      "shadow-lg border border-neutral-50",
      "hover:shadow-xl hover:shadow-neutral-200/20"
    ),
    interactive: clsx(
      "border border-neutral-200 shadow-sm cursor-pointer",
      "hover:shadow-lg hover:border-neutral-300",
      "hover:-translate-y-0.5", // Subtle lift effect
      "active:translate-y-0 active:shadow-md"
    ),
    brutalist: clsx(
      "border-2 border-neutral-900 shadow-none",
      "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      "transition-all duration-200"
    ),
  };

  // Border configuration
  const borderClasses = {
    none: "border-none",
    subtle: "border border-neutral-100",
    visible: "border border-neutral-200",
    bold: "border-2 border-neutral-900",
  };

  // Padding classes with modern spacing
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12", // Extra large for hero sections
  };

  // Hover effects
  const hoverClasses = hover
    ? clsx(
        "cursor-pointer",
        "hover:shadow-lg hover:border-neutral-300",
        "hover:-translate-y-0.5 transition-transform"
      )
    : "";

  // Combine all classes
  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    variant !== "brutalist" && borderClasses[border], // Override border for brutalist
    paddingClasses[padding],
    hoverClasses,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}

      {/* Subtle shine effect on hover - modern micro-interaction */}
      {(hover || variant === "interactive") && (
        <div
          className={clsx(
            "absolute inset-0 opacity-0 group-hover:opacity-100",
            "bg-gradient-to-r from-transparent via-white/5 to-transparent",
            "-translate-x-full group-hover:translate-x-full",
            "transition-all duration-700 pointer-events-none"
          )}
        />
      )}
    </div>
  );
};

// Card subcomponents with modern 2025 typography
export const CardHeader: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    spacing?: "tight" | "normal" | "loose";
  }
> = ({ children, className = "", spacing = "normal", ...props }) => {
  const spacingClasses = {
    tight: "mb-3",
    normal: "mb-6",
    loose: "mb-8",
  };

  return (
    <div className={clsx(spacingClasses[spacing], className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<
  HTMLAttributes<HTMLHeadingElement> & {
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    weight?: "light" | "normal" | "medium" | "semibold";
  }
> = ({
  children,
  className = "",
  size = "md",
  weight = "medium",
  ...props
}) => {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };

  return (
    <h3
      className={clsx(
        "text-neutral-900 tracking-tight leading-tight",
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<
  HTMLAttributes<HTMLParagraphElement> & {
    muted?: boolean;
    size?: "sm" | "md" | "lg";
  }
> = ({ children, className = "", muted = false, size = "md", ...props }) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <p
      className={clsx(
        "leading-relaxed",
        muted ? "text-neutral-500" : "text-neutral-600",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    spacing?: "tight" | "normal" | "loose";
  }
> = ({
  children,
  className = "",
  padding = "none", // Let parent card handle padding by default
  spacing = "normal",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  };

  const spacingClasses = {
    tight: "space-y-3",
    normal: "space-y-4",
    loose: "space-y-6",
  };

  return (
    <div
      className={clsx(
        paddingClasses[padding],
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "minimal" | "bordered";
    justify?: "start" | "center" | "end" | "between";
  }
> = ({
  children,
  className = "",
  variant = "default",
  justify = "end",
  ...props
}) => {
  const variantClasses = {
    default: "border-t border-neutral-100 bg-neutral-50/30 mt-6 pt-4",
    minimal: "mt-6 pt-4",
    bordered: "border-t border-neutral-200 mt-6 pt-6",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3",
        variantClasses[variant],
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
