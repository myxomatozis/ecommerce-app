import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  group?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "filled";
  position?: "auto" | "top" | "bottom";
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  error,
  label,
  helperText,
  fullWidth = false,
  searchable = false,
  clearable = false,
  multiple = false,
  size = "md",
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const selectedOptions = multiple
    ? options.filter((option) => selectedValues.includes(option.value))
    : selectedOption
      ? [selectedOption]
      : [];

  // Group options
  const groupedOptions = options.reduce(
    (groups, option) => {
      const group = option.group || "default";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    },
    {} as Record<string, DropdownOption[]>
  );

  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange(newValues as any);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      setSelectedValues([]);
      onChange([] as any);
    } else {
      onChange("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (event.key === "Enter" && !isOpen) {
      setIsOpen(true);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      trigger: "px-3 py-2 text-sm min-h-[2.5rem]",
      dropdown: "text-sm",
      icon: "w-4 h-4",
    },
    md: {
      trigger: "px-4 py-3 text-sm min-h-[3rem]",
      dropdown: "text-sm",
      icon: "w-5 h-5",
    },
    lg: {
      trigger: "px-4 py-4 text-base min-h-[3.5rem]",
      dropdown: "text-base",
      icon: "w-5 h-5",
    },
  };

  // Variant classes
  const variantClasses = {
    default:
      "bg-white border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    bordered:
      "bg-white border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    filled:
      "bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
  };

  const baseClasses = "relative inline-block text-left z-20";
  const widthClass = fullWidth ? "w-full" : "min-w-[12rem]";

  const getTriggerClasses = () => {
    const base = `w-full flex items-center justify-between rounded-xl shadow-sm transition-all duration-200 cursor-pointer focus:outline-none ${sizeClasses[size].trigger}`;
    const variantClass = variantClasses[variant as keyof typeof variantClasses];
    const state = disabled
      ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
      : "hover:border-gray-400";
    const errorState = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "";

    return `${base} ${variantClass} ${state} ${errorState}`;
  };

  const renderSelectedContent = () => {
    if (multiple && selectedOptions.length > 0) {
      if (selectedOptions.length === 1) {
        const option = selectedOptions[0];
        return (
          <div className="flex items-center min-w-0 flex-1">
            {option.icon && (
              <span className="mr-2 flex-shrink-0">{option.icon}</span>
            )}
            <span className="block truncate text-gray-900">{option.label}</span>
          </div>
        );
      }
      return (
        <div className="flex items-center min-w-0 flex-1">
          <span className="block truncate text-gray-900">
            {selectedOptions.length} items selected
          </span>
        </div>
      );
    }

    if (selectedOption) {
      return (
        <div className="flex items-center min-w-0 flex-1">
          {selectedOption.icon && (
            <span className="mr-2 flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="block truncate text-gray-900">
            {selectedOption.label}
          </span>
        </div>
      );
    }

    return <span className="block truncate text-gray-500">{placeholder}</span>;
  };

  return (
    <div className={`${baseClasses} ${widthClass}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={getTriggerClasses()}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {renderSelectedContent()}

          <div className="flex items-center space-x-1 ml-2">
            {clearable &&
              (selectedOption || selectedOptions.length > 0) &&
              !disabled && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Clear selection"
                >
                  <svg
                    className="w-3 h-3"
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
            <ChevronDown
              className={`${
                sizeClasses[size].icon
              } text-gray-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            <div className="py-1 overflow-y-auto max-h-64">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchable && searchTerm
                    ? "No options found"
                    : "No options available"}
                </div>
              ) : (
                Object.keys(groupedOptions).map((groupName) => {
                  const groupOptions = groupedOptions[groupName].filter(
                    (option) => filteredOptions.includes(option)
                  );

                  if (groupOptions.length === 0) return null;

                  return (
                    <div key={groupName}>
                      {groupName !== "default" && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                          {groupName}
                        </div>
                      )}
                      {groupOptions.map((option) => {
                        const isSelected = multiple
                          ? selectedValues.includes(option.value)
                          : option.value === value;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            disabled={option.disabled}
                            className={`
                              w-full text-left px-4 py-3 ${
                                sizeClasses[size].dropdown
                              } transition-colors duration-150 flex items-center justify-between
                              ${
                                option.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-900 hover:bg-gray-50 cursor-pointer"
                              }
                              ${
                                isSelected
                                  ? "bg-primary-50 text-primary-700"
                                  : ""
                              }
                            `}
                          >
                            <div className="flex items-center min-w-0 flex-1">
                              {option.icon && (
                                <span className="mr-3 flex-shrink-0">
                                  {option.icon}
                                </span>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="font-medium">
                                  {option.label}
                                </div>
                                {option.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {option.description}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-primary-600 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
