import { Suspense } from "react";
import ParcelComparables from "@/components/parcel-comparables/all-comps";

export default async function Page() {
  // console.log("Parcel data:", parcel);

  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading parcel comparables...</div>}>
        <ParcelComparables />
      </Suspense>
    </div>
  );
}
