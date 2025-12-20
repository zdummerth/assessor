// app/components/ServerParcelFieldReviews.tsx
import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ReviewThreadModal from "@/app/parcels/[id]/field-reviews/thread";

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

export default async function ServerFieldReview({
  reviewId,
  title = "Review Thread",
  revalidatePath,
}: {
  reviewId: number;
  title?: string;
  revalidatePath?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .eq("id", reviewId)
    .maybeSingle();

  if (error || !data) {
    const errMsg = error?.message ?? "Review not found";
    return (
      <div className="mt-8 flex flex-col items-center justify-center text-center">
        <SearchX className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm font-medium">Error fetching field review</p>
        <p className="text-xs text-gray-500">{errMsg}</p>
      </div>
    );
  }

  const review = data as ReviewRow;

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

  const initialNotes = review.field_review_notes ?? [];
  const initialStatuses = review.field_review_status_history ?? [];
  const initialImages = toImageDisplay(review.field_review_images);

  const resolvedRevalidatePath =
    revalidatePath ?? `/parcels/${String(review.parcel_id)}`;

  return (
    // <ReviewThreadModal
    //   reviewId={review.id}
    //   initialNotes={initialNotes}
    //   initialStatuses={initialStatuses}
    //   initialImages={initialImages}
    //   revalidatePath={resolvedRevalidatePath}
    //   title={title}
    // />
    <div></div>
  );
}
