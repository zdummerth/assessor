import { createClient } from "@/utils/supabase/server";
import GowerCompsClient from "./client";

export default async function ParcelCompsClient({
  parcelId,
}: {
  parcelId: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_parcel_value_features_asof", {
      p_parcel_ids: [parcelId],
      p_as_of_date: new Date().toISOString(),
      p_land_uses: undefined,
      p_neighborhoods: undefined,
    })
    .single();

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcel</p>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Parcel not found</p>
      </div>
    );
  }

  const p = data;

  return <GowerCompsClient subject={p} />;
}
