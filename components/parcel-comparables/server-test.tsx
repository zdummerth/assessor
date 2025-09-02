// app/components/ServerCompsTable.tsx
import { createClient } from "@/utils/supabase/server";
import CompsMapClientWrapper from "../ui/maps/comps-map-client-wrapper";
import CompsCardList from "./client-cards";

type Weights = Partial<{
  year_built: number;
  lat: number;
  lon: number;
  bedrooms: number;
  rooms: number;
  full_bathrooms: number;
  half_bathrooms: number;

  floor_finished: number;
  floor_unfinished: number;
  attic_finished: number;
  attic_unfinished: number;
  basement_finished: number;
  basement_unfinished: number;
  crawl_finished: number;
  crawl_unfinished: number;
  addition_finished: number;
  addition_unfinished: number;

  garage_attached: number;
  garage_detached: number;
  garage_basement: number;
  carport: number;

  material: number;
  condition: number;
  district: number;
  land_use: number;
}>;

type CompRow = {
  comp_parcel_id: number;
  comp_block: number | null;
  comp_lot: number | null;
  comp_ext: number | null;
  sale_id: number;
  sale_date: string | null;
  sale_price: number | null;
  gower_distance: number | null;
  comp_distance_miles: number | null;

  comp_lat: number | null;
  comp_lon: number | null;
  comp_district: string | null;
  comp_city: string | null;
  comp_state: string | null;
  comp_postcode: string | null;
  comp_house_number: string | null;
  comp_street: string | null;

  comp_land_use: string | null;
  comp_year_built: number | null;
  comp_material: string | null;
  comp_bedrooms: number | null;
  comp_rooms: number | null;
  comp_full_bathrooms: number | null;
  comp_half_bathrooms: number | null;
  comp_condition_at_sale: string | null;

  floor_finished_total: number | null;
  floor_unfinished_total: number | null;
  attic_finished_total: number | null;
  attic_unfinished_total: number | null;
  basement_finished_total: number | null;
  basement_unfinished_total: number | null;
  crawl_finished_total: number | null;
  crawl_unfinished_total: number | null;
  addition_finished_total: number | null;
  addition_unfinished_total: number | null;

  attached_garage_area: number | null;
  detached_garage_area: number | null;
  basement_garage_area: number | null;
  carport_area: number | null;
};

function fmtUSD(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat().format(n);
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

export default async function ServerCompsTable({
  parcelId,
  k = 4,
  years = 2,
  weights,
  className = "",
  title = "Comparable Sales",
  max_distance_miles = 1,
  living_area_band = 500,
}: {
  parcelId: number;
  k?: number;
  years?: number;
  weights?: Weights;
  className?: string;
  title?: string;
  max_distance_miles?: number;
  living_area_band?: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    //@ts-expect-error ts
    "find_comps_gower_with_garages_test_2",
    {
      p_parcel_id: parcelId,
      p_k: k,
      p_years: years,
      p_weights: (weights ?? {}) as any,
      p_max_distance_miles: max_distance_miles,
      p_living_area_band: living_area_band,
    }
  );

  if (error) {
    console.error("Comps RPC error:", error);
    return (
      <div className={`rounded border p-3 text-sm text-red-700 ${className}`}>
        Failed to load comparable sales: {error.message}
      </div>
    );
  }

  const rows = (data ?? []) as CompRow[];

  const { data: subj, error: subjErr } = await supabase
    //@ts-expect-error ts
    .from("test_parcel_addresses")
    .select(
      `
      parcel_id,
      geocoded:test_geocoded_addresses(lat,lon,housenumber,street,city,state,postcode),
      parcel:test_parcels(block,lot,ext)
    `
    )
    .eq("parcel_id", parcelId)
    .single();

  if (subjErr) {
    console.warn("Subject fetch warning:", subjErr.message);
  }

  // 3) Transform to map points (server-side)
  const subjectPoint =
    //@ts-expect-error ts
    subj?.geocoded?.lat != null && subj?.geocoded?.lon != null
      ? {
          //@ts-expect-error ts
          lat: Number(subj.geocoded.lat),
          //@ts-expect-error ts
          long: Number(subj.geocoded.lon),
          parcel_number: parcelId,
          address: [
            //@ts-expect-error ts
            subj.geocoded.housenumber,
            //@ts-expect-error ts
            subj.geocoded.street,
            //@ts-expect-error ts
            subj.geocoded.city,
            //@ts-expect-error ts
            subj.geocoded.state,
            //@ts-expect-error ts
            subj.geocoded.postcode,
          ]
            .filter(Boolean)
            .join(", "),
          kind: "subject" as const,
        }
      : null;

  const compPoints = rows
    .filter((r) => r.comp_lat != null && r.comp_lon != null)
    .map((r) => ({
      lat: Number(r.comp_lat),
      long: Number(r.comp_lon),
      parcel_number: r.comp_parcel_id,
      address: [
        r.comp_house_number,
        r.comp_street,
        r.comp_city,
        r.comp_state,
        r.comp_postcode,
      ]
        .filter(Boolean)
        .join(", "),
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
        className="w-full mb-24"
        height={"80vh"}
        key={JSON.stringify(compPoints)}
      />
    </div>
  );
}
