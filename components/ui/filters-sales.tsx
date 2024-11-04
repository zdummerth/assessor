import { NeighborhoodFilter } from "@/components/ui/filter";
import {
  PriceRangeMenu,
  DateRangeMenu,
  ClientDisclosureWrapper,
} from "./filter-client";
import { Suspense } from "react";

export default async function SalesFilters({ count }: { count: number }) {
  return (
    <div className="flex gap-4 relative z-10">
      <div className="">
        <ClientDisclosureWrapper
          serverComponent={
            <Suspense fallback={<div>loading filter...</div>}>
              <NeighborhoodFilter label="Neighborhood" urlParam="nbrhd" />
            </Suspense>
          }
          label="Neighborhood"
        />
      </div>
      <div>
        <PriceRangeMenu />
      </div>
      <div>
        <DateRangeMenu />
      </div>
      <div className="absolute top-0 right-0">
        <div className="p-2 rounded-md">{count} Sales</div>
      </div>
    </div>
  );
}
