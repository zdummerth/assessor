// components/field-reviews/BulkStatusDialog.tsx
"use client";

import * as React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// import your bulk form (adjust path)
import BulkFieldReviewStatusForm from "./create-statuses";

export default function BulkStatusDialog({
  reviewIds,
  revalidatePath,
  triggerLabel = "Bulk update status",
  title = "Bulk Update Status",
  description = "Apply the same status (and optional description) to all selected reviews.",
  disabled,
  onSuccess,
}: {
  reviewIds: number[];
  revalidatePath?: string;
  triggerLabel?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const safeDisabled = disabled || !reviewIds || reviewIds.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center rounded border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-60"
          disabled={safeDisabled}
        >
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}{" "}
            <span className="ml-1 text-xs">
              Applying to <strong>{reviewIds.length}</strong> review
              {reviewIds.length === 1 ? "" : "s"}.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <BulkFieldReviewStatusForm
            reviewIds={reviewIds}
            revalidatePath={revalidatePath}
            title={undefined}
            description={undefined}
            onSuccess={() => {
              setOpen(false);
              if (onSuccess) {
                onSuccess();
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
