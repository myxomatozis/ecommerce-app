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
    | "outline"
    | "minimal"
    | "counter"; // New counter variant for icon overlays
  size?: "xs" | "sm" | "md" | "lg";
  dot?: boolean;
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
  icon,
  removable = false,
  onRemove,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium 
    transition-all duration-300 ease-out
    ${!dot ? "whitespace-nowrap" : ""}
  `;

  const variantClasses = {
    default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    primary: "bg-neutral-900 text-white border border-neutral-900",
    secondary: "bg-neutral-200 text-neutral-700 border border-neutral-300",
    success: "bg-neutral-800 text-neutral-100 border border-neutral-800", // Dark gray instead of green
    warning: "bg-neutral-600 text-neutral-100 border border-neutral-600", // Medium gray instead of yellow
    danger: "bg-neutral-700 text-neutral-100 border border-neutral-700", // Dark gray instead of red
    info: "bg-neutral-500 text-white border border-neutral-500", // Medium gray instead of blue
    outline:
      "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    minimal: "bg-neutral-50 text-neutral-600 border border-transparent",
    counter: "bg-neutral-900 text-white border-none rounded-full", // Special counter style
  };

  const sizeClasses = {
    xs: dot
      ? "w-1.5 h-1.5"
      : variant === "counter"
        ? "w-4 h-4 text-[10px] min-w-[1rem]"
        : "px-2 py-0.5 text-xs min-h-[1.25rem]",
    sm: dot
      ? "w-2 h-2"
      : variant === "counter"
        ? "w-5 h-5 text-xs min-w-[1.25rem]"
        : "px-2.5 py-1 text-xs min-h-[1.5rem]",
    md: dot
      ? "w-2.5 h-2.5"
      : variant === "counter"
        ? "w-6 h-6 text-xs min-w-[1.5rem]"
        : "px-3 py-1 text-sm min-h-[1.75rem]",
    lg: dot
      ? "w-3 h-3"
      : variant === "counter"
        ? "w-7 h-7 text-sm min-w-[1.75rem]"
        : "px-4 py-1.5 text-sm min-h-[2rem]",
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  };

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
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
        <span className="mr-1.5 flex-shrink-0">
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ size?: number }>,
                {
                  size: iconSizes[size],
                }
              )
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
            ml-1.5 flex-shrink-0 rounded-full p-0.5 
            hover:bg-black/10 transition-colors duration-200
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
    status: "active" | "inactive" | "pending" | "completed";
  }
> = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: "primary" as const, children: "Active" },
    inactive: { variant: "secondary" as const, children: "Inactive" },
    pending: { variant: "warning" as const, children: "Pending" },
    completed: { variant: "success" as const, children: "Completed" },
  };

  return <Badge {...statusConfig[status]} {...props} />;
};

export const CountBadge: React.FC<
  Omit<BadgeProps, "children"> & {
    count: number;
    max?: number;
    showZero?: boolean;
  }
> = ({ count, max = 99, showZero = false, variant = "counter", ...props }) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant={variant} size="sm" {...props}>
      {displayCount}
    </Badge>
  );
};

export const CategoryBadge: React.FC<
  Omit<BadgeProps, "variant"> & {
    category: string;
    style?: "minimal" | "varied"; // New style option
  }
> = ({ category, style = "minimal", ...props }) => {
  if (style === "minimal") {
    // All categories use the same neutral style for ultra-minimal look
    return (
      <Badge variant="secondary" {...props}>
        {category}
      </Badge>
    );
  }

  // Varied approach using different neutral shades
  const getVariantFromString = (str: string) => {
    const variants = ["secondary", "info", "warning", "success"] as const;
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

// Icon Overlay Counter - Perfect for cart icons, notification badges, etc.
export const IconCounter: React.FC<{
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}> = ({ count, max = 99, showZero = false, className = "", size = "sm" }) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant="counter"
      size={size}
      className={`absolute -top-1 -right-1 ${className}`}
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;
