import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

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
  variant?: "default" | "centered" | "slide-over" | "minimal";
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

  // Modern size configurations - using specific widths instead of w-full
  const sizeClasses = {
    xs: "w-[280px] max-w-[90vw] sm:w-80", // 280px -> 320px
    sm: "w-[320px] max-w-[90vw] sm:w-96", // 320px -> 384px
    md: "w-[90vw] max-w-[90vw] sm:w-[448px] sm:max-w-md", // responsive -> 448px
    lg: "w-[90vw] max-w-[90vw] sm:w-[512px] sm:max-w-lg", // responsive -> 512px
    xl: "w-[90vw] max-w-[90vw] sm:w-[576px] sm:max-w-xl", // responsive -> 576px
    "2xl": "w-[95vw] max-w-[95vw] sm:w-[672px] sm:max-w-2xl", // responsive -> 672px
    full: "w-[95vw] max-w-[95vw] max-h-[95vh]", // nearly full screen
  };

  // Modern variant configurations with mobile-first approach
  const variantClasses = {
    default: "mx-4 my-4 sm:mx-4 sm:my-8",
    centered: "mx-4 my-4 sm:mx-4",
    "slide-over":
      "ml-auto mr-0 my-0 h-full w-[90vw] max-w-[90vw] sm:w-[448px] sm:max-w-md",
    minimal: "mx-4 my-8 sm:mx-4 sm:my-16", // More white space for minimal variant
  };

  const containerClasses = {
    default: "flex h-full items-center justify-center p-4 sm:p-6",
    centered: "flex h-full items-center justify-center p-4 sm:p-6",
    "slide-over": "flex h-full items-start justify-end",
    minimal: "flex h-full items-center justify-center p-6 sm:p-8",
  };

  // Modal styling with 2025 trends - clean, minimal, purposeful
  const getModalClasses = () => {
    const baseClasses =
      "relative transform transition-all duration-500 ease-out";

    const variantSpecificClasses = {
      default: clsx(
        "bg-white shadow-2xl border border-neutral-100",
        "rounded-none", // Following brutalist trend - no rounded corners
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      ),
      centered: clsx(
        "bg-white shadow-2xl border border-neutral-100",
        "rounded-none",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      ),
      "slide-over": clsx(
        "bg-white shadow-2xl border-l border-neutral-200",
        "rounded-none h-full",
        isOpen ? "translate-x-0" : "translate-x-full"
      ),
      minimal: clsx(
        "bg-white shadow-sm border border-neutral-200",
        "rounded-none", // Clean, geometric shape
        isOpen ? "scale-100 opacity-100" : "scale-98 opacity-0"
      ),
    };

    return clsx(
      baseClasses,
      // Only apply size classes for non-slide-over variants
      variant !== "slide-over" && sizeClasses[size],
      variantClasses[variant],
      variantSpecificClasses[variant],
      className
    );
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

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Modern scroll lock with proper scrollbar compensation
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Add event listeners
      document.addEventListener("keydown", handleEscape);
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Return focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
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
      className={clsx("fixed inset-0 z-50 overflow-y-auto", overlayClassName)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Modern backdrop with subtle blur */}
      <div
        className={clsx(
          "fixed inset-0 backdrop-blur-sm transition-all duration-500 ease-out",
          variant === "minimal"
            ? "bg-neutral-900/20" // Lighter overlay for minimal variant
            : "bg-neutral-900/30",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={containerClasses[variant]}>
        <div
          ref={focusTrapRef}
          className={getModalClasses()}
          onKeyDown={handleTabKey}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="focus:outline-none h-full flex flex-col"
          >
            {/* Header - Modern typography following 2025 trends */}
            {(title || showCloseButton) && (
              <div
                className={clsx(
                  "flex items-center justify-between",
                  variant === "minimal" ? "p-6 pb-0" : "p-6",
                  variant === "slide-over" && "border-b border-neutral-100",
                  variant === "minimal" && "border-b border-neutral-100"
                )}
              >
                {title && (
                  <h2
                    id="modal-title"
                    className={clsx(
                      "font-medium text-neutral-900 pr-8 tracking-tight",
                      variant === "minimal" ? "text-lg" : "text-xl"
                    )}
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={clsx(
                      "p-2 -m-2 text-neutral-400 hover:text-neutral-900",
                      "transition-colors duration-300",
                      "hover:bg-neutral-50 focus:outline-none",
                      "focus:ring-1 focus:ring-neutral-200 focus:ring-offset-1",
                      title ? "absolute top-4 right-4" : "ml-auto"
                    )}
                    aria-label="Close modal"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}

            {/* Content - with proper spacing following white space trends */}
            <div
              className={clsx(
                "flex-1 overflow-y-auto",
                title || showCloseButton ? "" : "pt-6",
                footer ? "pb-0" : "pb-6",
                variant === "minimal" ? "px-6" : "px-6",
                variant === "slide-over" && "min-h-0"
              )}
            >
              {children}
            </div>

            {/* Footer - Clean, minimal design */}
            {footer && (
              <div
                className={clsx(
                  "flex items-center justify-end gap-3 p-6 mt-auto",
                  "border-t border-neutral-100",
                  variant === "minimal"
                    ? "bg-neutral-50/30"
                    : "bg-neutral-50/50"
                )}
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
