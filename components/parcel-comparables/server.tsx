import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ComparablesTable from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelComparables({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_comparables")
    .select("*, subject_parcel(*)")
    .eq("subject_parcel", parcel.id)
    .order("gower_dist", { ascending: true });

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

  console.log("Parcel comparables data:", data);

  return <ComparablesTable values={data} />;
}
