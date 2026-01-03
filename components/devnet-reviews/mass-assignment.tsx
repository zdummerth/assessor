"use client";

import { useActionState, useEffect } from "react";
import { massAssignReviews } from "@/app/devnet-reviews/actions";
import { useDevnetEmployees } from "@/lib/client-queries";
import { toast } from "sonner";

const initialState = { error: "", success: "" };

export default function MassAssignmentForm({
  reviewIds,
  revalidatePath,
  title = "Bulk Assign Reviews",
  description = "Assign all selected reviews to an employee.",
  onSuccess,
}: {
  reviewIds: number[];
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    massAssignReviews,
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
          Assigning <strong>{reviewIds.length}</strong> review
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

        {/* Assignment Details */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <label htmlFor="employee_id" className="font-medium">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              id="employee_id"
              name="employee_id"
              required
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select employee…
              </option>
              {employees && employees.length > 0 ? (
                employees.map(
                  (employee: {
                    id: number;
                    first_name: string;
                    last_name: string;
                    role: string;
                  }) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} (
                      {employee.role})
                    </option>
                  )
                )
              ) : (
                <option value="">Loading employees...</option>
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="due_date" className="font-medium">
              Due Date (optional)
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="assigned_by_id" className="font-medium">
              Assigned By (optional)
            </label>
            <select
              id="assigned_by_id"
              name="assigned_by_id"
              className="border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="">Select supervisor…</option>
              {employees
                ?.filter((emp: { role: string }) => emp.role === "supervisor")
                .map(
                  (supervisor: {
                    id: number;
                    first_name: string;
                    last_name: string;
                  }) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.first_name} {supervisor.last_name}
                    </option>
                  )
                )}
            </select>
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
            {pending ? "Assigning…" : "Assign Reviews"}
          </button>
        </div>
      </form>
    </section>
  );
}
