"use client";

import { useMemo, useState } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";
import { haversineMiles } from "@/lib/gower";

// ---------- Types ----------
type SubjectFeatures = {
  parcel_id: number;
  land_use: string | null;
  district: string | null;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_condition: number | null;
  lat: number | null;
  lon: number | null;
  house_number: string | null;
  street: string | null;
};

const keyOf = (r: Partial<RatiosFeaturesRow>) =>
  `${String(r.sale_id ?? "")}:${String(r.parcel_id ?? "")}`;

export default function ManualComps({ subject }: { subject: SubjectFeatures }) {
  // Search + selection
  const [q, setQ] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Fetch ALL (valid + invalid); no date filters here
  const { data, isLoading, error } = useRatiosFeatures({ valid_only: false });

  // Candidate pool (exclude the subject parcel)
  const candidates = useMemo(() => {
    if (!data) return [] as RatiosFeaturesRow[];
    return data.filter((r) => r.parcel_id !== subject.parcel_id);
  }, [data, subject.parcel_id]);

  // Attach miles, then search + sort by miles asc (nulls last)
  const enriched = useMemo(() => {
    const sLat = subject.lat;
    const sLon = subject.lon;
    const list = candidates.map((item) => {
      const miles = haversineMiles(
        sLat,
        sLon,
        (item as any).lat,
        (item as any).lon
      );
      return { item, miles };
    });
    const term = q.trim().toLowerCase();
    const filtered = !term
      ? list
      : list.filter(({ item: r }) =>
          [
            r.parcel_id,
            `${r.house_number ?? ""} ${r.street ?? ""}`,
            r.district,
            r.land_use,
            r.sale_date,
          ]
            .map((v) => String(v ?? "").toLowerCase())
            .some((s) => s.includes(term))
        );
    filtered.sort((a, b) => {
      const am = a.miles,
        bm = b.miles;
      if (am == null && bm == null) return 0;
      if (am == null) return 1;
      if (bm == null) return -1;
      return am - bm;
    });
    return filtered.slice(0, 3); // cap at 500 results
  }, [candidates, q, subject.lat, subject.lon]);

  // Selected comps (keep same miles + sort by miles asc)
  const selectedRows = useMemo(() => {
    if (!selected.size)
      return [] as Array<{ item: RatiosFeaturesRow; miles: number | null }>;
    return enriched
      .filter(({ item }) => selected.has(keyOf(item)))
      .sort((a, b) => {
        const am = a.miles,
          bm = b.miles;
        if (am == null && bm == null) return 0;
        if (am == null) return 1;
        if (bm == null) return -1;
        return am - bm;
      });
  }, [enriched, selected]);

  // Selection helpers
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAllFiltered = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      enriched.forEach(({ item }) => next.add(keyOf(item)));
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  // ---------- UI ----------
  return (
    <div className="space-y-4">
      {/* Search + actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full"
            placeholder="Search candidates by parcel, address, district, land use, or sale date…"
          />
          <div className="text-xs text-gray-500 mt-1">
            {isLoading
              ? "Loading…"
              : `Showing ${enriched.length} of ${candidates.length} candidates`}
            {error ? " • Error loading data" : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAllFiltered}
            className="border rounded px-3 py-2 text-sm"
            disabled={!enriched.length}
          >
            Select all filtered
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="border rounded px-3 py-2 text-sm"
            disabled={!selected.size}
          >
            Clear selection
          </button>
        </div>
      </div>

      {/* Search results (pick comps) */}
      <div className="border rounded-md overflow-x-auto bg-white">
        <div className="px-3 py-2 border-b text-sm font-medium">
          Candidates (click checkboxes to select) • Selected: {selected.size}
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th className="w-12">Pick</Th>
              <Th>Parcel</Th>
              <Th>Address</Th>
              <Th>Miles</Th>
              <Th>Sale Date</Th>
              <Th className="text-right">Sale Price</Th>
              <Th className="text-right">Avg Cond</Th>
              <Th>Land Use</Th>
              <Th>District</Th>
              <Th className="text-right">Finished</Th>
              <Th className="text-right">Unfinished</Th>
              <Th className="text-center">Valid</Th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(({ item, miles }, i) => {
              const id = keyOf(item);
              const checked = selected.has(id);
              return (
                <tr key={id} className={i % 2 ? "bg-white" : "bg-gray-50"}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(id)}
                      aria-label={`Select parcel ${String(item.parcel_id)}`}
                    />
                  </Td>
                  <Td>{String(item.parcel_id ?? "—")}</Td>
                  <Td>
                    {`${item.house_number ?? ""} ${item.street ?? ""}`.trim() ||
                      "—"}
                  </Td>
                  <Td>{miles == null ? "—" : miles.toFixed(2)}</Td>
                  <Td>{String(item.sale_date ?? "—")}</Td>
                  <Td className="text-right">{moneyFmt(item.sale_price)}</Td>
                  <Td className="text-right">
                    {numFmt(item.avg_condition, 2)}
                  </Td>
                  <Td>{String(item.land_use ?? "—")}</Td>
                  <Td>{String(item.district ?? "—")}</Td>
                  <Td className="text-right">
                    {numFmt(item.total_finished_area)}
                  </Td>
                  <Td className="text-right">
                    {numFmt(item.total_unfinished_area)}
                  </Td>
                  <Td className="text-center">
                    {(item as any).is_valid === true ? (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                        valid
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                        other
                      </span>
                    )}
                  </Td>
                </tr>
              );
            })}
            {!enriched.length && (
              <tr>
                <td colSpan={12} className="px-3 py-4 text-gray-500">
                  No matches. Try a different search (e.g., parcel ID, street
                  name, district).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected comps (sorted by miles) */}
      <div className="border rounded-md overflow-x-auto bg-white">
        <div className="px-3 py-2 border-b text-sm font-medium">
          Selected comps (sorted by distance)
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>#</Th>
              <Th>Parcel</Th>
              <Th>Address</Th>
              <Th>Miles</Th>
              <Th>Sale Date</Th>
              <Th className="text-right">Sale Price</Th>
              <Th className="text-right">Avg Cond</Th>
              <Th>Land Use</Th>
              <Th>District</Th>
              <Th className="text-right">Finished</Th>
              <Th className="text-right">Unfinished</Th>
            </tr>
          </thead>
          <tbody>
            {selectedRows.map(({ item, miles }, i) => (
              <tr
                key={keyOf(item)}
                className={i % 2 ? "bg-white" : "bg-gray-50"}
              >
                <Td>{i + 1}</Td>
                <Td>{String(item.parcel_id ?? "—")}</Td>
                <Td>
                  {`${item.house_number ?? ""} ${item.street ?? ""}`.trim() ||
                    "—"}
                </Td>
                <Td>{miles == null ? "—" : miles.toFixed(2)}</Td>
                <Td>{String(item.sale_date ?? "—")}</Td>
                <Td className="text-right">{moneyFmt(item.sale_price)}</Td>
                <Td className="text-right">{numFmt(item.avg_condition, 2)}</Td>
                <Td>{String(item.land_use ?? "—")}</Td>
                <Td>{String(item.district ?? "—")}</Td>
                <Td className="text-right">
                  {numFmt(item.total_finished_area)}
                </Td>
                <Td className="text-right">
                  {numFmt(item.total_unfinished_area)}
                </Td>
              </tr>
            ))}
            {!selectedRows.length && (
              <tr>
                <td colSpan={11} className="px-3 py-4 text-gray-500">
                  No comps selected. Use the search table above to pick comps.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- UI helpers ----------
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-2 text-left border-b whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2 border-b ${className}`}>{children}</td>;
}

// ---------- utils/format ----------
function toNum(v: any): number {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : NaN;
}
function numFmt(v: any, digits = 0) {
  const n = toNum(v);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}
function moneyFmt(v: any) {
  const n = toNum(v);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
