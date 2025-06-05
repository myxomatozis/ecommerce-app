import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "minimal" | "elevated" | "interactive";
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
  const baseClasses = `
    bg-white transition-all duration-500 relative overflow-hidden
  `;

  const variantClasses = {
    default: "border border-neutral-200/50 shadow-minimal",
    outlined: "border border-neutral-200",
    minimal: "border-none",
    elevated: "shadow-soft border border-neutral-200/50",
    interactive:
      "border border-neutral-200/50 shadow-minimal hover:shadow-elegant hover:border-neutral-300",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover
    ? "hover:shadow-elegant hover:border-neutral-300 cursor-pointer group"
    : "";

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${paddingClasses[padding]} 
    ${hoverClasses} 
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card subcomponents with modern styling
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
    size?: "sm" | "md" | "lg" | "xl";
  }
> = ({ children, className = "", size = "md", ...props }) => {
  const sizeClasses = {
    sm: "text-lg font-medium",
    md: "text-xl font-medium",
    lg: "text-2xl font-medium",
    xl: "text-3xl font-light",
  };

  return (
    <h3
      className={`text-neutral-900 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<
  HTMLAttributes<HTMLParagraphElement>
> = ({ children, className = "", ...props }) => (
  <p className={`text-neutral-600 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    padding?: "none" | "sm" | "md" | "lg";
  }
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
    variant?: "default" | "minimal";
  }
> = ({ children, className = "", variant = "default", ...props }) => {
  const variantClass =
    variant === "minimal" ? "" : "border-t border-neutral-200 bg-neutral-50/30";

  return (
    <div className={`mt-6 pt-4 ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
