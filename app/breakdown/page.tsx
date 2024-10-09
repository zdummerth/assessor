import Filter, { NonCodedFilter } from "@/components/ui/filter";
import { Suspense } from "react";
import { getFilteredData } from "@/lib/data";
import {
  CondoReportCard,
  CommercialReportCard,
  ResidentialReportCard,
  GroupedReportCard,
} from "@/components/ui/report-cards";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full flex gap-4">
        <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
          <div className="border-b border-foreground py-8">
            <NonCodedFilter
              values={[
                { id: 1, name: "1" },
                { id: 2, name: "2" },
                { id: 3, name: "3" },
                { id: 4, name: "4" },
                { id: 5, name: "5" },
                { id: 6, name: "6" },
                { id: 7, name: "7" },
                { id: 8, name: "8" },
                { id: 9, name: "9" },
                { id: 10, name: "10" },
              ]}
              label="Ward"
              urlParam="ward"
            />
          </div>
        </div>
        <div className="w-full">
          <h2 className="font-bold text-2xl mb-4">Breakdown</h2>
          <Suspense fallback={<div>loading stats...</div>}>
            <CondoReportCard filters={formattedSearchParams} />
          </Suspense>
          <Suspense fallback={<div>loading stats...</div>}>
            <CommercialReportCard filters={formattedSearchParams} />
          </Suspense>
          <Suspense fallback={<div>loading stats...</div>}>
            <ResidentialReportCard filters={formattedSearchParams} />
          </Suspense>
          {/* <Suspense fallback={<div>loading stats...</div>}>
            <GroupedReportCard
              filters={formattedSearchParams}
              groupBy="asrlanduse1"
            />
          </Suspense> */}
        </div>
      </div>
    </div>
  );
}
