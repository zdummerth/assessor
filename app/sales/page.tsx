"use client";

import { useMemo, useState, useEffect } from "react";
import { useRatiosFeatures } from "@/lib/client-queries";
import { toCsv, downloadCsv } from "@/lib/csv";
import { getSaleYear } from "@/lib/ratio-stats";
import { computeGroupedNumeric, sortGroupSummaries } from "@/lib/stats";
import { Chart } from "react-google-charts";
import {
  fmtMoney,
  fmtRatio,
  type SortDir,
  type SortKey,
  type ViewMode,
  type RawRow,
} from "./utils";
import data from "@/lib/land_use_arrays.json";
import RawSalesView from "./raw-sales";
import MultiParcelSalesCards from "./multi-parcel-sales";

// ===============================
// Land-use sets (codes as numbers)
// ===============================
const residential = data.residential as number[];
const commercial = data.commercial as number[];
const industrial = data.agriculture as number[];
const lots = data.lots as number[];
const single_family = data.single_family as number[];
const condo = data.condo as number[];

const all_residential = [...residential, ...single_family, ...condo];
const all_other = [...commercial, ...industrial];
const all_lots = lots;

type TrimChoice = "" | "1.5" | "3";
type Tab = "sale_price" | "ratio" | "raw" | "multi";
type LuSet = "residential" | "other" | "lots";

type GroupSummary = {
  group_values: Record<string, any>;
  median: number | null;
  avg: number | null;
  min: number | null;
  max: number | null;
  count: number;
  values?: number[];
};

// ============ utils ============
function setCodes(setKey: LuSet): string[] {
  switch (setKey) {
    case "residential":
      return all_residential.map(String);
    case "other":
      return all_other.map(String);
    case "lots":
      return all_lots.map(String);
  }
}

function useSort() {
  const [sortKey, setSortKey] = useState<SortKey>("median");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const indicator = (k: SortKey) =>
    sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  const onSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };
  return { sortKey, sortDir, indicator, onSort, setSortKey, setSortDir };
}

