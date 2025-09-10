import { useMemo, useState, useEffect } from "react";
import { type RatiosFeaturesRow } from "@/lib/client-queries";
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
// RawSalesView with client-side pagination
// =======================================================

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

export default function RawSalesView({ rows, viewMode }: RawViewProps) {
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
