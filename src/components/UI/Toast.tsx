// src/components/UI/Toast.tsx
import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
} from "lucide-react";

export interface ToastProps {
  id: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  variant?: "default" | "filled" | "minimal";
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
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
    loading: Zap,
  };

  const getVariantClasses = () => {
    const baseClasses = "rounded-xl shadow-lg border backdrop-blur-sm";

    switch (variant) {
      case "filled":
        return {
          success: `${baseClasses} bg-primary-600 border-primary-700 text-white`,
          error: `${baseClasses} bg-red-600 border-red-700 text-white`,
          warning: `${baseClasses} bg-yellow-600 border-yellow-700 text-white`,
          info: `${baseClasses} bg-blue-600 border-blue-700 text-white`,
          loading: `${baseClasses} bg-purple-600 border-purple-700 text-white`,
        };

      case "minimal":
        return {
          success: `${baseClasses} bg-white/95 border-primary-200 text-gray-900`,
          error: `${baseClasses} bg-white/95 border-red-200 text-gray-900`,
          warning: `${baseClasses} bg-white/95 border-yellow-200 text-gray-900`,
          info: `${baseClasses} bg-white/95 border-blue-200 text-gray-900`,
          loading: `${baseClasses} bg-white/95 border-purple-200 text-gray-900`,
        };

      default: // default variant
        return {
          success: `${baseClasses} bg-primary-50/95 border-primary-200 text-primary-800`,
          error: `${baseClasses} bg-red-50/95 border-red-200 text-red-800`,
          warning: `${baseClasses} bg-yellow-50/95 border-yellow-200 text-yellow-800`,
          info: `${baseClasses} bg-blue-50/95 border-blue-200 text-blue-800`,
          loading: `${baseClasses} bg-purple-50/95 border-purple-200 text-purple-800`,
        };
    }
  };

  const getIconColor = () => {
    if (variant === "filled") return "text-white";
    if (variant === "minimal") return "text-gray-600";

    return {
      success: "text-primary-500",
      error: "text-red-500",
      warning: "text-yellow-500",
      info: "text-blue-500",
      loading: "text-purple-500",
    }[type];
  };

  const getCloseButtonColor = () => {
    if (variant === "filled") return "text-white/80 hover:text-white";
    if (variant === "minimal") return "text-gray-400 hover:text-gray-600";

    return {
      success: "text-primary-600 hover:text-primary-700",
      error: "text-red-600 hover:text-red-700",
      warning: "text-yellow-600 hover:text-yellow-700",
      info: "text-blue-600 hover:text-blue-700",
      loading: "text-purple-600 hover:text-purple-700",
    }[type];
  };

  const getActionButtonColor = () => {
    if (variant === "filled") return "text-white underline hover:no-underline";
    if (variant === "minimal")
      return "text-gray-900 underline hover:no-underline";

    return {
      success: "text-primary-700 underline hover:no-underline",
      error: "text-red-700 underline hover:no-underline",
      warning: "text-yellow-700 underline hover:no-underline",
      info: "text-blue-700 underline hover:no-underline",
      loading: "text-purple-700 underline hover:no-underline",
    }[type];
  };

  const Icon = icons[type];
  const variantClasses = getVariantClasses()[type];

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
        ${variantClasses}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      {!persistent && duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 rounded-t-xl overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${
              variant === "filled" ? "bg-white/30" : "bg-current/30"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon
              className={`h-5 w-5 ${getIconColor()} ${
                type === "loading" ? "animate-pulse" : ""
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold mb-1 leading-tight">
                {renderContent(title)}
              </div>
            )}
            <div
              className={`text-sm leading-relaxed ${
                title ? "" : "font-medium"
              }`}
            >
              {renderContent(message)}
            </div>

            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-semibold transition-all duration-200 ${getActionButtonColor()}`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className={`rounded-lg p-1 transition-all duration-200 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current/20 ${getCloseButtonColor()}`}
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
