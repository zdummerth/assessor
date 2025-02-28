import { getFilteredData } from "@/lib/data";
import Link from "next/link";
import { SearchX } from "lucide-react";

const ParcelCard = ({ parcel }: { parcel: any }) => {
  return (
    <div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{parcel.parcel_number}</h2>
          <span className="text-sm">{parcel.year}</span>
        </div>
        <p className="">
          {parcel.site_address_1}, {parcel.site_zip}
        </p>
        <p className="">
          {parcel.occupancy} ({parcel.occupancy_description})
        </p>
        <p className="">{parcel.neighborhood}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Owner</h3>
        </div>
        <p className="mb-2">{parcel.owner_name}</p>
        <p className="mb-2">
          {parcel.owner_address_1}, {parcel.owner_city}, {parcel.owner_state}{" "}
          {parcel.owner_zip}
        </p>
        <div>
          <h3 className="font-semibold">Appraiser</h3>
          <p>{parcel.appraiser}</p>
        </div>
      </div>
    </div>
  );
};

export default async function ParcelSearchResults({
  query,
  year,
}: {
  query: string;
  year: string;
}) {
  const { data, error } = await getFilteredData({
    filters: { year },
    currentPage: 1,
    table: "search_site_addresses",
    searchString: query,
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {data.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-16">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-center">
            No parcels found for search term: <strong>{query}</strong>
          </p>
        </div>
      )}
      {data.map((parcel: any) => (
        <Link
          href={`/parcels/${parcel.parcel_number}`}
          key={parcel.id}
          className="border border-gray-200 rounded-lg shadow-sm shadow-foreground"
        >
          <ParcelCard parcel={parcel} />
        </Link>
      ))}
    </div>
  );
}
