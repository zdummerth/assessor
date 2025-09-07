// app/test/ratios/_components/client-ratios-explorer.tsx
"use client";

import { useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import { useRatiosRaw, RatioRow } from "@/lib/client-queries";
import { useLandUseOptions } from "@/lib/client-queries";
import MultiSelectAutocomplete from "@/components/inputs/multi-select-autocomplete";

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

type StatsRow = {
  group_values: Record<string, string | number | null>;
  median_ratio: number | null;
  min_ratio: number | null;
  max_ratio: number | null;
  avg_ratio: number | null;
  n: number;
  raw_data?: RatioRow[];
  ratios?: number[]; // trimmed ratios for this group (for per-group histograms)
};

type SortKey =
  | "median_ratio"
  | "min_ratio"
  | "max_ratio"
  | "avg_ratio"
  | "n"
  | `group:${string}`; // e.g., 'group:district'

// ----- Small helpers -----
function toCsv(rows: Record<string, any>[], headerOrder?: string[]): string {
  if (!rows?.length) return "";
  const headers = headerOrder?.length ? headerOrder : Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return "\uFEFF" + lines.join("\n");
}
function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function percentileCont(sorted: number[], p: number): number | null {
  if (!sorted.length) return null;
  if (p <= 0) return sorted[0];
  if (p >= 1) return sorted[sorted.length - 1];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const frac = idx - lo;
  return sorted[lo] + (sorted[hi] - sorted[lo]) * frac;
}
function trimIQR(values: number[], factor: 1.5 | 3 | null): number[] {
  if (factor == null || !values.length) return [...values];
  const s = [...values].sort((a, b) => a - b);
  const q1 = percentileCont(s, 0.25);
  const q3 = percentileCont(s, 0.75);
  if (q1 == null || q3 == null) return s;
  const iqr = q3 - q1;
  const lo = q1 - factor * iqr;
  const hi = q3 + factor * iqr;
  return s.filter((v) => v >= lo && v <= hi);
}
function getSaleYear(sale_date?: string | null): number | null {
  if (!sale_date) return null;
  const d = new Date(sale_date);
  return Number.isFinite(d.getTime()) ? d.getUTCFullYear() : null;
}
// Bin ratios into width=0.1 buckets
function buildHistogram(
  ratios: number[],
  opts?: { binWidth?: number; min?: number; max?: number }
) {
  const binWidth = opts?.binWidth ?? 0.1;
  if (!ratios.length) return [];
  const minVal = opts?.min ?? Math.min(...ratios);
  const maxVal = opts?.max ?? Math.max(...ratios);
  const start = Math.floor(minVal / binWidth) * binWidth;
  const end = Math.ceil(maxVal / binWidth) * binWidth;

  const bins: { bin: number; count: number }[] = [];
  for (let x = start; x <= end + 1e-9; x = +(x + binWidth).toFixed(10)) {
    bins.push({ bin: +x.toFixed(10), count: 0 });
  }
  for (const r of ratios) {
    if (!Number.isFinite(r)) continue;
    let idx = Math.floor((r - start) / binWidth);
    if (idx < 0) idx = 0;
    if (idx >= bins.length) idx = bins.length - 1;
    bins[idx].count += 1;
  }
  return bins;
}

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

// drop the "use" hook version; use this instead:
function getHistogramChartData(ratios: number[]) {
  const rows = buildHistogram(ratios, { binWidth: 0.1 });
  const data = [
    [
      "Bin (start)",
      "Count",
      { role: "style" },
      { role: "tooltip", type: "string", p: { html: true } },
    ],
    ...rows.map((b) => {
      const next = b.bin + 0.1;
      const mid = b.bin + 0.05;
      const diff = Math.abs(mid - 1);
      const color = diff > 0.3 ? "#fecaca" : diff > 0.1 ? "#fde68a" : "#bbf7d0";
      const tip = `
        <div style="padding:6px 8px">
          <div><b>Bin:</b> ${b.bin.toFixed(1)} – ${next.toFixed(1)}</div>
          <div><b>Count:</b> ${b.count}</div>
        </div>`;
      return [Number(b.bin.toFixed(1)), b.count, color, tip];
    }),
  ];

  let options: any = { legend: "none" };
  if (rows.length) {
    const min = rows[0].bin;
    const max = rows[rows.length - 1].bin + 0.1;
    const ticks: number[] = [];
    for (let x = min; x <= max + 1e-9; x = +(x + 0.1).toFixed(10)) {
      ticks.push(+x.toFixed(1));
    }
    options = {
      legend: "none",
      tooltip: { isHtml: true, trigger: "focus" },
      bar: { groupWidth: "95%" },
      hAxis: { title: "Ratio", ticks, viewWindow: { min, max }, format: "0.0" },
      vAxis: {
        title: "Count",
        viewWindow: { min: 0 },
        gridlines: { color: "#eee" },
      },
      chartArea: { left: 60, right: 20, top: 20, bottom: 50 },
    };
  }
  return { data, options, hasRows: rows.length > 0 };
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
  const [trim, setTrim] = useState<"" | "1.5" | "3">("1.5");
  const [includeRaw, setIncludeRaw] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "charts">("table"); // NEW

  // Sorting (supports dynamic group columns with key: `group:${col}`)
  const [sortKey, setSortKey] = useState<SortKey>("median_ratio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  // Fetch raw rows (server/route applies date defaults and land-use filter)
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

  // Derive sale_year on the client
  const rows = useMemo<RatioRow[]>(
    () =>
      (rawRows ?? []).map((r) => ({
        ...r,
        sale_year: getSaleYear(r.sale_date),
      })),
    [rawRows]
  ) as (RatioRow & { sale_year?: number | null })[];

  // Grouped stats (client-side)
  const stats = useMemo<StatsRow[]>(() => {
    const tf = trim ? (Number(trim) as 1.5 | 3) : null;

    if (!groupBy.length) {
      const ratios = rows
        .map((r) => r?.ratio)
        .filter((x): x is number => Number.isFinite(x));
      const trimmed = trimIQR(ratios, tf);
      const s = [...trimmed].sort((a, b) => a - b);
      const med = percentileCont(s, 0.5);
      const min = s.length ? s[0] : null;
      const max = s.length ? s[s.length - 1] : null;
      const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
      return [
        {
          group_values: {},
          median_ratio: med,
          min_ratio: min,
          max_ratio: max,
          avg_ratio: avg,
          n: s.length,
          raw_data: includeRaw ? rows : undefined,
          ratios: trimmed, // keep for chart
        },
      ];
    }

    const buckets = new Map<string, RatioRow[]>();
    for (const r of rows) {
      const tuple = groupBy.map((col) =>
        col === "sale_year"
          ? ((r as any)?.sale_year ?? null)
          : ((r as any)?.[col] ?? null)
      );
      const key = JSON.stringify(tuple);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(r);
    }

    const out: StatsRow[] = [];
    //@ts-expect-error TS2345`
    for (const [key, bucketRows] of buckets.entries()) {
      const tuple: (string | number | null)[] = JSON.parse(key);
      const gv: Record<string, string | number | null> = {};
      groupBy.forEach((col, i) => {
        gv[col] = tuple[i];
      });

      const ratios = bucketRows
        //@ts-expect-error TS2345
        .map((r) => r?.ratio)
        //@ts-expect-error TS2345
        .filter((x): x is number => Number.isFinite(x));
      const trimmed = trimIQR(ratios, tf);
      const s = [...trimmed].sort((a, b) => a - b);
      const med = percentileCont(s, 0.5);
      const min = s.length ? s[0] : null;
      const max = s.length ? s[s.length - 1] : null;
      const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

      out.push({
        group_values: gv,
        median_ratio: med,
        min_ratio: min,
        max_ratio: max,
        avg_ratio: avg,
        n: s.length,
        raw_data: includeRaw ? bucketRows : undefined,
        ratios: trimmed, // keep for chart
      });
    }

    // Stable order by first group column for readability
    out.sort((a, b) => {
      const first = groupBy[0];
      const av = a.group_values[first];
      const bv = b.group_values[first];
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });

    return out;
  }, [rows, groupBy, trim, includeRaw]);

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

  // Overall histogram (trim-consistent)
  const allRatios = useMemo(() => {
    const vals = rows
      .map((r) => r?.ratio)
      .filter((x): x is number => Number.isFinite(x));
    const tf = trim ? (Number(trim) as 1.5 | 3) : null;
    return trimIQR(vals, tf);
  }, [rows, trim]);

  const overallHist = useMemo(
    () => getHistogramChartData(allRatios),
    [allRatios]
  );

  // CSV exports
  function exportStatsCsv() {
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
  }
  function exportRawCsv() {
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
  }

  // ----- UI -----
  return (
    <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
      {/* Sidebar controls */}
      <aside className="rounded-lg border p-3 h-fit lg:sticky lg:top-4 print:hidden">
        <div className="mb-3">
          <div className="mb-3">
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
          <label className="flex items-center gap-2 mb-2">
            <span className="w-24 text-sm">Start date</span>
            <input
              type="date"
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 mb-2">
            <span className="w-24 text-sm">End date</span>
            <input
              type="date"
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 mb-3">
            <span className="w-24 text-sm">As-of date</span>
            <input
              type="date"
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 mb-3">
            <span className="w-24 text-sm">Trim</span>
            <select
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={trim}
              onChange={(e) => setTrim(e.target.value as "" | "1.5" | "3")}
            >
              <option value="">None</option>
              <option value="1.5">1.5 × IQR</option>
              <option value="3">3 × IQR</option>
            </select>
          </label>

          <div className="mb-3">
            <div className="text-sm mb-1">Group by</div>
            <div className="flex flex-col gap-2">
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

          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md border px-2 py-1 text-xs"
              onClick={resetToResidential}
            >
              Set to Residential
            </button>
          </div>

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={includeRaw}
              onChange={(e) => setIncludeRaw(e.target.checked)}
            />
            <span className="text-sm">Include raw JSON</span>
          </label>

          {/* CSV buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportStatsCsv}
              disabled={!sortedStats.length}
              className={`rounded-md border px-3 py-1.5 text-sm ${sortedStats.length ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
              title="Export grouped medians/min/max/avg"
            >
              Export Stats CSV
            </button>
            <button
              type="button"
              onClick={exportRawCsv}
              disabled={!rows?.length}
              className={`rounded-md border px-3 py-1.5 text-sm ${rows?.length ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
              title="Export raw rows"
            >
              Export Raw CSV
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-2">
            <span
              aria-hidden
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              title="Loading…"
            />
          </div>
        )}
      </aside>

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
                  {/* Dynamic group columns */}
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
                  {/* Metrics */}
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
                {/* Skeleton during loading */}
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
                      {/* Dynamic group cells */}
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

                      {/* Metrics */}
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

                      {/* Raw JSON */}
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
            {/* Overall histogram */}
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

            {/* Per-group histograms */}
            {groupBy.length > 0 && (
              <div className="rounded-md border">
                <div className="px-3 py-2 border-b text-sm font-medium">
                  Histograms by Group ({groupBy.join(", ")})
                </div>

                <div className="p-3 grid gap-4 sm:grid-cols-2">
                  {sortedStats
                    .filter((g) => (g.ratios?.length ?? 0) > 0) // avoid header-only datasets
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

        {/* Error display */}
        {error && (
          <div className="mt-3 p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
            Error loading data. Adjust filters.
          </div>
        )}
      </section>
    </div>
  );
}
