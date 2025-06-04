import { InputHTMLAttributes, forwardRef } from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = "",
      label,
      description,
      error,
      indeterminate = false,
      size = "md",
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    const baseClasses = `
      ${
        sizeClasses[size]
      } text-primary-600 bg-white border-2 border-gray-300 rounded 
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none
      transition-all duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? "border-red-300 focus:ring-red-500" : ""}
    `;

    return (
      <div className={className}>
        <div className="flex items-start">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={`${baseClasses} appearance-none`}
              {...props}
            />

            {/* Custom checkbox visual */}
            <div
              className={`
              absolute inset-0 flex items-center justify-center pointer-events-none
              ${
                props.checked || indeterminate
                  ? "text-white"
                  : "text-transparent"
              }
            `}
            >
              {indeterminate ? (
                <Minus size={iconSizes[size]} strokeWidth={3} />
              ) : (
                <Check size={iconSizes[size]} strokeWidth={3} />
              )}
            </div>

            {/* Background overlay for checked state */}
            <div
              className={`
              absolute inset-0 rounded transition-all duration-200 pointer-events-none
              ${
                props.checked || indeterminate
                  ? "bg-primary-600 border-primary-600"
                  : "bg-transparent"
              }
              ${props.disabled ? "opacity-50" : ""}
            `}
            />
          </div>

          {(label || description) && (
            <div className="ml-3 flex-1">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={`
                    block font-medium cursor-pointer
                    ${
                      size === "sm"
                        ? "text-sm"
                        : size === "lg"
                        ? "text-base"
                        : "text-sm"
                    }
                    ${
                      props.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900"
                    }
                    ${error ? "text-red-700" : ""}
                  `}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={`
                  text-sm mt-1
                  ${props.disabled ? "text-gray-400" : "text-gray-600"}
                  ${error ? "text-red-600" : ""}
                `}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
