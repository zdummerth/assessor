// app/test/field-reviews/ReviewThreadModal.tsx
"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/modal";
import { useModal } from "@/components/ui/modal-context";
import { useActionState } from "react";
import { addReviewNote, deleteReviewNotes, addReviewStatus } from "./actions";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

type NoteRow = {
  id: number;
  review_id: number;
  note: string;
  created_at: string | null;
  created_by: string | null;
};

type StatusRow = {
  id: number;
  review_id: number;
  status: string;
  created_at: string | null;
  created_by: string | null;
};

const initialState = { error: "", success: "" };

const fmtShortDateTime = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_OPTIONS = ["In Progress", "Complete"] as const;

export default function ReviewThreadModal({
  reviewId,
  initialNotes,
  initialStatuses,
  trigger,
  revalidatePath,
  title = "Review Thread",
}: {
  reviewId: number;
  initialNotes: NoteRow[];
  initialStatuses: StatusRow[];
  trigger?: React.ReactNode;
  revalidatePath?: string;
  title?: string;
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = useMemo(() => `review-thread-${reviewId}`, [reviewId]);
  const isOpen = currentModalId === modalId;

  // server actions
  const [addStatusState, addStatusAction, addingStatus] = useActionState(
    addReviewStatus,
    initialState
  );
  const [addNoteState, addNoteAction, addingNote] = useActionState(
    addReviewNote,
    initialState
  );
  const [delNotesState, delNotesAction, deletingNotes] = useActionState(
    deleteReviewNotes,
    initialState
  );

  // Sort newest-first
  const statuses = [...(initialStatuses || [])].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  );
  const notes = [...(initialNotes || [])].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  );

  const latestStatus = statuses[0];
  const olderStatuses = statuses.slice(1);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <span onClick={() => openModal(modalId)}>
        {trigger ?? <button>Open</button>}
      </span>

      <Modal open={isOpen} onClose={closeModal} title={title}>
        <div className="space-y-4 text-sm">
          {/* ===== STATUSES ===== */}
          <div className="space-y-3">
            {/* Add Status (now a select) */}
            <form action={addStatusAction} className="flex items-end gap-2">
              <input type="hidden" name="review_id" value={reviewId} />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-600">
                  New Status
                </label>
                <select
                  name="status"
                  required
                  defaultValue=""
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="" disabled>
                    — Select —
                  </option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 h-10 rounded"
                aria-busy={addingStatus}
              >
                {addingStatus ? "Adding…" : "Add"}
              </button>
            </form>

            {/* Latest status (always visible) */}
            {latestStatus ? (
              <div className="rounded border bg-white p-3">
                <div className="font-medium">{latestStatus.status}</div>
                <div className="text-[11px] text-gray-500 mt-1">
                  {fmtShortDateTime(latestStatus.created_at)}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No statuses yet.</div>
            )}

            {/* Older statuses (collapsed) */}
            {olderStatuses.length > 0 && (
              <div className="rounded border bg-gray-50">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium"
                  onClick={() => setShowHistory((v) => !v)}
                >
                  <span>
                    {showHistory
                      ? "Hide status history"
                      : `Show status history (${olderStatuses.length})`}
                  </span>
                  {showHistory ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showHistory && (
                  <ul className="divide-y">
                    {olderStatuses.map((s) => (
                      <li key={s.id} className="px-3 py-2">
                        <div className="font-medium">{s.status}</div>
                        <div className="text-[11px] text-gray-500">
                          {fmtShortDateTime(s.created_at)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* ===== NEW NOTE INPUT ===== */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-700">Add Note</div>
            <form action={addNoteAction} className="flex items-end gap-2">
              <input type="hidden" name="review_id" value={reviewId} />
              {revalidatePath && (
                <input
                  type="hidden"
                  name="revalidate_path"
                  value={revalidatePath}
                />
              )}
              <div className="flex-1">
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Write a note…"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-3 h-10 rounded"
                aria-busy={addingNote}
              >
                {addingNote ? "Saving…" : "Save"}
              </button>
            </form>
          </div>

          {/* ===== NOTES (Cards) ===== */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-700">Notes</div>
            {notes.length === 0 ? (
              <div className="text-gray-500">No notes yet.</div>
            ) : (
              <div className="space-y-2">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded border bg-white shadow-sm p-3"
                  >
                    <div className="whitespace-pre-wrap">{n.note}</div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      {fmtShortDateTime(n.created_at)}
                    </div>
                    <div className="mt-2">
                      <form action={delNotesAction}>
                        <input
                          type="hidden"
                          name="ids_json"
                          value={JSON.stringify([n.id])}
                        />
                        {revalidatePath && (
                          <input
                            type="hidden"
                            name="revalidate_path"
                            value={revalidatePath}
                          />
                        )}
                        <button
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border text-red-700 hover:bg-red-50 text-xs"
                          aria-busy={deletingNotes}
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end">
            <button className="px-4 py-2 rounded border" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
