import Search from "@/components/ui/search";
import { SelectFilter } from "@/components/ui/filter-client";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
import {
  ParcelSearchResultsSkeleton,
  BinocularsSkeleton,
} from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    year?: string;
  };
}) {
  const query = searchParams?.query;
  const year = searchParams?.year || new Date().getFullYear().toString();

  return (
    <div className="">
      <div className="flex gap-4">
        <div className="w-[85px]">
          <SelectFilter
            values={[
              { value: "2020", label: "2020" },
              { value: "2021", label: "2021" },
              { value: "2022", label: "2022" },
              { value: "2023", label: "2023" },
              { value: "2024", label: "2024" },
              { value: "2025", label: "2025" },
            ]}
            urlParam="year"
            defaultValue={{ value: year, label: year }}
          />
        </div>

        <div className=" w-full md:w-[300px]">
          <Search placeholder="parcel number or site address" />
        </div>
      </div>
      {query && (
        <Suspense fallback={<BinocularsSkeleton />} key={`${query}-${year}`}>
          <ParcelSearchResults query={query} year={year} />
        </Suspense>
      )}
    </div>
  );
}
