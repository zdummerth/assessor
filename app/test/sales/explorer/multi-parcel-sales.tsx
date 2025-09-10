"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useMultiParcelSales,
  type MultiParcelSaleRow,
} from "@/lib/client-queries";

// ---------- small format helpers ----------
const isNum = (x: any): x is number =>
  typeof x === "number" && Number.isFinite(x);
const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString() : "—";
const fmtMoney = (n: any) =>
  isNum(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";
const fmtCurrency2 = (n: any) =>
  isNum(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n)
    : "—";
const fmtInt = (n: any) => (isNum(n) ? Math.trunc(n).toLocaleString() : "—");
const fmtFloat = (n: any, d = 3) => (isNum(n) ? n.toFixed(d) : "—");
const fmtYesNo = (b: boolean | null | undefined) =>
  b == null ? "—" : b ? "Valid" : "Invalid";

// ---------- sorting + pagination ----------
type SortDir = "asc" | "desc";

type SortKey =
  | "sale_date"
  | "sale_price"
  | "parcel_count"
  | "structure_count"
  | "total_units"
  | "total_finished_area"
  | "total_unfinished_area"
  | "land_area_total"
  | "land_to_building_area_ratio"
  | "price_per_sqft_building_total"
  | "price_per_sqft_finished"
  | "price_per_sqft_land"
  | "price_per_unit";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "sale_date", label: "Sale Date" },
  { key: "sale_price", label: "Sale Price" },
  { key: "parcel_count", label: "Parcels" },
  { key: "structure_count", label: "Structures" },
  { key: "total_units", label: "Units" },
  { key: "total_finished_area", label: "Finished Area" },
  { key: "total_unfinished_area", label: "Unfinished Area" },
  { key: "land_area_total", label: "Land Area" },
  { key: "land_to_building_area_ratio", label: "Land/Building Area" },
  { key: "price_per_sqft_building_total", label: "PPSF (Total)" },
  { key: "price_per_sqft_finished", label: "PPSF (Finished)" },
  { key: "price_per_sqft_land", label: "PPSF (Land, no structures)" },
  { key: "price_per_unit", label: "Price/Unit" },
];

const PAGE_SIZES = [10, 25, 50, 100, 250];

function cmp(a: any, b: any) {
  const an = a == null;
  const bn = b == null;
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;

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

// =======================================================
// MultiParcelSalesCards (card-only view using useMultiParcelSales)
// =======================================================

export default function MultiParcelSalesCards(props?: {
  start_date?: string;
  end_date?: string;
  land_uses?: string[];
  valid_only?: boolean;
}) {
  const { data, error, isLoading } = useMultiParcelSales(props);

  const [sortKey, setSortKey] = useState<SortKey>("sale_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]); // 25 by default

  // Sort rows (no filtering)
  const sorted = useMemo(() => {
    const arr = [...(data ?? [])];
    arr.sort((a, b) => {
      const v1 = (a as any)[sortKey];
      const v2 = (b as any)[sortKey];
      const base = cmp(v1, v2);
      return sortDir === "asc" ? base : -base;
    });
    return arr;
  }, [data, sortKey, sortDir]);

  // Reset page when sort or dataset changes
  useEffect(() => {
    setPage(1);
  }, [sortKey, sortDir, data?.length]);

  // Compute pagination
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const pageRows = sorted.slice(startIdx, endIdx);

  const showingFrom = totalCount === 0 ? 0 : startIdx + 1;
  const showingTo = endIdx;

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

  return (
    <section className="space-y-3">
      <div>{HeaderBar}</div>

      <div className="flex items-center gap-2 text-sm">
        <label className="text-gray-600">Sort by</label>
        <select
          className="border rounded-md px-2 py-1 bg-white"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((o) => (
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

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="rounded-lg border p-3 bg-white shadow-sm space-y-2 animate-pulse"
            >
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          Failed to load multi-parcel sales. Adjust filters and try again.
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pageRows.map((r) => (
              <SaleCard key={r.sale_id} row={r} />
            ))}
          </div>

          {totalCount === 0 && (
            <div className="text-sm text-gray-500">
              No multi-parcel sales found.
            </div>
          )}
        </>
      )}

      <div>{HeaderBar}</div>
    </section>
  );
}

// ---------- Card renderer ----------
function SaleCard({ row }: { row: MultiParcelSaleRow }) {
  const bldgTotal =
    (row.total_finished_area ?? 0) + (row.total_unfinished_area ?? 0);

  return (
    <div className="rounded-lg border p-3 bg-white shadow-sm space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm text-gray-500">{fmtDate(row.sale_date)}</div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${
            row.is_valid
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
          title="Sale validity (latest sale type)"
        >
          {fmtYesNo(row.is_valid)}
        </span>
      </div>

      <div className="text-base font-semibold">{fmtMoney(row.sale_price)}</div>
      <div className="text-xs text-gray-600">
        Sale #{row.sale_id} • {row.sale_type ?? "—"}
      </div>

      {/* Quick metrics chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Chip label="Parcels" value={fmtInt(row.parcel_count)} />
        <Chip label="Structures" value={fmtInt(row.structure_count)} />
        <Chip label="Units" value={fmtInt(row.total_units)} />
        <Chip label="Finished" value={fmtInt(row.total_finished_area)} />
        <Chip label="Unfinished" value={fmtInt(row.total_unfinished_area)} />
        <Chip label="Land (sf)" value={fmtInt(row.land_area_total)} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <L label="Avg Yr Built" v={fmtInt(row.avg_year_built)} />
        <R
          label="Avg Cond"
          v={isNum(row.avg_condition) ? row.avg_condition.toFixed(1) : "—"}
        />

        <L
          label="Land/Building Area"
          v={fmtFloat(row.land_to_building_area_ratio, 3)}
        />
        <R label="Price/Unit" v={fmtCurrency2(row.price_per_unit)} />

        <L
          label="PPSF (Total)"
          v={fmtCurrency2(row.price_per_sqft_building_total)}
        />
        <R
          label="PPSF (Finished)"
          v={fmtCurrency2(row.price_per_sqft_finished)}
        />

        <L label="PPSF (Land)" v={fmtCurrency2(row.price_per_sqft_land)} />
        <R label="Bldg Area (Total)" v={fmtInt(bldgTotal)} />
      </div>

      {/* Parcel list (compact) */}
      <div className="mt-2">
        <div className="text-xs text-gray-600 mb-1">Parcels in sale</div>
        <div className="space-y-1">
          {(row.parcels ?? []).slice(0, 4).map((p, idx) => (
            <div
              key={`${row.sale_id}-${p.parcel_id}-${idx}`}
              className="text-xs flex justify-between gap-2"
            >
              <div className="truncate">
                <span className="text-gray-500 mr-1">#{p.parcel_id}</span>
                <span>
                  {[p.house_number, p.street].filter(Boolean).join(" ") || "—"}
                </span>
              </div>
              <div className="text-right text-gray-600 shrink-0">
                {p.land_use_sale ?? "—"}
              </div>
            </div>
          ))}
          {row.parcels && row.parcels.length > 4 && (
            <div className="text-xs text-gray-500">
              …and {row.parcels.length - 4} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// tiny label/value helpers
function L({ label, v }: { label: string; v: any }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="text-right">{v}</div>
    </>
  );
}
function R({ label, v }: { label: string; v: any }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="text-right">{v}</div>
    </>
  );
}
function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
