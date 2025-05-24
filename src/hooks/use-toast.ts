import { toast } from "sonner";
import type { ExternalToast } from "sonner";
import type { MouseEvent } from "react";

interface ToastOptions extends ExternalToast {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: (
      event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    ) => void;
  };
  cancel?: {
    label: string;
    onClick: (
      event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    ) => void;
  };
}

export function useToast() {
  const showToast = (message: string, options?: ToastOptions) => {
    return toast(message, options);
  };

  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  };

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    return toast.info(message, options);
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, options);
  };

  const showPromise = <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    } & ExternalToast,
  ) => {
    return toast.promise(promise, options);
  };

  const dismiss = (id?: string | number) => {
    toast.dismiss(id);
  };

  return {
    toast: showToast,
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    promise: showPromise,
    dismiss,
  };
}
