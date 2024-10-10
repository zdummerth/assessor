import ParcelFilters from "@/components/ui/filters-parcels";

import { Suspense } from "react";
import {
  CondoReportCard,
  CommercialReportCard,
  ResidentialReportCard,
} from "@/components/ui/report-cards";
import ParcelTabs from "@/components/ui/parcels-tabs";

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
    <div className="w-full flex gap-4">
      <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
        <ParcelFilters />
      </div>
      <div className="w-full">
        <ParcelTabs searchParams={searchParams} />
        <div className="flex flex-col gap-6">
          <Suspense fallback={<div>loading stats...</div>}>
            <CondoReportCard filters={formattedSearchParams} />
          </Suspense>
          <Suspense fallback={<div>loading stats...</div>}>
            <CommercialReportCard filters={formattedSearchParams} />
          </Suspense>
          <Suspense fallback={<div>loading stats...</div>}>
            <ResidentialReportCard filters={formattedSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
