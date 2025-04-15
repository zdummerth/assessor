import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import SalesData, { Count } from "@/components/server/sales";
import { SelectFilter } from "@/components/ui/filter-client";

export default async function SalesPage({
  searchParams,
  params,
}: {
  params: { id: string };
  searchParams?: {
    filter?: string;
    page?: string;
    appraiser?: string;
    year?: string;
    status?: string;
    propertyClass?: string;
    occupancy?: string;
    neighborhood?: string;
    sortColumn?: string;
    sortDirection?: string;
    view?: "grid" | "map" | "summary";
  };
}) {
  const limit = ITEMS_PER_PAGE;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const supabase = await createClient();
  const appraisers = supabase.from("appraisers").select("*");
  const neighborhoods = supabase
    .from("neighborhoods")
    .select("neighborhood")
    .lt("neighborhood", 500)
    .order("neighborhood", { ascending: true });
  const [appraisers_data, neighborhood_data] = await Promise.all([
    appraisers,
    neighborhoods,
  ]);
  const errors = [appraisers_data.error, neighborhood_data.error].filter(
    (error) => error !== null
  );

  if (!appraisers_data.data || !neighborhood_data.data) {
    console.error(errors);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching filters</p>
        <p>Please refresh page</p>
      </div>
    );
  }

  // console.log(appraisers_data.data);

  const suspenseKey = `${page.toString()}_${params.id}_${searchParams?.appraiser}_${searchParams?.status}_${searchParams?.year}_${searchParams?.neighborhood}`;
  return (
    <div className="w-full flex p-2">
      <div className="w-full">
        <h2 className="text-center text-lg my-4">Sales</h2>
        <div>
          <div className="flex gap-2 flex-wrap my-4">
            <div className="">
              <p className="mb-2">Year</p>
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
                defaultValue={searchParams?.year || "Any"}
                urlParam="year"
              />
            </div>
            <div className="">
              <p className="mb-2">Appraiser</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  ...appraisers_data.data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]}
                defaultValue={searchParams?.appraiser || "Any"}
                urlParam="appraiser"
              />
            </div>
            <div className="">
              <p className="mb-2">Neighborhood</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  ...neighborhood_data.data.map((item: any) => ({
                    value: item.neighborhood,
                    label: item.neighborhood,
                  })),
                ]}
                defaultValue={searchParams?.neighborhood || "Any"}
                urlParam="neighborhood"
              />
            </div>
            <div className="">
              <p className="mb-2">Status</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  { value: "status_pending", label: "Status Pending" },
                  {
                    value: "Improved, open market, arms length",
                    label: "Improved, open market, arms length",
                  },
                  { value: "foreclosure", label: "Foreclosure" },
                  {
                    value: "after_foreclosure",
                    label: "Sale After Foreclosure",
                  },
                ]}
                defaultValue={searchParams?.status || "Any"}
                urlParam="status"
              />
            </div>
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
                    key={suspenseKey}
                  >
                    <span>
                      <Count
                        appraiserId={parseInt(params.id)}
                        year={searchParams?.year || "Any"}
                        neighborhood={searchParams?.neighborhood || "Any"}
                        status={searchParams?.status || "Any"}
                        appraiser={searchParams?.appraiser || "Any"}
                      />
                    </span>
                  </Suspense>
                </>
              )}
            </div>
          </div>
        </div>

        <Suspense fallback={<BinocularsSkeleton />} key={suspenseKey}>
          <SalesData
            page={page}
            appraiser={searchParams?.appraiser || "Any"}
            neighborhood={searchParams?.neighborhood || "Any"}
            status={searchParams?.status || "Any"}
            year={searchParams?.year || "Any"}
          />
        </Suspense>
      </div>
    </div>
  );
}
