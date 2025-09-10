import { useMemo, useState, useEffect } from "react";
import {
  ViewMode,
  SortDir,
  isNum,
  fmtMoney,
  fmtDate,
  fmtRatio,
  RawRow,
} from "./page";

// =======================================================
// RawSalesView with all DB columns + client-side pagination
// =======================================================

type RawViewProps = {
  rows: RawRow[];
  viewMode: ViewMode; // "table" | "cards"
};

// Add sort keys for new numeric fields you care about
type RawSortKey =
  | "sale_id"
  | "parcel_id"
  | "sale_date"
  | "sale_price"
  | "ratio"
  | "district"
  | "land_use"
  | "avg_year_built"
  | "avg_condition"
  | "postcode"
  | "value_year"
  | "structure_count"
  | "total_finished_area"
  | "total_unfinished_area"
  | "land_area"
  | "land_to_building_area_ratio"
  | "price_per_sqft_building_total"
  | "price_per_sqft_finished";

const RAW_SORT_OPTIONS: { key: RawSortKey; label: string }[] = [
  { key: "sale_date", label: "Sale Date" },
  { key: "sale_price", label: "Sale Price" },
  { key: "ratio", label: "Ratio" },
  { key: "land_area", label: "Land Area" },
  { key: "price_per_sqft_building_total", label: "PPSF (Total)" },
  { key: "price_per_sqft_finished", label: "PPSF (Finished)" },
  { key: "land_to_building_area_ratio", label: "Land/Building Area" },
  { key: "avg_year_built", label: "Avg Year Built" },
  { key: "avg_condition", label: "Avg Condition" },
  { key: "structure_count", label: "Structures" },
  { key: "total_finished_area", label: "Finished Area" },
  { key: "total_unfinished_area", label: "Unfinished Area" },
  { key: "district", label: "District" },
  { key: "land_use", label: "Land Use" },
  { key: "postcode", label: "Postcode" },
  { key: "sale_id", label: "Sale ID" },
  { key: "parcel_id", label: "Parcel ID" },
  { key: "value_year", label: "Value Year" },
];

const SORTABLE_KEYS = new Set<RawSortKey>(RAW_SORT_OPTIONS.map((o) => o.key));
const PAGE_SIZES = [10, 25, 50, 100, 250];

