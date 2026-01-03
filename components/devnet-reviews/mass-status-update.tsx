"use client";

import { useActionState, useEffect } from "react";
import { massUpdateReviewStatus } from "@/app/devnet-reviews/actions";
import { useDevnetReviewStatuses } from "@/lib/client-queries";
import { toast } from "sonner";
import type { DevnetReviewKind } from "@/app/devnet-reviews/actions";

const initialState = { error: "", success: "" };

export default function MassStatusUpdateForm({
  reviewIds,
  reviewKind,
  revalidatePath,
  title = "Bulk Update Status",
  description = "Apply the same status to all selected reviews.",
  onSuccess,
}: {
  reviewIds: number[];
  reviewKind?: DevnetReviewKind;
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    massUpdateReviewStatus,
    initialState
  );

  const { options: statusOptions, error: statusOptionsError } =
    useDevnetReviewStatuses(reviewKind);

  if (statusOptionsError) {
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading status options: {statusOptionsError.message}
      </div>
    );
  }

  if (!reviewIds || reviewIds.length === 0) {
    return (
      <div className="mt-4 rounded border bg-yellow-100 p-4 text-xs text-yellow-800">
        No reviews selected for bulk status update.
      </div>
    );
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      if (onSuccess) onSuccess();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, onSuccess]);

  return (
    <section className="w-full rounded border bg-background p-4 md:p-6 space-y-4 text-sm">
      <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Applying to <strong>{reviewIds.length}</strong> review
          {reviewIds.length === 1 ? "" : "s"}
        </p>
      </header>

      <form action={action} className="space-y-4">
        {/* Hidden review ids */}
        <input
          type="hidden"
          name="review_ids"
          value={JSON.stringify(reviewIds)}
        />

        {/* Optional revalidate path */}
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Status Selection and Notes */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="new_status_slug" className="font-medium">
              New Status
            </label>
            <select
              id="new_status_slug"
              name="new_status_slug"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select new status…
              </option>
              {statusOptions && statusOptions.length > 0 ? (
                statusOptions.map(
                  (status: { id: number; slug: string; name: string }) => (
                    <option key={status.id} value={status.slug}>
                      {status.name}
                    </option>
                  )
                )
              ) : (
                <option value="">Loading statuses...</option>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="font-medium">
              Notes (optional)
            </label>
            <input
              id="notes"
              name="notes"
              type="text"
              placeholder="Reason for status change…"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
          <div className="text-xs">
            {state.error && <p className="text-red-600">{state.error}</p>}
            {state.success && (
              <p className="text-emerald-600">{state.success}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
            aria-busy={pending}
            disabled={pending}
          >
            {pending ? "Updating Status…" : "Update Status"}
          </button>
        </div>
      </form>
    </section>
  );
}
