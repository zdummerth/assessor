import { createClient } from "@/lib/supabase/server";
import { SearchVinWithGuideMatchesPresentation } from "../search-vin-with-guide-matches-presentation";
import { SearchVinWithGuideMatchesPagination } from "../search-vin-with-guide-matches-pagination";

interface SearchVinWithGuideMatchesServerProps {
  params?: {
    p_max_guide_results?: number;
    p_vin?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function SearchVinWithGuideMatchesServer({
  params,
  currentPage = 1,
  pageSize = 25,
}: SearchVinWithGuideMatchesServerProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_vin_with_guide_matches", {
    p_vin: params?.p_vin || "",
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
      <SearchVinWithGuideMatchesPresentation
        data={paginatedData}
        error={error?.message}
      />
      <SearchVinWithGuideMatchesPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
