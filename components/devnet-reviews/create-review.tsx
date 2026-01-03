"use client";

import { useActionState, useEffect } from "react";
import { createDevnetReview } from "@/app/devnet-reviews/actions";
import { useDevnetEmployees } from "@/lib/client-queries";
import { toast } from "sonner";
import type {
  DevnetReviewKind,
  DevnetEntityType,
  ReviewPriority,
} from "@/app/devnet-reviews/actions";

const initialState = { error: "", success: "" };

const REVIEW_KINDS: { value: DevnetReviewKind; label: string }[] = [
  { value: "sale_review", label: "Sale Review" },
  { value: "permit_review", label: "Permit Review" },
  { value: "appeal_review", label: "Appeal Review" },
  { value: "custom_review", label: "Custom Review" },
];

const ENTITY_TYPES: { value: DevnetEntityType; label: string }[] = [
  { value: "devnet_sale", label: "Sale" },
  { value: "devnet_parcel", label: "Parcel" },
  { value: "devnet_neighborhood", label: "Neighborhood" },
];

const PRIORITIES: { value: ReviewPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function CreateReviewForm({
  revalidatePath,
  title = "Create Review",
  description = "Create a new review for a devnet entity.",
  onSuccess,
}: {
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    createDevnetReview,
    initialState
  );

  const { options: employees, error: employeesError } = useDevnetEmployees();

  if (employeesError) {
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading employees: {employeesError.message}
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
      <header className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>

      <form action={action} className="space-y-4">
        {/* Optional revalidate path */}
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Review Details */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="kind" className="font-medium">
              Review Type <span className="text-red-500">*</span>
            </label>
            <select
              id="kind"
              name="kind"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select review type…
              </option>
              {REVIEW_KINDS.map((kind) => (
                <option key={kind.value} value={kind.value}>
                  {kind.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="priority" className="font-medium">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="border rounded px-3 py-2"
              defaultValue="medium"
            >
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="entity_type" className="font-medium">
              Entity Type <span className="text-red-500">*</span>
            </label>
            <select
              id="entity_type"
              name="entity_type"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select entity type…
              </option>
              {ENTITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="entity_id" className="font-medium">
              Entity ID <span className="text-red-500">*</span>
            </label>
            <input
              id="entity_id"
              name="entity_id"
              type="number"
              required
              min="1"
              placeholder="Enter entity ID…"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="title" className="font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Enter review title…"
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Enter review description…"
            className="border rounded px-3 py-2 resize-none"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="assigned_to_id" className="font-medium">
            Assign To (optional)
          </label>
          <select
            id="assigned_to_id"
            name="assigned_to_id"
            className="border rounded px-3 py-2"
            defaultValue=""
          >
            <option value="">Leave unassigned…</option>
            {employees && employees.length > 0 ? (
              employees.map(
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
              )
            ) : (
              <option value="">Loading employees...</option>
            )}
          </select>
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
            {pending ? "Creating Review…" : "Create Review"}
          </button>
        </div>
      </form>
    </section>
  );
}
