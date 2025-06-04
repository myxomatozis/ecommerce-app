import React, { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "gradient"
    | "outline"
    | "soft";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  dot?: boolean;
  rounded?: "sm" | "md" | "lg" | "full";
  animation?: "none" | "pulse" | "bounce" | "glow";
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  dot = false,
  rounded = "full",
  animation = "none",
  icon,
  removable = false,
  onRemove,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium 
    transition-all duration-200 ease-out
    ${!dot ? "whitespace-nowrap" : ""}
  `;

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "bg-gray-100 text-gray-600 border border-gray-200",
    success: "bg-success-100 text-success-800 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    danger: "bg-danger-100 text-danger-800 border border-danger-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    gradient: `
      bg-gradient-to-r from-primary-500 to-purple-600 
      text-white border-0 shadow-sm
    `,
    outline: `
      bg-transparent border-2 border-current 
      text-gray-700 hover:bg-gray-50
    `,
    soft: `
      bg-white/80 backdrop-blur-sm 
      text-gray-700 border border-gray-200/60
      shadow-sm
    `,
  };

  const sizeClasses = {
    xs: dot ? "w-1.5 h-1.5" : "px-1.5 py-0.5 text-xs min-h-[1.25rem]",
    sm: dot ? "w-2 h-2" : "px-2 py-0.5 text-xs min-h-[1.5rem]",
    md: dot ? "w-2.5 h-2.5" : "px-2.5 py-1 text-sm min-h-[1.75rem]",
    lg: dot ? "w-3 h-3" : "px-3 py-1.5 text-sm min-h-[2rem]",
    xl: dot ? "w-4 h-4" : "px-4 py-2 text-base min-h-[2.25rem]",
  };

  const roundedClasses = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  const animationClasses = {
    none: "",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    glow: "animate-pulse shadow-glow",
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  };

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${roundedClasses[rounded]}
    ${animationClasses[animation]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  if (dot) {
    return <span className={classes} {...props} />;
  }

  return (
    <span className={classes} {...props}>
      {/* Icon */}
      {icon && (
        <span className="mr-1 flex-shrink-0">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement, {
                size: iconSizes[size],
              })
            : icon}
        </span>
      )}

      {/* Content */}
      {children && <span className="flex-1 min-w-0 truncate">{children}</span>}

      {/* Remove button */}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className={`
            ml-1 flex-shrink-0 rounded-full p-0.5 
            hover:bg-black/10 transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-current
            ${size === "xs" ? "p-0" : ""}
          `}
          aria-label="Remove"
        >
          <svg
            className={`${iconSizes[size] <= 12 ? "w-2.5 h-2.5" : "w-3 h-3"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Specialized Badge variants for common use cases
export const StatusBadge: React.FC<
  Omit<BadgeProps, "variant"> & {
    status: "online" | "offline" | "away" | "busy";
  }
> = ({ status, ...props }) => {
  const statusConfig = {
    online: { variant: "success" as const, children: "Online", dot: true },
    offline: { variant: "secondary" as const, children: "Offline", dot: true },
    away: { variant: "warning" as const, children: "Away", dot: true },
    busy: { variant: "danger" as const, children: "Busy", dot: true },
  };

  return <Badge {...statusConfig[status]} {...props} />;
};

export const CountBadge: React.FC<
  Omit<BadgeProps, "children"> & {
    count: number;
    max?: number;
    showZero?: boolean;
  }
> = ({ count, max = 99, showZero = false, ...props }) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant="danger" size="sm" {...props}>
      {displayCount}
    </Badge>
  );
};

export const CategoryBadge: React.FC<
  Omit<BadgeProps, "variant"> & {
    category: string;
    colorScheme?:
      | "auto"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "info";
  }
> = ({ category, colorScheme = "auto", ...props }) => {
  // Simple hash function to generate consistent colors for categories
  const getVariantFromString = (str: string) => {
    if (colorScheme !== "auto") return colorScheme;

    const variants = ["primary", "success", "warning", "info"] as const;
    const hash = str.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return variants[Math.abs(hash) % variants.length];
  };

  return (
    <Badge variant={getVariantFromString(category)} {...props}>
      {category}
    </Badge>
  );
};

export default Badge;
