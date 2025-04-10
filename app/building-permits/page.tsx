import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import BuildingPermits, { Count } from "@/components/server/building-permits";
import { SelectFilter } from "@/components/ui/filter-client";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    year?: string;
    status?: string;
    type?: string;
    sortColumn?: string;
    sortDirection?: string;
  };
}) {
  const limit = ITEMS_PER_PAGE;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const supabase = await createClient();

  const complaint_types = supabase.from("appeal_complaint_types").select("*");
  const appraisers = supabase.from("appeal_re_appraisers").select("*");
  const statuses = supabase.from("appeal_statuses").select("*");
  const types = supabase.from("appeal_types").select("*");

  const [complaint_types_data, appraisers_data, statuses_data, types_data] =
    await Promise.all([complaint_types, appraisers, statuses, types]);

  const errors = [
    complaint_types_data.error,
    appraisers_data.error,
    statuses_data.error,
    types_data.error,
  ].filter((error) => error !== null);

  if (
    !complaint_types_data.data ||
    !appraisers_data.data ||
    !statuses_data.data ||
    !types_data.data
  ) {
    console.error(errors);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching filters</p>
        <p>Please refresh page</p>
      </div>
    );
  }
  //   console.log({ data, error });
  console.log(types_data.data);

  const suspenseKey = `${page.toString()}_${searchParams?.type}_${searchParams?.status}_${searchParams?.year}`;

  return (
    <div className="w-full flex p-4">
      <div className="w-full">
        <h2 className="text-center text-xl my-4">Building Permits</h2>
        <div>
          <div className="flex gap-4 flex-wrap my-4">
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
              <p className="mb-2">Status</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "COMPLETED", label: "COMPLETED" },
                  { value: "VOID", label: "VOID" },
                ]}
                defaultValue={searchParams?.status || "Any"}
                urlParam="status"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <div className="text-sm flex items-center gap-2">
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
                    {/* <Count
                      appraiser={searchParams?.appraiser || "Any"}
                      status={searchParams?.status || "Any"}
                      type={searchParams?.type || "Any"}
                      complaintType={searchParams?.complaintType || "Any"}
                      year={searchParams?.year || "Any"}
                    /> */}
                  </span>
                </Suspense>
              </>
            </div>
          </div>
        </div>

        <Suspense fallback={<BinocularsSkeleton />} key={suspenseKey}>
          <BuildingPermits
            page={page}
            year={searchParams?.year || "Any"}
            status={searchParams?.status || "Any"}
            type={searchParams?.type || "Any"}
          />
        </Suspense>
      </div>
    </div>
  );
}
