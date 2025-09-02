"use client";

import type { Toast } from "@/types/toast";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  OctagonAlert,
} from "lucide-react";

function Icon({ variant }: { variant: Toast["variant"] }) {
  const cls = "h-4 w-4";
  switch (variant) {
    case "success":
      return <CheckCircle2 className={cls} />;
    case "warning":
      return <AlertTriangle className={cls} />;
    case "error":
      return <OctagonAlert className={cls} />;
    default:
      return <Info className={cls} />;
  }
}

function variantClasses(variant: Toast["variant"]) {
  switch (variant) {
    case "success":
      return "border-emerald-300/60 bg-emerald-50 text-emerald-950";
    case "warning":
      return "border-amber-300/60 bg-amber-50 text-amber-950";
    case "error":
      return "border-rose-300/60 bg-rose-50 text-rose-950";
    default:
      return "border-sky-300/60 bg-sky-50 text-sky-950";
  }
}

export default function Toaster({
  toasts,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] flex items-start justify-end p-4 sm:items-end sm:justify-end"
      aria-live="polite"
      aria-atomic="false"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className="pointer-events-auto flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <li
            key={t.id}
            className={`relative overflow-hidden rounded-xl border shadow-sm transition
                        animate-in slide-in-from-right-4 fade-in-0`}
          >
            <div
              className={`flex items-start gap-3 p-3 ${variantClasses(
                t.variant
              )}`}
            >
              <div className="mt-0.5 shrink-0">
                <Icon variant={t.variant} />
              </div>
              <div className="min-w-0 flex-1">
                {t.title && (
                  <div className="text-sm font-medium">{t.title}</div>
                )}
                {t.description && (
                  <div className="text-xs opacity-90">{t.description}</div>
                )}
                {t.action && (
                  <div className="mt-2">
                    <button
                      className="rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted"
                      onClick={() => t.action?.onClick()}
                    >
                      {t.action.label}
                    </button>
                  </div>
                )}
              </div>
              <button
                className="rounded p-1 text-xs opacity-60 hover:bg-black/5 hover:opacity-100"
                aria-label="Dismiss"
                onClick={() => onDismiss(t.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
