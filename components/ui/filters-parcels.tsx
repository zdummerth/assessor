import Filter, {
  NeighborhoodFilter,
  AppraiserFilter,
} from "@/components/ui/filter";
import { Suspense } from "react";

export default async function ParcelFilters() {
  return (
    <div className="h-[95vh] overflow-y-auto">
      <div className="border-b border-foreground py-4">
        <Suspense fallback={<div>loading filter...</div>}>
          <Filter label="Occupancy" urlParam="occupancy" />
        </Suspense>
      </div>
      <div className="border-b border-foreground py-4">
        <Suspense fallback={<div>loading filter...</div>}>
          <NeighborhoodFilter label="Neighborhood" urlParam="nbhd" />
        </Suspense>
      </div>
      {/* <div className="border-b border-foreground py-4">
        <Suspense fallback={<div>loading filter...</div>}>
          <AppraiserFilter label="Appraiser" urlParam="appraiser" />
        </Suspense>
      </div> */}
    </div>
  );
}
