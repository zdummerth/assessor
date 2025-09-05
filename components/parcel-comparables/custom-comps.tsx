"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useCompare } from "@/lib/client-queries";
import { useMemo } from "react";

type CompareRow = {
  subject_parcel_id: number;
  comp_sale_id: number;
  comp_sale_date: string | null;
  comp_sale_price: number | null;
  comp_sale_type: string | null;

  subject_block: number;
  subject_lot: string;
  subject_ext: number;

  comp_parcel_id: number;
  comp_block: number;
  comp_lot: string;
  comp_ext: number;

  subject_lat: number | null;
  subject_lon: number | null;
  comp_lat: number | null;
  comp_lon: number | null;
  distance_miles: number | null;

  // RAW features (subject & comp)
  subject_structure_count: number | null;
  comp_structure_count: number | null;
  subject_total_finished_area: number | null;
  comp_total_finished_area: number | null;
  subject_total_unfinished_area: number | null;
  comp_total_unfinished_area: number | null;
  subject_avg_year_built: number | null;
  comp_avg_year_built: number | null;
  subject_avg_condition: number | null;
  comp_avg_condition: number | null;

  // Diffs (subject - comp)
  diff_structure_count: number | null;
  diff_total_finished_area: number | null;
  diff_total_unfinished_area: number | null;
  diff_avg_year_built: number | null;
  diff_avg_condition: number | null;

  // categorical
  same_land_use: boolean | null;
  subject_land_use: string | null;
  comp_land_use: string | null;
};

function Badge({
  children,
  intent = "default",
}: {
  children: React.ReactNode;
  intent?: "default" | "success" | "warning";
}) {
  const color =
    intent === "success"
      ? "bg-green-100 text-green-800"
      : intent === "warning"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${color}`}
    >
      {children}
    </span>
  );
}

function fmtInt(n: number | null | undefined, unit?: string) {
  if (n == null) return "—";
  return `${n.toLocaleString()}${unit ?? ""}`;
}

function fmtNum(n: number | null | undefined, digits = 2, unit?: string) {
  if (n == null) return "—";
  return `${n.toFixed(digits)}${unit ?? ""}`;
}

function diffClass(n: number | null | undefined) {
  if (n == null) return "text-gray-600";
  if (n > 0) return "text-emerald-700";
  if (n < 0) return "text-rose-700";
  return "text-gray-800";
}

export default function ParcelCompareViewer() {
  const params = useParams();
  const searchParams = useSearchParams();

  const parcelId = params?.id ? Number(params.id) : null;

  const saleIdsParam = searchParams.get("saleIds");
  const compSaleIds = saleIdsParam
    ? saleIdsParam
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((n) => Number.isFinite(n))
    : null;

  const { data, isLoading, error } = useCompare(parcelId, compSaleIds);

  const rows = useMemo<CompareRow[]>(
    () => (Array.isArray(data) ? (data as CompareRow[]) : []),
    [data]
  );

  if (!parcelId || !compSaleIds) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No parcel or sale IDs provided.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">Loading comparisons…</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">Error loading comparisons.</div>
    );
  }

  if (!rows.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No comparison results found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <div
            key={`${r.comp_sale_id}-${r.comp_parcel_id}`}
            className="rounded-lg border bg-white p-4 shadow-sm space-y-3"
          >
            {/* Header / Sale summary */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-gray-500">Comp Sale</div>
                <div className="text-base font-semibold">#{r.comp_sale_id}</div>
                <div className="text-sm text-gray-700">
                  {r.comp_sale_date ?? "—"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-base font-semibold">
                  {r.comp_sale_price != null
                    ? `$${r.comp_sale_price.toLocaleString()}`
                    : "—"}
                </div>
                {r.comp_sale_type && (
                  <div className="mt-1">
                    <Badge>{r.comp_sale_type}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Distance & land use */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge intent="default">
                {r.distance_miles != null
                  ? `${r.distance_miles.toFixed(2)} mi`
                  : "— mi"}
              </Badge>
              <Badge intent={r.same_land_use ? "success" : "warning"}>
                {r.same_land_use ? "Same land use" : "Different land use"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-md border p-2">
              <div className="text-xs text-gray-500">Subject LU</div>
              <div className="text-right text-sm font-medium">
                {r.subject_land_use ?? "—"}
              </div>
              <div className="text-xs text-gray-500">Comp LU</div>
              <div className="text-right text-sm font-medium">
                {r.comp_land_use ?? "—"}
              </div>
            </div>

            {/* Differences (Subject vs Comp vs Diff) */}
            <div className="rounded-md border p-3">
              <div className="mb-2 text-sm font-medium text-gray-800">
                Differences
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-gray-500">
                    <th className="border-b text-left font-medium py-1">
                      Feature
                    </th>

                    <th className="border-b text-right font-medium py-1">
                      Comp
                    </th>
                    <th className="border-b text-right font-medium py-1">
                      Diff
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">Finished Area</td>

                    <td className="text-right">
                      {fmtInt(r.comp_total_finished_area, " sf")}
                    </td>
                    <td
                      className={`text-right font-medium ${diffClass(r.diff_total_finished_area)}`}
                    >
                      {fmtInt(r.diff_total_finished_area, " sf")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Unfinished Area</td>

                    <td className="text-right">
                      {fmtInt(r.comp_total_unfinished_area, " sf")}
                    </td>
                    <td
                      className={`text-right font-medium ${diffClass(r.diff_total_unfinished_area)}`}
                    >
                      {fmtInt(r.diff_total_unfinished_area, " sf")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Structure Count</td>

                    <td className="text-right">
                      {fmtInt(r.comp_structure_count)}
                    </td>
                    <td
                      className={`text-right font-medium ${diffClass(r.diff_structure_count)}`}
                    >
                      {fmtInt(r.diff_structure_count)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Avg Year Built</td>

                    <td className="text-right">
                      {fmtInt(r.comp_avg_year_built)}
                    </td>
                    <td
                      className={`text-right font-medium ${diffClass(r.diff_avg_year_built)}`}
                    >
                      {fmtInt(r.diff_avg_year_built)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Avg Condition</td>

                    <td className="text-right">
                      {fmtNum(r.comp_avg_condition, 2)}
                    </td>
                    <td
                      className={`text-right font-medium ${diffClass(r.diff_avg_condition)}`}
                    >
                      {fmtNum(r.diff_avg_condition, 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
