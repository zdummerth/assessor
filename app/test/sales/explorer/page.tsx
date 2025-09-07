"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
  useLandUseOptions,
} from "@/lib/client-queries";
import RatioSidebar from "../../ratios/_components/sidebar"; // adjust if needed
import { toCsv, downloadCsv } from "@/lib/csv";
import { getSaleYear } from "@/lib/ratio-stats";
import { computeGroupedNumeric, sortGroupSummaries } from "@/lib/stats";

type TrimChoice = "" | "1.5" | "3";
type Tab = "sale_price" | "ratio";
type SortDir = "asc" | "desc";
type SortKey = "median" | "avg" | "min" | "max" | "count" | `group:${string}`;

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
  const [includeRaw, setIncludeRaw] = useState<boolean>(false); // kept for sidebar compat

  const [tab, setTab] = useState<Tab>("sale_price");

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

  // If groups cleared but sortKey is a group column, reset to a metric
  useEffect(() => {
    if (groupBy.length === 0 && String(sortKey).startsWith("group:")) {
      setSortKey("median");
      setSortDir("asc");
    }
  }, [groupBy, sortKey]);

  const activeGroups = tab === "sale_price" ? priceGroups : ratioGroups;
  const sortedGroups = useMemo(
    () => sortGroupSummaries(activeGroups, sortKey, sortDir),
    [activeGroups, sortKey, sortDir]
  );

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

  return (
    <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
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
          { key: "sale_year", label: "Sale Year" }, // derived here
          { key: "land_use", label: "Land Use" }, // from features; matches sale/as-of in your SQL
          { key: "avg_condition", label: "Avg Condition" },
          { key: "postcode", label: "Postcode" },
          { key: "avg_year_built", label: "Avg Year Built" },
        ]}
        includeRaw={includeRaw}
        setIncludeRaw={setIncludeRaw}
        resetToResidential={resetToResidential}
        onExportStats={exportCurrentCsv}
        onExportRaw={exportCurrentCsv}
      />

      {/* Main: tabs + SORTABLE grouped stats */}
      <section className="min-w-0 space-y-4">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {groupBy.length
              ? `Grouped by: ${groupBy.join(", ")}${
                  trim ? ` • Trim ${trim}× IQR` : ""
                }`
              : `Overall${trim ? ` • Trim ${trim}× IQR` : ""}`}
          </div>
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
                tab === "ratio" ? "bg-gray-900 text-white" : "hover:bg-gray-50"
              }`}
            >
              Ratios
            </button>
          </div>
        </div>

        {/* Sortable table */}
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
                      key={i}
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
      </section>
    </div>
  );
}