// Reusable grouped summary renderer
function GroupedSummary(props: {
  label: string;
  groups: GroupSummary[];
  groupBy: string[];
  viewMode: ViewMode;
  loading: boolean;
  error?: any;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  indicator: (k: SortKey) => string;
  formatCell: (n: number | null) => string;
}) {
  const {
    label,
    groups,
    groupBy,
    viewMode,
    loading,
    error,
    sortKey,
    sortDir,
    onSort,
    indicator,
    formatCell,
  } = props;

  const sorted = useMemo(
    () => sortGroupSummaries(groups, sortKey, sortDir),
    [groups, sortKey, sortDir]
  );

  if (viewMode === "table") {
    return (
      <div className="rounded-md border">
        <div className="px-3 py-2 border-b text-sm font-medium">
          {label} stats{" "}
          {groupBy.length ? `(by ${groupBy.join(", ")})` : "(overall)"}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {groupBy.length === 0 ? (
                  <th className="px-3 py-2 text-left border-b">Group</th>
                ) : (
                  groupBy.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left border-b cursor-pointer whitespace-nowrap"
                      onClick={() => onSort(`group:${col}` as SortKey)}
                    >
                      {col}
                      {indicator(`group:${col}` as SortKey)}
                    </th>
                  ))
                )}
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => onSort("median")}
                >
                  Median{indicator("median")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => onSort("avg")}
                >
                  Avg{indicator("avg")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => onSort("min")}
                >
                  Min{indicator("min")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => onSort("max")}
                >
                  Max{indicator("max")}
                </th>
                <th
                  className="px-3 py-2 text-right border-b cursor-pointer"
                  onClick={() => onSort("count")}
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
                    className="odd:bg-background even:bg-gray-50 dark:even:bg-gray-800 border-b animate-pulse"
                  >
                    {(groupBy.length || 1) > 0 &&
                      (groupBy.length ? groupBy : ["_overall"]).map((g) => (
                        <td key={`${g}-${i}`} className="px-3 py-2">
                          <div className="h-3 w-24 rounded" />
                        </td>
                      ))}
                    {["med", "avg", "min", "max", "n"].map((k) => (
                      <td key={`sk-${k}-${i}`} className="px-3 py-2 text-right">
                        <div className="h-3 w-12 bg-gray-200 rounded ml-auto" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                sorted.map((g, i) => (
                  <tr
                    key={`row-${i}`}
                    className="odd:bg-background even:bg-gray-50 dark:even:bg-gray-800 border-b"
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

              {!loading && groups.length === 0 && (
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
          <div className="m-3 p-3 text-sm text-yellow-800 border border-yellow-200 rounded-md bg-yellow-50">
            {String(error)}
          </div>
        )}
      </div>
    );
  }

  // Card view
  return (
    <div>
      <div className="px-1 pb-1 text-sm text-gray-600">
        {label} distributions{" "}
        {groupBy.length ? `(by ${groupBy.join(", ")})` : "(overall)"}
      </div>

      {loading && (
        <div className="grid gap-3 grid-cols-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`card-sk-${i}`}
              className="rounded-lg border p-3 space-y-3 animate-pulse"
            >
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((__, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-36 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-sm text-gray-500">No results</div>
      )}

      {!loading && groups.length > 0 && (
        <div className="grid gap-4 grid-cols-1">
          {sortGroupSummaries(groups, sortKey, sortDir).map((g, i) => {
            const vals = g.values ?? [];
            // @ts-expect-error js
            const chartData = [["x"], ...vals.map((v) => [v])];
            const title =
              groupBy.length === 0
                ? "Overall"
                : groupBy
                    .map((col) => `${col}: ${g.group_values[col] ?? "—"}`)
                    .join(" • ");

            return (
              <div key={`card-${i}`} className="rounded border p-2 shadow-sm">
                <div className="mb-2 text-sm font-medium">{title}</div>
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

                <div className="mt-3 text-black">
                  {vals.length > 1 ? (
                    <Chart
                      chartType="Histogram"
                      width="100%"
                      height="300px"
                      data={chartData}
                      options={{
                        legend: { position: "none" as const },
                        hAxis: { title: label },
                        vAxis: { title: "Frequency" },
                        chartArea: { width: "85%", height: "70%" },
                      }}
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
  );
}

// ============ children (no fetching; client-side only) ============
function SaleSummaries(props: {
  rows: RawRow[];
  setOptions: string[]; // parent-selected set codes (strings)
  validOnly: boolean;
  viewMode: ViewMode;
}) {
  const [withinSet, setWithinSet] = useState<string[]>([]);
  const [trim, setTrim] = useState<TrimChoice>("1.5");
  const [groupBy, setGroupBy] = useState<string[]>([]);

  const { sortKey, sortDir, indicator, onSort, setSortKey, setSortDir } =
    useSort();

  const getRowCode = (r: any) =>
    String(r?.land_use_code ?? r?.land_use_code_id ?? r?.land_use ?? "");

  const filteredRows = useMemo(() => {
    const allowed = new Set(props.setOptions);
    const chosen = withinSet.length ? new Set(withinSet) : null;

    return (props.rows ?? []).filter((r) => {
      const c = getRowCode(r);
      if (!allowed.has(c)) return false; // keep in parent set
      if (chosen) return chosen.has(c); // subset
      return true; // whole set
    });
  }, [props.rows, props.setOptions, withinSet]);

  const groups = useMemo(
    () =>
      computeGroupedNumeric(
        filteredRows,
        groupBy,
        "sale_price",
        trim
      ) as GroupSummary[],
    [filteredRows, groupBy, trim]
  );

  useEffect(() => {
    if (groupBy.length === 0 && String(sortKey).startsWith("group:")) {
      setSortKey("median");
      setSortDir("asc");
    }
  }, [groupBy, sortKey, setSortKey, setSortDir]);

  const exportCsv = () => {
    const headers = [
      ...(groupBy.length ? groupBy : ["Group"]),
      "median",
      "avg",
      "min",
      "max",
      "count",
    ];
    const rowsOut = sortGroupSummaries(groups, sortKey, sortDir).map((g) => {
      const base: Record<string, any> = {};
      if (groupBy.length)
        for (const col of groupBy) base[col] = g.group_values[col] ?? "";
      else base["Group"] = "Overall";
      base.median = g.median ?? "";
      base.avg = g.avg ?? "";
      base.min = g.min ?? "";
      base.max = g.max ?? "";
      base.count = g.count ?? 0;
      return base;
    });
    downloadCsv(`sale_price_grouped_stats.csv`, toCsv(rowsOut, headers));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
      {/* Sidebar (these are the "rest of filters" for this tab) */}
      <aside className="space-y-4">
        {!props.validOnly && (
          <div className="text-sm px-3 py-2 rounded border border-yellow-300 bg-yellow-50 text-yellow-900">
            Warning: <span className="font-medium">Valid only</span> is off.
            Results may include outliers or invalid sales.
          </div>
        )}

        <div className="space-y-1">
          <div className="text-sm">Trim (IQR)</div>
          <div className="inline-flex rounded border p-1">
            {(["", "1.5", "3"] as TrimChoice[]).map((t) => (
              <button
                key={t || "none"}
                type="button"
                onClick={() => setTrim(t)}
                className={`px-3 py-1.5 text-sm rounded-md ${trim === t ? "bg-gray-900 text-white" : ""}`}
              >
                {t ? `${t}×` : "None"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm mb-1">Group by</div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "district", label: "District" },
              { key: "sale_year", label: "Sale Year" },
              { key: "land_use", label: "Land Use" },
              { key: "avg_condition", label: "Avg Condition" },
              { key: "postcode", label: "Postcode" },
              { key: "avg_year_built", label: "Avg Year Built" },
            ].map((g) => {
              const active = groupBy.includes(g.key);
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() =>
                    setGroupBy((prev) =>
                      prev.includes(g.key)
                        ? prev.filter((k) => k !== g.key)
                        : [...prev, g.key]
                    )
                  }
                  className={`px-2 py-1 text-xs rounded border ${active ? "bg-gray-900 text-white" : ""}`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="px-3 py-1.5 text-sm rounded border"
        >
          Export CSV
        </button>
      </aside>

      {/* Content */}
      <section className="min-h-0">
        <GroupedSummary
          label="Sale Price"
          groups={groups}
          groupBy={groupBy}
          viewMode={props.viewMode}
          loading={false}
          error={undefined}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          indicator={indicator}
          formatCell={fmtMoney}
        />
      </section>
    </div>
  );
}

function RatioSummaries(props: {
  rows: RawRow[];
  setOptions: string[];
  validOnly: boolean;
  viewMode: ViewMode;
}) {
  const [withinSet, setWithinSet] = useState<string[]>([]);
  const [trim, setTrim] = useState<TrimChoice>("1.5");
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const { sortKey, sortDir, indicator, onSort, setSortKey, setSortDir } =
    useSort();

  const getRowCode = (r: any) =>
    String(r?.land_use_code ?? r?.land_use_code_id ?? r?.land_use ?? "");

  const filteredRows = useMemo(() => {
    const allowed = new Set(props.setOptions);
    const chosen = withinSet.length ? new Set(withinSet) : null;
    return (props.rows ?? []).filter((r) => {
      const c = getRowCode(r);
      if (!allowed.has(c)) return false;
      if (chosen) return chosen.has(c);
      return true;
    });
  }, [props.rows, props.setOptions, withinSet]);

  const groups = useMemo(
    () =>
      computeGroupedNumeric(
        filteredRows,
        groupBy,
        "ratio",
        trim
      ) as GroupSummary[],
    [filteredRows, groupBy, trim]
  );

  useEffect(() => {
    if (groupBy.length === 0 && String(sortKey).startsWith("group:")) {
      setSortKey("median");
      setSortDir("asc");
    }
  }, [groupBy, sortKey, setSortKey, setSortDir]);

  const exportCsv = () => {
    const headers = [
      ...(groupBy.length ? groupBy : ["Group"]),
      "median",
      "avg",
      "min",
      "max",
      "count",
    ];
    const rowsOut = sortGroupSummaries(groups, sortKey, sortDir).map((g) => {
      const base: Record<string, any> = {};
      if (groupBy.length)
        for (const col of groupBy) base[col] = g.group_values[col] ?? "";
      else base["Group"] = "Overall";
      base.median = g.median ?? "";
      base.avg = g.avg ?? "";
      base.min = g.min ?? "";
      base.max = g.max ?? "";
      base.count = g.count ?? 0;
      return base;
    });
    downloadCsv(`ratio_grouped_stats.csv`, toCsv(rowsOut, headers));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
      {/* Sidebar (rest of filters for this tab) */}
      <aside className="space-y-4">
        {!props.validOnly && (
          <div className="text-sm px-3 py-2 rounded border border-yellow-300 bg-yellow-50 text-yellow-900">
            Warning: <span className="font-medium">Valid only</span> is off.
            Results may include outliers or invalid sales.
          </div>
        )}

        <div className="space-y-1">
          <div className="text-sm">Trim (IQR)</div>
          <div className="inline-flex rounded border p-1">
            {(["", "1.5", "3"] as TrimChoice[]).map((t) => (
              <button
                key={t || "none"}
                type="button"
                onClick={() => setTrim(t)}
                className={`px-3 py-1.5 text-sm rounded-md ${trim === t ? "bg-gray-900 text-white" : ""}`}
              >
                {t ? `${t}×` : "None"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm mb-1">Group by</div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "district", label: "District" },
              { key: "sale_year", label: "Sale Year" },
              { key: "land_use", label: "Land Use" },
              { key: "avg_condition", label: "Avg Condition" },
              { key: "postcode", label: "Postcode" },
              { key: "avg_year_built", label: "Avg Year Built" },
            ].map((g) => {
              const active = groupBy.includes(g.key);
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() =>
                    setGroupBy((prev) =>
                      prev.includes(g.key)
                        ? prev.filter((k) => k !== g.key)
                        : [...prev, g.key]
                    )
                  }
                  className={`px-2 py-1 text-xs rounded border ${active ? "bg-gray-900 text-white" : ""}`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="px-3 py-1.5 text-sm rounded border"
        >
          Export CSV
        </button>
      </aside>

      {/* Content */}
      <section className="min-h-0">
        <GroupedSummary
          label="Ratio"
          groups={groups}
          groupBy={groupBy}
          viewMode={props.viewMode}
          loading={false}
          error={undefined}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          indicator={indicator}
          formatCell={fmtRatio}
        />
      </section>
    </div>
  );
}

// ===============================
// Main: top-bar + sidebar + scrollable content
// ===============================
export default function SoldParcelRatiosFeaturesStats() {
  const [tab, setTab] = useState<Tab>("raw");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [validOnly, setValidOnly] = useState<boolean>(true);

  const [setKey, setSetKey] = useState<LuSet>("residential");
  const activeSetOptions = useMemo(() => setCodes(setKey), [setKey]);

  // Fetch rows (by active land-use set)
  const {
    data: raw,
    isLoading,
    error,
  } = useRatiosFeatures({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    as_of_date: asOfDate || undefined,
    valid_only: validOnly,
    land_uses: activeSetOptions,
  });

  const rows = useMemo(
    () =>
      (raw ?? []).map((r) => ({
        ...r,
        sale_year: getSaleYear(r.sale_date),
      })),
    [raw]
  ) as RawRow[];

  const exportRawCsv = () => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0] ?? {});
    const rowsOut = rows.map((r) => {
      const out: Record<string, any> = {};
      for (const key of headers) (out as any)[key] = (r as any)[key];
      return out;
    });
    downloadCsv(`raw_sales.csv`, toCsv(rowsOut, headers));
  };

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col">
      {/* === TOP BAR: Set + Tab + View Mode === */}
      <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between gap-3 p-3">
          {/* Land-use set */}
          <div className="inline-flex rounded border p-1">
            {(["residential", "other", "lots"] as LuSet[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSetKey(k)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  setKey === k ? "bg-gray-900 text-white" : ""
                }`}
              >
                {k === "residential"
                  ? "Residential"
                  : k === "other"
                    ? "Other"
                    : "Lots"}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="inline-flex rounded border p-1">
            {[
              { id: "raw", label: "Sales" },
              { id: "multi", label: "Multi-Parcel Sales" },
              { id: "sale_price", label: "Sale Summaries" },
              { id: "ratio", label: "Ratio Summaries" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as Tab)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  tab === (t.id as Tab) ? "bg-gray-900 text-white" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="inline-flex rounded border p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                viewMode === "table" ? "bg-gray-900 text-white" : ""
              }`}
              title={tab === "raw" ? "Raw sales table" : "Show stats table"}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                viewMode === "cards" ? "bg-gray-900 text-white" : ""
              }`}
              title={
                tab === "raw" ? "Raw sales cards" : "Show cards with histograms"
              }
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* === BODY: Sidebar (left) + Scrollable content (right) === */}
      <div className="grid flex-1 min-h-0 gap-4 p-4 lg:grid-cols-[320px,1fr]">
        {/* LEFT SIDEBAR: global filters */}
        <aside className="min-h-0 overflow-auto pr-1 space-y-4">
          <div className="rounded border p-3 space-y-3">
            <div className="text-xs font-semibold text-gray-600">Filters</div>

            <div className="space-y-1">
              <label className="text-xs block">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs block">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs block">As-of date</label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={validOnly}
                onChange={(e) => setValidOnly(e.target.checked)}
              />
              Valid only
            </label>

            {tab === "raw" && (
              <button
                type="button"
                onClick={exportRawCsv}
                className="w-full px-3 py-1.5 text-sm rounded border"
              >
                Export CSV
              </button>
            )}
          </div>

          {/* Optional fetch error display in sidebar */}
          {error && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900 p-3 text-sm">
              {String(error)}
            </div>
          )}
        </aside>

        {/* RIGHT: scrollable content area */}
        <section className="min-h-0 overflow-hidden">
          <div className="h-full min-h-0 max-h-[80vh] overflow-auto">
            {tab === "multi" ? (
              <MultiParcelSalesCards
                start_date={startDate || undefined}
                end_date={endDate || undefined}
                land_uses={activeSetOptions}
                valid_only={validOnly}
              />
            ) : tab === "raw" ? (
              <div className="space-y-2">
                {!validOnly && (
                  <div className="text-sm px-3 py-2 rounded border border-yellow-300 bg-yellow-50 text-yellow-900">
                    Warning: <span className="font-medium">Valid only</span> is
                    off. Results may include outliers or invalid sales.
                  </div>
                )}
                {/* RawSalesView renders its own pagination controls.
                    Make its header sticky (see note below). */}
                <RawSalesView
                  rows={rows}
                  viewMode={viewMode}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            ) : tab === "sale_price" ? (
              <SaleSummaries
                rows={rows}
                setOptions={activeSetOptions}
                validOnly={validOnly}
                viewMode={viewMode}
              />
            ) : (
              <RatioSummaries
                rows={rows}
                setOptions={activeSetOptions}
                validOnly={validOnly}
                viewMode={viewMode}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
