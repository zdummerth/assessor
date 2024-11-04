import { NeighborhoodFilter } from "@/components/ui/filter";
import {
  PriceRangeMenu,
  DateRangeMenu,
  ClientDisclosureWrapper,
} from "./filter-client";
import { Suspense } from "react";

export default async function SalesFilters({ count = 0 }: { count?: number }) {
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
      <div className="fixed top-0 right-10">
        <div className="p-2 rounded-md bg-background">{count} Sales</div>
      </div>
    </div>
  );
}
