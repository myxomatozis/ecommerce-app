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
  variant?: "default" | "minimal" | "outlined";
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
        spacing: "space-x-2",
      },
      md: {
        checkbox: "w-5 h-5",
        icon: 14,
        label: "text-sm",
        description: "text-xs",
        spacing: "space-x-3",
      },
      lg: {
        checkbox: "w-6 h-6",
        icon: 16,
        label: "text-base",
        description: "text-sm",
        spacing: "space-x-3",
      },
    };

    const variantClasses = {
      default: "border border-neutral-300",
      minimal: "border border-neutral-200",
      outlined: "border border-neutral-300 border-dashed",
    };

    const getCheckboxClasses = () => {
      const base = `${sizeClasses[size].checkbox} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-1 appearance-none relative bg-white`;

      if (disabled) {
        return `${base} ${variantClasses[variant]} bg-neutral-50 border-neutral-200 cursor-not-allowed opacity-50`;
      }

      if (checked || indeterminate) {
        return `${base} bg-neutral-900 border-neutral-900 text-white shadow-minimal hover:bg-neutral-800`;
      }

      return `${base} ${variantClasses[variant]} hover:border-neutral-400 hover:shadow-minimal`;
    };

    const getLabelClasses = () => {
      const base = `${sizeClasses[size].label} font-medium transition-colors duration-300`;

      if (disabled) {
        return `${base} text-neutral-400 cursor-not-allowed`;
      }

      return `${base} text-neutral-900 cursor-pointer ${
        error ? "text-neutral-700" : ""
      }`;
    };

    const getDescriptionClasses = () => {
      const base = `${sizeClasses[size].description} mt-1 transition-colors duration-300`;

      if (disabled) {
        return `${base} text-neutral-400`;
      }

      return `${base} text-neutral-600 ${error ? "text-neutral-600" : ""}`;
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
                  <Minus size={sizeClasses[size].icon} strokeWidth={2.5} />
                ) : (
                  <Check size={sizeClasses[size].icon} strokeWidth={2.5} />
                )}
              </div>
            ) : null}
          </div>
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
          className={`flex items-start ${sizeClasses[size].spacing} ${
            labelPosition === "left" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {renderContent()}
        </div>

        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-neutral-700 flex items-center">
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
              <p className="text-sm text-neutral-500 flex items-start">
                <svg
                  className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-neutral-400"
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
