import Filter from "@/components/ui/filter";
import { BooleanFilter, NonCodedFilter } from "@/components/ui/filter-client";
import { Suspense } from "react";

export default async function ParcelFilters() {
  const generateValues = (start: number, end: number) => {
    const values = [];
    for (let i = start; i <= end; i++) {
      values.push({ id: i.toString(), name: i.toString() });
    }
    return values;
  };

  return (
    <div className="h-[95vh] overflow-y-auto">
      <div className="border-b border-foreground py-8">
        <Suspense fallback={<div>loading filter...</div>}>
          <Filter label="Occupancy" urlParam="occupancy" />
        </Suspense>
      </div>
      <div className="border-b border-foreground py-8">
        <Suspense fallback={<div>loading filter...</div>}>
          <Filter label="Neighborhood" urlParam="cda" />
        </Suspense>
      </div>
      {/* <div className="border-b border-foreground py-8">
        <Suspense fallback={<div>loading filter...</div>}>
          <Filter label="SBD/CID District" urlParam="specBusDist" />
        </Suspense>
      </div>
      <div className="border-b border-foreground py-8">
        <Suspense fallback={<div>loading filter...</div>}>
          <Filter label="TIF District" urlParam="tif" />
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
        <BooleanFilter label="Is in TIF" urlParam="isTif" />
      </div>
      <div className="border-b border-foreground py-8">
        <BooleanFilter label="Is Abated" urlParam="isAbated" />
      </div> */}
    </div>
  );
}
