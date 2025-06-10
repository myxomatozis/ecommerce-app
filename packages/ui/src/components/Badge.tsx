import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import Button from "./Button";
import { X } from "lucide-react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "minimal"
    | "counter"
    | "neutral"; // New neutral variant for 2025 minimalism
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
  // Base classes following 2025 minimalist principles
  const baseClasses = clsx(
    "inline-flex items-center justify-center font-medium",
    "transition-all duration-300 ease-out",
    "border", // Always include border for consistent structure
    !dot && "whitespace-nowrap"
  );

  // Modern variant classes - neutral palette following 2025 trends
  const variantClasses = {
    default: clsx(
      "bg-neutral-50 text-neutral-700",
      "border-neutral-200",
      "hover:bg-neutral-100 hover:border-neutral-300"
    ),
    primary: clsx(
      "bg-neutral-900 text-white",
      "border-neutral-900",
      "hover:bg-neutral-800 hover:border-neutral-800"
    ),
    secondary: clsx(
      "bg-neutral-100 text-neutral-800",
      "border-neutral-200",
      "hover:bg-neutral-200 hover:border-neutral-300"
    ),
    outline: clsx(
      "bg-transparent text-neutral-700",
      "border-neutral-300",
      "hover:bg-neutral-50 hover:border-neutral-400"
    ),
    minimal: clsx(
      "bg-transparent text-neutral-600",
      "border-transparent",
      "hover:text-neutral-800"
    ),
    counter: clsx(
      "bg-neutral-900 text-white",
      "border-neutral-900 rounded-full",
      "shadow-sm"
    ),
    neutral: clsx(
      "bg-neutral-200 text-neutral-700",
      "border-neutral-200",
      "hover:bg-neutral-300"
    ),
  };

  // Size classes - refined for modern proportions
  const sizeClasses = {
    xs: dot
      ? "w-1.5 h-1.5"
      : variant === "counter"
        ? "w-4 h-4 text-[10px] min-w-[1rem] leading-none"
        : "px-2 py-0.5 text-xs h-5 leading-tight",
    sm: dot
      ? "w-2 h-2"
      : variant === "counter"
        ? "w-5 h-5 text-sm min-w-[1.25rem] leading-none"
        : "px-2.5 py-1 text-sm h-6 leading-tight",
    md: dot
      ? "w-2.5 h-2.5"
      : variant === "counter"
        ? "w-6 h-6 text-md min-w-[1.5rem] leading-none"
        : "px-3 py-1 text-md h-7 leading-tight",
    lg: dot
      ? "w-3 h-3"
      : variant === "counter"
        ? "w-7 h-7 text-lg min-w-[1.75rem] leading-none"
        : "px-4 py-1.5 text-lg h-8 leading-tight",
  };

  // Icon sizes for consistent scaling
  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };

  // Combine all classes using clsx for proper handling
  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  // Dot variant - simple indicator
  if (dot) {
    return <span className={badgeClasses} {...props} />;
  }

  return (
    <span className={badgeClasses} {...props}>
      {/* Icon */}
      {icon && (
        <span className={clsx("flex-shrink-0", children ? "mr-1.5" : "")}>
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ size?: number }>,
                { size: iconSizes[size] }
              )
            : icon}
        </span>
      )}

      {/* Content */}
      {children && (
        <span className="flex-1 min-w-0 truncate ml-1 mr-1">{children}</span>
      )}

      {/* Remove button */}
      {removable && onRemove && (
        <Button
          variant="text"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          <X size={iconSizes[size]} />
        </Button>
      )}
    </span>
  );
};

// Specialized Badge variants for common use cases - following The Folk's style
export const StatusBadge: React.FC<
  Omit<BadgeProps, "variant"> & {
    status: "active" | "inactive" | "pending" | "completed";
  }
> = ({ status, ...props }) => {
  // Use neutral variants for minimal, professional look
  const statusConfig = {
    active: { variant: "primary" as const, children: "Active" },
    inactive: { variant: "neutral" as const, children: "Inactive" },
    pending: { variant: "secondary" as const, children: "Pending" },
    completed: { variant: "minimal" as const, children: "Completed" },
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
    style?: "minimal" | "neutral"; // Updated for 2025 aesthetics
  }
> = ({ category, style = "minimal", ...props }) => {
  const variant = style === "minimal" ? "minimal" : "neutral";

  return (
    <Badge size="xs" variant={variant} {...props}>
      {category}
    </Badge>
  );
};

// Icon Overlay Counter - Perfect for cart icons, notification badges
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
      className={clsx("absolute -top-1 -right-1", className)}
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;
