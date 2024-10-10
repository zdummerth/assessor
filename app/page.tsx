import { ValueCard } from "@/components/ui/report-cards";
import ParcelsTable from "@/components/ui/parcels-table";
import Filter from "@/components/ui/filter";
import { BooleanFilter, NonCodedFilter } from "@/components/ui/filter-client";
import { Suspense } from "react";
import Link from "next/link";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
    isTif?: string;
    isAbated?: string;
    view?: "parcelTable" | "values";
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const generateValues = (start: number, end: number) => {
    const values = [];
    for (let i = start; i <= end; i++) {
      values.push({ id: i.toString(), name: i.toString() });
    }
    return values;
  };

  const defaultView = searchParams?.view || "values";

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full flex gap-4">
        <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden max-h-[500px] overflow-y-auto">
          <div className="border-b border-foreground py-8">
            <Suspense fallback={<div>loading filter...</div>}>
              <Filter label="Occupancy" urlParam="landuse" />
            </Suspense>
          </div>
          <div className="border-b border-foreground py-8">
            <Suspense fallback={<div>loading filter...</div>}>
              <Filter label="Neighborhood" urlParam="cda" />
            </Suspense>
          </div>
          <div className="border-b border-foreground py-8">
            <NonCodedFilter
              values={generateValues(1, 14)}
              label="Ward"
              urlParam="ward"
            />
          </div>
          <div className="border-b border-foreground py-8">
            <BooleanFilter
              label="Is in TIF"
              urlParam="isTif"
              value={searchParams?.isTif}
            />
          </div>
          <div className="border-b border-foreground py-8">
            <BooleanFilter
              label="Is Abated"
              urlParam="isAbated"
              value={searchParams?.isAbated}
            />
          </div>
        </div>
        <div className="w-full">
          <div>
            <Link
              href={{
                pathname: "/parcels",
                query: searchParams,
              }}
            >
              {"Parcels >"}
            </Link>
          </div>
          <Suspense fallback={<div>loading stats...</div>}>
            <ValueCard filters={formattedSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
