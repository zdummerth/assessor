// app/(whatever)/ParcelFeaturesBrowser.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  useParcelValueFeatures,
  type ParcelValueFeatureRow,
  useLandUseOptions,
  useNeighborhoods,
} from "@/lib/client-queries";
import MultiSelectAutocomplete from "@/components/inputs/multi-select-autocomplete";
import MultiSelect from "@/components/inputs/multi-select";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import { Database } from "@/database-types";

type Neighborhood = Database["public"]["Tables"]["neighborhoods"]["Row"];

const NUM = (n: number | string | null | undefined) =>
  Number.isFinite(Number(n)) ? Number(n) : undefined;

const fmtInt = (v: any) =>
  Number.isFinite(Number(v))
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
        Number(v)
      )
    : "—";

type Col = {
  key: keyof ParcelValueFeatureRow;
  label: string;
  align?: "left" | "right";
  render?: (row: ParcelValueFeatureRow) => React.ReactNode;
  sortable?: boolean; // default true
};

// Helpers to safely read neighborhoods JSON
type NeighborhoodItem = {
  set_name?: string;
  neighborhood_code?: string | number;
  neighborhood_name?: string;
};
function toNeighborhoods(val: any): NeighborhoodItem[] {
  if (Array.isArray(val)) return val as NeighborhoodItem[];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed as NeighborhoodItem[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

const COLUMNS: Col[] = [
  {
    key: "parcel_id",
    label: "Parcel",
    render: (row) => (
      <ParcelNumber
        id={row.parcel_id}
        lot={parseInt(row.lot) || 0}
        ext={row.ext}
        block={row.block}
      />
    ),
  },
  { key: "house_number", label: "No." },
  { key: "street", label: "Street" },
  { key: "land_use", label: "Land Use" },
  {
    key: "neighborhoods_at_as_of",
    label: "Neighborhoods",
    sortable: false,
    render: (row) => {
      const items = toNeighborhoods(row.neighborhoods_at_as_of);
      if (!items.length) return <span className="text-gray-400">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {items.map((n, i) => (
            <span
              key={`${n.set_name ?? "set"}-${n.neighborhood_code ?? i}-${i}`}
              className="px-2 py-0.5 rounded text-[11px] leading-5"
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
    },
  },
  { key: "total_finished_area", label: "Finished (sf)", align: "right" },
  { key: "avg_year_built", label: "Avg Yr Built", align: "right" },
  { key: "structure_count", label: "Structures", align: "right" },
  { key: "current_value", label: "Current Value", align: "right" },
  { key: "value_year", label: "Value Year", align: "right" },
  { key: "values_per_sqft_finished", label: "$/sf Finished", align: "right" },
  {
    key: "values_per_sqft_building_total",
    label: "$/sf Total",
    align: "right",
  },
];

export default function ParcelFeaturesBrowser() {
  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  const {
    options: neighborhoodOptions,
    isLoading: nbLoading,
    error: nbError,
  } = useNeighborhoods();

  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    []
  );
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>([]);

  // --- basic params ---
  const [asOfDate, setAsOfDate] = useState<string>("");

  // --- filters ---
  const [ilikeStreet, setIlikeStreet] = useState<string>("");
  const [tfaMin, setTfaMin] = useState<string>("");
  const [tfaMax, setTfaMax] = useState<string>("");
  const [cvMin, setCvMin] = useState<string>("");
  const [cvMax, setCvMax] = useState<string>("");

  // --- pagination + sorting ---
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sort, setSort] = useState<string>(""); // header toggles manage this

  const resetToFirst = () => setPage(1);

  // Build options for hook
  const hookOpts = useMemo(() => {
    const land_uses = selectedLandUses;
    const neighborhoods = selectedNeighborhoods;

    const filters: any = {};
    if (ilikeStreet)
      filters.ilike = {
        ...(filters.ilike || {}),
        street: `%${ilikeStreet}%`,
      };

    const gte: Record<string, number> = {};
    const lte: Record<string, number> = {};

    if (NUM(tfaMin) !== undefined && tfaMin !== "")
      gte.total_finished_area = NUM(tfaMin)!;
    if (NUM(tfaMax) !== undefined && tfaMax !== "")
      lte.total_finished_area = NUM(tfaMax)!;

    if (NUM(cvMin) !== undefined && cvMin !== "")
      gte.current_value = NUM(cvMin)!;
    if (NUM(cvMax) !== undefined && cvMax !== "")
      lte.current_value = NUM(cvMax)!;

    if (Object.keys(gte).length) filters.gte = gte;
    if (Object.keys(lte).length) filters.lte = lte;

    return {
      as_of_date: asOfDate || undefined,
      land_uses: land_uses.length ? land_uses : undefined,
      neighborhoods: neighborhoods.length ? neighborhoods : undefined,
      page,
      page_size: pageSize,
      sort: sort || undefined,
      filters,
    };
  }, [
    asOfDate,
    selectedLandUses,
    selectedNeighborhoods,
    page,
    pageSize,
    sort,
    ilikeStreet,
    tfaMin,
    tfaMax,
    cvMin,
    cvMax,
  ]);

  const { data, meta, isLoading, error } = useParcelValueFeatures(hookOpts);

  // Sorting
  const toggleSort = (col: string) => {
    const parts = sort
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const top = parts[0] ?? "";
    const bare = top.replace(/^-/, "");
    let next = "";
    if (bare !== col) next = col;
    else if (!top.startsWith("-")) next = `-${col}`;
    else next = "";
    setSort(next);
    setPage(1);
  };

  const sortDirFor = (col: string): "asc" | "desc" | "" => {
    const top = sort.split(",").map((s) => s.trim())[0] || "";
    if (!top) return "";
    const bare = top.replace(/^-/, "");
    if (bare !== col) return "";
    return top.startsWith("-") ? "desc" : "asc";
  };

  // Skeleton row renderer
  const SkeletonRows = ({ rows = 8 }: { rows?: number }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={`sk-${i}`} className={i % 2 ? "bg-white" : "bg-gray-50/50"}>
          {COLUMNS.map((c, j) => (
            <td key={`sk-${i}-${j}`} className="px-3 py-2">
              <div className="h-4 w-full max-w-[220px] rounded bg-gray-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6">
      {/* Sidebar */}
      <aside className="mb-4 lg:mb-0">
        <div className="rounded-lg border bg-white p-4 lg:sticky lg:top-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">As-of date</label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => {
                  setAsOfDate(e.target.value);
                  resetToFirst();
                }}
                className="w-full rounded border px-2 py-1 text-sm"
              />
            </div>

            <div className="space-y-1">
              <MultiSelectAutocomplete
                options={landUseOptions}
                value={selectedLandUses}
                onChange={(vals) => {
                  setSelectedLandUses(vals);
                  resetToFirst();
                }}
                label="Land Uses"
                className="w-full"
                placeholder={
                  luError
                    ? "Failed to load"
                    : luLoading
                      ? "Loading…"
                      : "Search land uses…"
                }
              />
            </div>

            <div className="space-y-1">
              <MultiSelect
                options={neighborhoodOptions.map((n) => ({
                  //@ts-expect-error d
                  value: n.id,
                  //@ts-expect-error
                  label: `${n.name ?? ""} (${n.neighborhood || "No Set"})`,
                }))}
                value={selectedNeighborhoods}
                onChange={(vals) => {
                  setSelectedNeighborhoods(vals);
                  resetToFirst();
                }}
                label="Neighborhoods"
                className="w-full"
                placeholder={
                  nbError
                    ? "Failed to load"
                    : nbLoading
                      ? "Loading…"
                      : "Select neighborhoods…"
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Street contains</label>
              <input
                value={ilikeStreet}
                onChange={(e) => {
                  setIlikeStreet(e.target.value);
                  resetToFirst();
                }}
                placeholder="KING"
                className="w-full rounded border px-2 py-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Finished sf ≥</label>
                <input
                  type="number"
                  value={tfaMin}
                  onChange={(e) => {
                    setTfaMin(e.target.value);
                    resetToFirst();
                  }}
                  className="w-full rounded border px-2 py-1 text-sm"
                  inputMode="numeric"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Finished sf ≤</label>
                <input
                  type="number"
                  value={tfaMax}
                  onChange={(e) => {
                    setTfaMax(e.target.value);
                    resetToFirst();
                  }}
                  className="w-full rounded border px-2 py-1 text-sm"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Current value ≥</label>
                <input
                  type="number"
                  value={cvMin}
                  onChange={(e) => {
                    setCvMin(e.target.value);
                    resetToFirst();
                  }}
                  className="w-full rounded border px-2 py-1 text-sm"
                  inputMode="numeric"
                  placeholder="e.g. 100000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Current value ≤</label>
                <input
                  type="number"
                  value={cvMax}
                  onChange={(e) => {
                    setCvMax(e.target.value);
                    resetToFirst();
                  }}
                  className="w-full rounded border px-2 py-1 text-sm"
                  inputMode="numeric"
                  placeholder="e.g. 500000"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        {/* Top toolbar with pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page{" "}
              <input
                type="number"
                min={1}
                value={page}
                onChange={(e) =>
                  setPage(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-16 border rounded px-2 py-1 text-sm"
                disabled={isLoading}
              />{" "}
              {meta?.total ? (
                <span>
                  of{" "}
                  {Math.max(
                    1,
                    Math.ceil(meta.total / (meta.page_size || pageSize))
                  )}
                </span>
              ) : null}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={
                isLoading ||
                meta?.has_more === false ||
                (data?.length ?? 0) < pageSize
              }
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Rows per page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
              disabled={isLoading}
            >
              {[10, 25, 50, 100, 250].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {meta?.total != null && (
              <span className="text-sm text-gray-600">
                Total: {fmtInt(meta.total)}
              </span>
            )}
          </div>
        </div>

        {/* Error (separate from skeleton) */}
        {error && (
          <div className="rounded-lg border bg-white px-3 py-2 text-sm text-red-600">
            Error loading data. Check console.
          </div>
        )}

        {/* Table + Skeleton */}
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((c) => {
                  const dir =
                    c.sortable === false ? "" : sortDirFor(String(c.key));
                  const clickable = c.sortable !== false;
                  return (
                    <th
                      key={String(c.key)}
                      onClick={
                        clickable ? () => toggleSort(String(c.key)) : undefined
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
              {isLoading ? (
                <SkeletonRows rows={10} />
              ) : data && data.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={`${row.parcel_id}-${i}`}
                    className={i % 2 ? "bg-white" : "bg-gray-50/50"}
                  >
                    {COLUMNS.map((c) => {
                      const right = c.align === "right";
                      let cell: React.ReactNode;

                      if (c.render) {
                        cell = c.render(row);
                      } else {
                        const v = row[c.key];
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
                          className={`px-3 py-2 ${
                            right ? "text-right" : "text-left"
                          }`}
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
                    colSpan={COLUMNS.length}
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
