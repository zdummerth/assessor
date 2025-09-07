"use client";

import { useState, useMemo } from "react";
import { useRatioMedians, RatioMediansRow } from "@/lib/client-queries";
import { useLandUseOptions } from "@/lib/client-queries";
import MultiSelectAutocomplete from "@/components/inputs/multi-select-autocomplete";

const GROUPABLES = [
  { key: "district", label: "District" },
  { key: "land_use_sale", label: "Land Use (Sale)" },
  { key: "land_use_asof", label: "Land Use (As-of)" },
  { key: "sale_type", label: "Sale Type" },
  { key: "value_year", label: "Value Year" },
];

const RESIDENTIAL_LU_DEFAULTS = [
  "1010",
  "1110",
  "1111",
  "1114",
  "1115",
  "1120",
  "1130",
  "1140",
];

type SortKey = keyof RatioMediansRow | "group_key";

function RatioBadge({ ratio }: { ratio: number | null }) {
  if (ratio == null) {
    return (
      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
        —
      </span>
    );
  }

  const diff = Math.abs(ratio - 1);
  let color = "bg-green-300 "; // default: good range
  if (diff > 0.3) {
    color = "bg-red-300";
  } else if (diff > 0.1) {
    color = "bg-yellow-300";
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className={`px-2 py-0.5 rounded-md text-xs font-medium`}>
        {ratio.toFixed(3)}
      </span>
    </div>
  );
}

export default function RatioMediansExplorer() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>(
    RESIDENTIAL_LU_DEFAULTS
  );
  const [trim, setTrim] = useState<string>("1.5");
  const [includeRaw, setIncludeRaw] = useState<boolean>(false);

  const [sortKey, setSortKey] = useState<SortKey>("group_key");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  function toggleGroup(key: string) {
    setGroupBy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }
  function resetToResidential() {
    setSelectedLandUses(RESIDENTIAL_LU_DEFAULTS);
    setTrim("1.5");
  }

  const { data, isLoading, error } = useRatioMedians({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    as_of_date: asOfDate || undefined,
    group_by: groupBy.length ? groupBy : undefined,
    land_uses: selectedLandUses.length ? selectedLandUses : undefined,
    trim_factor: trim ? (Number(trim) as 1.5 | 3) : undefined,
    include_raw: includeRaw,
  });

  const loading = isLoading || luLoading;

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      const av = (a as any)[sortKey] ?? null;
      const bv = (b as any)[sortKey] ?? null;
      if (av === null && bv === null) return 0;
      if (av === null) return sortDir === "asc" ? 1 : -1;
      if (bv === null) return sortDir === "asc" ? -1 : 1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "";

  return (
    <div className="grid gap-4 p-4 mb-10 max-w-6xl mx-auto">
      {/* Controls */}
      <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-3 lg:grid-cols-4">
        <label className="flex items-center gap-2">
          <span className="w-28 text-sm">Start date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28 text-sm">End date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28 text-sm">As-of date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="w-28 text-sm">Trim</span>
          <select
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
          >
            <option value="">None</option>
            <option value="1.5">1.5 × IQR</option>
            <option value="3">3 × IQR</option>
          </select>
        </label>

        <div className="col-span-full">
          <div className="text-sm mb-1">Group by</div>
          <div className="flex flex-wrap gap-3">
            {GROUPABLES.map((g) => (
              <label
                key={g.key}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={groupBy.includes(g.key)}
                  onChange={() => toggleGroup(g.key)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-full">
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              className="rounded-md border px-2 py-1 text-xs"
              onClick={resetToResidential}
            >
              Set to Residential
            </button>
          </div>
          <MultiSelectAutocomplete
            options={landUseOptions}
            value={selectedLandUses}
            onChange={setSelectedLandUses}
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={includeRaw}
            onChange={(e) => setIncludeRaw(e.target.checked)}
          />
          <span className="text-sm">Include raw JSON</span>
        </label>
      </div>

      {/* Results */}
      {error ? (
        <div className="p-3 text-sm text-red-600">Error loading medians.</div>
      ) : (
        <div className="overflow-x-auto rounded-md border" aria-busy={loading}>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-3 py-2 text-left border-b cursor-pointer"
                  onClick={() => handleSort("group_key")}
                >
                  Group {sortIndicator("group_key")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => handleSort("median_ratio")}
                >
                  Median {sortIndicator("median_ratio")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => handleSort("min_ratio")}
                >
                  Min {sortIndicator("min_ratio")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => handleSort("max_ratio")}
                >
                  Max {sortIndicator("max_ratio")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => handleSort("avg_ratio")}
                >
                  Avg {sortIndicator("avg_ratio")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => handleSort("n")}
                >
                  Count {sortIndicator("n")}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Skeleton rows when loading */}
              {loading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b animate-pulse">
                      <td className="px-3 py-2">
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="h-3 w-10 bg-gray-200 rounded ml-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {!loading &&
                sortedData.map((row, i) => (
                  <tr
                    key={`${row.group_key ?? "overall"}-${i}`}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <td className="px-3 py-2">{row.group_key ?? "Overall"}</td>
                    <td className="px-3 py-2 text-right">
                      <RatioBadge ratio={row.median_ratio} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.min_ratio != null ? row.min_ratio.toFixed(3) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.max_ratio != null ? row.max_ratio.toFixed(3) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.avg_ratio != null ? row.avg_ratio.toFixed(3) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">{row.n ?? 0}</td>
                  </tr>
                ))}

              {!loading && sortedData.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={6}>
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
