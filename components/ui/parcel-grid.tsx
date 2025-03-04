import Link from "next/link";

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

export default async function ParcelsGrid({ parcels }: { parcels: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {parcels.map((parcel: any) => (
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
