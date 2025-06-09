import React from "react";

export interface ToastData {
  id: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  variant?: "default" | "minimal";
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ToastListener = (toasts: ToastData[]) => void;

class ToastManager {
  private toasts: ToastData[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(toast: Omit<ToastData, "id">) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      ...toast,
      id,
      variant: toast.variant || "default",
    };

    this.toasts.push(newToast);
    this.notify();

    // Auto-remove toast after duration
    if (!toast.persistent) {
      const duration = toast.duration || this.getDefaultDuration(toast.type);
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  private getDefaultDuration(type?: string) {
    switch (type) {
      case "success":
        return 3000;
      case "error":
        return 5000;
      case "warning":
        return 4000;
      case "info":
        return 3500;
      case "loading":
        return 0; // Loading toasts should be persistent by default
      default:
        return 4000;
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  getToasts() {
    return [...this.toasts];
  }
}

export const toastManager = new ToastManager();

const toast = {
  success: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "success",
      message,
      title,
      variant: "default",
      ...options,
    });
  },

  error: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "error",
      message,
      title,
      variant: "default",
      ...options,
    });
  },

  warning: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "warning",
      message,
      title,
      variant: "default",
      ...options,
    });
  },

  info: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "info",
      message,
      title,
      variant: "default",
      ...options,
    });
  },

  loading: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "loading",
      message,
      title,
      persistent: true,
      variant: "default",
      ...options,
    });
  },

  minimal: (
    message: string | React.ReactNode,
    type: "success" | "error" | "warning" | "info" = "info",
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type,
      message,
      variant: "minimal",
      ...options,
    });
  },

  custom: (toastData: Omit<ToastData, "id">) => {
    return toastManager.add(toastData);
  },

  dismiss: (id: string) => {
    toastManager.remove(id);
  },

  clear: () => {
    toastManager.clear();
  },

  // Modern promise-based loading states
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string | React.ReactNode;
      success:
        | string
        | React.ReactNode
        | ((data: T) => string | React.ReactNode);
      error:
        | string
        | React.ReactNode
        | ((error: any) => string | React.ReactNode);
    }
  ) => {
    const loadingId = toast.loading(loading);

    promise
      .then((data) => {
        toast.dismiss(loadingId);
        const successMessage =
          typeof success === "function" ? success(data) : success;
        toast.success(successMessage);
      })
      .catch((err) => {
        toast.dismiss(loadingId);
        const errorMessage = typeof error === "function" ? error(err) : error;
        toast.error(errorMessage);
      });

    return promise;
  },
};

export { toast };
export default toast;
