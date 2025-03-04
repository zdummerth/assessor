import PaginationClient from "./pagination-client";
import { getFilteredData, ITEMS_PER_PAGE } from "@/lib/data";

export default async function Pagination({
  filters,
  table,
}: {
  filters: any;
  table?: string;
}) {
  const { count, error } = await getFilteredData({
    filters,
    count: { count: "exact", head: true },
    table: table,
  });

  if (error && !count) {
    console.error(error);
    return <div className="text-sm">Failed to fetch count</div>;
  }

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <div className="flex items-center">
      <PaginationClient totalPages={totalPages} />
      <p className="text-sm">{count.toLocaleString()} parcels match filters</p>
    </div>
  );
}
