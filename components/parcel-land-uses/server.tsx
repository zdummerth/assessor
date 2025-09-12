import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelLandUses from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ParcelLandUses({ parcel }: { parcel: Parcel }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    // @ts-expect-error need update types
    .from("test_parcel_land_uses")
    .select("id, parcel_id, land_use, effective_date, end_date")
    .eq("parcel_id", parcel.id)
    .order("effective_date", { ascending: false });

  if (error || !data) {
    console.error(error);
    return (
      <section className="rounded-lg border bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-800">Land Use</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <SearchX className="w-4 h-4" />
          <span>Error fetching land use history</span>
        </div>
        {error?.message && (
          <div className="mt-1 text-xs text-red-700">{error.message}</div>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-800">Land Use</h3>
      {/* @ts-expect-error need update types */}
      <ClientParcelLandUses parcel={parcel} data={data} />
    </section>
  );
}
