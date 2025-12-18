// app/test/field-reviews/table.tsx
import { createClient } from "@/utils/supabase/server";
import ReviewsWithMap, {
  FieldReviewWithParcelDetailsV2,
} from "./reviews-with-map";
import PaginationToolbar from "../parcels/test/features/pagination-toolbar";

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
    //@ts-expect-error need to generate types for rpc
    .rpc("get_field_reviews_with_parcel_details_v2", undefined, {
      count: "exact",
    })
    .order("block", { ascending: true })
    .order("address_street", { ascending: true })
    .order("address_house_number", { ascending: true })
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

  const reviews = (data ?? []) as FieldReviewWithParcelDetailsV2[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <PaginationToolbar page={page} pageSize={pageSize} total={total} />
      <ReviewsWithMap reviews={reviews} />
    </>
  );
}
