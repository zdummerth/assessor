import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return {
    title: id,
  };
}

// Helper function: Compares two parcel records and returns only the changed fields.
function getDifferences(oldParcel: any, newParcel: any) {
  const differences: Record<string, [any, any]> = {};
  // Ignore these keys when comparing
  const ignoreKeys = [
    "id",
    "year",
    "parcel_number",
    "owner_address_1",
    "owner_city",
    "owner_state",
    "owner_zip",
    "appraised_res_building",
    "assessed_res_building",
    "working_improve_value",
    "working_total_value",
  ];
  // Compare the union of keys from both records
  const keys = new Set([...Object.keys(oldParcel), ...Object.keys(newParcel)]);
  keys.forEach((key) => {
    if (ignoreKeys.includes(key)) return;
    if (oldParcel[key] !== newParcel[key]) {
      differences[key] = [oldParcel[key], newParcel[key]];
    }
  });
  return differences;
}

function ParcelTimeline({ parcels }: { parcels: any[] }) {
  const sortedParcels = [...parcels].sort((a, b) => a.year - b.year);

  const timelineItems = sortedParcels.map((parcel, index) => {
    if (index === 0) {
      // No previous record for the first year
      return null;
    }
    const previousParcel = sortedParcels[index - 1];
    const changes = getDifferences(previousParcel, parcel);
    if (Object.keys(changes).length === 0) {
      // No changes to display for this year
      return null;
    }
    return (
      <div
        key={parcel.year}
        className="timeline-item mb-4 p-2 border rounded shadow-sm"
      >
        <h3 className="font-semibold">{parcel.year}</h3>
        <ul className="list-disc list-inside">
          {Object.entries(changes).map(([field, [oldValue, newValue]]) => (
            <li key={field}>
              <span className="font-bold">{field}</span>: {oldValue}{" "}
              <span className="mx-2">→</span> {newValue}
            </li>
          ))}
        </ul>
      </div>
    );
  });

  // Only render timeline items that have changes
  return <div>{timelineItems.filter((item) => item !== null)}</div>;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      //@ts-ignore
      .from("parcel_years")
      .select()
      .eq("parcel_number", id)
      .order("assessor_year", { ascending: false });

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch data");
    }

    if (Array.isArray(data) && data.length === 0) {
      return <div>Parcel not found</div>;
    }

    const maxYear = data.reduce(
      (max: number, parcel: any) => (parcel.year > max ? parcel.year : max),
      0
    );

    const mostRecentParcel = data.find(
      (parcel: any) => parcel.year === maxYear
    );

    // const { data: address, error: addressError } = await supabase
    //   .from("addresses")
    //   .select("address, address_line1, postcode, formatted, lat, lon, bbox")
    //   .eq("address", mostRecentParcel?.site_address_1 || "")
    //   .limit(1)
    //   .single();

    // const displayAddress = address
    //   ? `${address.address_line1} ${address.postcode}`
    //   : `${mostRecentParcel.site_address_1} ${mostRecentParcel.zip || ""}`;

    // console.log(mostRecentParcel);
    // return (
    //   <div>
    //     <div className="grid w-full gap-4 grid-cols-1 lg:grid-cols-3 lg:h-[450px]">
    //       <div className="rounded-lg shadow-lg p-2 md:p-4">
    //         {/* ID Section */}
    //         <div className="flex items-center space-x-3 border-b pb-3">
    //           <h1 className="text-2xl font-semibold">{id}</h1>
    //           <CopyToClipboard text={id} />
    //         </div>

    //         {/* Address Section */}
    //         <div className="mt-2 flex items-center justify-between border-b pb-3">
    //           <div className="flex items-center space-x-2">
    //             <p className="">{displayAddress}</p>
    //             <CopyToClipboard text={displayAddress} />
    //           </div>
    //           <a
    //             href={`https://www.google.com/maps/search/?api=1&query=${displayAddress}`}
    //             target="_blank"
    //             rel="noreferrer"
    //           >
    //             <MapPin
    //               size={18}
    //               className="text-gray-500 hover:text-blue-500 transition-colors"
    //             />
    //           </a>
    //         </div>

    //         {/* Owner Info */}
    //         <div className="mt-2 border-b pb-3">
    //           <p className="font-medium">{mostRecentParcel.owner_name}</p>
    //           <p className="">{mostRecentParcel.owner_address_1}</p>
    //         </div>

    //         {/* Neighborhood */}
    //         <div className="mt-2 border-b pb-3">
    //           <p className="">
    //             <span className="font-semibold">Neighborhood:</span>{" "}
    //             {mostRecentParcel.neighborhood}
    //           </p>
    //         </div>

    //         {/* Occupancy */}
    //         <div className="mt-2 border-b pb-3 flex items-center space-x-2">
    //           <span className="font-semibold">
    //             {mostRecentParcel.occupancy}
    //           </span>
    //           <span className="">-</span>
    //           <span className="">{mostRecentParcel.occupancy_description}</span>
    //         </div>

    //         {/* Appraiser */}
    //         <div className="mt-2 border-b pb-3">
    //           <p className="">
    //             <span className="font-semibold">Appraiser:</span>{" "}
    //             {mostRecentParcel.appraiser}
    //           </p>
    //         </div>

    //         {/* Appraised Total */}
    //         <div className="mt-2 border-b pb-3">
    //           <p className="">
    //             <span className="font-semibold">Appraised Total:</span>{" "}
    //             {mostRecentParcel.appraised_total}
    //           </p>
    //         </div>

    //         {/* Property Class */}
    //         <div className="mt-2">
    //           <p className="font-medium">{mostRecentParcel.property_class}</p>
    //         </div>
    //       </div>

    //       <div className="border rounded-lg h-[400px] shadow overflow-hidden">
    //         <AppraisedTotalLineChart data={data} />
    //       </div>

    //       <div className="rounded-lg shadow flex flex-col items-center overflow-hidden">
    //         {address?.lat && address?.lon && (
    //           <BaseMap lat={address.lat} lon={address.lon} />
    //         )}
    //       </div>
    //     </div>

    //     {/* Existing Parcel Cards */}
    //     <div className="flex flex-col space-y-4">
    //       {data.map((parcel: any) => (
    //         <ParcelCard
    //           key={`${parcel.parcel_number}-${parcel.year}`}
    //           data={parcel}
    //         />
    //       ))}
    //     </div>

    //     {/* Timeline Section */}
    //     <div>
    //       <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
    //         Timeline
    //       </h2>
    //       <ParcelTimeline parcels={data} />
    //     </div>

    //     {/* Sales Section */}
    //     <div>
    //       <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
    //         Sales
    //       </h2>
    //       <Suspense fallback={<div>loading sales...</div>}>
    //         <ParcelSales parcel_number={id} />
    //       </Suspense>
    //     </div>

    //     {/* Appeals Section */}
    //     <div>
    //       <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
    //         Appeals
    //       </h2>
    //       <Suspense fallback={<div>loading appeals...</div>}>
    //         <ParcelAppeals parcel_number={id} />
    //       </Suspense>
    //     </div>

    //     {/* Permits Section */}
    //     <div>
    //       <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
    //         Permits
    //       </h2>
    //       <Suspense fallback={<div>loading permits...</div>}>
    //         <ParcelPermits parcel_number={id} />
    //       </Suspense>
    //     </div>
    //   </div>
    // );

    return <div>Testing</div>;
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }
}
