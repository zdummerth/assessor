// components/parcel-features/ParcelTable.tsx
"use client";

import React from "react";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import Address from "@/components/ui/address";

import type { ParcelValueFeatureRow } from "@/lib/client-queries";

const fmtInt = (v: any) =>
  Number.isFinite(Number(v))
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
        Number(v)
      )
    : "—";

const fmtNum = (v: any, digits = 2) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
};

const fmtMoney = (v: any) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
};

function toNeighborhoods(val: any): Array<{
  set_id?: number;
  set_name?: string;
  neighborhood_id?: number;
  neighborhood_code?: string | number;
  neighborhood_name?: string;
}> {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function NeighborhoodChips({ value }: { value: any }) {
  const items = toNeighborhoods(value);
  if (!items.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1 max-w-[520px]">
      {items.map((n, i) => (
        <span
          key={`${n.set_name ?? "set"}-${n.neighborhood_code ?? i}-${i}`}
          className="px-2 py-0.5 rounded text-[11px] leading-5 bg-gray-100"
          title={`${n.set_name ?? ""}${n.set_name ? ": " : ""}${
            n.neighborhood_name ?? ""
          } (${n.neighborhood_code ?? ""})`}
        >
          {(n.set_name ?? "").toString()}
          {n.set_name ? ": " : ""}
          {(n.neighborhood_name ?? "").toString()}
          {n.neighborhood_code != null ? ` (${n.neighborhood_code})` : ""}
        </span>
      ))}
    </div>
  );
}

function SkeletonRows({
  rows = 10,
  cols = 999,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={`sk-${i}`} className={i % 2 ? "bg-white" : "bg-gray-50/50"}>
          {Array.from({ length: cols }).map((__, j) => (
            <td key={`sk-${i}-${j}`} className="px-3 py-2">
              <div className="h-4 w-full max-w-[220px] rounded bg-gray-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function ParcelTable(props: {
  rows: ParcelValueFeatureRow[];
  isLoading?: boolean;
  onHeaderClick: (key: string) => void;
  sortDirFor: (key: string) => "asc" | "desc" | "";
  onOpenStructures: (row: ParcelValueFeatureRow) => void;
}) {
  // Display ALL fields from the function:
  const columns: Array<{
    key: keyof ParcelValueFeatureRow | "_parcel_compound" | "_address";
    label: string;
    align?: "left" | "right";
    sortable?: boolean;
    render?: (row: ParcelValueFeatureRow) => React.ReactNode;
  }> = [
    // Nice parcel rendering
    {
      key: "_parcel_compound",
      label: "Parcel",
      sortable: false,
      render: (row) => (
        <ParcelNumber
          id={row.parcel_id}
          lot={parseInt(row.lot) || 0}
          ext={row.ext}
          block={row.block}
        />
      ),
    },
    {
      key: "_address",
      label: "Address",
      sortable: false,
      render: (row) => (
        <Address
          address={`${row.house_number ?? ""} ${row.street ?? ""} ${row.postcode ?? ""}`.trim()}
        />
      ),
    },

    {
      key: "retired_at",
      label: "Retired At",
      render: (row) =>
        row.retired_at ? new Date(row.retired_at as any).toLocaleString() : "—",
    },

    // LU & geo
    { key: "land_use", label: "Land Use" },
    {
      key: "neighborhoods_at_as_of",
      label: "Neighborhoods",
      sortable: false,
      render: (row) => <NeighborhoodChips value={row.neighborhoods_at_as_of} />,
    },

    { key: "value_year", label: "Value Year", align: "right" },
    {
      key: "date_of_assessment",
      label: "Date of Assessment",
      render: (row) =>
        row.date_of_assessment
          ? new Date(row.date_of_assessment as any).toLocaleString()
          : "—",
    },
    {
      key: "current_value",
      label: "Current Value",
      align: "right",
      render: (row) => fmtMoney(row.current_value),
    },

    // Structures / physical
    {
      key: "structure_count",
      label: "Structures",
      align: "right",
      sortable: false,
      render: (row) => (
        <button
          type="button"
          className="rounded border px-2 py-0.5 text-sm hover:bg-gray-50"
          onClick={() => props.onOpenStructures(row)}
          disabled={!row.structure_count}
          title={row.structure_count ? "View structures" : "No structures"}
        >
          {fmtInt(row.structure_count)}
        </button>
      ),
    },
    { key: "total_finished_area", label: "Finished (sf)", align: "right" },
    { key: "total_unfinished_area", label: "Unfinished (sf)", align: "right" },
    { key: "avg_year_built", label: "Avg Yr Built", align: "right" },
    {
      key: "avg_condition",
      label: "Avg Condition (score)",
      align: "right",
      render: (row) =>
        row.avg_condition == null ? "—" : fmtNum(row.avg_condition, 2),
    },
    { key: "total_units", label: "Units", align: "right" },

    // Land
    { key: "land_area", label: "Land Area", align: "right" },
    {
      key: "land_to_building_area_ratio",
      label: "Land/Building",
      align: "right",
      render: (row) =>
        row.land_to_building_area_ratio == null
          ? "—"
          : fmtNum(row.land_to_building_area_ratio, 3),
    },

    // Value-derived
    {
      key: "values_per_sqft_building_total",
      label: "$/sf Total",
      align: "right",
      render: (row) =>
        row.values_per_sqft_building_total == null
          ? "—"
          : fmtNum(row.values_per_sqft_building_total, 2),
    },
    {
      key: "values_per_sqft_finished",
      label: "$/sf Finished",
      align: "right",
      render: (row) =>
        row.values_per_sqft_finished == null
          ? "—"
          : fmtNum(row.values_per_sqft_finished, 2),
    },
    {
      key: "values_per_sqft_land",
      label: "$/sf Land",
      align: "right",
      render: (row) =>
        row.values_per_sqft_land == null
          ? "—"
          : fmtNum(row.values_per_sqft_land, 2),
    },
    {
      key: "values_per_unit",
      label: "$/Unit",
      align: "right",
      render: (row) =>
        row.values_per_unit == null ? "—" : fmtNum(row.values_per_unit, 0),
    },
  ];

  return (
    <div className="">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => {
              const dir =
                c.sortable === false ? "" : props.sortDirFor(String(c.key));
              const clickable = c.sortable !== false;
              return (
                <th
                  key={String(c.key)}
                  onClick={
                    clickable
                      ? () => props.onHeaderClick(String(c.key))
                      : undefined
                  }
                  className={`px-3 py-2 font-medium select-none ${
                    clickable
                      ? "cursor-pointer"
                      : "cursor-default text-gray-700"
                  } ${c.align === "right" ? "text-right" : "text-left"}`}
                  title={clickable ? "Click to sort" : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {dir === "asc" && <span>▲</span>}
                    {dir === "desc" && <span>▼</span>}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {props.isLoading ? (
            <SkeletonRows rows={10} cols={columns.length} />
          ) : props.rows && props.rows.length > 0 ? (
            props.rows.map((row, i) => (
              <tr
                key={`${row.parcel_id}-${i}`}
                className={i % 2 ? "bg-white" : "bg-gray-50/50"}
              >
                {columns.map((c) => {
                  const right = c.align === "right";
                  let cell: React.ReactNode;
                  if (c.render) {
                    cell = c.render(row);
                  } else {
                    const v = (row as any)[c.key];
                    cell =
                      typeof v === "number"
                        ? fmtInt(v)
                        : typeof v === "string"
                          ? v
                          : v == null
                            ? "—"
                            : String(v);
                  }
                  return (
                    <td
                      key={String(c.key)}
                      className={`px-3 py-2 ${right ? "text-right" : "text-left"}`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-3 py-6 text-center text-gray-500"
                colSpan={columns.length}
              >
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
