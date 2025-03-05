import { Suspense } from "react";
import Pagination from "@/components/ui/pagination";
import { getFilteredData, ITEMS_PER_PAGE } from "@/lib/data";
import SalesTable from "@/components/ui/sales-table";
import ParcelFilters from "@/components/ui/filters-parcels";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    occupancy?: string;
    page?: string;
    saleColumns?: string;
    sort?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const currentPage = Number(searchParams?.page) || 1;

  const res = await getFilteredData({
    filters: formattedSearchParams,
    table: "get_sales",
    get_count: true,
  });

  console.log({ res });
  const { data, error, count } = res;

  // console.log({ data, error, count });

  if (!count) {
    console.error(error);
    return <div>Failed to fetch in sales page</div>;
  }

  const totalPagesCount = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <div className="w-full flex gap-4">
      {/* <div className="w-1/4">
        <ParcelFilters />
      </div>
      <div className="w-full">
        <p className="text-sm text-foreground">{count} sales match filters</p>
        <Suspense fallback={<div>loading parcels...</div>}>
          <SalesTable
            filters={formattedSearchParams}
            currentPage={currentPage}
            sort={searchParams?.sort}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPagesCount} />
        </div>
      </div> */}
    </div>
  );
}
