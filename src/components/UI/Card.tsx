import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "outlined"
    | "elevated"
    | "warm"
    | "glow"
    | "premium"
    | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  ...props
}) => {
  const baseClasses = "bg-white rounded-2xl transition-all duration-300";

  const variantClasses = {
    default: "border border-gray-200 shadow-sharp",
    outlined: "border-1 border-gray-200",
    elevated: "shadow-sharp-lg",
    warm: "bg-white/90 backdrop-blur-sm border border-orange-200/50 shadow-warm hover:shadow-warm-lg hover:border-orange-300/50",
    glow: "border border-primary-200 shadow-glow hover:shadow-glow-lg",
    premium:
      "bg-gradient-to-br from-white to-orange-50/50 border-1 border-gold-200 shadow-warm hover:shadow-glow relative overflow-hidden before:absolute before:inset-0 before:bg-shimmer-gradient before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none",
    glass: "bg-white/20 backdrop-blur-md border border-white/30 shadow-warm",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover
    ? "hover:shadow-warm-lg hover:-translate-y-1 cursor-pointer"
    : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Card subcomponents with enhanced styling
export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`mb-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<
  HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean;
    variant?: "default" | "warm" | "gold";
  }
> = ({
  children,
  className = "",
  gradient = false,
  variant = "default",
  ...props
}) => {
  const gradientClass = gradient
    ? variant === "gold"
      ? "text-gradient-gold"
      : "text-gradient-warm"
    : "";

  return (
    <h3
      className={`text-xl font-bold text-gray-900 ${gradientClass} ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<
  HTMLAttributes<HTMLParagraphElement>
> = ({ children, className = "", ...props }) => (
  <p className={`text-gray-600 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<
  HTMLAttributes<HTMLDivElement> & { padding?: "none" | "sm" | "md" | "lg" }
> = ({ children, className = "", padding = "md", ...props }) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "warm";
  }
> = ({ children, className = "", variant = "default", ...props }) => {
  const variantClass =
    variant === "warm"
      ? "border-orange-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50"
      : "border-gray-200";

  return (
    <div
      className={`mt-6 pt-4 border-t ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
