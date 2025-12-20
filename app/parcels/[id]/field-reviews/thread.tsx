// app/parcels/[id]/field-reviews/thread.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { addReviewNote, deleteReviewNotes, addReviewStatus } from "./actions";
import UploadReviewImagesModal from "./upload-images";
import ReviewImagesGrid from "./images-editor";
import { ReviewStatusHistory } from "@/components/reviews/review-status-history";
import { useReviewStatusOptions } from "@/lib/client-queries";

/* ------------------------------ helpers ------------------------------ */

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

const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function safeArray<T = any>(v: any): T[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function uniqBy<T>(arr: T[], keyFn: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function employeeName(e: any) {
  if (!e) return "—";
  const full = [e.first_name, e.last_name].filter(Boolean).join(" ").trim();
  return full || e.email || "—";
}

function employeeInitials(e: any) {
  if (!e) return "U";
  const a = (e.first_name?.[0] ?? "").toUpperCase();
  const b = (e.last_name?.[0] ?? "").toUpperCase();
  if (a || b) return `${a}${b}`;
  return (e.email?.[0] ?? "U").toUpperCase();
}

function structureSummaryFromParcel(p: any) {
  const cs = p?.current_structures;
  if (!Array.isArray(cs) || cs.length === 0) return "None";
  const n = cs.length;
  const sections = cs.reduce(
    (acc: number, item: any) =>
      acc + (Array.isArray(item?.sections) ? item.sections.length : 0),
    0
  );
  return `${n} structure${n === 1 ? "" : "s"} • ${sections} section${sections === 1 ? "" : "s"}`;
}

function parcelAddressLine(p: any) {
  return (
    p?.address_line1 ||
    p?.address_formatted ||
    [p?.address_city, p?.address_state, p?.address_postcode]
      .filter(Boolean)
      .join(", ") ||
    null
  );
}

/* ---------------------- Component 1: dialog wrapper ---------------------- */

export function ReviewThreadDialog({
  review,
  initialImages = [],
  trigger,
  revalidatePath,
  title = "Review Thread",
}: {
  review: any;
  initialImages?: any[];
  trigger?: React.ReactNode;
  revalidatePath?: string;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
          <DialogPanel className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-xl border bg-background shadow-lg">
            <ReviewThreadForm
              review={review}
              initialImages={initialImages}
              revalidatePath={revalidatePath}
              title={title}
              onRequestClose={() => setIsOpen(false)}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

/* -------------------------- Component 2: the form ------------------------- */

export function ReviewThreadForm({
  review,
  initialImages = [],
  revalidatePath,
  title = "Review Thread",
  onRequestClose,
}: {
  review: any;
  initialImages?: any[];
  revalidatePath?: string;
  title?: string;
  onRequestClose?: () => void;
}) {
  const reviewId = Number(review?.field_review_id ?? review?.id);

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

  const errorMessage =
    addStatusState.error || addNoteState.error || delNotesState.error;

  const {
    options: statusOptions,
    isLoading: loadingStatusOptions,
    error: statusOptionsError,
  } = useReviewStatusOptions();

  const statusHistoryJson = useMemo(
    () => safeArray<any>(review?.status_history),
    [review?.status_history]
  );

  const notesJson = useMemo(
    () => safeArray<any>(review?.notes),
    [review?.notes]
  );

  const assignmentsJson = useMemo(
    () => safeArray<any>(review?.assignments),
    [review?.assignments]
  );

  const parcelsJson = useMemo(() => {
    const fromFn = safeArray<any>(review?.parcels);
    if (fromFn.length) return fromFn;

    // fallback if you still have "one-row-per-parcel" columns
    if (review?.parcel_id == null) return [];
    return [
      {
        parcel_id: review?.parcel_id,
        block: review?.block ?? null,
        lot: review?.lot ?? null,
        ext: review?.ext ?? null,
        address_line1: review?.address_line1 ?? null,
        address_formatted: review?.address_formatted ?? null,
        address_city: review?.address_city ?? null,
        address_state: review?.address_state ?? null,
        address_postcode: review?.address_postcode ?? null,
        current_land_use: review?.current_land_use ?? null,
        current_structures: review?.current_structures ?? null,
      },
    ];
  }, [review]);

  const salesJson = useMemo(
    () => safeArray<any>(review?.sales),
    [review?.sales]
  );

  // convert json history into what ReviewStatusHistory expects
  const statusesForTimeline = useMemo(() => {
    const rows = statusHistoryJson.map((h: any) => ({
      id: Number(h?.id),
      review_id: reviewId,
      status: {
        id: Number(h?.status_id ?? 0),
        name: String(h?.status_name ?? "—"),
      },
      created_at: h?.created_at ?? null,
      created_by: h?.created_by ?? null,
    }));
    return rows.sort(
      (a: any, b: any) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
    );
  }, [statusHistoryJson, reviewId]);

  const latestStatus = statusesForTimeline[0];

  const images = useMemo(
    () =>
      [...(initialImages || [])].sort((a: any, b: any) => {
        const soA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const soB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (soA !== soB) return soA - soB;
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      }),
    [initialImages]
  );

  const activeEmployees = useMemo(() => {
    const emps = assignmentsJson.map((a: any) => a?.employee).filter(Boolean);
    return uniqBy(emps, (e: any) => String(e?.id));
  }, [assignmentsJson]);

  const [showStructureDetails, setShowStructureDetails] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="border-b px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted"
            onClick={onRequestClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            <span className="uppercase">Review:</span> #{reviewId}
          </span>
          {review?.review_type_name ? (
            <span>
              <span className="uppercase">Type:</span> {review.review_type_name}
            </span>
          ) : null}
          {review?.latest_status_name ? (
            <span>
              <span className="uppercase">Latest:</span>{" "}
              {review.latest_status_name}
            </span>
          ) : null}
          {review?.review_due_date ? (
            <span>
              <span className="uppercase">Due:</span>{" "}
              {fmtDate(review.review_due_date)}
            </span>
          ) : null}
          <span>
            <span className="uppercase">Created:</span>{" "}
            {fmtShortDateTime(review?.review_created_at)}
          </span>
        </div>

        <div className="mt-3 flex flex-col md:flex-row md:items-end gap-4">
          <ReviewStatusHistory statuses={statusesForTimeline} />

          <form action={addStatusAction} className="w-full md:w-auto">
            <input type="hidden" name="review_id" value={reviewId} />
            {revalidatePath && (
              <input
                type="hidden"
                name="revalidate_path"
                value={revalidatePath}
              />
            )}

            <div className="flex gap-2">
              <select
                name="status_id"
                required
                defaultValue=""
                className="w-full rounded border bg-background px-3 py-2 text-xs"
              >
                <option value="" disabled>
                  {loadingStatusOptions
                    ? "Loading options..."
                    : "Select a status"}
                </option>
                {statusOptions
                  ?.filter((opt: any) => opt.id !== latestStatus?.status?.id)
                  .map((opt: any) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                aria-busy={addingStatus}
                disabled={addingStatus || !!statusOptionsError}
              >
                {addingStatus ? "Updating…" : "Update"}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-1 text-[11px] text-red-600">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] md:gap-4 px-4 py-4 md:px-6 md:py-5 overflow-y-auto max-h-[calc(95vh-10rem)]">
        {/* LEFT */}
        <div className="space-y-4 md:pr-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0">
          {/* Assignments */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assignments
            </h3>

            {activeEmployees.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                No employees assigned.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeEmployees.map((e: any) => (
                  <div
                    key={e.id}
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-2 py-1 text-[11px]"
                    title={e.email ?? ""}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                      {employeeInitials(e)}
                    </span>
                    <span className="font-medium">{employeeName(e)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sales */}
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sales
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {salesJson.length}
              </span>
            </div>

            {salesJson.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                No sales linked to this review.
              </div>
            ) : (
              <div className="space-y-2">
                {salesJson.slice(0, 10).map((s: any) => (
                  <div
                    key={s.sale_id ?? s.id}
                    className="rounded-md border p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">
                        Sale #{s.sale_id ?? s.id}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {s.date_of_sale ? fmtDate(s.date_of_sale) : "—"}
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {Number.isFinite(Number(s.net_selling_price))
                        ? `Net: $${Number(s.net_selling_price).toLocaleString()}`
                        : "Net: —"}
                      {s.sale_year ? ` • Year: ${s.sale_year}` : null}
                    </div>
                  </div>
                ))}
                {salesJson.length > 10 ? (
                  <div className="text-[11px] text-muted-foreground">
                    +{salesJson.length - 10} more…
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* Parcels + structures */}
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Parcels
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {parcelsJson.length}
              </span>
            </div>

            {parcelsJson.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                No parcels linked to this review.
              </div>
            ) : (
              <div className="space-y-2">
                {parcelsJson.map((p: any) => {
                  const addr = parcelAddressLine(p);

                  return (
                    <div
                      key={p.parcel_id ?? p.id}
                      className="rounded-md border p-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            Parcel {p.parcel_id ?? p.id}
                          </div>
                          {addr ? (
                            <div className="mt-1 text-[11px] text-muted-foreground truncate">
                              {addr}
                            </div>
                          ) : null}

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            {p.block != null ? (
                              <span>Block {p.block}</span>
                            ) : null}
                            {p.lot != null ? (
                              <span>Lot {String(p.lot)}</span>
                            ) : null}
                            {p.ext != null ? <span>Ext {p.ext}</span> : null}
                            {p.current_land_use != null ? (
                              <span>LU {p.current_land_use}</span>
                            ) : null}
                          </div>
                        </div>

                        <Link
                          href={`/parcels/${p.parcel_id ?? p.id}`}
                          className="shrink-0 text-[11px] font-medium text-blue-700 hover:underline"
                        >
                          Open parcel
                        </Link>
                      </div>

                      <div className="mt-2 text-[11px] text-muted-foreground">
                        <span className="uppercase">Structures:</span>{" "}
                        {structureSummaryFromParcel(p)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowStructureDetails((v) => !v)}
                        className="mt-2 inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium hover:bg-muted"
                        aria-expanded={showStructureDetails}
                      >
                        {showStructureDetails ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Hide structure details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Show structure details
                          </>
                        )}
                      </button>

                      {showStructureDetails ? (
                        <div className="mt-2 space-y-2">
                          {Array.isArray(p.current_structures) &&
                          p.current_structures.length > 0 ? (
                            (p.current_structures as any[]).map(
                              (item: any, idx: number) => {
                                const s = item?.structure ?? {};
                                const sections = Array.isArray(item?.sections)
                                  ? item.sections
                                  : [];
                                return (
                                  <div
                                    key={`${p.parcel_id ?? p.id}-s-${idx}`}
                                    className="rounded border bg-muted/30 p-2"
                                  >
                                    <div className="text-[11px] font-medium">
                                      Structure {s?.id ?? "—"}
                                      {s?.year_built
                                        ? ` • Built ${s.year_built}`
                                        : null}
                                      {s?.units ? ` • Units ${s.units}` : null}
                                    </div>

                                    <div className="mt-1 text-[11px] text-muted-foreground">
                                      {sections.length} section
                                      {sections.length === 1 ? "" : "s"}
                                    </div>

                                    {sections.length > 0 ? (
                                      <div className="mt-2 space-y-1">
                                        {sections
                                          .slice(0, 6)
                                          .map((sec: any) => (
                                            <div
                                              key={sec?.id ?? Math.random()}
                                              className="text-[11px] text-muted-foreground truncate"
                                              title={JSON.stringify(sec)}
                                            >
                                              {sec?.section_type ??
                                                sec?.type ??
                                                "Section"}{" "}
                                              {sec?.finished_area != null
                                                ? `• finished ${sec.finished_area}`
                                                : null}
                                              {sec?.unfinished_area != null
                                                ? ` • unfinished ${sec.unfinished_area}`
                                                : null}
                                            </div>
                                          ))}
                                        {sections.length > 6 ? (
                                          <div className="text-[11px] text-muted-foreground">
                                            +{sections.length - 6} more…
                                          </div>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <div className="rounded border border-dashed p-2 text-[11px] text-muted-foreground">
                              No current structures returned.
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Images */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Images
              </h3>

              <UploadReviewImagesModal
                reviewId={reviewId}
                revalidatePath={revalidatePath}
                buttonLabel="Images"
                title="Upload Images"
              />
            </div>

            {images.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                No images uploaded yet. Use the <strong>Images</strong> button
                above to add photos.
              </div>
            ) : (
              <ReviewImagesGrid
                images={images}
                revalidatePath={revalidatePath}
                className="space-y-2"
              />
            )}
          </section>
        </div>

        {/* RIGHT: Notes */}
        <div className="flex flex-col gap-3 md:pl-2 pt-4 md:pt-0">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </h3>

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

          <div className="flex-1 overflow-y-auto rounded-md border bg-background p-3 text-sm space-y-2">
            {notesJson.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No notes yet. Add the first note above.
              </div>
            ) : (
              <div className="space-y-3">
                {[...notesJson]
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.created_at ?? 0).getTime() -
                      new Date(a.created_at ?? 0).getTime()
                  )
                  .map((n: any) => {
                    const busy = deletingNotes && deletingNoteId === n.id;

                    // supports either `employee` or old `employees`
                    const emp = n.employee ?? n.employees ?? null;

                    return (
                      <div
                        key={n.id}
                        className="rounded-md border bg-muted/40 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                            {employeeInitials(emp)}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="whitespace-pre-wrap text-xs">
                              {n.note}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{employeeName(emp)}</span>
                              <span>•</span>
                              <span>{fmtShortDateTime(n.created_at)}</span>
                            </div>
                          </div>

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
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------- default export alias ------------------------- */

export default function ReviewThreadModal(
  props: React.ComponentProps<typeof ReviewThreadDialog>
) {
  return <ReviewThreadDialog {...props} />;
}
