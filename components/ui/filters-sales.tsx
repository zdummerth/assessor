import { NeighborhoodFilter } from "@/components/ui/filter";
import {
  PriceRangeMenu,
  DateRangeMenu,
  ClientDisclosureWrapper,
} from "./filter-client";
import { Suspense } from "react";

export default async function SalesFilters({
  count = 0,
  currentFilters,
}: {
  count?: number;
  currentFilters?: any;
}) {
  console.log(currentFilters);
  const numberofNeighborhoodFilters = currentFilters?.nbrhd?.length || 0;
  // console.log(numberofNeighborhoodFilters);
  return (
    <div className="flex gap-4 relative z-10">
      <div className="">
        <ClientDisclosureWrapper
          serverComponent={
            <Suspense fallback={<div>loading filter...</div>}>
              <NeighborhoodFilter label="Neighborhood" urlParam="nbrhd" />
            </Suspense>
          }
          label="Neighborhoods"
          currentCount={numberofNeighborhoodFilters}
        />
      </div>
      <div>
        <PriceRangeMenu
          isActive={currentFilters?.min_price || currentFilters?.max_price}
        />
      </div>
      <div>
        <DateRangeMenu
          isActive={currentFilters?.start_date || currentFilters?.end_date}
        />
      </div>
      <div className="fixed top-0 right-10">
        <div className="p-2 rounded-md bg-background">{count} Sales</div>
      </div>
    </div>
  );
}
