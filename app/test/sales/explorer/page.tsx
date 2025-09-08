"use client";

import { useMemo, useState, useEffect, Fragment } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
  useLandUseOptions,
} from "@/lib/client-queries";
import RatioSidebar from "../../ratios/_components/sidebar";
import { toCsv, downloadCsv } from "@/lib/csv";
import { getSaleYear } from "@/lib/ratio-stats";
import { computeGroupedNumeric, sortGroupSummaries } from "@/lib/stats";
import { Chart } from "react-google-charts";

type TrimChoice = "" | "1.5" | "3";
type Tab = "sale_price" | "ratio";
type SortDir = "asc" | "desc";
type SortKey = "median" | "avg" | "min" | "max" | "count" | `group:${string}`;
type ViewMode = "table" | "cards";

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

function isNum(x: any): x is number {
  return typeof x === "number" && Number.isFinite(x);
}
function fmtMoney(n: number | null) {
  if (!isNum(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtRatio(n: number | null) {
  return isNum(n) ? n.toFixed(3) : "—";
}

export default function SoldParcelRatiosFeaturesStats() {
  // Sidebar state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>(
    RESIDENTIAL_LU_DEFAULTS
  );
  const [trim, setTrim] = useState<TrimChoice>("1.5");
  const [includeRaw, setIncludeRaw] = useState<boolean>(false);

  const [tab, setTab] = useState<Tab>("sale_price");
  const [viewMode, setViewMode] = useState<ViewMode>("table"); // NEW

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>("median");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const indicator = (k: SortKey) =>
    sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  // Sidebar helpers
  function toggleGroup(key: string) {
    setGroupBy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }
  function resetToResidential() {
    setSelectedLandUses(RESIDENTIAL_LU_DEFAULTS);
    setTrim("1.5");
  }

  // Options for sidebar (land-use multiselect)
  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  // Data fetch (ratios + features)
  const {
    data: rawRows,
    isLoading: rowsLoading,
    error,
  } = useRatiosFeatures({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    as_of_date: asOfDate || undefined,
    land_uses: selectedLandUses.length ? selectedLandUses : undefined,
    valid_only: true,
  });

  const loading = luLoading || rowsLoading;

  // Derive sale_year client-side
  const rows = useMemo(
    () =>
      (rawRows ?? []).map((r) => ({
        ...r,
        sale_year: getSaleYear(r.sale_date),
      })),
    [rawRows]
  ) as (RatiosFeaturesRow & { sale_year?: number | null })[];

  // Grouped stats (IQR trim applied via computeGroupedNumeric from /lib/stats.js)
  const priceGroups = useMemo(
    () => computeGroupedNumeric(rows, groupBy, "sale_price", trim),
    [rows, groupBy, trim]
  );
  const ratioGroups = useMemo(
    () => computeGroupedNumeric(rows, groupBy, "ratio", trim),
    [rows, groupBy, trim]
  );

  const activeGroups = tab === "sale_price" ? priceGroups : ratioGroups;
  const sortedGroups = useMemo(
    () => sortGroupSummaries(activeGroups, sortKey, sortDir),
    [activeGroups, sortKey, sortDir]
  );

  // If groups cleared but sortKey is a group column, reset to a metric
  useEffect(() => {
    if (groupBy.length === 0 && String(sortKey).startsWith("group:")) {
      setSortKey("median");
      setSortDir("asc");
    }
  }, [groupBy, sortKey]);

  const label = tab === "sale_price" ? "Sale Price" : "Ratio";
  const formatCell =
    tab === "sale_price"
      ? (n: number | null) => fmtMoney(n)
      : (n: number | null) => fmtRatio(n);

  // Export the current tab (sorted)
  const exportCurrentCsv = () => {
    const headers = [
      ...(groupBy.length ? groupBy : ["Group"]),
      "median",
      "avg",
      "min",
      "max",
      "count",
    ];
    const rowsOut = sortedGroups.map((g) => {
      const base: Record<string, any> = {};
      if (groupBy.length) {
        for (const col of groupBy) base[col] = g.group_values[col] ?? "";
      } else {
        base["Group"] = "Overall";
      }
      base.median = g.median ?? "";
      base.avg = g.avg ?? "";
      base.min = g.min ?? "";
      base.max = g.max ?? "";
      base.count = g.count ?? 0;
      return base;
    });
    downloadCsv(`${tab}_grouped_stats.csv`, toCsv(rowsOut, headers));
  };

  //export the raw sales
  const exportRawCsv = () => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const rowsOut = rows.map((r) => {
      const out: Record<string, any> = {};
      for (const key of headers) {
        // @ts-expect-error dynamic index ok
        out[key] = r[key];
      }
      return out;
    });
    downloadCsv(`raw_sales.csv`, toCsv(rowsOut, headers));
  };

  // Chart options
  const histogramOptions =
    tab === "ratio"
      ? {
          legend: { position: "none" as const },
          histogram: { bucketSize: 0.1 },
          hAxis: { title: "Ratio" },
          vAxis: { title: "Frequency" },
          chartArea: { width: "85%", height: "70%" },
        }
      : {
          legend: { position: "none" as const },
          hAxis: { title: "Sale Price (USD)", format: "short" },
          vAxis: { title: "Frequency" },
          chartArea: { width: "85%", height: "70%" },
        };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px,1fr] pr-4">
      {/* Sidebar */}
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
        groupables={[
          { key: "district", label: "District" },
          { key: "sale_year", label: "Sale Year" },
          { key: "land_use", label: "Land Use" },
          { key: "avg_condition", label: "Avg Condition" },
          { key: "postcode", label: "Postcode" },
          { key: "avg_year_built", label: "Avg Year Built" },
        ]}
        includeRaw={includeRaw}
        setIncludeRaw={setIncludeRaw}
        resetToResidential={resetToResidential}
        onExportStats={exportCurrentCsv}
        onExportRaw={exportRawCsv}
      />

      {/* Main */}
      <section className="min-w-0 space-y-4">
        {/* Tabs + View toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-gray-600">
            {groupBy.length
              ? `Grouped by: ${groupBy.join(", ")}${
                  trim ? ` • Trim ${trim}× IQR` : ""
                }`
              : `Overall${trim ? ` • Trim ${trim}× IQR` : ""}`}
          </div>

          <div className="flex items-center gap-2">
            {/* Value Tabs */}
            <div className="inline-flex rounded-lg border p-1 bg-white">
              <button
                type="button"
                onClick={() => setTab("sale_price")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  tab === "sale_price"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Sale Prices
              </button>
              <button
                type="button"
                onClick={() => setTab("ratio")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  tab === "ratio"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                Ratios
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border p-1 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  viewMode === "table"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
                title="Show stats table"
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  viewMode === "cards"
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50"
                }`}
                title="Show cards with histograms"
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* ===== TABLE VIEW (stats only) ===== */}
        {viewMode === "table" && (
          <div className="rounded-md border">
            <div className="px-3 py-2 border-b text-sm font-medium">
              {label} stats{" "}
              {groupBy.length ? `(by ${groupBy.join(", ")})` : "(overall)"}
            </div>
            <div className="overflow-x-auto">
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
                          onClick={() => handleSort(`group:${col}` as SortKey)}
                        >
                          {col}
                          {indicator(`group:${col}` as SortKey)}
                        </th>
                      ))
                    )}
                    <th
                      className="px-3 py-2 text-right border-b cursor-pointer"
                      onClick={() => handleSort("median")}
                    >
                      Median{indicator("median")}
                    </th>
                    <th
                      className="px-3 py-2 text-right border-b cursor-pointer"
                      onClick={() => handleSort("avg")}
                    >
                      Avg{indicator("avg")}
                    </th>
                    <th
                      className="px-3 py-2 text-right border-b cursor-pointer"
                      onClick={() => handleSort("min")}
                    >
                      Min{indicator("min")}
                    </th>
                    <th
                      className="px-3 py-2 text-right border-b cursor-pointer"
                      onClick={() => handleSort("max")}
                    >
                      Max{indicator("max")}
                    </th>
                    <th
                      className="px-3 py-2 text-right border-b cursor-pointer"
                      onClick={() => handleSort("count")}
                    >
                      Count{indicator("count")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr
                        key={`sk-${i}`}
                        className="odd:bg-white even:bg-gray-50 border-b animate-pulse"
                      >
                        {(groupBy.length || 1) > 0 &&
                          (groupBy.length ? groupBy : ["_overall"]).map((g) => (
                            <td key={`${g}-${i}`} className="px-3 py-2">
                              <div className="h-3 w-24 bg-gray-200 rounded" />
                            </td>
                          ))}
                        {["med", "avg", "min", "max", "n"].map((k) => (
                          <td
                            key={`sk-${k}-${i}`}
                            className="px-3 py-2 text-right"
                          >
                            <div className="h-3 w-12 bg-gray-200 rounded ml-auto" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!loading &&
                    sortedGroups.map((g, i) => (
                      <tr
                        key={`row-${i}`}
                        className="odd:bg-white even:bg-gray-50 border-b"
                      >
                        {groupBy.length ? (
                          groupBy.map((col) => (
                            <td
                              key={`${col}-${i}`}
                              className="px-3 py-2 whitespace-nowrap"
                            >
                              {g.group_values[col] ?? "—"}
                            </td>
                          ))
                        ) : (
                          <td className="px-3 py-2">Overall</td>
                        )}
                        <td className="px-3 py-2 text-right">
                          {formatCell(g.median)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCell(g.avg)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCell(g.min)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCell(g.max)}
                        </td>
                        <td className="px-3 py-2 text-right">{g.count}</td>
                      </tr>
                    ))}

                  {!loading && sortedGroups.length === 0 && (
                    <tr>
                      <td
                        className="px-3 py-4 text-sm text-gray-500"
                        colSpan={(groupBy.length || 1) + 5}
                      >
                        No results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {error && (
              <div className="m-3 p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
                Error loading data. Adjust filters.
              </div>
            )}
          </div>
        )}

        {/* ===== CARD VIEW (stats + histogram) ===== */}
        {viewMode === "cards" && (
          <div>
            <div className="px-1 pb-1 text-sm text-gray-600">
              {label} distributions{" "}
              {groupBy.length ? `(by ${groupBy.join(", ")})` : "(overall)"}
            </div>

            {loading && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`card-sk-${i}`}
                    className="rounded-lg border p-3 space-y-3 animate-pulse"
                  >
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="h-36 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && sortedGroups.length === 0 && (
              <div className="text-sm text-gray-500">No results</div>
            )}

            {!loading && sortedGroups.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedGroups.map((g, i) => {
                  const vals = (g as any).values as number[] | undefined;
                  const chartData = [["x"], ...(vals ?? []).map((v) => [v])];

                  // Display group label
                  const title =
                    groupBy.length === 0
                      ? "Overall"
                      : groupBy
                          .map((col) => `${col}: ${g.group_values[col] ?? "—"}`)
                          .join(" • ");

                  return (
                    <div
                      key={`card-${i}`}
                      className="rounded-lg border p-3 shadow-sm bg-white"
                    >
                      <div className="mb-2 text-sm font-medium">{title}</div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="text-gray-500">Median</div>
                        <div className="text-right">{formatCell(g.median)}</div>
                        <div className="text-gray-500">Average</div>
                        <div className="text-right">{formatCell(g.avg)}</div>
                        <div className="text-gray-500">Min</div>
                        <div className="text-right">{formatCell(g.min)}</div>
                        <div className="text-gray-500">Max</div>
                        <div className="text-right">{formatCell(g.max)}</div>
                        <div className="text-gray-500">Count</div>
                        <div className="text-right">{g.count}</div>
                      </div>

                      {/* Histogram */}
                      <div className="mt-3">
                        {vals && vals.length > 1 ? (
                          <Chart
                            chartType="Histogram"
                            width="100%"
                            height="300px"
                            data={chartData}
                            options={
                              tab === "ratio"
                                ? {
                                    legend: { position: "none" as const },
                                    histogram: { bucketSize: 0.1 },
                                    hAxis: { title: "Ratio" },
                                    vAxis: { title: "Frequency" },
                                    chartArea: { width: "85%", height: "70%" },
                                  }
                                : {
                                    legend: { position: "none" as const },
                                    hAxis: {
                                      title: "Sale Price (USD)",
                                      format: "short",
                                    },
                                    vAxis: { title: "Frequency" },
                                    chartArea: { width: "85%", height: "70%" },
                                  }
                            }
                            loader={<div className="text-xs">Loading…</div>}
                          />
                        ) : (
                          <div className="text-xs text-gray-500">
                            Not enough data for histogram.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
