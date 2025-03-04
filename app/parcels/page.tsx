import { Suspense } from "react";
import ParcelFilters from "@/components/ui/filters-parcels";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
import SearchCount from "@/components/ui/search-count";
import Sidebar from "@/components/ui/sidebar";
import { YearSelectFilter, SelectFilter } from "@/components/ui/filter-client";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";

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
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const occupancy = searchParams?.occupancy;

  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  // get fomratttedSearchParams without year key
  const { year: excluded, ...rest } = formattedSearchParams;

  // get sum of array lengths in rest
  const totalNumberOfFilters = Object.values(rest).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const filters = {
    ...formattedSearchParams,
    year: formattedSearchParams?.year || [new Date().getFullYear().toString()],
  };

  const year = filters.year[0];

  const yearKey = year ? year : "all";
  const classKey = searchParams?.propertyClass
    ? searchParams.propertyClass
    : "all";
  const occupancyKey = occupancy ? occupancy : "all";
  const neighborhoodKey = searchParams?.nbhd ? searchParams.nbhd : "all";
  const appraiserKey = searchParams?.appraiser ? searchParams.appraiser : "all";
  const sortColumnKey = searchParams?.sortColumn
    ? searchParams.sortColumn
    : "parcel_number";

  const sortDirectionKey = searchParams?.sortDirection
    ? searchParams.sortDirection
    : "asc";

  console.log({
    yearKey,
    classKey,
    occupancyKey,
    sortColumnKey,
    sortDirectionKey,
  });

  return (
    <div className="w-full flex">
      <div className="hidden lg:block w-[320px] px-2 mr-2 border-r border-gray-200">
        <div>
          <div>
            <div className="text-sm mb-2">Sort by</div>
            <div className="flex gap-2 text-sm">
              <SelectFilter
                values={[
                  {
                    value: "parcel_number",
                    label: "Parcel Number",
                  },
                  {
                    value: "occupancy",
                    label: "Occupancy",
                  },
                ]}
                defaultValue={sortColumnKey}
                urlParam="sortColumn"
              />
              <div className="w-[120px]">
                <SelectFilter
                  values={[
                    {
                      value: "asc",
                      label: "Asc",
                    },
                    {
                      value: "desc",
                      label: "Desc",
                    },
                  ]}
                  defaultValue={sortDirectionKey}
                  urlParam="sortDirection"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm my-2">Year</div>
          <YearSelectFilter defaultValue={year} />
        </div>
        <div>
          <div className="text-sm my-2">Property Class</div>
          <SelectFilter
            values={[
              {
                value: "Residential",
                label: "Residential",
              },
              {
                value: "Commercial",
                label: "Commercial",
              },
              {
                value: "Exempt",
                label: "Exempt",
              },
              {
                value: "all",
                label: "All",
              },
            ]}
            defaultValue={classKey}
            urlParam="propertyClass"
          />
        </div>
        <ParcelFilters />
      </div>
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <div className="lg:hidden">
            <Sidebar total={totalNumberOfFilters}>
              <div>
                <div className="py-4">
                  <YearSelectFilter defaultValue={year} />
                </div>
                <ParcelFilters />
              </div>
            </Sidebar>
          </div>
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

          {/* display range of current parcels */}
          <div className="text-sm flex items-center gap-2">
            <span>
              {page > 1 ? (page - 1) * ITEMS_PER_PAGE + 1 : 1}-
              {page * ITEMS_PER_PAGE}
            </span>
            <span>of</span>
            <Suspense
              fallback={
                <span className="bg-gray-500 rounded h-4 w-12 animate-pulse"></span>
              }
              key={
                yearKey +
                occupancyKey +
                page +
                sortColumnKey +
                sortDirectionKey +
                neighborhoodKey +
                classKey +
                appraiserKey
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
          </div>
        </div>
        <Suspense
          fallback={<BinocularsSkeleton />}
          key={
            yearKey +
            occupancyKey +
            page +
            sortColumnKey +
            sortDirectionKey +
            neighborhoodKey +
            classKey +
            appraiserKey
          }
        >
          <ParcelSearchResults
            currentPage={page}
            filters={filters}
            table="parcel_year"
          />
        </Suspense>
      </div>
    </div>
  );
}
