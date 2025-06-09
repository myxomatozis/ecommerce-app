import React, { useState, useEffect } from "react";
import { toastManager, ToastData } from "./ToastManager";
import Toast from "./Toast";

interface ToastRendererProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
}

const ToastRenderer: React.FC<ToastRendererProps> = ({
  position = "top-right",
  maxToasts = 4,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    // Subscribe to toast manager
    const unsubscribe = toastManager.subscribe((newToasts) => {
      setToasts(newToasts);
    });

    // Initialize with current toasts
    const currentToasts = toastManager.getToasts();
    setToasts(currentToasts);

    return () => {
      unsubscribe();
    };
  }, []);

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
      pointerEvents: "none",
      maxWidth: "24rem",
      width: "100%",
    };

    const positions = {
      "top-right": { top: "1rem", right: "1rem" },
      "top-left": { top: "1rem", left: "1rem" },
      "bottom-right": { bottom: "1rem", right: "1rem" },
      "bottom-left": { bottom: "1rem", left: "1rem" },
      "top-center": {
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
      },
      "bottom-center": {
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
      },
    };

    return { ...baseStyles, ...positions[position] };
  };

  const containerStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  };

  const toastWrapperStyles: React.CSSProperties = {
    pointerEvents: "auto",
  };

  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      id="toast-container"
      style={getPositionStyles()}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div style={containerStyles}>
        {visibleToasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              ...toastWrapperStyles,
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Toast
              id={toast.id}
              type={toast.type}
              variant={toast.variant || "default"}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              persistent={toast.persistent}
              action={toast.action}
              onClose={(id) => {
                toastManager.remove(id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastRenderer;
