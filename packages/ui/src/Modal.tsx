import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  variant?: "default" | "centered" | "slide-over";
  className?: string;
  overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  variant = "default",
  className = "",
  overlayClassName = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusTrapRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  // Variant configurations
  const variantClasses = {
    default: "mx-4 my-8",
    centered: "mx-4",
    "slide-over": "ml-auto mr-0 my-0 h-full",
  };

  const containerClasses = {
    default: "flex min-h-full items-center justify-center p-4",
    centered: "flex min-h-full items-center justify-center p-4",
    "slide-over": "flex min-h-full items-start justify-end",
  };

  // Handle escape key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Add event listeners
      document.addEventListener("keydown", handleEscape);
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";

      // Return focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, handleEscape]);

  // Focus trap implementation
  const handleTabKey = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !focusTrapRef.current) return;

    const focusableElements = focusTrapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 overflow-y-auto scrollbar-hide
        ${overlayClassName}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={containerClasses[variant]}>
        <div
          ref={focusTrapRef}
          className={`
            relative w-full transform transition-all duration-300 ease-out
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${
              variant === "slide-over"
                ? `
                  bg-white shadow-2xl
                  ${isOpen ? "translate-x-0" : "translate-x-full"}
                `
                : `
                  bg-white rounded-2xl shadow-2xl
                  ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
                `
            }
            ${className}
          `}
          onKeyDown={handleTabKey}
        >
          <div ref={modalRef} tabIndex={-1} className="focus:outline-none">
            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className={`
                flex items-center justify-between p-6 
                ${variant === "slide-over" ? "border-b border-gray-200" : ""}
              `}
              >
                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900 pr-8"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={`
                      p-2 -m-2 text-gray-400 hover:text-gray-600 
                      transition-colors duration-200 rounded-lg hover:bg-gray-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20
                      ${title ? "absolute top-4 right-4" : "ml-auto"}
                    `}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className={`
              ${title || showCloseButton ? "" : "pt-6"} 
              ${footer ? "pb-0" : "pb-6"} 
              px-6 
              ${variant === "slide-over" ? "flex-1 overflow-y-auto" : ""}
            `}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className={`
                flex items-center justify-end gap-3 p-6 
                border-t border-gray-100 bg-gray-50/50
                ${variant === "slide-over" ? "" : "rounded-b-2xl"}
              `}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
