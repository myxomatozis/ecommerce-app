import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

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
    loading: Loader2,
  };

  const getToastClasses = () => {
    const baseClasses =
      "rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300";

    if (variant === "minimal") {
      return {
        success: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        error: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        warning: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        info: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
        loading: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
      };
    }

    // Default variant - modern with subtle glassmorphism
    return {
      success: `${baseClasses} bg-white border-emerald-200 text-neutral-900`,
      error: `${baseClasses} bg-white border-red-200 text-neutral-900`,
      warning: `${baseClasses} bg-white border-amber-200 text-neutral-900`,
      info: `${baseClasses} bg-white border-blue-200 text-neutral-900`,
      loading: `${baseClasses} bg-white border-neutral-200 text-neutral-900`,
    };
  };

  const getIconColor = () => {
    return {
      success: "text-emerald-500",
      error: "text-red-500",
      warning: "text-amber-500",
      info: "text-blue-500",
      loading: "text-neutral-500",
    };
  };

  const getProgressBarColor = () => {
    return {
      success: "bg-emerald-500",
      error: "bg-red-500",
      warning: "bg-amber-500",
      info: "bg-blue-500",
      loading: "bg-neutral-500",
    };
  };

  const IconComponent = icons[type!];
  const toastClasses = getToastClasses()[type!];
  const iconColor = getIconColor()[type!];
  const progressColor = getProgressBarColor()[type!];

  const renderContent = (content: string | React.ReactNode) => {
    if (typeof content === "string") {
      return content;
    }
    return content;
  };

  return (
    <div
      className={`
        pointer-events-auto relative w-full transform transition-all duration-300 ease-out
        ${
          isVisible && !isRemoving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`${toastClasses} p-4 relative overflow-hidden`}>
        {/* Progress bar */}
        {!persistent && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-neutral-200/50 w-full">
            <div
              className={`h-full transition-all duration-75 ease-linear ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {IconComponent && (
              <IconComponent
                className={`h-5 w-5 ${iconColor} ${type === "loading" ? "animate-spin" : ""}`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold text-neutral-900 mb-1">
                {renderContent(title)}
              </div>
            )}
            <div
              className={`text-sm text-neutral-700 ${
                title ? "font-normal" : "font-medium"
              }`}
            >
              {renderContent(message)}
            </div>

            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className="text-sm font-medium text-neutral-900 underline hover:no-underline transition-all duration-200 hover:text-neutral-700"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:ring-offset-1"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
