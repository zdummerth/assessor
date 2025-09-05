import ParcelSearchClient from "@/components/parcel-search-client";
import SalesAddressSearch from "@/components/ui/sales/search-by-address";

export default async function Page() {
  return (
    <div className="p-4 flex gap-4">
      <ParcelSearchClient />
      <SalesAddressSearch className="flex-1" />
    </div>
  );
}
