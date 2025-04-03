import { getFilteredData } from "@/lib/data";
import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import Link from "next/link";

export default async function SearchResults({
  query = "",
}: {
  query?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("search_current_parcels", {
      search_text: query,
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
              <Card>
                <Link
                  href={`/parcels/${item.parcel_number}`}
                  key={item.parcel_number}
                  target="_blank"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      {item.site_street_number} {item.site_street_name}{" "}
                      {item.site_zip_code}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Parcel Number: {item.parcel_number}
                    </p>
                    <p className="text-sm text-gray-500">
                      Owner: {item.owner_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Owner Address: {item.owner_address2} {item.owner_city}{" "}
                      {item.owner_city}, {item.owner_state} {item.owner_zip}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}
