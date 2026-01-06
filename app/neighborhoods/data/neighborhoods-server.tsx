import { createClient } from "@/lib/supabase/server";
import { NeighborhoodsPresentation } from "../neighborhoods-presentation";
import { NeighborhoodsPagination } from "../neighborhoods-pagination";
import type { Database } from "@/database-types";

interface NeighborhoodsServerProps {
  filters?: {
  name?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function NeighborhoodsServer({
  filters,
  currentPage = 1,
  pageSize = 25,
}: NeighborhoodsServerProps) {
  const supabase = await createClient();

  // Build query for data
  let dataQuery = supabase.from("neighborhoods").select("*");
  
  // Build query for count
  let countQuery = supabase.from("neighborhoods").select("*", { count: "exact", head: true });

  // Apply filters to data query
  if (filters?.name) {
    dataQuery = dataQuery.eq("name", filters.name);
  }

  // Apply filters to count query
  if (filters?.name) {
    countQuery = countQuery.eq("name", filters.name);
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
      <NeighborhoodsPresentation
        data={data || []}
        error={error?.message}
      />
      <NeighborhoodsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
