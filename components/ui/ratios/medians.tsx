// app/test/ratios/_components/ratio-medians-explorer.tsx
"use client";

import { useMemo, useState } from "react";
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

export default function RatioMediansExplorer() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [trim, setTrim] = useState<string>(""); // "", "1.5", "3"
  const [includeRaw, setIncludeRaw] = useState<boolean>(false);

  // Dynamic land use list
  const { options: landUseOptions, isLoading: luLoading } = useLandUseOptions();
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>([]);

  console.log("landUseOptions:", landUseOptions);

  function toggleGroup(key: string) {
    setGroupBy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
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

  return (
    <div className="grid gap-4">
      {/* Controls */}
      <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-3 lg:grid-cols-4">
        {/* Dates */}
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

        {/* Trim */}
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

        {/* Group by */}
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

        {/* Land uses (dynamic autocomplete multi-select) */}
        <div className="col-span-full">
          <MultiSelectAutocomplete
            label="Land Uses"
            options={landUseOptions}
            value={selectedLandUses}
            onChange={setSelectedLandUses}
            className="w-full"
            placeholder={luLoading ? "Loading land uses…" : "Search land uses…"}
          />
        </div>

        {/* Raw toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={includeRaw}
            onChange={(e) => setIncludeRaw(e.target.checked)}
          />
          <span className="text-sm">Include raw JSON</span>
        </label>

        {(isLoading || luLoading) && (
          <div className="col-span-full">
            <span
              aria-hidden
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              title="Loading…"
            />
          </div>
        )}
      </div>

      {/* Results table (unchanged) */}
      {error ? (
        <div className="p-3 text-sm text-red-600">
          Error loading medians. Adjust your filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left border-b">Group</th>
                <th className="px-3 py-2 text-right border-b">Median</th>
                <th className="px-3 py-2 text-right border-b">Min</th>
                <th className="px-3 py-2 text-right border-b">Max</th>
                <th className="px-3 py-2 text-right border-b">Avg</th>
                <th className="px-3 py-2 text-right border-b">Count</th>
                {/* include_raw column if requested */}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((row: RatioMediansRow, i) => (
                <tr
                  key={`${row.group_key ?? "overall"}-${i}`}
                  className="border-b"
                >
                  <td className="px-3 py-2">{row.group_key ?? "Overall"}</td>
                  <td className="px-3 py-2 text-right">
                    {row.median_ratio != null
                      ? row.median_ratio.toFixed(3)
                      : "—"}
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
              {!isLoading && (!data || data.length === 0) && (
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
