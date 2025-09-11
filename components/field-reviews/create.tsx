// app/test/field-reviews/NewFieldReviewModal.tsx
"use client";

import { useMemo, useEffect } from "react";
import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useModal } from "@/components/ui/modal-context";
import { createFieldReviewWithInitial } from "./actions";

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
}: {
  parcelId: number;
  revalidatePath?: string;
  buttonLabel?: string;
  title?: string;
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = useMemo(() => `add-review-${parcelId}`, [parcelId]);
  const isOpen = currentModalId === modalId;
  const [state, action, pending] = useActionState(
    createFieldReviewWithInitial,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      closeModal();
    }
  }, [state, closeModal]);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded border hover:bg-gray-50"
        onClick={() => openModal(modalId)}
      >
        <PlusCircle className="w-4 h-4" />
        {buttonLabel}
      </button>

      <Modal open={isOpen} onClose={closeModal} title={title}>
        <form action={action} className="p-3 space-y-3 text-sm">
          <input type="hidden" name="parcel_id" value={parcelId} />
          {revalidatePath && (
            <input
              type="hidden"
              name="revalidate_path"
              value={revalidatePath}
            />
          )}

          {/* Type */}
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-2">
              <label className="font-medium">Type</label>
              <select
                name="type"
                required
                defaultValue="general"
                className="border rounded px-3 py-2"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="grid gap-2">
              <label className="font-medium">Due Date</label>
              <input
                name="due_date"
                type="date"
                required
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Initial Status (select) */}
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

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={closeModal}
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
      </Modal>
    </>
  );
}