function cmp(a: any, b: any) {
  const an = a === null || a === undefined;
  const bn = b === null || b === undefined;
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;

  // attempt date compare first
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

// ---------- format helpers specific to extra columns ----------
const fmtYesNo = (b: boolean | null | undefined) =>
  b === null || b === undefined ? "—" : b ? "Valid" : "Invalid";

const fmtInt = (n: any) => (isNum(n) ? Math.trunc(n).toLocaleString() : "—");
const fmtFloat = (n: any, d = 2) => (isNum(n) ? n.toFixed(d) : "—");
const fmtCurrency2 = (n: any) =>
  isNum(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n)
    : "—";
const fmtLatLon = (n: any) => (isNum(n) ? n.toFixed(6) : "—");
const fmtDateTime = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleString() : "—";

// ---------- column model ----------
type AnyRow = RawRow & Record<string, any>;
type ColDef = {
  key:
    | "sale_id"
    | "sale_date"
    | "sale_price"
    | "sale_type"
    | "is_valid"
    | "parcel_id"
    | "value_row_id"
    | "value_year"
    | "date_of_assessment"
    | "current_value"
    | "ratio"
    | "land_use_sale"
    | "land_use_asof"
    | "block"
    | "lot"
    | "ext"
    | "structure_count"
    | "total_finished_area"
    | "total_unfinished_area"
    | "avg_year_built"
    | "avg_condition"
    | "land_area"
    | "land_to_building_area_ratio"
    | "price_per_sqft_building_total"
    | "price_per_sqft_finished"
    | "land_use"
    | "total_units"
    | "price_per_unit"
    | "lat"
    | "lon"
    | "district"
    | "house_number"
    | "street"
    | "postcode";
  label: string;
  align?: "left" | "right";
  // custom formatter (value, row) -> string | JSX
  fmt?: (v: any, row: AnyRow) => any;
};

const DB_COLUMNS: ColDef[] = [
  { key: "sale_id", label: "Sale ID", align: "right" },
  { key: "sale_date", label: "Sale Date", fmt: (v) => fmtDate(v) },
  {
    key: "sale_price",
    label: "Sale Price",
    align: "right",
    fmt: (v) => fmtMoney(v),
  },
  { key: "sale_type", label: "Sale Type" },
  { key: "is_valid", label: "Validity", fmt: (v) => fmtYesNo(v) },
  { key: "parcel_id", label: "Parcel ID", align: "right" },
  { key: "value_year", label: "Value Year", align: "right" },

  {
    key: "current_value",
    label: "Current Value",
    align: "right",
    fmt: (v) => fmtMoney(v),
  },
  { key: "ratio", label: "Ratio", align: "right", fmt: (v) => fmtRatio(v) },

  { key: "land_use_sale", label: "Land Use (Sale)" },
  { key: "land_use_asof", label: "Land Use (As-Of)" },

  { key: "structure_count", label: "Structures", align: "right", fmt: fmtInt },
  {
    key: "total_finished_area",
    label: "Finished Area",
    align: "right",
    fmt: fmtInt,
  },
  {
    key: "total_unfinished_area",
    label: "Unfinished Area",
    align: "right",
    fmt: fmtInt,
  },
  {
    key: "avg_year_built",
    label: "Avg Year Built",
    align: "right",
  },
  {
    key: "avg_condition",
    label: "Avg Condition",
    align: "right",
    fmt: (v) => (isNum(v) ? v.toFixed(1) : "—"),
  },
  {
    key: "total_units",
    label: "Total Units",
    align: "right",
    fmt: fmtInt,
  },
  {
    key: "price_per_unit",
    label: "Price/Unit",
    align: "right",
  },

  { key: "land_area", label: "Land Area", align: "right", fmt: fmtInt },
  {
    key: "land_to_building_area_ratio",
    label: "Land/Building Area",
    align: "right",
    fmt: (v) => fmtFloat(v, 3),
  },
  {
    key: "price_per_sqft_building_total",
    label: "PPSF (Total)",
    align: "right",
    fmt: (v) => fmtCurrency2(v),
  },
  {
    key: "price_per_sqft_finished",
    label: "PPSF (Finished)",
    align: "right",
    fmt: (v) => fmtCurrency2(v),
  },

  { key: "land_use", label: "Land Use" },
  { key: "district", label: "District" },
  { key: "house_number", label: "House #" },
  { key: "street", label: "Street" },
  { key: "postcode", label: "Postcode" },
];

const PAGE_SIZES_DEFAULT = PAGE_SIZES[0]; // 10

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
      className={`px-3 py-2 text-${align} border-b ${
        onClick ? "cursor-pointer whitespace-nowrap" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </th>
  );
}

export default function RawSalesView({ rows, viewMode }: RawViewProps) {
  const [sortKey, setSortKey] = useState<RawSortKey>("sale_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);

  // Sort rows (no filtering)
  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((r1, r2) => {
      const v1 = (r1 as any)[sortKey];
      const v2 = (r2 as any)[sortKey];
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
    if (!SORTABLE_KEYS.has(k)) return;
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir(k === "sale_date" ? "desc" : "asc");
    }
  };

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

  // ===== TABLE VIEW (all DB columns) =====
  if (viewMode === "table") {
    return (
      <div className="rounded-md border">
        <div className="px-3 py-2 border-b text-sm font-medium">
          Raw Sales (table)
        </div>
        <div className="px-3 py-2">{HeaderBar}</div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {DB_COLUMNS.map((col) => (
                  <Th
                    key={col.key}
                    align={col.align ?? "left"}
                    onClick={
                      SORTABLE_KEYS.has(col.key as RawSortKey)
                        ? () => toggleSort(col.key as RawSortKey)
                        : undefined
                    }
                    label={
                      SORTABLE_KEYS.has(col.key as RawSortKey)
                        ? `${col.label}${indicator(col.key as RawSortKey)}`
                        : col.label
                    }
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr
                  key={`${r.sale_id}-${i}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  {DB_COLUMNS.map((col) => {
                    const raw = (r as AnyRow)[col.key];
                    const content = col.fmt
                      ? col.fmt(raw, r as AnyRow)
                      : (raw ?? "—");
                    const cls =
                      "px-3 py-2 " +
                      (col.align === "right" ? "text-right" : "");
                    return (
                      <td key={`${col.key}-${i}`} className={cls}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {totalCount === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-sm text-gray-500"
                    colSpan={DB_COLUMNS.length}
                  >
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

  // ===== CARD VIEW (all DB columns) =====
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

      <div className="grid gap-3 sm:grid-cols-2">
        {pageRows.map((r, i) => (
          <div
            key={`${r.sale_id}-${i}`}
            className="rounded-lg border p-3 bg-white shadow-sm space-y-2"
          >
            <div className="text-sm text-gray-500">
              {fmtDate((r as AnyRow).sale_date)}
            </div>
            <div className="text-base font-semibold">
              {fmtMoney((r as AnyRow).sale_price)}
            </div>
            <div className="text-sm">
              Ratio:{" "}
              <span className="font-medium">{fmtRatio(Number(r.ratio))}</span>
            </div>

            {/* All DB fields in a tidy grid */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs">
              {DB_COLUMNS.map((col) => {
                const raw = (r as AnyRow)[col.key];
                const value = col.fmt
                  ? col.fmt(raw, r as AnyRow)
                  : (raw ?? "—");
                return (
                  <div key={`${col.key}-${i}`} className="flex justify-between">
                    <div className="text-gray-500">{col.label}</div>
                    <div className={col.align === "right" ? "text-right" : ""}>
                      {value}
                    </div>
                  </div>
                );
              })}
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
