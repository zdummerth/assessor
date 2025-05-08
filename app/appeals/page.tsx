import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { ArrowButton } from "@/components/ui/pagination-client";
import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import Appeals, { Count } from "@/components/server/appeals";
import { SelectFilter } from "@/components/ui/filter-client";
import Nav from "@/app/appeals/nav";

export default async function Page(props: {
  searchParams?: Promise<{
    page?: string;
    year?: string;
    appraiser?: string;
    status?: string;
    type?: string;
    hearing?: string;
    complaintType?: string;
    sortColumn?: string;
    sortDirection?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const limit = ITEMS_PER_PAGE;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const supabase = await createClient();

  const complaint_types = supabase
    .from("appeal_complaint_types")
    .select("*")
    .order("complaint_type", { ascending: true });
  const appraisers = supabase
    .from("appeal_re_appraisers")
    .select("*")
    .order("name", {
      ascending: true,
    });
  const statuses = supabase
    .from("appeal_statuses")
    .select("*")
    .order("status", { ascending: true });
  const types = supabase
    .from("appeal_types")
    .select("*")
    .order("name", { ascending: true });

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

  const suspenseKey = `${page.toString()}_${searchParams?.appraiser}_${searchParams?.status}_${searchParams?.type}_${searchParams?.complaintType}_${searchParams?.year}_${searchParams?.hearing}`;

  return (
    <div className="w-full flex p-4">
      <div className="w-full">
        <Nav />
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
                defaultValue={searchParams?.year || "2025"}
                urlParam="year"
              />
            </div>
            <div className="">
              <p className="mb-2">Appraiser</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  { value: "Unassigned", label: "Unassigned" },
                  ...appraisers_data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                  })),
                ]}
                defaultValue={searchParams?.appraiser || "Any"}
                urlParam="appraiser"
              />
            </div>
            <div className="">
              <p className="mb-2">Status</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  ...statuses_data.data.map((item: any) => ({
                    value: item.status,
                    label: item.status,
                  })),
                ]}
                defaultValue={searchParams?.status || "Any"}
                urlParam="status"
              />
            </div>
            <div className="">
              <p className="mb-2">Type</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  ...types_data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                  })),
                ]}
                defaultValue={searchParams?.type || "Any"}
                urlParam="type"
              />
            </div>
            <div>
              <p className="mb-2">Complaint Type</p>
              <SelectFilter
                values={[
                  { value: "Any", label: "Any" },
                  ...complaint_types_data.data.map((item: any) => ({
                    value: item.complaint_type,
                    label: item.complaint_type,
                  })),
                ]}
                defaultValue={searchParams?.complaintType || "Any"}
                urlParam="complaintType"
              />
            </div>
            <div>
              <p className="mb-2">Hearing Scheduled?</p>
              <SelectFilter
                values={[
                  { value: "true", label: "True" },
                  { value: "false", label: "False" },
                  { value: "Any", label: "Any" },
                ]}
                defaultValue={searchParams?.hearing || "Any"}
                urlParam="hearing"
              />
            </div>
          </div>
        </div>

        <Suspense fallback={<BinocularsSkeleton />} key={suspenseKey}>
          <Appeals
            page={page}
            appraiser={searchParams?.appraiser || "Any"}
            status={searchParams?.status || "Any"}
            type={searchParams?.type || "Any"}
            complaintType={searchParams?.complaintType || "Any"}
            year={searchParams?.year || "2025"}
            hearing={searchParams?.hearing || "Any"}
          />
        </Suspense>
      </div>
    </div>
  );
}
