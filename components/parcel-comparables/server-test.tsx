// app/components/ServerCompsTable.tsx
import { createClient } from "@/utils/supabase/server";
import CompsMapClientWrapper from "../ui/maps/comps-map-client-wrapper";
import CompsCardList from "./client-cards";

type Weights = Partial<{
  structure_count: number;
  finished: number;
  unfinished: number;
  lat: number;
  lon: number;
  year_built: number;
  condition: number;
  land_use: number;
  district: number;
}>;

export default async function ServerCompsTable({
  parcelId,
  k = 4,
  years = 2,
  weights,
  className = "",
  max_distance_miles = 1,
  living_area_band = 500,
  require_same_land_use = true,
}: {
  parcelId: number;
  k?: number;
  years?: number;
  weights?: Weights;
  className?: string;
  max_distance_miles?: number;
  living_area_band?: number;
  require_same_land_use?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("find_comps", {
    p_parcel_ids: [parcelId], // << updated
    p_k: k,
    p_years: years,
    p_weights: (weights ?? {}) as any,
    p_max_distance_miles: max_distance_miles,
    p_living_area_band: living_area_band,
    p_require_same_land_use: require_same_land_use,
  });

  if (error) {
    console.error("Comps RPC error:", error);
    return (
      <div className={`rounded border p-3 text-sm text-red-700 ${className}`}>
        Failed to load comparable sales: {error.message}
      </div>
    );
  }

  const rows = data ?? [];

  // Build subject point from subject_features in the first row (if present)
  const subjFromRows = rows.find((r) => r.subject_parcel_id === parcelId);
  const subjectPoint =
    subjFromRows?.lat != null && subjFromRows?.lon != null
      ? {
          lat: subjFromRows.lat,
          long: subjFromRows.lon,
          parcel_number: parcelId,
          address: [subjFromRows.district, subjFromRows.land_use]
            .filter(Boolean)
            .join(" • "),
          kind: "subject" as const,
        }
      : null;

  const compPoints = rows
    .filter((r) => r.lat != null && r.lon != null)
    .map((r) => ({
      lat: Number(r.lat),
      long: Number(r.lon),
      parcel_number: r.parcel_id,
      address: [r.district, r.land_use].filter(Boolean).join(" • "),
      sale_price: r.sale_price ?? undefined,
      gower_distance: r.gower_distance ?? undefined,
      kind: "comp" as const,
    }));

  const points = subjectPoint ? [subjectPoint, ...compPoints] : compPoints;

  return (
    <div className={className}>
      <CompsCardList rows={rows} className="my-4" />
      <CompsMapClientWrapper
        points={points}
        className="w-full mb-24 relative"
        height={"400px"}
        key={JSON.stringify(compPoints)}
      />
    </div>
  );
}
