import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelStructures from "./client-cards";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelStructures({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("test_structures")
    .select(
      `
      *,
      test_structure_sections(*),
      test_conditions(*)
    `
    )
    .eq("id", parcel.id);

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching structure data</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  //@ts-expect-error ts
  return <ClientParcelStructures data={data} parcel={parcel} />;
}
