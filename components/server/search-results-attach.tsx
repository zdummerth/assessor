import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "@/components/ui/parcel-number";
import { CreateListItem } from "@/components/ui/lists/create";

export default async function SearchResultsAttach({
  query = "",
  listId,
  year = new Date().getFullYear(),
}: {
  query?: string;
  listId: number;
  year?: number;
}) {
  // replace spaces with + in the query string
  const cleanedQuery = query.replace(/\s+/g, "+");
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .rpc("search_parcels", {
      prefix: cleanedQuery,
    })
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
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-8">
          {data.map((item: any) => {
            return (
              <div
                className="flex flex-col w-full border rounded-md p-2"
                key={item.parcel}
              >
                <div className="flex justify-between items-center mb-2">
                  <ParcelNumber parcelNumber={item.parcel} />
                  <CreateListItem
                    listId={listId}
                    parcel_number={item.parcel}
                    year={year}
                  />
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
