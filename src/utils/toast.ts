import React from "react";

export interface ToastData {
  id: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  variant?: "default" | "filled" | "minimal";
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type ToastListener = (toasts: ToastData[]) => void;

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
    const newToast: ToastData = { ...toast, id };

    this.toasts.push(newToast);
    this.notify();

    // Auto-remove toast after duration (default 5000ms)
    if (!toast.persistent) {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
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

// Global toast manager instance
const toastManager = new ToastManager();

// Pure functions for showing toasts
export const toast = {
  success: (
    message: string | React.ReactNode,
    title?: string | React.ReactNode,
    options?: Partial<ToastData>
  ) => {
    return toastManager.add({
      type: "success",
      message,
      title,
      duration: 4000,
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
      duration: 6000,
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
      duration: 5000,
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
      duration: 4000,
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
};

export { toastManager };
