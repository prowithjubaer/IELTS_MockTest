"use client";

import React, { useState, useCallback, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right",
            toast.type === "success" && "bg-green-50 border-green-200 text-green-800",
            toast.type === "error" && "bg-red-50 border-red-200 text-red-800",
            toast.type === "warning" && "bg-yellow-50 border-yellow-200 text-yellow-800",
            toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-800",
          )}
        >
          {toast.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "warning" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
