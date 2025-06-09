// src/components/UI/Toast.tsx
import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface ToastProps {
  id: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  variant?: "default" | "minimal";
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type = "info",
  variant = "default",
  title,
  message,
  duration = 5000,
  onClose,
  action,
  persistent = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    if (!persistent && duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const decrement = 100 / (duration / 50);
          return Math.max(0, prev - decrement);
        });
      }, 50);

      // Auto-close timer
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose(id);
    }, 200);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: null, // No icon for loading, we'll use a subtle indicator
  };

  const getToastClasses = () => {
    const baseClasses = "rounded-lg shadow-soft border backdrop-blur-sm";

    if (variant === "minimal") {
      return {
        success: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        error: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        warning: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        info: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        loading: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
      };
    }

    // Default variant - very subtle color hints
    return {
      success: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
      error: `${baseClasses} bg-white border-neutral-300 text-neutral-900`,
      warning: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
      info: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
      loading: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
    };
  };

  const getIconColor = () => {
    if (variant === "minimal") return "text-neutral-600";

    return {
      success: "text-neutral-700",
      error: "text-neutral-700",
      warning: "text-neutral-700",
      info: "text-neutral-600",
      loading: "text-neutral-600",
    }[type];
  };

  const getProgressBarColor = () => {
    return {
      success: "bg-neutral-900",
      error: "bg-neutral-900",
      warning: "bg-neutral-900",
      info: "bg-neutral-900",
      loading: "bg-neutral-900",
    }[type];
  };

  const Icon = icons[type];
  const toastClasses = getToastClasses()[type];

  const renderContent = (content: string | React.ReactNode) => {
    if (typeof content === "string") {
      return content;
    }
    return content;
  };

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm transition-all duration-300 ease-out transform
        ${
          isVisible && !isRemoving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
        ${toastClasses}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar - ultra minimal */}
      {!persistent && duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${getProgressBarColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon - minimal and clean */}
          {Icon && (
            <div className="flex-shrink-0 mt-0.5">
              <Icon className={`h-4 w-4 ${getIconColor()}`} />
            </div>
          )}

          {/* Loading indicator for loading type */}
          {type === "loading" && (
            <div className="flex-shrink-0 mt-1">
              <div className="w-3 h-3 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-medium text-neutral-900 mb-1 leading-tight">
                {renderContent(title)}
              </div>
            )}
            <div
              className={`text-sm text-neutral-700 leading-relaxed ${
                title ? "" : "font-medium"
              }`}
            >
              {renderContent(message)}
            </div>

            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className="text-sm font-medium text-neutral-900 underline hover:no-underline transition-all duration-200"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className="rounded-md p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-1"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
