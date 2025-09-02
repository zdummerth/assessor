"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/modal";
import ParcelNumber from "../ui/parcel-number-updated";

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
function fmtMiles(n?: number | null) {
  if (n == null) return "—";
  return Number(n).toFixed(2);
}
function fmtGower(n?: number | null) {
  if (n == null) return "—";
  return Number(n).toFixed(3);
}

function totalLivingArea(r: CompRow): number | null {
  // Sum of finished areas only
  const vals = [
    r.floor_finished_total,
    r.attic_finished_total,
    r.basement_finished_total,
    r.crawl_finished_total,
    r.addition_finished_total,
  ].filter((v): v is number => v != null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
}

export default function CompsCardList({
  rows,
  title = "Comparable Sales",
  className = "",
}: {
  rows: CompRow[];
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const cards = useMemo(
    () =>
      (rows ?? []).map((r) => {
        const living = totalLivingArea(r);
        return {
          key: `${r.comp_parcel_id}-${r.sale_id}`,
          parcelId: r.comp_parcel_id,
          block: r.comp_block ?? 0,
          lot: r.comp_lot ?? 0,
          ext: r.comp_ext ?? 0,
          address: `${r.comp_house_number} ${r.comp_street} ${r.comp_postcode}`,
          condition: r.comp_condition_at_sale ?? "—",
          livingArea: living != null ? fmtNum(living) : "—",
          gower: fmtGower(r.gower_distance),
          miles: fmtMiles(r.comp_distance_miles),
          salePrice: fmtUSD(r.sale_price),
          saleDate: fmtDate(r.sale_date),
          raw: r,
        };
      }),
    [rows]
  );

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {rows?.length ? `${rows.length} results` : "No results"}
          </span>
          {!!rows?.length && (
            <button
              onClick={() => setOpen(true)}
              className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
            >
              View full table
            </button>
          )}
        </div>
      </div>

      {!rows?.length ? (
        <div className="rounded border p-3 text-sm text-gray-600">
          No comparable sales found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.key}
              className="rounded border overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              {/* Placeholder image */}
              <div className="aspect-[4/3] w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                Image placeholder
              </div>

              {/* Content */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <ParcelNumber
                    id={c.parcelId}
                    block={c.block}
                    lot={c.lot}
                    ext={c.ext}
                  />
                </div>

                <div className="text-sm text-gray-700">
                  <div className="truncate">{c.address || "—"}</div>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Condition</span>
                    <span className="font-medium">{c.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Living Area</span>
                    <span className="font-medium">{c.livingArea}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Gower</span>
                    <span className="font-medium">{c.gower}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Miles</span>
                    <span className="font-medium">{c.miles}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t">
                  <span>{c.saleDate}</span>
                  <span className="font-medium">{c.salePrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Full table view */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Comparable Sales (Full Table)"
      >
        <div className="overflow-auto rounded border">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-20">
              <tr className="text-left">
                {/* FROZEN FIRST COLUMN */}
                <th className="p-2 sticky left-0 z-30 bg-gray-50 border-r">
                  Parcel / Address
                </th>

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
                  {/* FROZEN FIRST CELL */}
                  <td className="p-2 sticky left-0 z-20 bg-white border-r min-w-[240px]">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        <ParcelNumber
                          id={r.comp_parcel_id}
                          block={r.comp_block ?? 0}
                          lot={r.comp_lot ?? 0}
                          ext={r.comp_ext ?? 0}
                        />
                      </span>
                      <span className="text-xs text-gray-600 truncate">
                        {r.comp_house_number} {r.comp_street}{" "}
                        {r.comp_postcode ? r.comp_postcode : ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-2">{fmtDate(r.sale_date)}</td>
                  <td className="p-2">{fmtUSD(r.sale_price)}</td>
                  <td className="p-2">{fmtGower(r.gower_distance)}</td>
                  <td className="p-2">{fmtMiles(r.comp_distance_miles)}</td>

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
                  <td className="p-2">{fmtNum(r.basement_unfinished_total)}</td>
                  <td className="p-2">{fmtNum(r.crawl_finished_total)}</td>
                  <td className="p-2">{fmtNum(r.crawl_unfinished_total)}</td>
                  <td className="p-2">{fmtNum(r.addition_finished_total)}</td>
                  <td className="p-2">{fmtNum(r.addition_unfinished_total)}</td>

                  <td className="p-2">{fmtNum(r.attached_garage_area)}</td>
                  <td className="p-2">{fmtNum(r.detached_garage_area)}</td>
                  <td className="p-2">{fmtNum(r.basement_garage_area)}</td>
                  <td className="p-2">{fmtNum(r.carport_area)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            className="px-4 py-2 rounded border"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
