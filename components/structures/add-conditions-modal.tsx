"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast-context";
import { addCondition } from "@/app/test/structures/actions";

const initialState = { error: "", success: "" };

const CONDITION_OPTIONS = [
  "Unsound",
  "Poor",
  "Fair",
  "Average",
  "Good",
  "Very Good",
  "Excellent",
];

export default function AddConditionModal({
  structureId,
  defaultEffectiveDate, // e.g., sale_date - 1 day ("YYYY-MM-DD")
  revalidatePath, // optional: e.g., `/parcels/123` or current page
  buttonLabel = "Add Condition",
  modalTitle = "Add Condition at Date",
  compact = false,
}: {
  structureId: number;
  defaultEffectiveDate?: string;
  revalidatePath?: string;
  buttonLabel?: string;
  modalTitle?: string;
  compact?: boolean;
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = useMemo(() => `add-condition-${structureId}`, [structureId]);
  const isOpen = currentModalId === modalId;

  const [state, action, pending] = useActionState(addCondition, initialState);
  const [form, setForm] = useState({
    condition: "",
    effective_date: defaultEffectiveDate || "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (state.error) {
      showToast({ message: state.error, type: "error", timeOpen: 10000 });
    }
    if (state.success) {
      showToast({ message: state.success, type: "success", timeOpen: 2000 });
      // Reset & close
      setForm({
        condition: "",
        effective_date: defaultEffectiveDate || "",
      });
      closeModal();
    }
  }, [state, showToast, closeModal, defaultEffectiveDate]);

  const edited = Boolean(form.condition && form.effective_date);

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className={`hover:text-blue-700 inline-flex items-center gap-2 ${compact ? "" : "text-sm"}`}
        title={buttonLabel}
      >
        <PlusCircle className="w-4 h-4" />
        {!compact && <span>{buttonLabel}</span>}
      </button>

      <Modal open={isOpen} onClose={closeModal} title={modalTitle}>
        <form action={action} className="p-2 text-sm text-gray-800 space-y-3">
          {/* Hidden fields */}
          <input type="hidden" name="structure_id" value={structureId} />
          {revalidatePath && (
            <input
              type="hidden"
              name="revalidate_path"
              value={revalidatePath}
            />
          )}

          <div>
            <label className="block font-semibold mb-1" htmlFor="condition">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={form.condition}
              onChange={(e) =>
                setForm((p) => ({ ...p, condition: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">— Select Condition —</option>
              {CONDITION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block font-semibold mb-1"
              htmlFor="effective_date"
            >
              Effective Date
            </label>
            <input
              id="effective_date"
              name="effective_date"
              type="date"
              value={form.effective_date}
              onChange={(e) =>
                setForm((p) => ({ ...p, effective_date: e.target.value }))
              }
              className="border rounded px-3 py-2 w-full"
            />
            {defaultEffectiveDate && (
              <p className="text-xs text-gray-500 mt-1">
                Tip: for “condition at sale,” use {defaultEffectiveDate}.
              </p>
            )}
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
              disabled={pending || !edited}
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-25"
            >
              {pending ? "Saving..." : "Save Condition"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
