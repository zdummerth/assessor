import { createClient } from "@/lib/supabase/server";
import { SearchDevnetReviewsPresentation } from "../search-devnet-reviews-presentation";
import { SearchDevnetReviewsPagination } from "../search-devnet-reviews-pagination";
import type { Json } from "@/database-types";

interface SearchDevnetReviewsServerProps {
  params?: {
  p_filters?: Json;
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
      p_filters: params?.p_filters,
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
