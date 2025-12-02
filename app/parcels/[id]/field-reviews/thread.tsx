// app/test/field-reviews/ReviewThreadModal.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useActionState } from "react";
import { addReviewNote, deleteReviewNotes, addReviewStatus } from "./actions";
import { Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
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
  employees?: {
    id: number;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

type StatusRow = {
  id: number;
  review_id: number;
  status: string;
  created_at: string | null;
  created_by: string | null;
};

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

  const errorMessage =
    addStatusState.error || addNoteState.error || delNotesState.error;

  return (
    <>
      <span onClick={() => setIsOpen(true)}>
        {trigger ?? (
          <button
            type="button"
            className="px-2 py-1 rounded border text-xs hover:bg-muted"
          >
            Open
          </button>
        )}
      </span>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-zinc-900/70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-xl border bg-background shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
              <div className="space-y-0.5">
                <DialogTitle className="text-sm font-semibold">
                  {title}
                </DialogTitle>
                <p className="text-[11px] text-muted-foreground">
                  Manage statuses, notes, and images for this field review.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  {errorMessage && (
                    <div className="text-red-600">{errorMessage}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UploadReviewImagesModal
                  reviewId={reviewId}
                  revalidatePath={revalidatePath}
                  buttonLabel="Images"
                  title="Upload Images"
                />
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] md:gap-4 px-4 py-4 md:px-6 md:py-5 overflow-y-auto max-h-[calc(95vh-3rem)]">
              {/* LEFT: Images + Status */}
              <div className="space-y-4 md:pr-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0">
                {/* Images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Images
                    </h3>
                    {images.length > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {images.length} file{images.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                  {images.length === 0 ? (
                    <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                      No images uploaded yet. Use the <strong>Images</strong>{" "}
                      button above to add photos.
                    </div>
                  ) : (
                    <ReviewImagesGrid
                      images={images}
                      revalidatePath={revalidatePath}
                      className="space-y-2"
                    />
                  )}
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </h3>

                  {/* New status form */}
                  <form
                    action={addStatusAction}
                    className="flex flex-col gap-2 rounded-md border bg-muted/40 p-3 text-sm"
                  >
                    <input type="hidden" name="review_id" value={reviewId} />
                    {revalidatePath && (
                      <input
                        type="hidden"
                        name="revalidate_path"
                        value={revalidatePath}
                      />
                    )}
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                        Update status
                      </label>
                      <select
                        name="status"
                        required
                        defaultValue=""
                        className="w-full rounded border bg-background px-3 py-2 text-xs"
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
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        aria-busy={addingStatus}
                        disabled={addingStatus}
                      >
                        {addingStatus ? "Adding…" : "Save status"}
                      </button>
                    </div>
                  </form>

                  {/* Current status */}
                  {latestStatus ? (
                    <div className="rounded-md border bg-background p-3 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs font-semibold">
                              {latestStatus.status}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                              Current
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {fmtShortDateTime(latestStatus.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      No statuses yet.
                    </div>
                  )}

                  {/* Status history */}
                  {olderStatuses.length > 0 && (
                    <div className="rounded-md border bg-background">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/40"
                        onClick={() => setShowHistory((v) => !v)}
                      >
                        <span>
                          {showHistory
                            ? "Hide previous statuses"
                            : `Show previous statuses (${olderStatuses.length})`}
                        </span>
                        {showHistory ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {showHistory && (
                        <ul className="divide-y text-xs">
                          {olderStatuses.map((s) => (
                            <li key={s.id} className="px-3 py-2">
                              <div className="font-medium">{s.status}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {fmtShortDateTime(s.created_at)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Notes */}
              <div className="flex flex-col gap-3 md:pl-2 pt-4 md:pt-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </h3>

                {/* Add note */}
                <form
                  action={addNoteAction}
                  className="rounded-md border bg-muted/40 p-3 text-sm space-y-2"
                >
                  <input type="hidden" name="review_id" value={reviewId} />
                  {revalidatePath && (
                    <input
                      type="hidden"
                      name="revalidate_path"
                      value={revalidatePath}
                    />
                  )}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                      Add a note
                    </label>
                    <textarea
                      name="note"
                      rows={3}
                      placeholder="Write a note about what you saw, did, or decided…"
                      className="w-full rounded border bg-background px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">
                      Notes are ordered from newest to oldest.
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                      aria-busy={addingNote}
                      disabled={addingNote}
                    >
                      {addingNote ? "Adding…" : "Save note"}
                    </button>
                  </div>
                </form>

                {/* Notes list */}
                <div className="flex-1 overflow-y-auto rounded-md border bg-background p-3 text-sm space-y-2">
                  {notes.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      No notes yet. Add the first note above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((n) => {
                        const busy = deletingNotes && deletingNoteId === n.id;
                        const firstName = n.employees?.first_name || "User";
                        const lastName = n.employees?.last_name || "";
                        const initials = `${firstName[0] ?? ""}${
                          lastName[0] ?? ""
                        }`.toUpperCase();

                        return (
                          <div
                            key={n.id}
                            className="rounded-md border bg-muted/40 p-3"
                          >
                            <div className="flex items-start gap-2">
                              {/* Simple avatar */}
                              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                                {initials || "U"}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="whitespace-pre-wrap text-xs">
                                  {n.note}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                  <span>
                                    {firstName} {lastName}
                                  </span>
                                  <span>•</span>
                                  <span>{fmtShortDateTime(n.created_at)}</span>
                                </div>
                              </div>
                              <div>
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
                                    type="submit"
                                    className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                                    aria-busy={busy}
                                    disabled={busy}
                                    title="Delete note"
                                    onClick={() => setDeletingNoteId(n.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    {busy ? "Deleting…" : "Delete"}
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
