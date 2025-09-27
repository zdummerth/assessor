"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Trash2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// server actions
import {
  addCondition,
  deleteConditions,
  bulkUpdateConditions,
} from "@/app/structures/actions";

type ConditionRow = {
  id: number;
  structure_id: number;
  condition: string;
  effective_date: string; // "YYYY-MM-DD"
  created_at?: string | null;
};

type Props = {
  structureId: number;
  conditions: ConditionRow[];
  revalidatePath?: string;
  buttonLabel?: string;
  modalTitle?: string;
};

const CONDITION_OPTIONS = [
  "Unsound",
  "Poor",
  "Fair",
  "Average",
  "Good",
  "Very Good",
  "Excellent",
];

const initialState = { error: "", success: "" };

export default function ConditionsCRUDModal({
  structureId,
  conditions,
  revalidatePath,
  buttonLabel = "Edit Conditions",
  modalTitle = "Conditions",
}: Props) {
  // selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? new Set(conditions.map((c) => c.id)) : new Set());
  const selectedCount = selectedIds.size;
  const nothingSelected = selectedCount === 0;

  // bulk inputs (always visible)
  const [bulkCondition, setBulkCondition] = useState("");
  const [bulkDate, setBulkDate] = useState("");

  // server actions
  const [createState, createAction, creating] = useActionState(
    addCondition,
    initialState
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteConditions,
    initialState
  );

  // separate bulk hooks so only one button shows loading
  const [bulkCondState, bulkConditionAction, bulkingCondition] = useActionState(
    bulkUpdateConditions,
    initialState
  );
  const [bulkDateState, bulkDateAction, bulkingDate] = useActionState(
    bulkUpdateConditions,
    initialState
  );

  // Reset bits on success (no toasts; we’ll show inline messages)
  useEffect(() => {
    if (
      createState.success ||
      deleteState.success ||
      bulkCondState.success ||
      bulkDateState.success
    ) {
      setSelectedIds(new Set()); // clear selection
      setBulkCondition("");
      setBulkDate("");
    }
  }, [
    createState.success,
    deleteState.success,
    bulkCondState.success,
    bulkDateState.success,
  ]);

  const isBusy = creating || deleting || bulkingCondition || bulkingDate;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          <span>{buttonLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="p-2 text-sm text-gray-800 space-y-3">
          {/* ROW 1: New condition */}
          <form
            action={createAction}
            className="border rounded p-2 bg-gray-50 flex flex-wrap items-end gap-2"
          >
            <input type="hidden" name="structure_id" value={structureId} />
            {revalidatePath && (
              <input
                type="hidden"
                name="revalidate_path"
                value={revalidatePath}
              />
            )}

            <div className="flex flex-col">
              <label className="font-semibold mb-1">New Condition</label>
              <select
                name="condition"
                required
                defaultValue=""
                className="border rounded px-3 py-2 h-10 min-w-[12rem]"
              >
                <option value="" disabled>
                  — Select —
                </option>
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Effective Date</label>
              <input
                name="effective_date"
                type="date"
                required
                className="border rounded px-3 py-2 h-10 min-w-[12rem]"
              />
            </div>

            <div className="flex-1" />

            <Button type="submit" className="w-28" aria-busy={creating}>
              {creating ? "Saving…" : "Add"}
            </Button>
          </form>

          <InlineStatus state={createState} />

          {/* ROW 2: Bulk controls + Delete */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Bulk Condition */}
            <form
              action={bulkConditionAction}
              className={`flex items-end gap-2 ${nothingSelected ? "opacity-50" : ""}`}
            >
              <input type="hidden" name="mode" value="condition" />
              <input
                type="hidden"
                name="ids_json"
                // @ts-expect-error - JSON stringify
                value={JSON.stringify([...selectedIds])}
              />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Set Condition</label>
                <select
                  name="condition"
                  required
                  value={bulkCondition}
                  onChange={(e) => setBulkCondition(e.target.value)}
                  className="border rounded px-3 py-2 h-10 min-w-[8rem]"
                  disabled={nothingSelected || bulkingCondition}
                >
                  <option value="" disabled>
                    — Select —
                  </option>
                  {CONDITION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-20"
                disabled={nothingSelected || bulkingCondition || !bulkCondition}
                aria-busy={bulkingCondition}
              >
                {bulkingCondition ? "Applying…" : "Apply"}
              </Button>
            </form>

            <InlineStatus state={bulkCondState} />

            {/* Bulk Effective Date */}
            <form
              action={bulkDateAction}
              className={`flex items-end gap-2 ${nothingSelected ? "opacity-50" : ""}`}
            >
              <input type="hidden" name="mode" value="effective_date" />
              <input
                type="hidden"
                name="ids_json"
                // @ts-expect-error - JSON stringify
                value={JSON.stringify([...selectedIds])}
              />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Set Effective Date</label>
                <input
                  name="effective_date"
                  type="date"
                  required
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className="border rounded px-3 py-2 h-10 min-w-[8rem]"
                  disabled={nothingSelected || bulkingDate}
                />
              </div>

              <Button
                type="submit"
                className="w-20"
                disabled={nothingSelected || bulkingDate || !bulkDate}
                aria-busy={bulkingDate}
              >
                {bulkingDate ? "Applying…" : "Apply"}
              </Button>
            </form>

            <InlineStatus state={bulkDateState} />

            {/* Delete selected */}
            <form action={deleteAction} className="flex items-end gap-2">
              <input
                type="hidden"
                name="ids_json"
                // @ts-expect-error - JSON stringify
                value={JSON.stringify([...selectedIds])}
              />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}

              <Button
                variant="outline"
                className="inline-flex items-center gap-2 w-32 justify-center text-red-700 hover:bg-red-50"
                disabled={nothingSelected || deleting}
                aria-busy={deleting}
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </form>
          </div>

          <InlineStatus state={deleteState} />

          {/* TABLE */}
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={
                        selectedCount === conditions.length &&
                        conditions.length > 0
                      }
                      onChange={(e) => selectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-2 text-left w-[30%]">Condition</th>
                  <th className="p-2 text-left w-[30%]">Effective Date</th>
                  <th className="p-2 text-left w-[40%]">Created</th>
                </tr>
              </thead>
              <tbody>
                {conditions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No conditions found.
                    </td>
                  </tr>
                ) : (
                  conditions.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          aria-label={`Select ${row.id}`}
                        />
                      </td>
                      <td className="p-2 truncate">{row.condition}</td>
                      <td className="p-2 truncate">{row.effective_date}</td>
                      <td className="p-2 truncate">{row.created_at ?? ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isBusy}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Inline status helper (success/error) */
function InlineStatus({
  state,
}: {
  state: { error?: string; success?: string };
}) {
  if (state?.error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      >
        {state.error || "Something went wrong."}
      </div>
    );
  }
  if (state?.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
      >
        {state.success || "Saved successfully."}
      </div>
    );
  }
  return null;
}
