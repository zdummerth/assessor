import { getFilteredData, ITEMS_PER_PAGE } from "@/lib/data";

export default async function SearchCount({
  filters,
  table,
  returnType,
  countType = "exact",
}: {
  filters: any;
  table?: string;
  returnType: "count" | "totalPages" | "countAndTotalPages";
  countType?: "exact" | "estimated" | "planned";
}) {
  const { count, error } = await getFilteredData({
    filters,
    count: { count: countType, head: true },
    table: table,
  });

  if (error && !count) {
    console.error(error);
    return <>Failed to fetch count</>;
  }

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <>
      {returnType === "count" && <>{count.toLocaleString()}</>}
      {returnType === "totalPages" && <>{totalPages.toLocaleString()}</>}
    </>
  );
}
