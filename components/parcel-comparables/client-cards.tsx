"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/modal";
import ParcelNumber from "../ui/parcel-number-updated";

type CompRow = {
  subject_parcel_id: number;
  parcel_id: number;
  structure_count: number | null;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  sale_price: number | null;
  sale_date: string | null;
  sale_type: string | null;
  price_per_sqft: number | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  land_use: string | null;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
  comp_lot: string;
  comp_block: string | null;
  comp_ext: string | null;
  gower_distance: number | null;
  distance_miles: number | null;
  subject_features: any | null;
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
        const living = r.total_finished_area ?? null;
        return {
          key: `${r.parcel_id}-${r.sale_date ?? "na"}`,
          parcelId: r.parcel_id,
          block: r.comp_block,
          lot: r.comp_lot,
          ext: r.comp_ext,
          // Construct
          address:
            r.house_number && r.street
              ? `${r.house_number} ${r.street} ${r.postcode ?? ""}`.trim()
              : null,
          district: r.district,
          land_use: r.land_use,
          condition: r.avg_condition != null ? r.avg_condition.toFixed(2) : "—",
          livingArea: living != null ? fmtNum(living) : "—",
          gower: fmtGower(r.gower_distance),
          miles: fmtMiles(r.distance_miles),
          salePrice: fmtUSD(r.sale_price),
          price_per_sqft:
            r.price_per_sqft != null
              ? `$${Number(r.price_per_sqft).toFixed(0)}`
              : "—",
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
              <div className="p-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <ParcelNumber
                    id={c.parcelId}
                    block={Number(c.block) || 0}
                    lot={Number(c.lot) || 0}
                    ext={Number(c.ext) || 0}
                  />
                </div>

                <div className="text-gray-700">
                  <div className="truncate">{c.address || "—"}</div>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Land Use</span>
                    <span className="font-medium">{c.land_use}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Avg Condition</span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Price/SqFt</span>
                    <span className="font-medium">{c.price_per_sqft}</span>
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
                {/* Frozen first column */}
                <th className="p-2 sticky left-0 z-30 bg-gray-50 border-r">
                  Parcel / Area
                </th>
                <th className="p-2">Sale Date</th>
                <th className="p-2">Sale Price</th>
                <th className="p-2">Price/SqFt</th>
                <th className="p-2">Gower</th>
                <th className="p-2">Miles</th>
                <th className="p-2">Avg Yr Built</th>
                <th className="p-2">Land Use</th>
                <th className="p-2">District</th>
                <th className="p-2">Structures</th>
                <th className="p-2">Finished</th>
                <th className="p-2">Unfinished</th>
                <th className="p-2">Avg Condition</th>
                <th className="p-2">Sale Type</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.map((r) => (
                <tr
                  key={`${r.parcel_id}-${r.sale_date ?? "na"}`}
                  className="align-top"
                >
                  {/* Frozen cell */}
                  <td className="p-2 sticky left-0 z-20 bg-white border-r min-w-[240px]">
                    <div className="flex flex-col">
                      <span className="font-medium">Parcel #{r.parcel_id}</span>
                      <span className="text-xs text-gray-600 truncate">
                        {r.district ?? "—"}{" "}
                        {r.land_use ? `• ${r.land_use}` : ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-2">{fmtDate(r.sale_date)}</td>
                  <td className="p-2">{fmtUSD(r.sale_price)}</td>
                  <td className="p-2">
                    {r.price_per_sqft == null
                      ? "—"
                      : `$${Number(r.price_per_sqft).toFixed(2)}`}
                  </td>
                  <td className="p-2">{fmtGower(r.gower_distance)}</td>
                  <td className="p-2">{fmtMiles(r.distance_miles)}</td>
                  <td className="p-2">{r.avg_year_built ?? "—"}</td>
                  <td className="p-2">{r.land_use ?? "—"}</td>
                  <td className="p-2">{r.district ?? "—"}</td>
                  <td className="p-2">{fmtNum(r.structure_count)}</td>
                  <td className="p-2">{fmtNum(r.total_finished_area)}</td>
                  <td className="p-2">{fmtNum(r.total_unfinished_area)}</td>
                  <td className="p-2">
                    {r.avg_condition == null
                      ? "—"
                      : Number(r.avg_condition).toFixed(2)}
                  </td>
                  <td className="p-2">{r.sale_type ?? "—"}</td>
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
