"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";

// ---------- Types ----------
type SubjectFeatures = {
  parcel_id: number;
  lat: number | null;
  lon: number | null;
  house_number?: string | null;
  street?: string | null;
};

// ---------- Haversine (miles) ----------
function haversineMiles(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number | null {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a = Number(lat1),
    b = Number(lon1),
    c = Number(lat2),
    d = Number(lon2);
  if (![a, b, c, d].every(Number.isFinite)) return null;
  const R = 3958.7613;
  const dLat = toRad(c - a);
  const dLon = toRad(d - b);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const A = s1 * s1 + Math.cos(toRad(a)) * Math.cos(toRad(c)) * s2 * s2;
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C;
}

const keyOf = (r: Partial<RatiosFeaturesRow>) =>
  `${String(r.sale_id ?? "")}:${String(r.parcel_id ?? "")}`;

export default function URLSelectedComps({
  subject,
}: {
  subject: SubjectFeatures;
}) {
  const searchParams = useSearchParams();

  // Parse ?saleIds=123,456,789
  const compSaleIds = useMemo(() => {
    const raw = searchParams.get("saleIds");
    if (!raw) return null;
    const ids = raw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    return ids.length ? ids : null;
  }, [searchParams]);

  // Fetch all candidates (valid + invalid). Add date/as_of elsewhere if you like.
  const { data, isLoading, error } = useRatiosFeatures({
    start_date: "2020-01-01",
    valid_only: false,
  });

  // Attach miles to all candidates (exclude subject parcel if present)
  const enriched = useMemo(() => {
    if (!data)
      return [] as Array<{ item: RatiosFeaturesRow; miles: number | null }>;
    return data
      .filter((r) => r.parcel_id !== subject.parcel_id)
      .map((item) => ({
        item,
        miles: haversineMiles(
          subject.lat,
          subject.lon,
          (item as any).lat,
          (item as any).lon
        ),
      }));
  }, [data, subject.parcel_id, subject.lat, subject.lon]);

  // Pick only the comps listed in the URL, keep the same order as saleIds
  const selected = useMemo(() => {
    if (!compSaleIds)
      return [] as Array<{ item: RatiosFeaturesRow; miles: number | null }>;
    const bySale = new Map<
      number,
      Array<{ item: RatiosFeaturesRow; miles: number | null }>
    >();
    for (const row of enriched) {
      const sid = row.item.sale_id as number;
      if (!Number.isFinite(sid)) continue;
      const arr = bySale.get(sid) ?? [];
      arr.push(row);
      bySale.set(sid, arr);
    }
    // If multiple rows share a sale_id (unlikely in single-parcel set), pick the nearest by miles
    const pickForSale = (sid: number) => {
      const arr = bySale.get(sid);
      if (!arr?.length) return null;
      return arr.slice().sort((a, b) => {
        const am = a.miles,
          bm = b.miles;
        if (am == null && bm == null) return 0;
        if (am == null) return 1;
        if (bm == null) return -1;
        return am - bm;
      })[0];
    };

    const out: Array<{ item: RatiosFeaturesRow; miles: number | null }> = [];
    for (const sid of compSaleIds) {
      const picked = pickForSale(sid);
      if (picked) out.push(picked);
    }
    return out;
  }, [enriched, compSaleIds]);

  if (!compSaleIds) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No <code>saleIds</code> found in the URL.
      </div>
    );
  }
  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading candidates…</div>;
  }
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">Error loading candidates.</div>
    );
  }
  if (!selected.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No matches for the provided <code>saleIds</code>.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <div className="px-3 py-2 border-b text-sm font-medium">
        Selected comps from URL • {selected.length}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              <Th>Sale</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Date</Th>
              <Th className="text-right">Dist (mi)</Th>
              <Th>Land Use</Th>
              <Th>District</Th>
              <Th className="text-right">Finished</Th>
              <Th className="text-right">Unfinished</Th>
              <Th className="text-center">Valid</Th>
            </tr>
          </thead>
          <tbody>
            {selected.map(({ item, miles }) => (
              <tr key={keyOf(item)} className="odd:bg-white even:bg-gray-50">
                <Td className="align-top">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      #{item.sale_id}
                    </span>
                    {item.sale_type && <Badge>{item.sale_type}</Badge>}
                  </div>
                  <div className="text-xs text-gray-600">
                    {`${item.house_number ?? ""} ${item.street ?? ""}`.trim() ||
                      "—"}
                  </div>
                </Td>
                <Td className="text-right font-semibold">
                  {moneyFmt(item.sale_price)}
                </Td>
                <Td className="text-right">{String(item.sale_date ?? "—")}</Td>
                <Td className="text-right">
                  {miles == null ? "—" : miles.toFixed(2)}
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
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                      other
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Small UI bits ----------
function Badge({
  children,
  intent = "default",
}: {
  children: React.ReactNode;
  intent?: "default" | "success" | "warning";
}) {
  const color =
    intent === "success"
      ? "bg-green-100 text-green-800"
      : intent === "warning"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${color}`}
    >
      {children}
    </span>
  );
}

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
