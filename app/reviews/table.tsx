// app/test/field-reviews/table.tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { FieldReviewWithDetails } from "./table-client";
import ServerFieldReview from "./[id]/server";
import ReviewsWithMap from "./reviews-with-map";

type Props = {
  reviewStatuses?: number[];
  reviewTypes?: number[];
  nbhds?: number[];
  page: number;
  pageSize: number;
};

export default async function FieldReviewsTableServer({
  reviewStatuses,
  reviewTypes,
  page,
  pageSize,
  nbhds,
}: Props) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .rpc("get_field_reviews_with_parcel_details", undefined, { count: "exact" })
    .order("block", { ascending: true })
    .order("review_created_at", { ascending: false })
    .range(from, to);

  if (reviewStatuses && reviewStatuses.length > 0) {
    q = q.in("latest_status_id", reviewStatuses);
  }

  if (reviewTypes && reviewTypes.length > 0) {
    q = q.in("review_type_id", reviewTypes);
  }

  if (nbhds && nbhds.length > 0) {
    q = q.or(
      `assessor_neighborhood_id.in.(${nbhds.join(",")}),cda_neighborhood_id.in.(${nbhds.join(",")})`
    );
  }

  const { data, error, count } = await q;

  if (error) {
    console.error("Error fetching field reviews:", error);
    return (
      <div className="mt-4 rounded border bg-destructive/10 p-4 text-xs text-destructive">
        Error loading field reviews.
      </div>
    );
  }

  const reviews = (data ?? []) as FieldReviewWithDetails[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <ReviewsWithMap reviews={reviews} />

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing{" "}
          {total === 0
            ? "0"
            : `${(page - 1) * pageSize + 1}-${Math.min(
                page * pageSize,
                total
              )}`}{" "}
          of {total} reviews
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => {
              const params = new URLSearchParams();
              if (pageNum !== 1) params.set("page", String(pageNum));
              if (nbhds && nbhds.length > 0)
                params.set("nbhds", nbhds.join(","));
              if (reviewStatuses && reviewStatuses.length > 0)
                params.set("review_statuses", reviewStatuses.join(","));
              if (reviewTypes && reviewTypes.length > 0)
                params.set("review_types", reviewTypes.join(","));

              const qs = params.toString();

              return (
                <Link
                  key={pageNum}
                  href={
                    qs ? `/test/field-reviews?${qs}` : "/test/field-reviews"
                  }
                  className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded border px-2 text-[11px] ${
                    pageNum === page
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-transparent hover:border-muted-foreground/30 hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
