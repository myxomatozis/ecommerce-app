import React, { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "white";
  speed?: "slow" | "normal" | "fast";
  type?: "spinner" | "dots" | "pulse" | "bars";
  text?: string;
  inline?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "default",
  speed = "normal",
  type = "spinner",
  text,
  inline = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16",
  };

  const variantClasses = {
    default: "text-gray-600",
    primary: "text-primary-600",
    secondary: "text-gray-400",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    white: "text-white",
  };

  const speedClasses = {
    slow: "animate-spin [animation-duration:2s]",
    normal: "animate-spin",
    fast: "animate-spin [animation-duration:0.5s]",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl",
  };

  const containerClasses = inline
    ? "inline-flex items-center space-x-2"
    : "flex flex-col items-center justify-center space-y-3";

  const renderSpinner = () => {
    const baseClasses = `${sizeClasses[size]} ${variantClasses[variant]} ${speedClasses[speed]}`;

    switch (type) {
      case "dots":
        return (
          <div className={`flex space-x-1 ${sizeClasses[size]}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${variantClasses[variant]} animate-bounce`}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  backgroundColor: "currentColor",
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${baseClasses} animate-pulse rounded-full`}
            style={{ backgroundColor: "currentColor" }}
          />
        );

      case "bars":
        return (
          <div className={`flex space-x-1 items-end ${sizeClasses[size]}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 bg-current animate-pulse`}
                style={{
                  height: `${25 + (i % 2) * 25}%`,
                  animationDelay: `${i * 0.1}s`,
                  color: variantClasses[variant].replace("text-", ""),
                }}
              />
            ))}
          </div>
        );

      default: // spinner
        return (
          <svg
            className={baseClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="img"
            aria-label={text || "Loading"}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      {renderSpinner()}
      {text && (
        <span
          className={`font-medium ${textSizeClasses[size]} ${variantClasses[variant]}`}
          aria-label={text}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Spinner;
