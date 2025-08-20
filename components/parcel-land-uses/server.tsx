import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelLandUses from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ParcelLandUses({ parcel }: { parcel: Parcel }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-expect-error need update types
    .from("test_parcel_land_uses")
    .select("id, parcel_id, land_use, effective_date, end_date")
    .eq("parcel_id", parcel.id)
    .order("effective_date", { ascending: false });

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching land use history</p>
        <p className="text-xs text-gray-600">{error?.message}</p>
      </div>
    );
  }

  //@ts-expect-error need update types
  return <ClientParcelLandUses parcel={parcel} data={data} />;
}
