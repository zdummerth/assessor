// /app/test/ratios/_components/client-ratios-explorer.tsx
"use client";

import { useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import { useRatiosRaw, RatioRow } from "@/lib/client-queries";
import { useLandUseOptions } from "@/lib/client-queries";
import RatioSidebar from "../_components/sidebar";
import {
  computeGroupedStats,
  allRatiosTrimmed,
  getSaleYear,
  type StatsRow,
  type TrimChoice,
} from "@/lib/ratio-stats";
import { toCsv, downloadCsv } from "@/lib/csv";
import { getHistogramChartData } from "@/lib/histogram-chart";

// ----- Config -----
const GROUPABLES = [
  { key: "district", label: "District" },
  { key: "land_use_sale", label: "Land Use (Sale)" },
  { key: "sale_year", label: "Sale Year" }, // derived from sale_date
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

type SortKey =
  | "median_ratio"
  | "min_ratio"
  | "max_ratio"
  | "avg_ratio"
  | "n"
  | `group:${string}`; // e.g., 'group:district'

function RatioBadge({ ratio }: { ratio: number | null }) {
  if (ratio == null) {
    return (
      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
        —
      </span>
    );
  }
  const diff = Math.abs(ratio - 1);
  let color = "bg-green-100 text-green-800";
  if (diff > 0.3) color = "bg-red-100 text-red-800";
  else if (diff > 0.1) color = "bg-yellow-100 text-yellow-800";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      {ratio.toFixed(3)}
    </span>
  );
}

// ----- Component -----
export default function ClientRatiosExplorer() {
  // Form state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>(
    RESIDENTIAL_LU_DEFAULTS
  );
  const [trim, setTrim] = useState<TrimChoice>("1.5");
  const [includeRaw, setIncludeRaw] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>("median_ratio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  const {
    data: rawRows,
    isLoading: rowsLoading,
    error,
  } = useRatiosRaw({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    as_of_date: asOfDate || undefined,
    land_uses: selectedLandUses.length ? selectedLandUses : undefined,
  });

  const loading = luLoading || rowsLoading;

  // Derive sale_year client-side (using shared util)
  const rows = useMemo(
    () =>
      (rawRows ?? []).map((r) => ({
        ...r,
        sale_year: getSaleYear(r.sale_date),
      })),
    [rawRows]
  ) as (RatioRow & { sale_year?: number | null })[];

  // Grouped stats (now from shared lib)
  const stats = useMemo<StatsRow[]>(
    () => computeGroupedStats(rows, groupBy, trim, includeRaw),
    [rows, groupBy, trim, includeRaw]
  );

  // Sorting (includes dynamic group columns via `group:${col}`)
  const sortedStats = useMemo(() => {
    const arr = [...stats];
    arr.sort((a, b) => {
      let av: any;
      let bv: any;

      if ((sortKey as string).startsWith("group:")) {
        const col = (sortKey as string).slice("group:".length);
        av = a.group_values[col];
        bv = b.group_values[col];
      } else {
        av = (a as any)[sortKey];
        bv = (b as any)[sortKey];
      }

      if (av == null && bv == null) return 0;
      if (av == null) return sortDir === "asc" ? 1 : -1;
      if (bv == null) return sortDir === "asc" ? -1 : 1;

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [stats, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  const indicator = (k: SortKey) =>
    sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "";

  function toggleGroup(key: string) {
    setGroupBy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }
  function resetToResidential() {
    setSelectedLandUses(RESIDENTIAL_LU_DEFAULTS);
    setTrim("1.5");
  }

  // Overall histogram (trim-consistent, from lib)
  const allRatios = useMemo(() => allRatiosTrimmed(rows, trim), [rows, trim]);
  const overallHist = useMemo(
    () => getHistogramChartData(allRatios),
    [allRatios]
  );

  // CSV exports
  const exportStatsCsv = () => {
    const groupHeaders = groupBy.map((g) => g);
    const rowsOut = sortedStats.map((r) => {
      const gv: Record<string, any> = {};
      for (const g of groupBy) gv[g] = r.group_values[g] ?? "";
      return {
        ...gv,
        median_ratio: r.median_ratio ?? "",
        min_ratio: r.min_ratio ?? "",
        max_ratio: r.max_ratio ?? "",
        avg_ratio: r.avg_ratio ?? "",
        count: r.n ?? 0,
      };
    });
    const csv = toCsv(rowsOut, [
      ...groupHeaders,
      "median_ratio",
      "min_ratio",
      "max_ratio",
      "avg_ratio",
      "count",
    ]);
    downloadCsv("ratio_stats.csv", csv);
  };

  const exportRawCsv = () => {
    const cols = [
      "sale_id",
      "parcel_id",
      "sale_date",
      "sale_price",
      "sale_type",
      "district",
      "land_use_sale",
      "land_use_asof",
      "sale_year",
      "ratio",
    ];
    const rowsOut = rows.map((r) => {
      const o: Record<string, any> = {};
      for (const c of cols) o[c] = (r as any)[c] ?? "";
      return o;
    });
    downloadCsv("ratio_raw_rows.csv", toCsv(rowsOut, cols));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
      {/* Sidebar (extracted) */}
      <RatioSidebar
        landUseOptions={landUseOptions}
        luLoading={luLoading}
        luError={luError}
        loading={loading}
        selectedLandUses={selectedLandUses}
        setSelectedLandUses={setSelectedLandUses}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        asOfDate={asOfDate}
        setAsOfDate={setAsOfDate}
        trim={trim}
        setTrim={setTrim}
        groupBy={groupBy}
        toggleGroup={toggleGroup}
        groupables={GROUPABLES}
        includeRaw={includeRaw}
        setIncludeRaw={setIncludeRaw}
        resetToResidential={resetToResidential}
        onExportStats={exportStatsCsv}
        onExportRaw={exportRawCsv}
      />

      {/* Main content */}
      <section className="min-w-0">
        {/* View toggle */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {groupBy.length ? `Grouped by: ${groupBy.join(", ")}` : "Overall"}
          </div>
          <div className="inline-flex rounded-lg border p-1 bg-white">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm rounded-md ${viewMode === "table" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("charts")}
              className={`px-3 py-1.5 text-sm rounded-md ${viewMode === "charts" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
            >
              Charts
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div
            className="overflow-x-auto rounded-md border"
            aria-busy={loading}
          >
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {groupBy.length === 0 ? (
                    <th className="px-3 py-2 text-left border-b">Group</th>
                  ) : (
                    groupBy.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left border-b cursor-pointer whitespace-nowrap"
                        onClick={() => handleSort(`group:${col}`)}
                      >
                        {GROUPABLES.find((g) => g.key === col)?.label ?? col}{" "}
                        {indicator(`group:${col}`)}
                      </th>
                    ))
                  )}
                  <th
                    className="px-3 py-2 text-right border-b cursor-pointer"
                    onClick={() => handleSort("median_ratio")}
                  >
                    Median {indicator("median_ratio")}
                  </th>
                  <th
                    className="px-3 py-2 text-right border-b cursor-pointer"
                    onClick={() => handleSort("min_ratio")}
                  >
                    Min {indicator("min_ratio")}
                  </th>
                  <th
                    className="px-3 py-2 text-right border-b cursor-pointer"
                    onClick={() => handleSort("max_ratio")}
                  >
                    Max {indicator("max_ratio")}
                  </th>
                  <th
                    className="px-3 py-2 text-right border-b cursor-pointer"
                    onClick={() => handleSort("avg_ratio")}
                  >
                    Avg {indicator("avg_ratio")}
                  </th>
                  <th
                    className="px-3 py-2 text-right border-b cursor-pointer"
                    onClick={() => handleSort("n")}
                  >
                    Count {indicator("n")}
                  </th>
                  {includeRaw && (
                    <th className="px-3 py-2 text-left border-b">Raw</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`sk-${i}`}
                      className="odd:bg-white even:bg-gray-50 border-b animate-pulse"
                    >
                      {groupBy.length === 0 ? (
                        <td className="px-3 py-2">
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                        </td>
                      ) : (
                        groupBy.map((g) => (
                          <td key={`skg-${g}-${i}`} className="px-3 py-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                          </td>
                        ))
                      )}
                      {["median", "min", "max", "avg", "n"].map((k) => (
                        <td
                          key={`sk-${k}-${i}`}
                          className="px-3 py-2 text-right"
                        >
                          <div className="h-3 w-12 bg-gray-200 rounded ml-auto" />
                        </td>
                      ))}
                      {includeRaw && <td className="px-3 py-2" />}
                    </tr>
                  ))}

                {!loading &&
                  sortedStats.map((r, i) => (
                    <tr
                      key={`row-${i}`}
                      className="odd:bg-white even:bg-gray-50 border-b"
                    >
                      {groupBy.length > 0 ? (
                        groupBy.map((col) => (
                          <td
                            key={`${col}-${i}`}
                            className="px-3 py-2 whitespace-nowrap"
                          >
                            {r.group_values[col] ?? "—"}
                          </td>
                        ))
                      ) : (
                        <td className="px-3 py-2">Overall</td>
                      )}

                      <td className="px-3 py-2 text-right">
                        <RatioBadge ratio={r.median_ratio} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        {r.min_ratio != null ? r.min_ratio.toFixed(3) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {r.max_ratio != null ? r.max_ratio.toFixed(3) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {r.avg_ratio != null ? r.avg_ratio.toFixed(3) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">{r.n ?? 0}</td>

                      {includeRaw && (
                        <td className="px-3 py-2 align-top">
                          <details>
                            <summary className="cursor-pointer select-none">
                              view
                            </summary>
                            <pre className="mt-2 max-h-64 overflow-auto text-xs">
                              {JSON.stringify(r.raw_data ?? [], null, 2)}
                            </pre>
                          </details>
                        </td>
                      )}
                    </tr>
                  ))}

                {!loading && sortedStats.length === 0 && (
                  <tr className="odd:bg-white even:bg-gray-50">
                    <td
                      className="px-3 py-4 text-sm text-gray-500"
                      colSpan={(groupBy.length || 1) + 5 + (includeRaw ? 1 : 0)}
                    >
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CHARTS VIEW */}
        {viewMode === "charts" && (
          <div className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 text-sm font-medium text-gray-800">
                Overall Ratio Distribution (bin width = 0.1)
              </div>
              <div className="w-full" style={{ height: 320 }}>
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="100%"
                  data={overallHist.data}
                  options={overallHist.options}
                  loader={
                    <div className="text-sm text-gray-500">Loading chart…</div>
                  }
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Showing {allRatios.length.toLocaleString()} ratios
                {trim ? ` (trimmed ${trim}× IQR)` : ""}.
              </div>
            </div>

            {groupBy.length > 0 && (
              <div className="rounded-md border">
                <div className="px-3 py-2 border-b text-sm font-medium">
                  Histograms by Group ({groupBy.join(", ")})
                </div>

                <div className="p-3 grid gap-4 sm:grid-cols-2">
                  {sortedStats
                    .filter((g) => (g.ratios?.length ?? 0) > 0)
                    .map((g, idx) => {
                      const { data, options } = getHistogramChartData(
                        g.ratios as number[]
                      );
                      const title =
                        groupBy
                          .map((col) => `${col}: ${g.group_values[col] ?? "—"}`)
                          .join(" • ") || "Overall";
                      return (
                        <div key={idx} className="rounded-md border p-3">
                          <div className="mb-2 text-xs font-medium text-gray-700 line-clamp-2">
                            {title}
                          </div>
                          <div className="w-full" style={{ height: 240 }}>
                            <Chart
                              chartType="ColumnChart"
                              width="100%"
                              height="100%"
                              data={data}
                              options={options}
                              loader={
                                <div className="text-sm text-gray-500">
                                  Loading…
                                </div>
                              }
                            />
                          </div>
                          <div className="mt-1 text-[11px] text-gray-500">
                            n={g.n} {trim ? `(trim ${trim}× IQR)` : ""}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
            Error loading data. Adjust filters.
          </div>
        )}
      </section>
    </div>
  );
}
