// app/components/ServerCompsTable.tsx
import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "../ui/parcel-number-updated";
import CompsMapClientWrapper from "../ui/maps/comps-map-client-wrapper";

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
  k = 5,
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
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="text-xs text-gray-500">
          {rows.length ? `${rows.length} results` : "No results"}
        </div>
      </div>

      {!rows.length ? (
        <div className="rounded border p-3 text-sm text-gray-600">
          No comparable sales found.
        </div>
      ) : (
        <>
          <div className="overflow-auto rounded border">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="text-left">
                  <th className="p-2">Parcel</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Sale Date</th>
                  <th className="p-2">Sale Price</th>
                  <th className="p-2">Gower</th>
                  <th className="p-2">Miles</th>
                  <th className="p-2">Year Built</th>
                  <th className="p-2">Material</th>
                  <th className="p-2">Land Use</th>
                  <th className="p-2">Condition @Sale</th>

                  <th className="p-2">District</th>
                  <th className="p-2">ZIP</th>

                  <th className="p-2">Beds</th>
                  <th className="p-2">Rooms</th>
                  <th className="p-2">Full Ba</th>
                  <th className="p-2">Half Ba</th>

                  <th className="p-2">Floor Fin</th>
                  <th className="p-2">Floor Unfin</th>
                  <th className="p-2">Attic Fin</th>
                  <th className="p-2">Attic Unfin</th>
                  <th className="p-2">Bsmt Fin</th>
                  <th className="p-2">Bsmt Unfin</th>
                  <th className="p-2">Crawl Fin</th>
                  <th className="p-2">Crawl Unfin</th>
                  <th className="p-2">Add Fin</th>
                  <th className="p-2">Add Unfin</th>

                  <th className="p-2">Gar Att</th>
                  <th className="p-2">Gar Det</th>
                  <th className="p-2">Gar Bsmt</th>
                  <th className="p-2">Carport</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr
                    key={`${r.comp_parcel_id}-${r.sale_id}`}
                    className="align-top"
                  >
                    <td className="p-2 font-medium">
                      <ParcelNumber
                        id={r.comp_parcel_id}
                        block={r.comp_block ?? 0}
                        lot={r.comp_lot ?? 0}
                        ext={r.comp_ext ?? 0}
                      />
                    </td>
                    <td className="p-2">
                      <div>
                        <span>
                          {r.comp_house_number} {r.comp_street}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">{fmtDate(r.sale_date)}</td>
                    <td className="p-2">{fmtUSD(r.sale_price)}</td>
                    <td className="p-2">
                      {r.gower_distance?.toFixed(3) ?? "—"}
                    </td>
                    <td className="p-2">
                      {r.comp_distance_miles?.toFixed(2) ?? "—"}
                    </td>

                    <td className="p-2">{r.comp_year_built ?? "—"}</td>
                    <td className="p-2">{r.comp_material ?? "—"}</td>
                    <td className="p-2">{r.comp_land_use ?? "—"}</td>
                    <td className="p-2">{r.comp_condition_at_sale ?? "—"}</td>

                    <td className="p-2">{r.comp_district ?? "—"}</td>
                    <td className="p-2">{r.comp_postcode ?? "—"}</td>

                    <td className="p-2">{r.comp_bedrooms ?? "—"}</td>
                    <td className="p-2">{r.comp_rooms ?? "—"}</td>
                    <td className="p-2">{r.comp_full_bathrooms ?? "—"}</td>
                    <td className="p-2">{r.comp_half_bathrooms ?? "—"}</td>

                    <td className="p-2">{fmtNum(r.floor_finished_total)}</td>
                    <td className="p-2">{fmtNum(r.floor_unfinished_total)}</td>
                    <td className="p-2">{fmtNum(r.attic_finished_total)}</td>
                    <td className="p-2">{fmtNum(r.attic_unfinished_total)}</td>
                    <td className="p-2">{fmtNum(r.basement_finished_total)}</td>
                    <td className="p-2">
                      {fmtNum(r.basement_unfinished_total)}
                    </td>
                    <td className="p-2">{fmtNum(r.crawl_finished_total)}</td>
                    <td className="p-2">{fmtNum(r.crawl_unfinished_total)}</td>
                    <td className="p-2">{fmtNum(r.addition_finished_total)}</td>
                    <td className="p-2">
                      {fmtNum(r.addition_unfinished_total)}
                    </td>

                    <td className="p-2">{fmtNum(r.attached_garage_area)}</td>
                    <td className="p-2">{fmtNum(r.detached_garage_area)}</td>
                    <td className="p-2">{fmtNum(r.basement_garage_area)}</td>
                    <td className="p-2">{fmtNum(r.carport_area)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CompsMapClientWrapper
            points={points}
            className="w-full h-64"
            key={JSON.stringify(compPoints)}
          />
        </>
      )}
    </div>
  );
}
