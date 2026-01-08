import { createClient } from "@/lib/supabase/server";
import { SearchGuideByDescriptionPresentation } from "../search-guide-by-description-presentation";
import { SearchGuideByDescriptionPagination } from "../search-guide-by-description-pagination";

interface SearchGuideByDescriptionServerProps {
  params?: {
    p_search_text: string;
    p_limit?: number;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function SearchGuideByDescriptionServer({
  params,
  currentPage = 1,
  pageSize = 25,
}: SearchGuideByDescriptionServerProps) {
  const supabase = await createClient();

  // Return early if no search text provided
  if (!params?.p_search_text) {
    return (
      <>
        <SearchGuideByDescriptionPresentation
          data={[]}
          error="Search text is required"
        />
        <SearchGuideByDescriptionPagination
          currentPage={currentPage}
          totalPages={0}
        />
      </>
    );
  }

  const { data, error } = await supabase.rpc("search_guide_by_description", {
    p_search_text: params.p_search_text,
    p_limit: params?.p_limit || 25,
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
      <SearchGuideByDescriptionPresentation
        data={paginatedData}
        error={error?.message}
      />
      <SearchGuideByDescriptionPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
