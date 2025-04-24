"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import Toast from "./toast";

export type ToastType = "success" | "error";

export interface ShowToastOpts {
  message: string;
  type?: ToastType;
  timeOpen?: number;
}

interface ToastData extends Required<ShowToastOpts> {
  id: number;
}

interface ToastContextProps {
  showToast: (opts: ShowToastOpts) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    ({ message, type = "success", timeOpen = 5000 }: ShowToastOpts) => {
      const id = Date.now();
      const toast: ToastData = { id, message, type, timeOpen };
      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timeOpen);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map(({ id, message, type, timeOpen }) => (
          <Toast
            key={id}
            successMessage={type === "success" ? message : undefined}
            errorMessage={type === "error" ? message : undefined}
            timeOpen={timeOpen}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
