import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientComponent from "./client";

export default async function ServerComponent({
  parcel_id,
}: {
  parcel_id: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("test_parcel_type_values")
    .select("type_key, value, effective_date")
    .eq("parcel_id", parcel_id)
    .order("effective_date", { ascending: false });

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcel types</p>
        <p>{error.message}</p>
      </div>
    );
  }

  //@ts-ignore
  return <ClientComponent values={data} parcel_id={parcel_id} />;
}
