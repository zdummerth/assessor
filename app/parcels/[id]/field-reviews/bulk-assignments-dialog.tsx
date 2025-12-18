// components/field-reviews/BulkAssignmentsDialog.tsx
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

import BulkFieldReviewAssignmentsForm from "./create-assignments";

export default function BulkAssignmentsDialog({
  reviewIds,
  revalidatePath,
  triggerLabel = "Bulk assign employees",
  title = "Bulk Assign Employees",
  description = "Assign one or more employees to all selected reviews (with an optional date range).",
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
          <BulkFieldReviewAssignmentsForm
            reviewIds={reviewIds}
            revalidatePath={revalidatePath}
            title={undefined}
            description={undefined}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
