import Link from "next/link";

const ParcelCard = ({ parcel }: { parcel: any }) => {
  return (
    <div>
      <div className="px-4 pb-4 pt-2">
        <div className="flex justify-center text-sm mb-2">
          {parcel.tax_status === "E" && <span>Exempt</span>}
          {parcel.tax_status === "T" && <span>Taxable</span>}
          {parcel.tax_status === "S" && <span>State Assessed</span>}
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{parcel.parcel_number}</h2>
          <span className="text-sm">{parcel.year}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">
            ${parcel.appraised_total.toLocaleString()}
          </h2>
          <span className="text-sm">{parcel.prop_class}</span>
        </div>
        <p className="">
          {parcel.site_address_1}, {parcel.site_zip}
        </p>
        <p className="">
          {parcel.land_use} ({parcel.occupancy})
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
          {/* <p>{parcel.appraiser}</p> */}
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
          target="_blank"
        >
          <ParcelCard parcel={parcel} />
        </Link>
      ))}
    </div>
  );
}
