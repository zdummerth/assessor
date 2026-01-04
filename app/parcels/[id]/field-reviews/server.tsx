// app/components/ServerParcelFieldReviews.tsx
import Image from "next/image";
import { SearchX, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ReviewThreadModal from "./thread";
import { FieldReviewCreateDialog } from "./create-dialog";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

type FileRow = {
  id: number;
  bucket_name: string;
  path: string;
  mime_type: string | null;
  size_bytes?: number | null;
  original_name?: string | null;
  extension?: string | null;
};

type ImageRow = {
  id: number;
  review_id: number;
  file_id: number;
  caption: string | null;
  width: number;
  height: number;
  sort_order: number | null;
  created_at?: string | null;
  files?: FileRow | null;
};

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
  status: {
    id: number;
    name: string;
  };
  created_at: string | null;
  created_by: string | null;
};

type ReviewRow = {
  id: number;
  parcel_id: number;
  due_date: string | null;
  created_at: string | null;
  created_by: string | null;
  field_review_notes?: NoteRow[];
  field_review_status_history?: StatusRow[];
  field_review_images?: ImageRow[];
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

const fmtShortDateTime = (s?: string | null) =>
  s
    ? new Date(s).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "—";

export default async function ServerParcelFieldReviews({
  parcel,
  title = "Field Reviews",
  revalidatePath = `/parcels/${String(parcel.id)}`,
}: {
  parcel: Parcel;
  title?: string;
  revalidatePath?: string;
}) {
  const supabase = await createClient();

  const [fieldReviewsRes] = await Promise.all([
    supabase
      .from("field_reviews")
      .select(
        `
      id,
      parcel_id,
      due_date,
      created_at,
      created_by,
      field_review_notes (
        id,
        review_id,
        note,
        created_at,
        created_by,
        employees (
          id,
          email,
          first_name,
          last_name
        )
      ),
      field_review_status_history (
        id,
        review_id,
        status:field_review_statuses(
          id,
          name
        ),
        created_at,
        created_by
      ),
      field_review_images (
        id,
        review_id,
        file_id,
        caption,
        width,
        height,
        sort_order,
        created_at,
        files (
          id,
          bucket_name,
          path,
          mime_type,
          size_bytes,
          original_name,
          extension
        )
      )
    `
      )
      .eq("parcel_id", parcel.id)
      .order("created_at", { ascending: false }),
  ]);

  const { data, error } = fieldReviewsRes;

  if (error) {
    const err = error;

    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching field reviews</p>
        <p className="text-sm text-gray-600">{err?.message}</p>
      </div>
    );
  }

  const reviews = (data ?? []) as ReviewRow[];

  const publicUrl = (file?: FileRow | null) => {
    if (!file) return "";
    const { data } = supabase.storage
      .from(file.bucket_name)
      .getPublicUrl(file.path);
    return data.publicUrl || "";
  };

  const toImageDisplay = (imgs?: ImageRow[] | null): ImageDisplay[] =>
    (imgs ?? [])
      .map((img) => {
        const url = publicUrl(img.files || null);
        if (!url) return null;
        return {
          id: img.id,
          url,
          caption: img.caption,
          width: img.width,
          height: img.height,
          sort_order: img.sort_order,
          created_at: img.created_at ?? undefined,
          original_name: img.files?.original_name ?? undefined,
        };
      })
      .filter(Boolean) as ImageDisplay[];
  const latestOf = <T extends { created_at: string | null }>(
    arr?: T[]
  ): T | undefined => {
    if (!arr || arr.length === 0) return undefined;

    return arr.reduce<T | undefined>((latest, item) => {
      if (!item.created_at) return latest;
      if (!latest || !latest.created_at) return item;

      return new Date(item.created_at) > new Date(latest.created_at)
        ? item
        : latest;
    }, undefined);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <FieldReviewCreateDialog
          parcelIds={[parcel.id as number]}
          revalidatePath={revalidatePath}
        />
      </div>

      {!reviews.length ? (
        <div className="text-sm text-gray-500 border rounded p-4">
          No field reviews yet for this parcel.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Showing {reviews.length} review
            {reviews.length === 1 ? "" : "s"}
          </div>

          {/* All reviews as consistent cards */}
          <div className="flex flex-col gap-3">
            {reviews.map((r, index) => {
              const latestStatus = latestOf(r.field_review_status_history);
              const latestNote = latestOf(r.field_review_notes);

              const firstImage = r.field_review_images?.[0];
              const hasImage = !!firstImage?.files;
              const src = hasImage ? publicUrl(firstImage!.files!) : "";

              const thumbWidth = 120;
              const w = Math.max(1, firstImage?.width || 1);
              const h = Math.max(1, firstImage?.height || 1);
              const thumbHeight = Math.max(1, Math.round((h / w) * thumbWidth));

              return (
                <div key={r.id}>
                  {/* Entire card is clickable trigger */}
                  {/* <ReviewThreadModal
                    reviewId={r.id}
                    initialNotes={r.field_review_notes ?? []}
                    initialStatuses={r.field_review_status_history ?? []}
                    initialImages={toImageDisplay(r.field_review_images)}
                    revalidatePath={revalidatePath}
                    trigger={
                      <button
                        type="button"
                        className="group w-full text-left rounded border bg-white p-3 flex gap-3 cursor-pointer transition hover:border-sky-400 hover:bg-sky-50/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        <div className="shrink-0">
                          {src ? (
                            <Image
                              src={src}
                              alt={
                                firstImage?.caption ||
                                firstImage?.files?.original_name ||
                                `thumb-${r.id}`
                              }
                              width={thumbWidth}
                              height={thumbHeight}
                              className="rounded border bg-gray-50 object-cover"
                            />
                          ) : (
                            <div className="w-[120px] h-[80px] rounded border bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="text-xs text-gray-500">
                                Created {fmtShortDateTime(r.created_at)} • Due{" "}
                                {fmtDate(r.due_date)}
                              </div>
                              {latestStatus && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">
                                    {latestStatus.status.name}
                                  </span>
                                  <span className="text-[11px] text-gray-500">
                                    {latestStatus.created_at
                                      ? `• ${fmtShortDateTime(
                                          latestStatus.created_at
                                        )}`
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {latestNote && (
                            <div className="mt-1 text-xs text-gray-700 line-clamp-3">
                              {latestNote.note}
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-700 group-hover:text-sky-800">
                            <PlusCircle className="w-3 h-3" />
                            <span>Open review thread</span>
                          </div>
                        </div>
                      </button>
                    }
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
