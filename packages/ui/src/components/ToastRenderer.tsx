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
    console.log("ToastRenderer mounted, current toasts:", toastManager.getToasts());

    // Initialize with current toasts
    const currentToasts = toastManager.getToasts();
    setToasts(currentToasts);
    console.log("Initial toasts:", currentToasts);

    return () => {
      console.log("ToastRenderer unmounted, unsubscribing");
      unsubscribe();
    };
  }, []);

  const getPositionClasses = () => {
    const positions = {
      "top-right": "fixed top-4 right-4 z-50",
      "top-left": "fixed top-4 left-4 z-50",
      "bottom-right": "fixed bottom-4 right-4 z-50",
      "bottom-left": "fixed bottom-4 left-4 z-50",
      "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
      "bottom-center":
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
    };
    return positions[position];
  };

  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`${getPositionClasses()} pointer-events-none max-w-sm w-full`}
      aria-live="polite"
      aria-label="Notifications"
      style={{ zIndex: 9999 }} // Ensure high z-index
    >
      <div className="flex flex-col space-y-3">
        {visibleToasts.map((toast, index) => (
          <div key={toast.id} style={{ animationDelay: `${index * 100}ms` }}>
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
