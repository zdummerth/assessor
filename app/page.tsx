import { ValueCard } from "@/components/ui/report-cards";
import ParcelFilters from "@/components/ui/filters-parcels";
import { Suspense } from "react";
import ParcelTabs from "@/components/ui/parcels-tabs";
import Search from "@/components/ui/search";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
    isTif?: string;
    isAbated?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  // console.log(formattedSearchParams);

  return (
    <div className="w-full flex gap-4">
      <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden">
        <Search placeholder="Search parcels" />
        {/* <ParcelFilters /> */}
      </div>
      <div className="w-full">
        <ParcelTabs searchParams={searchParams} />
        {/* <Suspense fallback={<div>loading stats...</div>}>
          <ValueCard filters={formattedSearchParams} />
        </Suspense> */}
      </div>
    </div>
  );
}
