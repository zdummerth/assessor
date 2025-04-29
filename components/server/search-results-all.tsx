import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "@/components/ui/parcel-number";
import FormattedDate from "@/components/ui/formatted-date";

export default async function SearchResults({
  query = "",
  active = false,
}: {
  query?: string;
  active?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .rpc("search_parcels", {
      prefix: query,
      active,
    })
    .order("retired", { nullsFirst: true })
    .order("parcel")
    .limit(9);

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log(data);

  return (
    <div className="flex flex-col">
      {data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-center">
            No parcels found for search term: <strong>{query}</strong>
          </p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {data.map((item: any) => {
            return (
              <div
                className="flex flex-col w-full border rounded-md p-2 lg:h-[200px] overflow-y-auto"
                key={item.parcel}
              >
                <div className="flex justify-between items-center mb-2">
                  <ParcelNumber parcelNumber={item.parcel} />
                  {item.retired ? (
                    <div className="text-sm text-red-500 flex gap-1">
                      <span>Retired:</span>
                      <FormattedDate date={item.retired} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-green-500">Active</p>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <p>{item.neighborhood}</p>
                  <p>{item.land_use}</p>
                  <p>${item.appraised_total.toLocaleString()}</p>
                </div>
                <div>
                  {item.addresses.map((address: any) => {
                    return (
                      <div
                        key={
                          address.house_number +
                          address.street_name +
                          address.zip_code +
                          address.street_suffix
                        }
                        className="flex flex-col gap-1"
                      >
                        <p className="text-sm">
                          {address.house_number} {address.street_name || ""}{" "}
                          {address.street_suffix} {address.zip_code}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm mt-2">
                  <div>
                    <p>{item.appraiser}</p>
                    <p>{item.appraiser_email}</p>
                    <p>{item.appraiser_phone}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {item.names.map((owner: string, index: number) => {
                    return (
                      <div key={owner + index} className="flex flex-col gap-1">
                        <p className="text-sm">{owner}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
