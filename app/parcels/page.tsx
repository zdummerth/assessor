import { Suspense } from "react";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
import SearchCount from "@/components/ui/search-count";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";
import ParcelsFilterPanel from "@/components/ui/parcel-filters-panel";
import { SelectFilter } from "@/components/ui/filter-client";
import Sidebar from "@/components/ui/sidebar";

export default async function ParcelsAdvancedSearchPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    sort?: string;
    year?: string;
    appraiser?: string;
    propertyClass?: string;
    occupancy?: string;
    nbhd?: string;
    sortColumn?: string;
    sortDirection?: string;
    view?: "grid" | "map" | "summary";
  };
}) {
  const limit = searchParams?.view === "map" ? 100 : ITEMS_PER_PAGE;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const occupancy = searchParams?.occupancy;

  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams || {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  // Exclude the year key for the filters count
  const { year: excluded, ...rest } = formattedSearchParams;
  const totalNumberOfFilters = Object.values(rest).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const filters = {
    ...formattedSearchParams,
    year: formattedSearchParams?.year || [new Date().getFullYear().toString()],
  };

  const year = filters.year[0];
  const classKey = searchParams?.propertyClass
    ? searchParams.propertyClass
    : "all";
  const sortColumnKey = searchParams?.sortColumn
    ? searchParams.sortColumn
    : "parcel_number";
  const sortDirectionKey = searchParams?.sortDirection
    ? searchParams.sortDirection
    : "asc";
  const occupancyKey = occupancy ? occupancy : "all";
  const neighborhoodKey = searchParams?.nbhd ? searchParams.nbhd : "all";
  const appraiserKey = searchParams?.appraiser ? searchParams.appraiser : "all";

  return (
    <div className="w-full flex">
      {/* Desktop Filters */}
      <div className="hidden lg:block w-[320px] px-2 mr-2 border-r border-gray-200">
        <ParcelsFilterPanel
          sortColumnKey={sortColumnKey}
          sortDirectionKey={sortDirectionKey}
          year={year}
          classKey={classKey}
        />
      </div>

      <div className="w-full">
        <div className="flex gap-2 items-center justify-between">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sidebar total={totalNumberOfFilters}>
              <ParcelsFilterPanel
                sortColumnKey={sortColumnKey}
                sortDirectionKey={sortDirectionKey}
                year={year}
                classKey={classKey}
              />
            </Sidebar>
          </div>

          {/* Display current parcel range */}
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
                  key={
                    year +
                      occupancyKey +
                      page +
                      sortColumnKey +
                      sortDirectionKey +
                      neighborhoodKey +
                      classKey +
                      appraiserKey +
                      searchParams?.view || "grid"
                  }
                >
                  <span>
                    <SearchCount
                      filters={filters}
                      table="parcel_year"
                      returnType="count"
                    />
                  </span>
                </Suspense>
              </>
            )}
          </div>
          <div>
            <SelectFilter
              values={[
                { value: "grid", label: "Grid" },
                { value: "map", label: "Map" },
                { value: "summary", label: "Summary" },
              ]}
              defaultValue={searchParams?.view || "grid"}
              urlParam="view"
            />
          </div>
        </div>

        <Suspense
          fallback={<BinocularsSkeleton />}
          key={
            year +
              occupancyKey +
              page +
              sortColumnKey +
              sortDirectionKey +
              neighborhoodKey +
              classKey +
              appraiserKey +
              searchParams?.view || "grid"
          }
        >
          <ParcelSearchResults
            currentPage={page}
            filters={filters}
            table="parcel_year"
            selectString="*, addresses(lat, lon, bbox)"
            view={searchParams?.view || "grid"}
            limit={limit}
          />
        </Suspense>
      </div>
    </div>
  );
}
