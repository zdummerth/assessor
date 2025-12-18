"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { assignFieldReviewEmployeesBulk } from "./actions";
import { useEmployees } from "@/lib/client-queries";

const initialState = { error: "", success: "" };

export default function BulkFieldReviewAssignmentsForm({
  reviewIds,
  revalidatePath,
  title = "Bulk Assign Employees",
  description = "Assign one or more employees to all selected reviews for the given date range.",
  onSuccess,
}: {
  reviewIds: number[];
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    assignFieldReviewEmployeesBulk,
    initialState
  );

  const { options: employeeOptions, error: employeeOptionsError } =
    useEmployees();

  if (employeeOptionsError) {
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading employee options.
      </div>
    );
  }

  if (!reviewIds || reviewIds.length === 0) {
    return (
      <div className="mt-4 rounded border bg-yellow-100 p-4 text-xs text-yellow-800">
        No reviews selected for bulk assignment.
      </div>
    );
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      onSuccess?.();
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

        {/* Employees + Valid date range */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="font-medium">Employees</label>
            <div className="max-h-48 overflow-auto rounded border p-2 space-y-2">
              {employeeOptions && employeeOptions.length > 0 ? (
                employeeOptions.map((e) => (
                  // @ts-expect-error need to generate types
                  <label key={e.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      name="employee_ids"
                      // @ts-expect-error need to generate types
                      value={e.id}
                      className="h-4 w-4"
                    />
                    <span className="truncate">
                      {/*@ts-expect-error need to generate types */}
                      {e.last_name}, {e.first_name}
                      {/*@ts-expect-error need to generate types */}
                      {e.email ? (
                        <span className="text-muted-foreground">
                          {" "}
                          {/*@ts-expect-error need to generate types */}•{" "}
                          {e.email}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  Loading employees…
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              You can select multiple employees. Existing overlapping
              assignments for the same employee/review are skipped.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <label className="font-medium">Valid start (optional)</label>
              <input
                name="valid_start"
                type="date"
                className="border rounded px-3 py-2"
              />
              <p className="text-[11px] text-muted-foreground">
                Leave blank to start today.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="font-medium">Valid end (optional)</label>
              <input
                name="valid_end"
                type="date"
                className="border rounded px-3 py-2"
              />
              <p className="text-[11px] text-muted-foreground">
                Leave blank for open-ended assignment.
              </p>
            </div>
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
            {pending ? "Assigning…" : "Assign Employees"}
          </button>
        </div>
      </form>
    </section>
  );
}
