import { createContext, useState, type ReactNode, useCallback } from "react";
import Toast from "../components/Toast/Toast";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
    duration: number;
  }>({ message: "", type: "info", visible: false, duration: 3000 });

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      setToast({ message, type, visible: true, duration });
    },
    []
  );

  const handleClose = () => setToast((t) => ({ ...t, visible: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export { ToastContext };
