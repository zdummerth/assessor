import ParcelFilters from "@/components/ui/filters-parcels";
import { Suspense } from "react";
import ParcelsTable from "@/components/ui/parcels-table";
import Pagination from "@/components/ui/pagination";
import { getPagesCount, ITEMS_PER_PAGE, getFilteredData } from "@/lib/data";
import ParcelTabs from "@/components/ui/parcels-tabs";
import Search from "@/components/ui/search";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
    page?: string;
    columns?: string;
    sort?: string;
    query?: string;
    year?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const currentPage = Number(searchParams?.page) || 1;

  const filters = {
    ...formattedSearchParams,
    year: searchParams?.year || new Date().getFullYear().toString(),
  };

  const res = await getFilteredData({
    filters,
    table: "parcels",
    get_count: true,
    currentPage,
  });

  // console.log({ res });
  const { data, error, count } = res;

  console.log({ data, error, count });

  if (error) {
    console.error(error);
    return <div>Failed to fetch parcels</div>;
  }

  const totalPagesCount = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <Search placeholder="Search parcels" />
      {/* <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
        <ParcelFilters />
      </div> */}
      <div className="w-full">
        <div className="flex justify-between">
          {/* <ParcelTabs searchParams={searchParams} /> */}
          <p className="text-sm text-foreground">
            {count.toLocaleString()} parcels match filters
          </p>
        </div>
        <Suspense fallback={<div>loading parcels...</div>}>
          <ParcelsTable
            filters={filters}
            currentPage={currentPage}
            columns={formattedSearchParams.columns || []}
            sort={searchParams?.sort || "parcel_number+asc"}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPagesCount} />
        </div>
      </div>
    </div>
  );
}
