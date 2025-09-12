// app/test/field-reviews/ReviewThreadModal.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useActionState } from "react";
import { addReviewNote, deleteReviewNotes, addReviewStatus } from "./actions";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import UploadReviewImagesModal from "./upload-images";
import ReviewImagesGrid from "./images-editor";

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

// Simple image shape passed in from the server with public URLs
type ImageDisplay = {
  id: number;
  url: string;
  caption: string | null;
  width: number;
  height: number;
  sort_order: number | null;
  created_at?: string | null;
  original_name?: string | null;
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
  initialImages = [],
  trigger,
  revalidatePath,
  title = "Review Thread",
}: {
  reviewId: number;
  initialNotes: NoteRow[];
  initialStatuses: StatusRow[];
  initialImages?: ImageDisplay[];
  trigger?: React.ReactNode;
  revalidatePath?: string;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

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

  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  useEffect(() => {
    if (!deletingNotes) setDeletingNoteId(null);
  }, [deletingNotes]);

  const statuses = useMemo(
    () =>
      [...(initialStatuses || [])].sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      ),
    [initialStatuses]
  );

  const notes = useMemo(
    () =>
      [...(initialNotes || [])].sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      ),
    [initialNotes]
  );

  const images = useMemo(
    () =>
      [...(initialImages || [])].sort((a, b) => {
        // sort by sort_order (nulls last), then created_at desc
        const soA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const soB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (soA !== soB) return soA - soB;
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      }),
    [initialImages]
  );

  const latestStatus = statuses[0];
  const olderStatuses = statuses.slice(1);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpen(true)}>
        {trigger ?? (
          <button className="px-2 py-1 rounded border text-xs">Open</button>
        )}
      </span>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-h-[95vh] overflow-y-auto max-w-4xl space-y-4 border bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <DialogTitle className="text-base font-semibold flex items-center justify-between">
              <div>{title}</div>
              <UploadReviewImagesModal
                reviewId={reviewId}
                revalidatePath={revalidatePath}
                buttonLabel="Images"
                title="Upload Images"
              />
            </DialogTitle>

            {/* ===== IMAGES (from server) ===== */}
            {images.length > 0 && (
              <ReviewImagesGrid
                images={images}
                revalidatePath={revalidatePath}
                className="space-y-2"
              />
            )}

            {/* ===== STATUSES ===== */}
            <div className="space-y-3 text-sm">
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
                  disabled={addingStatus}
                >
                  {addingStatus ? "Adding…" : "Add"}
                </button>
              </form>

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
            <div className="space-y-2 text-sm">
              <div className="text-xs font-semibold text-gray-700">
                Add Note
              </div>
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
                  disabled={addingNote}
                >
                  {addingNote ? "Saving…" : "Save"}
                </button>
              </form>
            </div>

            {/* ===== NOTES ===== */}
            <div className="space-y-2 text-sm">
              <div className="text-xs font-semibold text-gray-700">Notes</div>
              {notes.length === 0 ? (
                <div className="text-gray-500">No notes yet.</div>
              ) : (
                <div className="space-y-2">
                  {notes.map((n) => {
                    const busy = deletingNotes && deletingNoteId === n.id;
                    return (
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
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border text-red-700 hover:bg-red-50 text-xs disabled:opacity-60"
                              aria-busy={busy}
                              disabled={busy}
                              title="Delete note"
                              onClick={() => setDeletingNoteId(n.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                              {busy ? "Deleting…" : "Delete"}
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-end">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            {(addStatusState.error ||
              addNoteState.error ||
              delNotesState.error) && (
              <div className="text-red-600 text-xs">
                {addStatusState.error ||
                  addNoteState.error ||
                  delNotesState.error}
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
