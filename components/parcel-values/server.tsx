import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelValues from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelValues({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcel_values")
    .select("*")
    .eq("parcel_id", parcel.id)
    .order("tax_year", { ascending: false });

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcel values</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  return <ClientParcelValues values={data} parcel={parcel} />;
}
