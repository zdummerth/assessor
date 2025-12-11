"use client";

import { useActionState } from "react";
import { createFieldReviewsBulk } from "./actions";
import {
  useReviewStatusOptions,
  useReviewTypeOptions,
} from "@/lib/client-queries";

const initialState = { error: "", success: "" };

export default function BulkFieldReviewForm({
  parcelIds,
  revalidatePath,
  title = "Create Field Reviews",
  description = "Create a field review with shared details and apply it to all selected parcels.",
}: {
  parcelIds: number[];
  revalidatePath?: string;
  title?: string;
  description?: string;
}) {
  const [state, action, pending] = useActionState(
    createFieldReviewsBulk,
    initialState
  );

  const { options: reviewStatusOptions, error: reviewStatusOptionsError } =
    useReviewStatusOptions();

  const { options: reviewTypeOptions, error: reviewTypeOptionsError } =
    useReviewTypeOptions();

  if (reviewStatusOptionsError || reviewTypeOptionsError) {
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading review options.
      </div>
    );
  }

  if (!parcelIds || parcelIds.length === 0) {
    return (
      <div className="mt-4 rounded border bg-yellow-100 p-4 text-xs text-yellow-800">
        No parcels selected for bulk field review creation.
      </div>
    );
  }

  return (
    <section className="w-full rounded border bg-background p-4 md:p-6 space-y-4 text-sm">
      <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Applying to <strong>{parcelIds.length}</strong> parcel
          {parcelIds.length === 1 ? "" : "s"}
        </p>
      </header>

      <form action={action} className="space-y-4">
        {/* Hidden parcel ids */}
        {parcelIds.map((id) => (
          <input key={id} type="hidden" name="parcel_ids" value={id} />
        ))}

        {/* Optional revalidate path */}
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Type / Due Date / Initial Status */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="font-medium">Type</label>
            <select
              name="type"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select type…
              </option>
              {reviewTypeOptions && reviewTypeOptions.length > 0 ? (
                reviewTypeOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.display_name}
                  </option>
                ))
              ) : (
                <option value="">Loading types...</option>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="font-medium">Due Date</label>
            <input
              name="due_date"
              type="date"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="grid gap-2">
            <label className="font-medium">Initial Status</label>
            <select
              name="initial_status"
              className="border rounded px-3 py-2"
              defaultValue={1}
            >
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
        </div>

        {/* Initial Note */}
        <div className="grid gap-2">
          <label className="font-medium">Initial Note</label>
          <textarea
            name="initial_note"
            rows={3}
            placeholder="Add context for the field work…"
            className="border rounded px-3 py-2"
          />
          <p className="text-[11px] text-muted-foreground">
            At least one of initial status or initial note is required.
          </p>
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
            {pending ? "Creating…" : "Create Field Reviews"}
          </button>
        </div>
      </form>
    </section>
  );
}
