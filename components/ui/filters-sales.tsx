import { NeighborhoodFilter } from "@/components/ui/filter";
import { Suspense } from "react";

export default async function SalesFilters() {
  return (
    <div className="h-[95vh] overflow-y-auto">
      <div className="border-b border-foreground py-8">
        <Suspense fallback={<div>loading filter...</div>}>
          <NeighborhoodFilter label="Neighborhood" urlParam="nbrhd" />
        </Suspense>
      </div>
    </div>
  );
}
