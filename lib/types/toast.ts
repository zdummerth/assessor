export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms; default 4000
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast extends Required<Pick<ToastOptions, "id">> {
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
  action?: ToastOptions["action"];
}
