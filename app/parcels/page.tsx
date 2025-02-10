import ParcelFilters from "@/components/ui/filters-parcels";
import { Suspense } from "react";
import ParcelsTable from "@/components/ui/parcels-table";
import Pagination from "@/components/ui/pagination";
import { getPagesCount } from "@/lib/data";
import ParcelTabs from "@/components/ui/parcels-tabs";

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
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const currentPage = Number(searchParams?.page) || 1;

  const { totalPages, count } = await getPagesCount(formattedSearchParams);

  return (
    <div className="w-full flex gap-4">
      <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
        <ParcelFilters />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <ParcelTabs searchParams={searchParams} />
          <p className="text-sm text-foreground">
            {count} parcels match filters
          </p>
        </div>
        <Suspense fallback={<div>loading parcels...</div>}>
          <ParcelsTable
            filters={formattedSearchParams}
            currentPage={currentPage}
            columns={formattedSearchParams.columns || []}
            sort={searchParams?.sort || "parcel_number+asc"}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
