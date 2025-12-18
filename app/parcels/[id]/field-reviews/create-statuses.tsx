"use client";

import { useActionState, useEffect } from "react";
import { createFieldReviewStatusesBulk } from "./actions";
import { useReviewStatusOptions } from "@/lib/client-queries";
import { toast } from "sonner";

const initialState = { error: "", success: "" };

export default function BulkFieldReviewStatusForm({
  reviewIds,
  revalidatePath,
  title = "Bulk Update Status",
  description = "Apply the same status (and optional description) to all selected reviews.",
  onSuccess,
}: {
  reviewIds: number[];
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    createFieldReviewStatusesBulk,
    initialState
  );

  const { options: reviewStatusOptions, error: reviewStatusOptionsError } =
    useReviewStatusOptions();

  if (reviewStatusOptionsError) {
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading status options.
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
    if (state.success && onSuccess) {
      toast.success(state.success);
      onSuccess();
    }
  }, [state.success, onSuccess]);

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
        {reviewIds.map((id) => (
          <input key={id} type="hidden" name="review_ids" value={id} />
        ))}

        {/* Optional revalidate path */}
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Status / Description */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="font-medium">Status</label>
            <select
              name="status_id"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select status…
              </option>
              {reviewStatusOptions && reviewStatusOptions.length > 0 ? (
                reviewStatusOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="">Loading statuses...</option>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">Description (optional)</label>
            <input
              name="description"
              type="text"
              placeholder="Reason / note for this status update…"
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
            className="px-4 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-60"
            aria-busy={pending}
            disabled={pending}
          >
            {pending ? "Updating…" : "Apply Status"}
          </button>
        </div>
      </form>
    </section>
  );
}
