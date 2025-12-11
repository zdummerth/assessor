"use client";

import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import BulkFieldReviewForm from "./create";

type BulkFieldReviewCreateDialogProps = {
  parcelIds: number[];
  revalidatePath?: string;
  /**
   * Label for the button that opens the dialog
   */
  triggerLabel?: string;
  /**
   * Dialog title text
   */
  title?: string;
  /**
   * Dialog description text
   */
  description?: string;
};

export function FieldReviewCreateDialog({
  parcelIds,
  revalidatePath,
  triggerLabel = "Add Field Reviews",
  title = "New Field Reviews",
  description = "Create a field review with shared details and apply it to all selected parcels.",
}: BulkFieldReviewCreateDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded border px-2 py-1 text-xs hover:bg-muted">
          <PlusCircle className="h-4 w-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader className="mb-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <BulkFieldReviewForm
          parcelIds={parcelIds}
          revalidatePath={revalidatePath}
          // Override the internal header so we don’t double up titles
          title=""
          description=""
        />
      </DialogContent>
    </Dialog>
  );
}
