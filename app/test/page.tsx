import ParcelFilters from "@/components/ui/filters-parcels";
import { Suspense } from "react";
import ParcelsTable from "@/components/ui/parcels-table";
import Pagination from "@/components/ui/pagination";
import { getPagesCount } from "@/lib/data";
import ParcelTabs from "@/components/ui/parcels-tabs";
import { createClient } from "@/utils/supabase/server";

export default async function ProtectedPage() {
  const supabase = createClient();

  let query = supabase
    .rpc("get_sales_by_occupancy", {
      // occupancy_values: ["1110", "1120"],
    })
    .gte("date_of_sale", "2021-01-01")
    .lte("date_of_sale", "2021-01-31")
    .limit(3);

  const { data, error } = await query;

  console.log({ data, error });

  return (
    <div className="w-full flex gap-4">
      {/* <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
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
      </div> */}
      Testing page
    </div>
  );
}
