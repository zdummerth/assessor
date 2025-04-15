import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import ParcelNumber from "@/components/ui/parcel-number";

export default async function SearchResultsAll({
  query = "",
}: {
  query?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .rpc("search_all_parcels", {
      search_term: query,
    })
    .limit(9);

  console.log({ data, error });

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

  // const uniqueNeighborhoodsArray = Object.values(uniqueNeighborhoods);

  if (data.length > 0) {
    // console.log(data[0]);
  }

  return (
    <div className="">
      {data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-center">
            No parcels found for search term: <strong>{query}</strong>
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <Grid>
            {data.map((item: any) => (
              <Card key={item.parcel_number}>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">
                    {item.house_number} {item.street_name} {item.zip_code}
                  </h3>
                  <p className="my-2">
                    <ParcelNumber parcelNumber={item.parcel_number} />
                  </p>
                  <p className="text-sm">{item.name}</p>
                  {/* <p className="text-sm">
                    Owner Address: {item.owner_address2} {item.owner_city}{" "}
                    {item.owner_city}, {item.owner_state} {item.owner_zip}
                  </p> */}
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}
