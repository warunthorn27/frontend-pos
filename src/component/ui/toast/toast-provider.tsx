import { useState } from "react";
import { ToastContext } from "./context";
import Toast from "./Toast";
import type { ToastItem, ToastType } from "./context";

interface Props {
  children: React.ReactNode;
}

export function ToastProvider({ children }: Props) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const contextValue = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    warning: (msg: string) => addToast(msg, "warning"),
    info: (msg: string) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="fixed top-8 right-8 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
