import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "../ui/parcel-number-updated";
import GowerCompsClient from "./client";

export type ParcelFeaturesRow = {
  parcel_id: number;
  block: number;
  lot: string;
  ext: number;

  // Values (present but not all displayed here)
  value_row_id: number | null;
  value_year: number | null;
  date_of_assessment: string | null;
  current_value: number | null;

  // Structure / physical
  structure_count: number;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  total_units: number | null;

  // Land + per metrics (present but not all displayed here)
  land_area: number | null;
  land_to_building_area_ratio: number | null;
  values_per_sqft_building_total: number | null;
  values_per_sqft_finished: number | null;
  values_per_sqft_land: number | null;
  values_per_unit: number | null;

  // LU & geo
  land_use: string | null; // <- new function returns text
  lat: number | null;
  lon: number | null;
  district: string | null;
  neighborhoods_at_as_of: any; // jsonb
  house_number: string | null;
  street: string | null;
  postcode: string | null;
};

export default async function ParcelCompsClient({
  parcelId,
}: {
  parcelId: number;
}) {
  const supabase = await createClient();

  // Call the new RPC; rely on function defaults for p_as_of_date / other filters.
  const { data, error } = await supabase
    // @ts-expect-error rpc name typing varies by codegen
    .rpc("get_parcel_value_features_asof", {
      p_parcel_ids: [parcelId], // filter to this parcel
      p_as_of_date: new Date(),
      p_land_uses: null, // no LU filter
      p_neighborhoods: null, // no neighborhood filter
    })
    .single<ParcelFeaturesRow>();

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

  return (
    <div>
      <GowerCompsClient subject={p} />
    </div>
  );
}
