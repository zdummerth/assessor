import { createClient } from "@/lib/supabase/server";
import { DevnetReviewStatusesPresentation } from "../devnet-review-statuses-presentation";
import { DevnetReviewStatusesPagination } from "../devnet-review-statuses-pagination";
import type { Database } from "@/database-types";

type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];

interface DevnetReviewStatusesServerProps {
  filters?: {
  description?: string;
  name?: string;
  preferred_role?: string;
  review_kind?: DevnetReviewKind;
  slug?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function DevnetReviewStatusesServer({
  filters,
  currentPage = 1,
  pageSize = 25,
}: DevnetReviewStatusesServerProps) {
  const supabase = await createClient();

  // Build query for data
  let dataQuery = supabase.from("devnet_review_statuses").select("*");
  
  // Build query for count
  let countQuery = supabase.from("devnet_review_statuses").select("*", { count: "exact", head: true });

  // Apply filters to data query
  if (filters?.description) {
    dataQuery = dataQuery.eq("description", filters.description);
  }

  if (filters?.name) {
    dataQuery = dataQuery.eq("name", filters.name);
  }

  if (filters?.preferred_role) {
    dataQuery = dataQuery.eq("preferred_role", filters.preferred_role);
  }

  if (filters?.review_kind) {
    dataQuery = dataQuery.eq("review_kind", filters.review_kind);
  }

  if (filters?.slug) {
    dataQuery = dataQuery.eq("slug", filters.slug);
  }

  // Apply filters to count query
  if (filters?.description) {
    countQuery = countQuery.eq("description", filters.description);
  }

  if (filters?.name) {
    countQuery = countQuery.eq("name", filters.name);
  }

  if (filters?.preferred_role) {
    countQuery = countQuery.eq("preferred_role", filters.preferred_role);
  }

  if (filters?.review_kind) {
    countQuery = countQuery.eq("review_kind", filters.review_kind);
  }

  if (filters?.slug) {
    countQuery = countQuery.eq("slug", filters.slug);
  }

  // Apply pagination to data query
  const offset = (currentPage - 1) * pageSize;
  dataQuery = dataQuery.range(offset, offset + pageSize - 1);

  const [{ data, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <>
      <DevnetReviewStatusesPresentation
        data={data || []}
        error={error?.message}
      />
      <DevnetReviewStatusesPagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
