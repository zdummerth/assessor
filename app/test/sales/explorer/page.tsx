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
type Tab = "sale_price" | "ratio" | "raw"; // NEW
type SortDir = "asc" | "desc";
type SortKey = "median" | "avg" | "min" | "max" | "count" | `group:${string}`;
type ViewMode = "table" | "cards";

// ---- helpers ----
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
const isNum = (x: any): x is number =>
  typeof x === "number" && Number.isFinite(x);
const fmtMoney = (n: number | null) =>
  isNum(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";
const fmtRatio = (n: number | null) => (isNum(n) ? n.toFixed(3) : "—");
const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

// =======================================================
// RawSalesView with client-side pagination
// =======================================================
type RawRow = RatiosFeaturesRow & { sale_year?: number | null };

type RawViewProps = {
  rows: RawRow[];
  viewMode: ViewMode; // "table" | "cards"
};

type RawSortKey =
  | "sale_date"
  | "sale_price"
  | "ratio"
  | "district"
  | "land_use"
  | "avg_year_built"
  | "avg_condition"
  | "postcode";

const RAW_SORT_OPTIONS: { key: RawSortKey; label: string }[] = [
  { key: "sale_date", label: "Sale Date" },
  { key: "sale_price", label: "Sale Price" },
  { key: "ratio", label: "Ratio" },
  { key: "district", label: "District" },
  { key: "land_use", label: "Land Use" },
  { key: "avg_year_built", label: "Avg Year Built" },
  { key: "avg_condition", label: "Avg Condition" },
  { key: "postcode", label: "Postcode" },
];

const PAGE_SIZES = [25, 50, 100, 250];

function cmp(a: any, b: any) {
  const an = a === null || a === undefined;
  const bn = b === null || b === undefined;
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;

  // Dates come in as strings; try Date compare when key is sale_date
  // (Caller passes raw strings like "2024-05-01")
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (!Number.isNaN(da) && !Number.isNaN(db)) return da - db;

  const as = String(a).toLowerCase();
  const bs = String(b).toLowerCase();
  return as < bs ? -1 : as > bs ? 1 : 0;
}

function PaginationControls({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
  totalCount,
  showingFrom,
  showingTo,
}: {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (n: number) => void;
  totalCount: number;
  showingFrom: number;
  showingTo: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="text-gray-600">
        Showing{" "}
        <span className="font-medium">{showingFrom.toLocaleString()}</span>–
        <span className="font-medium">{showingTo.toLocaleString()}</span> of{" "}
        <span className="font-medium">{totalCount.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-gray-600">Rows per page</label>
        <select
          className="border rounded-md px-2 py-1 bg-white"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="inline-flex border rounded-md overflow-hidden">
          <button
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            «
          </button>
          <button
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          <div className="px-3 py-1 bg-white select-none">
            {page} / {totalPages}
          </div>
          <button
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            ›
          </button>
          <button
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

function RawSalesView({ rows, viewMode }: RawViewProps) {
  const [sortKey, setSortKey] = useState<RawSortKey>("sale_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]); // default 50

  // Sort rows (no filtering)
  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((r1, r2) => {
      const v1 = r1[sortKey as keyof RawRow];
      const v2 = r2[sortKey as keyof RawRow];
      const base = cmp(v1, v2);
      return sortDir === "asc" ? base : -base;
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  // Reset page when sort or dataset changes
  useEffect(() => {
    setPage(1);
  }, [sortKey, sortDir, rows?.length]);

  // Compute pagination
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const pageRows = sorted.slice(startIdx, endIdx);

  const showingFrom = totalCount === 0 ? 0 : startIdx + 1;
  const showingTo = endIdx;

  const indicator = (k: RawSortKey) =>
    sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const toggleSort = (k: RawSortKey) => {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir(k === "sale_date" ? "desc" : "asc");
    }
  };

  // shared header (top controls)
  const HeaderBar = (
    <PaginationControls
      page={clampedPage}
      setPage={setPage}
      totalPages={totalPages}
      pageSize={pageSize}
      setPageSize={(n) => {
        setPageSize(n);
        setPage(1);
      }}
      totalCount={totalCount}
      showingFrom={showingFrom}
      showingTo={showingTo}
    />
  );

  // --- TABLE VIEW ---
  if (viewMode === "table") {
    return (
      <div className="rounded-md border">
        <div className="px-3 py-2 border-b text-sm font-medium">
          Raw Sales (table)
        </div>
        <div className="px-3 py-2">{HeaderBar}</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th
                  onClick={() => toggleSort("sale_date")}
                  label={`Sale Date${indicator("sale_date")}`}
                />
                <Th
                  onClick={() => toggleSort("sale_price")}
                  align="right"
                  label={`Sale Price${indicator("sale_price")}`}
                />
                <Th
                  onClick={() => toggleSort("ratio")}
                  align="right"
                  label={`Ratio${indicator("ratio")}`}
                />
                <Th
                  onClick={() => toggleSort("district")}
                  label={`District${indicator("district")}`}
                />
                <Th
                  onClick={() => toggleSort("land_use")}
                  label={`Land Use${indicator("land_use")}`}
                />
                <Th
                  onClick={() => toggleSort("avg_year_built")}
                  align="right"
                  label={`Avg Yr Built${indicator("avg_year_built")}`}
                />
                <Th
                  onClick={() => toggleSort("avg_condition")}
                  align="right"
                  label={`Avg Cond${indicator("avg_condition")}`}
                />
                <Th
                  onClick={() => toggleSort("postcode")}
                  label={`Postcode${indicator("postcode")}`}
                />
                <th className="px-3 py-2 text-left border-b">Address</th>
                <th className="px-3 py-2 text-left border-b">Block•Lot•Ext</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr
                  key={`${r.sale_id}-${i}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <td className="px-3 py-2">{fmtDate(r.sale_date)}</td>
                  <td className="px-3 py-2 text-right">
                    {fmtMoney(r.sale_price)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {fmtRatio(r.ratio as any)}
                  </td>
                  <td className="px-3 py-2">{r.district ?? "—"}</td>
                  <td className="px-3 py-2">{r.land_use ?? "—"}</td>
                  <td className="px-3 py-2 text-right">
                    {r.avg_year_built ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {isNum(r.avg_condition) ? r.avg_condition.toFixed(1) : "—"}
                  </td>
                  <td className="px-3 py-2">{r.postcode ?? "—"}</td>
                  <td className="px-3 py-2">
                    {[r.house_number, r.street].filter(Boolean).join(" ") ||
                      "—"}
                  </td>
                  <td className="px-3 py-2">
                    {[
                      r.block ?? "—",
                      r.lot ?? "—",
                      r.ext ?? (r.ext === 0 ? 0 : "—"),
                    ].join("•")}
                  </td>
                </tr>
              ))}
              {totalCount === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={10}>
                    No rows to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-3 py-2 border-t">{HeaderBar}</div>
      </div>
    );
  }

  // --- CARD VIEW ---
  return (
    <div className="space-y-3">
      <div>{HeaderBar}</div>

      <div className="flex items-center gap-2 text-sm">
        <label className="text-gray-600">Sort by</label>
        <select
          className="border rounded-md px-2 py-1 bg-white"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as RawSortKey)}
        >
          {RAW_SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="px-2 py-1 border rounded-md bg-white"
          title="Toggle sort direction"
        >
          {sortDir === "asc" ? "Asc ▲" : "Desc ▼"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pageRows.map((r, i) => (
          <div
            key={`${r.sale_id}-${i}`}
            className="rounded-lg border p-3 bg-white shadow-sm space-y-2"
          >
            <div className="text-sm text-gray-500">{fmtDate(r.sale_date)}</div>
            <div className="text-base font-semibold">
              {fmtMoney(r.sale_price)}
            </div>
            <div className="text-sm">
              Ratio:{" "}
              <span className="font-medium">{fmtRatio(r.ratio as any)}</span>
            </div>

            <div className="text-sm text-gray-700">
              {[r.house_number, r.street].filter(Boolean).join(" ") || "—"}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="text-gray-500">District</div>
              <div className="text-right">{r.district ?? "—"}</div>
              <div className="text-gray-500">Land Use</div>
              <div className="text-right">{r.land_use ?? "—"}</div>
              <div className="text-gray-500">Avg Yr Built</div>
              <div className="text-right">{r.avg_year_built ?? "—"}</div>
              <div className="text-gray-500">Avg Cond</div>
              <div className="text-right">
                {isNum(r.avg_condition) ? r.avg_condition.toFixed(1) : "—"}
              </div>
              <div className="text-gray-500">Postcode</div>
              <div className="text-right">{r.postcode ?? "—"}</div>
              <div className="text-gray-500">Block•Lot•Ext</div>
              <div className="text-right">
                {[
                  r.block ?? "—",
                  r.lot ?? "—",
                  r.ext ?? (r.ext === 0 ? 0 : "—"),
                ].join("•")}
              </div>
            </div>
          </div>
        ))}
        {totalCount === 0 && (
          <div className="text-sm text-gray-500">No rows to display.</div>
        )}
      </div>

      <div>{HeaderBar}</div>
    </div>
  );
}

function Th({
  label,
  onClick,
  align = "left",
}: {
  label: string;
  onClick?: () => void;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-3 py-2 text-${align} border-b ${onClick ? "cursor-pointer whitespace-nowrap" : ""}`}
      onClick={onClick}
    >
      {label}
    </th>
  );
}

// =======================================================
// Main component (adds "Raw Sales" tab and uses RawSalesView)
// =======================================================
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

  const [tab, setTab] = useState<Tab>("sale_price");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Sorting state for grouped stats
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

  function toggleGroup(key: string) {
    setGroupBy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }
  function resetToResidential() {
    setSelectedLandUses(RESIDENTIAL_LU_DEFAULTS);
    setTrim("1.5");
  }

  // Land uses
  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();

  // Data fetch
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

  // Derive sale_year
  const rows = useMemo(
    () =>
      (rawRows ?? []).map((r) => ({
        ...r,
        sale_year: getSaleYear(r.sale_date),
      })),
    [rawRows]
  ) as RawRow[];

  // Grouped stats
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

  useEffect(() => {
    if (groupBy.length === 0 && String(sortKey).startsWith("group:")) {
      setSortKey("median");
      setSortDir("asc");
    }
  }, [groupBy, sortKey]);

  const label =
    tab === "sale_price"
      ? "Sale Price"
      : tab === "ratio"
        ? "Ratio"
        : "Raw Sales";

  // Exporters
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
    downloadCsv(`${tab}_grouped_stats.csv`, toCsv(rowsOut, headers));
  };

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

  const formatCell =
    tab === "sale_price"
      ? (n: number | null) => fmtMoney(n)
      : (n: number | null) => fmtRatio(n);

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
        includeRaw={tab === "raw"} // harmless; keeps existing prop usage
        setIncludeRaw={(val: boolean) => setTab(val ? "raw" : "sale_price")}
        resetToResidential={resetToResidential}
        onExportStats={tab === "raw" ? exportRawCsv : exportCurrentCsv}
        onExportRaw={exportRawCsv}
      />

      {/* Main */}
      <section className="min-w-0 space-y-4">
        {/* Tabs + View toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-gray-600">
            {tab !== "raw"
              ? groupBy.length
                ? `Grouped by: ${groupBy.join(", ")}${trim ? ` • Trim ${trim}× IQR` : ""}`
                : `Overall${trim ? ` • Trim ${trim}× IQR` : ""}`
              : "Unaggregated sales (no filtering here)"}
          </div>

          <div className="flex items-center gap-2">
            {/* Value Tabs */}
            <div className="inline-flex rounded-lg border p-1 bg-white">
              <button
                type="button"
                onClick={() => setTab("sale_price")}
                className={`px-3 py-1.5 text-sm rounded-md ${tab === "sale_price" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
              >
                Sale Prices
              </button>
              <button
                type="button"
                onClick={() => setTab("ratio")}
                className={`px-3 py-1.5 text-sm rounded-md ${tab === "ratio" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
              >
                Ratios
              </button>
              <button
                type="button"
                onClick={() => setTab("raw")}
                className={`px-3 py-1.5 text-sm rounded-md ${tab === "raw" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
              >
                Raw Sales
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border p-1 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-sm rounded-md ${viewMode === "table" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
                title={tab === "raw" ? "Raw sales table" : "Show stats table"}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 text-sm rounded-md ${viewMode === "cards" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
                title={
                  tab === "raw"
                    ? "Raw sales cards"
                    : "Show cards with histograms"
                }
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* ===== MAIN BODY ===== */}
        {tab === "raw" ? (
          <RawSalesView rows={rows} viewMode={viewMode} />
        ) : viewMode === "table" ? (
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
                    sortGroupSummaries(activeGroups, sortKey, sortDir).map(
                      (g, i) => (
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
                      )
                    )}

                  {!loading && activeGroups.length === 0 && (
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
        ) : (
          // ===== CARD VIEW (stats + histogram) =====
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
                      {Array.from({ length: 6 }).map((__, j) => (
                        <div key={j} className="h-3 bg-gray-200 rounded" />
                      ))}
                    </div>
                    <div className="h-36 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && activeGroups.length === 0 && (
              <div className="text-sm text-gray-500">No results</div>
            )}

            {!loading && activeGroups.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {sortGroupSummaries(activeGroups, sortKey, sortDir).map(
                  (g, i) => {
                    const vals = (g as any).values as number[] | undefined;
                    const chartData = [["x"], ...(vals ?? []).map((v) => [v])];
                    const title =
                      groupBy.length === 0
                        ? "Overall"
                        : groupBy
                            .map(
                              (col) => `${col}: ${g.group_values[col] ?? "—"}`
                            )
                            .join(" • ");

                    return (
                      <div
                        key={`card-${i}`}
                        className="rounded-lg border p-3 shadow-sm bg-white"
                      >
                        <div className="mb-2 text-sm font-medium">{title}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="text-gray-500">Median</div>
                          <div className="text-right">
                            {tab === "sale_price"
                              ? fmtMoney(g.median)
                              : fmtRatio(g.median)}
                          </div>
                          <div className="text-gray-500">Average</div>
                          <div className="text-right">
                            {tab === "sale_price"
                              ? fmtMoney(g.avg)
                              : fmtRatio(g.avg)}
                          </div>
                          <div className="text-gray-500">Min</div>
                          <div className="text-right">
                            {tab === "sale_price"
                              ? fmtMoney(g.min)
                              : fmtRatio(g.min)}
                          </div>
                          <div className="text-gray-500">Max</div>
                          <div className="text-right">
                            {tab === "sale_price"
                              ? fmtMoney(g.max)
                              : fmtRatio(g.max)}
                          </div>
                          <div className="text-gray-500">Count</div>
                          <div className="text-right">{g.count}</div>
                        </div>

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
                                      chartArea: {
                                        width: "85%",
                                        height: "70%",
                                      },
                                    }
                                  : {
                                      legend: { position: "none" as const },
                                      hAxis: {
                                        title: "Sale Price (USD)",
                                        format: "short",
                                      },
                                      vAxis: { title: "Frequency" },
                                      chartArea: {
                                        width: "85%",
                                        height: "70%",
                                      },
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
                  }
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
