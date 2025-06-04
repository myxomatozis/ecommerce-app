import React, { InputHTMLAttributes, forwardRef } from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  labelPosition?: "right" | "left";
  icon?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = "",
      label,
      description,
      error,
      helperText,
      indeterminate = false,
      size = "md",
      variant = "default",
      color = "primary",
      labelPosition = "right",
      icon,
      id,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: {
        checkbox: "w-4 h-4",
        icon: 12,
        label: "text-sm",
        description: "text-xs",
      },
      md: {
        checkbox: "w-5 h-5",
        icon: 14,
        label: "text-sm",
        description: "text-xs",
      },
      lg: {
        checkbox: "w-6 h-6",
        icon: 16,
        label: "text-base",
        description: "text-sm",
      },
    };

    const colorClasses = {
      primary: {
        bg: "bg-primary-600 border-primary-600",
        focus: "focus:ring-primary-500/20 focus:border-primary-600",
        hover: "hover:border-primary-500",
      },
      secondary: {
        bg: "bg-gray-600 border-gray-600",
        focus: "focus:ring-gray-500/20 focus:border-gray-600",
        hover: "hover:border-gray-500",
      },
      success: {
        bg: "bg-green-600 border-green-600",
        focus: "focus:ring-green-500/20 focus:border-green-600",
        hover: "hover:border-green-500",
      },
      warning: {
        bg: "bg-yellow-600 border-yellow-600",
        focus: "focus:ring-yellow-500/20 focus:border-yellow-600",
        hover: "hover:border-yellow-500",
      },
      danger: {
        bg: "bg-red-600 border-red-600",
        focus: "focus:ring-red-500/20 focus:border-red-600",
        hover: "hover:border-red-500",
      },
    };

    const variantClasses = {
      default: "border-2 rounded-md",
      filled: "border-2 rounded-lg",
      outlined: "border-2 rounded-md border-dashed",
    };

    const getCheckboxClasses = () => {
      const base = `${sizeClasses[size].checkbox} ${variantClasses[variant]} transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none relative`;

      if (disabled) {
        return `${base} bg-gray-100 border-gray-300 cursor-not-allowed opacity-60`;
      }

      if (checked || indeterminate) {
        return `${base} ${colorClasses[color].bg} ${colorClasses[color].focus} text-white`;
      }

      return `${base} bg-white border-gray-300 ${colorClasses[color].focus} ${colorClasses[color].hover}`;
    };

    const getLabelClasses = () => {
      const base = `${sizeClasses[size].label} font-medium transition-colors duration-200`;

      if (disabled) {
        return `${base} text-gray-400 cursor-not-allowed`;
      }

      return `${base} text-gray-900 cursor-pointer ${
        error ? "text-red-700" : ""
      }`;
    };

    const getDescriptionClasses = () => {
      const base = `${sizeClasses[size].description} mt-1 transition-colors duration-200`;

      if (disabled) {
        return `${base} text-gray-400`;
      }

      return `${base} text-gray-600 ${error ? "text-red-600" : ""}`;
    };

    const renderContent = () => (
      <>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={getCheckboxClasses()}
            disabled={disabled}
            checked={checked}
            {...props}
          />

          {/* Custom checkbox visual */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {checked || indeterminate ? (
              <div className="text-white">
                {icon ? (
                  icon
                ) : indeterminate ? (
                  <Minus size={sizeClasses[size].icon} strokeWidth={3} />
                ) : (
                  <Check size={sizeClasses[size].icon} strokeWidth={3} />
                )}
              </div>
            ) : null}
          </div>

          {/* Ripple effect on click */}
          {!disabled && (
            <div className="absolute inset-0 rounded-md transition-all duration-200 pointer-events-none opacity-0 bg-current scale-0 group-active:opacity-20 group-active:scale-150" />
          )}
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={checkboxId} className={getLabelClasses()}>
                {label}
              </label>
            )}
            {description && (
              <p className={getDescriptionClasses()}>{description}</p>
            )}
          </div>
        )}
      </>
    );

    return (
      <div className={`group ${className}`}>
        <div
          className={`flex items-start space-x-3 ${
            labelPosition === "left" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {renderContent()}
        </div>

        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500 flex items-start">
                <svg
                  className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
