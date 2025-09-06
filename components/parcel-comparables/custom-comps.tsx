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
  if (n == null) return "text-gray-500";
  if (n > 0) return "text-emerald-700";
  if (n < 0) return "text-rose-700";
  return "text-gray-700";
}

function ValueDiffCell({
  value,
  valueFmt = (x: number | null | undefined) =>
    (x ?? null) !== null ? String(x) : "—",
  diff,
  diffFmt = (x: number | null | undefined) =>
    (x ?? null) !== null ? String(x) : "—",
}: {
  value: number | string | null | undefined;
  valueFmt?: (x: any) => string;
  diff: number | null | undefined;
  diffFmt?: (x: number | null | undefined) => string;
}) {
  return (
    <div className="flex flex-col items-end">
      <div className="font-medium text-gray-900">{valueFmt(value)}</div>
      <div className={`text-[11px] ${diffClass(diff)}`}>{diffFmt(diff)}</div>
    </div>
  );
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
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="border-b px-3 py-2 text-left font-medium">
                  Sale
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Price
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Date
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Dist (mi)
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Land Use
                </th>

                {/* Feature columns */}
                <th className="border-b px-3 py-2 text-right font-medium">
                  Struct Cnt
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Finished (sf)
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Unfinished (sf)
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Avg Yr Built
                </th>
                <th className="border-b px-3 py-2 text-right font-medium">
                  Avg Cond
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={`${r.comp_sale_id}-${r.comp_parcel_id}`}
                  className="odd:bg-white even:bg-gray-50"
                >
                  {/* Sale */}
                  <td className="border-t px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        #{r.comp_sale_id}
                      </span>
                      {r.comp_sale_type && <Badge>{r.comp_sale_type}</Badge>}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <div className="font-semibold text-gray-900">
                      {r.comp_sale_price != null
                        ? `$${r.comp_sale_price.toLocaleString()}`
                        : "—"}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <div className="text-gray-900">
                      {r.comp_sale_date ?? "—"}
                    </div>
                  </td>

                  {/* Distance */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <div className="font-medium text-gray-900">
                      {r.distance_miles != null
                        ? r.distance_miles.toFixed(2)
                        : "—"}
                    </div>
                  </td>

                  {/* Land Use (value + small same/diff) */}
                  <td className="border-t px-3 py-2 align-top">
                    <div className="flex flex-col items-end">
                      <div className="font-medium text-gray-900">
                        {r.comp_land_use ?? "—"}
                      </div>
                      <div className="text-[11px]">
                        {r.same_land_use == null ? (
                          <span className="text-gray-500">—</span>
                        ) : r.same_land_use ? (
                          <span className="text-emerald-700">same</span>
                        ) : (
                          <span className="text-rose-700">
                            {r.subject_land_use ?? "—"}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Structure Count */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <ValueDiffCell
                      value={r.comp_structure_count}
                      valueFmt={(v) => fmtInt(v)}
                      diff={r.diff_structure_count}
                      diffFmt={(d) => fmtInt(d)}
                    />
                  </td>

                  {/* Finished Area */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <ValueDiffCell
                      value={r.comp_total_finished_area}
                      valueFmt={(v) => fmtInt(v, " sf")}
                      diff={r.diff_total_finished_area}
                      diffFmt={(d) => fmtInt(d, " sf")}
                    />
                  </td>

                  {/* Unfinished Area */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <ValueDiffCell
                      value={r.comp_total_unfinished_area}
                      valueFmt={(v) => fmtInt(v, " sf")}
                      diff={r.diff_total_unfinished_area}
                      diffFmt={(d) => fmtInt(d, " sf")}
                    />
                  </td>

                  {/* Avg Year Built */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <ValueDiffCell
                      value={r.comp_avg_year_built}
                      valueFmt={(v) => fmtInt(v)}
                      diff={r.diff_avg_year_built}
                      diffFmt={(d) => fmtInt(d)}
                    />
                  </td>

                  {/* Avg Condition */}
                  <td className="border-t px-3 py-2 align-top text-right">
                    <ValueDiffCell
                      value={r.comp_avg_condition}
                      valueFmt={(v) => fmtNum(v, 2)}
                      diff={r.diff_avg_condition}
                      diffFmt={(d) => fmtNum(d, 2)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
