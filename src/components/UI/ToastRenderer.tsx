import React, { useState, useEffect } from "react";
import { toastManager, ToastData } from "@/utils/toast";
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
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((newToasts) => {
      setToasts(newToasts);
    });

    // Initialize with current toasts
    setToasts(toastManager.getToasts());

    return () => {
      unsubscribe();
    };
  }, []);

  const positionClasses = {
    "top-right": "top-20 right-4",
    "top-left": "top-20 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none ${positionClasses[position]}`}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="flex flex-col space-y-3">
        {visibleToasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            persistent={toast.persistent}
            action={toast.action}
            onClose={toastManager.remove.bind(toastManager)}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastRenderer;
