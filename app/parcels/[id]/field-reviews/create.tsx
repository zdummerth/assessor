"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import { createFieldReviewWithInitial } from "./actions";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
  Description,
} from "@headlessui/react";

const initialState = { error: "", success: "" };

const TYPE_OPTIONS = [
  "building permit",
  "sale",
  "fire damage",
  "storm damage",
  "interior inspection",
  "demolition",
  "general",
] as const;

export default function NewFieldReviewModal({
  parcelId,
  revalidatePath,
  buttonLabel = "Add Field Review",
  title = "New Field Review",
  reviewTypes,
}: {
  parcelId: number;
  revalidatePath?: string;
  buttonLabel?: string;
  title?: string;
  reviewTypes: Array<{ id: number; name: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createFieldReviewWithInitial,
    initialState
  );

  useEffect(() => {
    if (state.success) setIsOpen(false);
  }, [state.success]);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded border hover:bg-gray-500"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle className="w-4 h-4" />
        {buttonLabel}
      </button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-zinc-800/70 backdrop-blur-sm" />

        {/* Centered panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl space-y-4 border bg-background p-8 rounded shadow-lg">
            <DialogTitle className="text-base font-semibold">
              {title}
            </DialogTitle>
            <Description className="text-sm">
              Create a field review and optionally add an initial note and
              status.
            </Description>

            <form action={action} className="space-y-4 text-sm">
              <input type="hidden" name="parcel_id" value={parcelId} />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}

              {/* Type / Due Date / Initial Status */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="grid gap-2">
                  <label className="font-medium">Type</label>
                  <select
                    name="type"
                    required
                    defaultValue="general"
                    className="border rounded px-3 py-2"
                  >
                    {reviewTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
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
                    defaultValue="In Progress"
                    className="border rounded px-3 py-2"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Initial Note */}
              <div className="grid gap-2">
                <label className="font-medium">Initial Note</label>
                <textarea
                  name="initial_note"
                  rows={4}
                  placeholder="Add context for the field work…"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                {state.error && (
                  <p className="text-red-600 text-sm">{state.error}</p>
                )}
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsOpen(false)}
                  disabled={pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white"
                  aria-busy={pending}
                >
                  {pending ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
