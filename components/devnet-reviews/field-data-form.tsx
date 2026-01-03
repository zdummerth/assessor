"use client";

import { useActionState, useEffect } from "react";
import { markDataCollected } from "@/app/devnet-reviews/actions";
import { useDevnetEmployees } from "@/lib/client-queries";
import { toast } from "sonner";

const initialState = { error: "", success: "" };

export default function FieldDataForm({
  reviewId,
  revalidatePath,
  title = "Mark Field Data Collected",
  description = "Record field inspection data for this review.",
  onSuccess,
}: {
  reviewId: number;
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    markDataCollected,
    initialState
  );

  const { options: employees } = useDevnetEmployees();

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
      <header className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>

      <form
        action={(formData) => {
          // Structure field data as JSON
          const fieldData = {
            inspection_date: formData.get("inspection_date"),
            inspector_notes: formData.get("inspector_notes"),
            photos_taken: formData.get("photos_taken")
              ? Number(formData.get("photos_taken"))
              : undefined,
            measurements: {
              length: formData.get("length")
                ? Number(formData.get("length"))
                : undefined,
              width: formData.get("width")
                ? Number(formData.get("width"))
                : undefined,
              height: formData.get("height")
                ? Number(formData.get("height"))
                : undefined,
            },
            condition_rating: formData.get("condition_rating")
              ? Number(formData.get("condition_rating"))
              : undefined,
          };

          // Clean up undefined values
          Object.keys(fieldData.measurements).forEach((key) => {
            if (
              fieldData.measurements[
                key as keyof typeof fieldData.measurements
              ] === undefined
            ) {
              delete fieldData.measurements[
                key as keyof typeof fieldData.measurements
              ];
            }
          });

          // Add structured data to form
          formData.set("field_data", JSON.stringify(fieldData));
          action(formData);
        }}
        className="space-y-4"
      >
        {/* Hidden fields */}
        <input type="hidden" name="review_id" value={reviewId} />
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Inspector and Date */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="employee_id" className="font-medium">
              Inspector <span className="text-red-500">*</span>
            </label>
            <select
              id="employee_id"
              name="employee_id"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select inspector…
              </option>
              {employees?.map(
                (employee: {
                  id: number;
                  first_name: string;
                  last_name: string;
                  role: string;
                }) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} ({employee.role})
                  </option>
                )
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="inspection_date" className="font-medium">
              Inspection Date
            </label>
            <input
              id="inspection_date"
              name="inspection_date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Property Measurements */}
        <fieldset className="border rounded p-3 space-y-3">
          <legend className="font-medium px-2">Property Measurements</legend>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="grid gap-1">
              <label htmlFor="length" className="text-xs font-medium">
                Length (ft)
              </label>
              <input
                id="length"
                name="length"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="width" className="text-xs font-medium">
                Width (ft)
              </label>
              <input
                id="width"
                name="width"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="height" className="text-xs font-medium">
                Height (ft)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="photos_taken" className="text-xs font-medium">
                Photos Taken
              </label>
              <input
                id="photos_taken"
                name="photos_taken"
                type="number"
                min="0"
                placeholder="0"
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* Condition Assessment */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="condition_rating" className="font-medium">
              Condition Rating (1-5)
            </label>
            <select
              id="condition_rating"
              name="condition_rating"
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="">Select rating…</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>

        {/* Inspector Notes */}
        <div className="grid gap-2">
          <label htmlFor="inspector_notes" className="font-medium">
            Inspector Notes
          </label>
          <textarea
            id="inspector_notes"
            name="inspector_notes"
            rows={4}
            placeholder="Enter detailed inspection notes…"
            className="border rounded px-3 py-2 resize-none"
          />
        </div>

        {/* Additional Notes */}
        <div className="grid gap-2">
          <label htmlFor="notes" className="font-medium">
            Additional Notes (optional)
          </label>
          <input
            id="notes"
            name="notes"
            type="text"
            placeholder="Any additional comments…"
            className="border rounded px-3 py-2"
          />
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
            {pending ? "Recording Data…" : "Mark Data Collected"}
          </button>
        </div>
      </form>
    </section>
  );
}
