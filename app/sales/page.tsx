import { Suspense } from "react";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
import SearchCount from "@/components/ui/search-count";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import SalesData, {
  AppraiserPercentChangeCount,
} from "@/components/server/sales";
import { SetUrlParam } from "@/components/ui/filter-client";

export default async function ParcelsAdvancedSearchPage({
  searchParams,
  params,
}: {
  params: { id: string };
  searchParams?: {
    filter?: string;
    page?: string;
    propertyClass?: string;
    occupancy?: string;
    nbhd?: string;
    sortColumn?: string;
    sortDirection?: string;
    view?: "grid" | "map" | "summary";
  };
}) {
  const filter = searchParams?.filter || "all";
  const limit = ITEMS_PER_PAGE;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const filters = [
    { label: "All", id: "all" },
    { label: "Status Pending", id: "status_pending" },
    { label: "Improved, Open Market", id: "improved" },
    { label: "Foreclosure", id: "foreclosure" },
    { label: "Sale After Foreclosure", id: "after_foreclosure" },
  ];

  return (
    <div className="w-full flex">
      <div className="w-full">
        <h2 className="text-center text-lg my-4">Sales</h2>
        <div>
          <div className="flex gap-2 flex-wrap my-4">
            {filters.map((f) => (
              <SetUrlParam
                key={f.id}
                value={f}
                urlParam="filter"
                className={`border rounded-lg py-1 px-2 ${filter === f.id ? "border-blue-500" : ""}`}
              />
            ))}
          </div>
          <div className="flex gap-2 items-center justify-between">
            <div className="text-sm flex items-center gap-2">
              {searchParams?.view !== "summary" && (
                <>
                  <ArrowButton
                    pageNumber={page - 1}
                    direction="left"
                    isDisabled={page <= 1}
                  />
                  <ArrowButton
                    pageNumber={page + 1}
                    direction="right"
                    isDisabled={false}
                  />
                  <span>
                    {page > 1 ? (page - 1) * limit + 1 : 1}-{page * limit}
                  </span>
                  <span>of</span>
                  <Suspense
                    fallback={
                      <span className="bg-gray-500 rounded h-4 w-12 animate-pulse"></span>
                    }
                    key={page.toString() + "_" + params.id + "_" + filter}
                  >
                    <span>
                      <AppraiserPercentChangeCount
                        appraiserId={parseInt(params.id)}
                        filter={filter}
                      />
                    </span>
                  </Suspense>
                </>
              )}
            </div>
          </div>
        </div>

        <Suspense
          fallback={<BinocularsSkeleton />}
          key={page.toString() + "_" + params.id + "_" + filter}
        >
          <SalesData page={page} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
