import { SelectFilter } from "@/components/ui/filter-client";
import AppealStats from "@/components/server/appeal-stats";
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
              { value: "Any", label: "Any" },
              { value: "2020", label: "2020" },
              { value: "2021", label: "2021" },
              { value: "2022", label: "2022" },
              { value: "2023", label: "2023" },
              { value: "2024", label: "2024" },
              { value: "2025", label: "2025" },
            ]}
            defaultValue={year}
            urlParam="year"
          />
        </div>
        <Suspense fallback={<BinocularsSkeleton />} key={year}>
          <AppealStats searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
