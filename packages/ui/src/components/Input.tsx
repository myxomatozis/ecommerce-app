import React, { InputHTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      "block w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200";

    const errorClasses = error
      ? "border-red-300 focus:ring-red-500 focus:border-transparent"
      : "";

    const paddingClasses =
      leftIcon && rightIcon
        ? "pl-12 pr-12"
        : leftIcon
          ? "pl-12"
          : rightIcon
            ? "pr-12"
            : "";

    const widthClass = fullWidth ? "w-full" : "";

    const inputClasses = `${baseClasses} ${errorClasses} ${paddingClasses} ${className}`;

    return (
      <div className={widthClass}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute flex items-center pointer-events-none justify-center inset-y-0 left-0 pl-3 w-12 h-full">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          <input ref={ref} id={inputId} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className={error ? "text-red-400" : "text-gray-400"}>
                {error ? <AlertCircle size={20} /> : rightIcon}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
