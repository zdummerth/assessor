import { SelectFilter } from "@/components/ui/filter-client";
import SaleStats from "@/components/server/sale-stats";
import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";

export default async function Page(
  props: {
    searchParams?: Promise<{
      year?: string;
      sortColumn?: string;
      sortDirection?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const year = searchParams?.year || "Any";
  return (
    <div className="w-full flex">
      <div className="w-full">
        <h2 className="text-center text-lg my-4">Appeal Stats</h2>
        <div className="flex items-center gap-4 my-4 max-w-[200px] mx-auto">
          <p className="">Year</p>
          <SelectFilter
            values={[
              { value: "Average Sale Price", label: "Average Sale Price" },
              { value: "Min Sale Price", label: "Min Sale Price" },
              { value: "Max Sale Price", label: "Max Sale Price" },
              { value: "Number of Sales", label: "Number of Sales" },
            ]}
            defaultValue={year}
            urlParam="sortColumn"
          />
        </div>
        <Suspense fallback={<BinocularsSkeleton />} key={year}>
          <SaleStats searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
