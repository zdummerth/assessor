// app/components/ServerParcelFieldReviews.tsx
import Image from "next/image";
import { SearchX, PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ReviewThreadModal from "./thread";
import NewFieldReviewModal from "./create";
import UploadReviewImagesModal from "./upload-images";
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
  status: string;
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
  field_review_statuses?: StatusRow[];
  field_review_images?: ImageRow[];
};

// What we pass into the thread dialog
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

  const { data, error } = await supabase
    // @ts-expect-error: nested select is valid in Supabase
    .from("field_reviews")
    .select(
      `
      id,
      parcel_id,
      due_date,
      created_at,
      created_by,
      field_review_notes (
        id, review_id, note, created_at, created_by
      ),
      field_review_statuses (
        id, review_id, status, created_at, created_by
      ),
      field_review_images (
        id, review_id, file_id, caption, width, height, sort_order, created_at,
        files (
          id, bucket_name, path, mime_type, size_bytes, original_name, extension
        )
      )
    `
    )
    .eq("parcel_id", parcel.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching field reviews</p>
        <p className="text-sm text-gray-600">{error.message}</p>
        <div className="mt-4">
          <NewFieldReviewModal
            parcelId={parcel.id as number}
            revalidatePath={revalidatePath}
          />
        </div>
      </div>
    );
  }

  // @ts-expect-error - nested select typing
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

  const latestOf = <T extends { created_at: string | null }>(arr?: T[]) =>
    (arr && arr.length > 0 ? arr[0] : undefined) as T | undefined;

  const [latest, ...rest] = reviews;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <NewFieldReviewModal
          parcelId={parcel.id as number}
          revalidatePath={revalidatePath}
        />
      </div>

      {/* LATEST REVIEW */}
      {!latest ? (
        <div className="text-sm text-gray-500 border rounded p-4">
          No field reviews yet for this parcel.
        </div>
      ) : (
        <div className="rounded border p-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs">
              Created {fmtShortDateTime(latest.created_at)} • Due{" "}
              {fmtDate(latest.due_date)}
            </div>
            <div className="flex items-center gap-2">
              <UploadReviewImagesModal
                reviewId={latest.id}
                revalidatePath={revalidatePath}
                buttonLabel="Images"
                title="Upload Images"
              />
              <ReviewThreadModal
                reviewId={latest.id}
                initialNotes={latest.field_review_notes ?? []}
                initialStatuses={latest.field_review_statuses ?? []}
                initialImages={toImageDisplay(latest.field_review_images)}
                trigger={
                  <button className="hover:bg-gray-50">
                    <PlusCircle className="w-4 h-4" />
                  </button>
                }
                revalidatePath={revalidatePath}
              />
            </div>
          </div>

          {/* Latest Status */}
          {(() => {
            const s = latestOf(latest.field_review_statuses);
            if (!s) return null;
            return (
              <div className="rounded border p-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.status}</div>
                  <div className="text-[11px] text-gray-500">
                    {fmtShortDateTime(s.created_at)}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Latest Note */}
          {(() => {
            const n = latestOf(latest.field_review_notes);
            if (!n) return null;
            return (
              <div className="rounded border p-2">
                <div className="whitespace-pre-wrap">{n.note}</div>
                <div className="mt-1 text-sm text-foreground/80">
                  {fmtShortDateTime(n.created_at)}
                </div>
              </div>
            );
          })()}

          {/* Latest images (thumbnails in card) */}
          {(latest.field_review_images?.length ?? 0) > 0 && (
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {latest.field_review_images!.map((img) => {
                const src = publicUrl(img.files || null);
                if (!src) return null;
                const thumbW = 220;
                const w = Math.max(1, img.width || 1);
                const h = Math.max(1, img.height || 1);
                const thumbH = Math.max(1, Math.round((h / w) * thumbW));
                return (
                  <div
                    key={img.id}
                    className="rounded border overflow-hidden bg-gray-50"
                  >
                    <Image
                      src={src}
                      alt={
                        img.caption ||
                        img.files?.original_name ||
                        `image-${img.id}`
                      }
                      width={thumbW}
                      height={thumbH}
                      className="w-full h-auto object-cover"
                    />
                    {img.caption && (
                      <div className="px-2 py-1 text-[11px] text-gray-600 truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PREVIOUS REVIEWS */}
      {rest.length > 0 && (
        <div className="rounded border">
          <div className="px-3 py-2 border-b text-xs font-medium text-gray-600">
            Previous Reviews
          </div>
          <ul className="divide-y">
            {rest.map((r) => {
              const s = latestOf(r.field_review_statuses);
              const firstImage = r.field_review_images?.[0];
              const src = firstImage?.files ? publicUrl(firstImage.files) : "";

              const tW = 96;
              const w = Math.max(1, firstImage?.width || 1);
              const h = Math.max(1, firstImage?.height || 1);
              const tH = Math.max(1, Math.round((h / w) * tW));

              return (
                <li key={r.id} className="px-3 py-3 flex items-center gap-3">
                  <div className="shrink-0">
                    {src ? (
                      <Image
                        src={src}
                        alt={
                          firstImage?.caption ||
                          firstImage?.files?.original_name ||
                          `thumb-${r.id}`
                        }
                        width={tW}
                        height={tH}
                        className="rounded border bg-gray-50 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded border bg-gray-50" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500">
                      Created {fmtShortDateTime(r.created_at)} • Due{" "}
                      {fmtDate(r.due_date)}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {s?.status ?? "No status"}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {s?.created_at
                          ? `• ${fmtShortDateTime(s.created_at)}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <ReviewThreadModal
                    reviewId={r.id}
                    initialNotes={r.field_review_notes ?? []}
                    initialStatuses={r.field_review_statuses ?? []}
                    initialImages={toImageDisplay(r.field_review_images)}
                    trigger={
                      <button className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-gray-50 shrink-0">
                        <PlusCircle className="w-4 h-4" />
                        Open
                      </button>
                    }
                    revalidatePath={revalidatePath}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
