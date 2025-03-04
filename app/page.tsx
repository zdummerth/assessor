import Search from "@/components/ui/search";
import { YearSelectFilter } from "@/components/ui/filter-client";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    years?: string;
    year?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  console.log({ formattedSearchParams });

  const query = searchParams?.query;

  const filters = {
    ...formattedSearchParams,
    year: formattedSearchParams?.year || [new Date().getFullYear().toString()],
  };

  // console.log({ filters });

  return (
    <div className="">
      <div className="flex gap-4">
        <div className="w-[85px] text-sm">
          <YearSelectFilter defaultValue={filters.year[0]} />
        </div>

        <div className=" w-full md:w-[300px]">
          <Search placeholder="parcel number or site address" />
        </div>
      </div>
      {query && (
        <Suspense
          fallback={<BinocularsSkeleton />}
          key={`${query}-${filters.year[0]}`}
        >
          <ParcelSearchResults
            query={query}
            filters={filters}
            view="grid"
            limit={9}
          />
        </Suspense>
      )}
    </div>
  );
}
