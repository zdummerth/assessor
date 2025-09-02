"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Toast, ToastOptions, ToastVariant } from "@/types/toast";
import Toaster from "@/components/toast/Toaster";

type ToastContextType = {
  toast: (opts: ToastOptions) => string; // returns id
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const DEFAULTS = {
  variant: "info" as ToastVariant,
  duration: 4000,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());
  const paused = useRef(false);

  const schedule = useCallback((id: string, duration: number) => {
    if (timers.current.has(id)) return;
    const handle = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, handle);
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = opts.id ?? genId();
      const t: Toast = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? DEFAULTS.variant,
        duration: opts.duration ?? DEFAULTS.duration,
        action: opts.action,
        createdAt: Date.now(),
      };
      setToasts((prev) => [t, ...prev]);
      // schedule auto-dismiss (slight delay so the item is mounted)
      queueMicrotask(() => schedule(id, t.duration));
      return id;
    },
    [schedule]
  );

  const dismiss = useCallback((id: string) => {
    // clear timer + remove
    const h = timers.current.get(id);
    if (h) {
      clearTimeout(h);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    timers.current.forEach((h) => clearTimeout(h));
    timers.current.clear();
    setToasts([]);
  }, []);

  // Pause/resume timers on hover over the toast area
  const onMouseEnter = useCallback(() => {
    if (paused.current) return;
    paused.current = true;
    timers.current.forEach((h, id) => {
      clearTimeout(h);
      timers.current.delete(id);
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!paused.current) return;
    paused.current = false;
    // reschedule remaining durations approximately
    setToasts((prev) => {
      prev.forEach((t) => {
        const elapsed = Date.now() - t.createdAt;
        const remaining = Math.max(800, t.duration - elapsed);
        schedule(t.id, remaining);
      });
      return prev;
    });
  }, [schedule]);

  const value = useMemo<ToastContextType>(
    () => ({ toast, dismiss, clear }),
    [toast, dismiss, clear]
  );

  // cleanup on unmount
  useEffect(() => () => clear(), [clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        toasts={toasts}
        onDismiss={dismiss}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
