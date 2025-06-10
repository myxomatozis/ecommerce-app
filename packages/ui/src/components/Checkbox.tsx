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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

    const sizeConfig = {
      sm: {
        checkbox: "w-5 h-5",
        icon: 12,
        label: "text-sm",
        description: "text-xs",
        gap: "gap-1",
      },
      md: {
        checkbox: "w-6 h-6",
        icon: 14,
        label: "text-md",
        description: "text-sm",
        gap: "gap-1",
      },
      lg: {
        checkbox: "w-8 h-8",
        icon: 16,
        label: "text-lg",
        description: "text-md",
        gap: "gap-1",
      },
    };

    const getCheckboxClasses = () => {
      const baseClasses = `
        ${sizeConfig[size].checkbox}
        rounded-sm
        border-2
        transition-all 
        duration-200
        cursor-pointer
        focus:outline-none 
        focus:ring-2 
        focus:ring-neutral-900/20
        focus:ring-offset-2
        appearance-none 
        relative
        flex
        items-center
        justify-center
        shrink-0
      `
        .replace(/\s+/g, " ")
        .trim();

      if (disabled) {
        return `${baseClasses} bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-60`;
      }

      if (checked || indeterminate) {
        switch (variant) {
          case "minimal":
            return `${baseClasses} bg-neutral-800 border-neutral-800 hover:bg-neutral-700 hover:border-neutral-700`;
          case "outlined":
            return `${baseClasses} bg-transparent border-neutral-800 hover:bg-neutral-50`;
          default:
            return `${baseClasses} bg-neutral-900 border-neutral-900 hover:bg-neutral-800 hover:border-neutral-800`;
        }
      }

      switch (variant) {
        case "minimal":
          return `${baseClasses} bg-white border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50`;
        case "outlined":
          return `${baseClasses} bg-transparent border-neutral-400 border-dashed hover:border-neutral-500 hover:bg-neutral-50`;
        default:
          return `${baseClasses} bg-white border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50`;
      }
    };

    const getLabelClasses = () => {
      const baseClasses = `${sizeConfig[size].label} font-medium leading-none cursor-pointer transition-colors duration-200`;

      if (disabled) {
        return `${baseClasses} text-neutral-400 cursor-not-allowed`;
      }

      if (error) {
        return `${baseClasses} text-red-700`;
      }

      return `${baseClasses} text-neutral-900`;
    };

    const getDescriptionClasses = () => {
      const baseClasses = `${sizeConfig[size].description} leading-relaxed transition-colors duration-200`;

      if (disabled) {
        return `${baseClasses} text-neutral-400`;
      }

      if (error) {
        return `${baseClasses} text-red-600`;
      }

      return `${baseClasses} text-neutral-600`;
    };

    const getIconColor = () => {
      if (variant === "outlined" && (checked || indeterminate)) {
        return "text-neutral-800";
      }
      return "text-white";
    };

    const renderCheckbox = () => (
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={getCheckboxClasses()}
          disabled={disabled}
          checked={checked}
          {...props}
        />

        {/* Custom checkbox icon */}
        {(checked || indeterminate) && (
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none ${getIconColor()}`}
          >
            {icon ? (
              icon
            ) : indeterminate ? (
              <Minus size={sizeConfig[size].icon} strokeWidth={2.5} />
            ) : (
              <Check size={sizeConfig[size].icon} strokeWidth={2.5} />
            )}
          </div>
        )}
      </div>
    );

    const renderLabel = () => {
      if (!label && !description) return null;

      return (
        <div className="flex-1 min-w-0">
          {label && (
            <label htmlFor={checkboxId} className={getLabelClasses()}>
              {label}
            </label>
          )}
          {description && (
            <div
              className={`${getDescriptionClasses()} ${label ? "mt-1" : ""}`}
            >
              {description}
            </div>
          )}
        </div>
      );
    };

    const renderHelperText = () => {
      if (!error && !helperText) return null;

      return (
        <div className="mt-2">
          {error && (
            <div className="flex items-start gap-1.5 text-sm text-red-700">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {helperText && !error && (
            <div className="flex items-start gap-1.5 text-sm text-neutral-500">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{helperText}</span>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={`group ${className}`}>
        <div
          className={`flex items-center ${sizeConfig[size].gap} ${labelPosition === "left" ? "flex-row-reverse" : ""}`}
        >
          {renderCheckbox()}
          {renderLabel()}
        </div>
        {renderHelperText()}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
