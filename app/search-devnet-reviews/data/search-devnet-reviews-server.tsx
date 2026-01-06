import { createClient } from "@/lib/supabase/server";
import { SearchDevnetReviewsPresentation } from "../search-devnet-reviews-presentation";
import { SearchDevnetReviewsPagination } from "../search-devnet-reviews-pagination";

interface SearchDevnetReviewsServerProps {
  params?: {
  p_active_only?: boolean;
  p_assigned_to_id?: number;
  p_completed_only?: boolean;
  p_created_after?: string;
  p_created_before?: string;
  p_data_status?: string;
  p_due_after?: string;
  p_due_before?: string;
  p_entity_type?: string;
  p_kind?: string;
  p_overdue_only?: boolean;
  p_priority?: string;
  p_requires_field_review?: boolean;
  p_search_text?: string;
  p_status_ids?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function SearchDevnetReviewsServer({
  params,
  currentPage = 1,
  pageSize = 25,
}: SearchDevnetReviewsServerProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_devnet_reviews", {
      p_active_only: params?.p_active_only,
      p_assigned_to_id: params?.p_assigned_to_id,
      p_completed_only: params?.p_completed_only,
      p_created_after: params?.p_created_after,
      p_created_before: params?.p_created_before,
      p_data_status: params?.p_data_status,
      p_due_after: params?.p_due_after,
      p_due_before: params?.p_due_before,
      p_entity_type: params?.p_entity_type,
      p_kind: params?.p_kind,
      p_overdue_only: params?.p_overdue_only,
      p_priority: params?.p_priority,
      p_requires_field_review: params?.p_requires_field_review,
      p_search_text: params?.p_search_text,
      p_status_ids: params?.p_status_ids,
  });

  // Handle pagination in-memory if data is returned
  let paginatedData = data || [];
  let totalCount = paginatedData.length;
  
  if (data && data.length > 0) {
    const offset = (currentPage - 1) * pageSize;
    paginatedData = data.slice(offset, offset + pageSize);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <SearchDevnetReviewsPresentation
        data={paginatedData}
        error={error?.message}
      />
      <SearchDevnetReviewsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
