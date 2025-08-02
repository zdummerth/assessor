import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelAddress from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelAddress({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("test_parcel_addresses")
    .select("*, test_geocoded_addresses(*)")
    .eq("parcel_id", parcel.id);

  if (error || !data || data.length === 0) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching address</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  const address = data[0].test_geocoded_addresses;

  return <ClientParcelAddress address={address} />;
}
