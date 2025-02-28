import { getFilteredData } from "@/lib/data";
import Link from "next/link";

const ParcelCard = ({ parcel }: { parcel: any }) => {
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{parcel.parcel_number}</h2>
        <p className="text-gray-200 mb-2">
          <span className="font-semibold">Year:</span> {parcel.year}
        </p>
        <p className="text-gray-200 mb-2">
          <span className="font-semibold">Owner:</span> {parcel.owner_name}
        </p>
        <p className="text-gray-200 mb-2">
          <span className="font-semibold">Owner Address:</span>{" "}
          {parcel.owner_address_1}, {parcel.owner_city}, {parcel.owner_state}{" "}
          {parcel.owner_zip}
        </p>
        <p className="text-gray-200 mb-2">
          <span className="font-semibold">Site Address:</span>{" "}
          {parcel.site_address_1}, {parcel.site_zip}
        </p>

        <p className="text-gray-200 mb-2">
          <span className="font-semibold">Occupancy:</span> {parcel.occupancy} (
          {parcel.occupancy_description})
        </p>
        <p className="text-gray-200">
          <span className="font-semibold">Appraiser:</span> {parcel.appraiser}
        </p>
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
    table: "search_parcel_year",
    searchString: query,
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {data.map((parcel: any) => (
        <Link
          href={`/parcels/${parcel.parcel_number}`}
          key={parcel.id}
          className="border border-gray-200 rounded-lg"
        >
          <ParcelCard parcel={parcel} />
        </Link>
      ))}
    </div>
  );
}
