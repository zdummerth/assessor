"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";

// ---------- Haversine ----------
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
  const R = 3958.7613; // miles
  const dLat = toRad(c - a);
  const dLon = toRad(d - b);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const A = s1 * s1 + Math.cos(toRad(a)) * Math.cos(toRad(c)) * s2 * s2;
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C;
}

// ---------- Gower helper (numeric/categorical/boolean) ----------
type GowerType = "numeric" | "categorical" | "boolean";
type FieldSpec<T> = { key: keyof T; type: GowerType; weight?: number };
type GowerResult<T> = { item: T; distance: number; index: number };

function gowerDistances<T extends Record<string, any>>(
  subject: T,
  candidates: T[],
  fields: FieldSpec<T>[]
): GowerResult<T>[] {
  if (!candidates.length || !fields.length) return [];

  const numericKeys = fields
    .filter((f) => f.type === "numeric")
    .map((f) => f.key);
  const mins = new Map<keyof T, number>();
  const maxs = new Map<keyof T, number>();
  const add = (k: keyof T, v: any) => {
    if (v == null) return;
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    mins.set(k, Math.min(mins.get(k) ?? n, n));
    maxs.set(k, Math.max(maxs.get(k) ?? n, n));
  };
  for (const k of numericKeys) add(k, subject[k]);
  for (const item of candidates) for (const k of numericKeys) add(k, item[k]);

  return candidates
    .map((item, idx) => {
      let wsum = 0,
        wden = 0;
      for (const f of fields) {
        const w = f.weight ?? 1;
        const a = subject[f.key];
        const b = item[f.key];
        if (a == null || b == null) continue;

        let d = 0;
        if (f.type === "numeric") {
          const aNum = Number(a),
            bNum = Number(b);
          if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) continue;
          const range = (maxs.get(f.key) ?? 0) - (mins.get(f.key) ?? 0);
          d = range === 0 ? 0 : Math.abs(aNum - bNum) / range;
        } else if (f.type === "categorical") {
          d = String(a) === String(b) ? 0 : 1;
        } else {
          d = Boolean(a) === Boolean(b) ? 0 : 1;
        }

        if (!Number.isFinite(d)) continue;
        if (d < 0) d = 0;
        if (d > 1) d = 1;
        wsum += w * d;
        wden += w;
      }
      return { item, distance: wden > 0 ? wsum / wden : 0, index: idx };
    })
    .sort((a, b) => a.distance - b.distance);
}

// ---------- Component ----------
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

export default function RatiosGowerCompsWithGeo() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [landUses, setLandUses] = useState<string[]>(RESIDENTIAL_LU_DEFAULTS);

  // subject selection/search
  const [subjectIndex, setSubjectIndex] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  // controls
  const [k, setK] = useState<number>(5);
  const [livingAreaBand, setLivingAreaBand] = useState<number>(0); // 0 = off
  const [forceSameLandUse, setForceSameLandUse] = useState<boolean>(false);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(0); // 0 = off

  // weights
  const [wLandUse, setWLandUse] = useState<number>(1);
  const [wDistrict, setWDistrict] = useState<number>(1);
  const [wLat, setWLat] = useState<number>(1);
  const [wLon, setWLon] = useState<number>(1);
  const [wFinished, setWFinished] = useState<number>(1);
  const [wUnfinished, setWUnfinished] = useState<number>(0.5);
  const [wAvgCond, setWAvgCond] = useState<number>(1);

  const { data, isLoading, error } = useRatiosFeatures({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    as_of_date: asOfDate || undefined,
    land_uses: landUses.length ? landUses : undefined,
    valid_only: true,
  });

  // make subject index safe when data changes
  useEffect(() => {
    if (!data?.length) return;
    if (subjectIndex >= data.length) setSubjectIndex(0);
  }, [data, subjectIndex]);

  // subject
  const subject = useMemo(
    () => (data && data[subjectIndex]) as RatiosFeaturesRow | undefined,
    [data, subjectIndex]
  );

  // candidates with filters (same LU, living area band, distance limit)
  const candidates = useMemo(() => {
    if (!data || !subject) return [] as RatiosFeaturesRow[];
    let cand = data
      .map((r, idx) => ({ r, idx }))
      .filter(({ idx }) => idx !== subjectIndex)
      .map(({ r }) => r) as RatiosFeaturesRow[];

    if (forceSameLandUse && subject.land_use) {
      cand = cand.filter((r) => r.land_use === subject.land_use);
    }

    const sTFA = toNum(subject.total_finished_area);
    if (livingAreaBand > 0 && Number.isFinite(sTFA)) {
      const min = sTFA - livingAreaBand;
      const max = sTFA + livingAreaBand;
      cand = cand.filter((r) => {
        const t = toNum(r.total_finished_area);
        return Number.isFinite(t) ? t >= min && t <= max : false;
      });
    }

    if (maxDistanceMiles > 0) {
      const sLat = toNum(subject.lat),
        sLon = toNum(subject.lon);
      if (Number.isFinite(sLat) && Number.isFinite(sLon)) {
        cand = cand.filter((r) => {
          const miles = haversineMiles(sLat, sLon, toNum(r.lat), toNum(r.lon));
          return miles != null && miles <= maxDistanceMiles;
        });
      } else {
        console.warn(
          "[Distance limit] Subject has no lat/lon; distance filter skipped."
        );
      }
    }

    return cand;
  }, [
    data,
    subject,
    subjectIndex,
    forceSameLandUse,
    livingAreaBand,
    maxDistanceMiles,
  ]);

  // fields spec from weights
  const fields = useMemo<FieldSpec<RatiosFeaturesRow>[]>(
    () => [
      { key: "land_use", type: "categorical", weight: wLandUse },
      { key: "district", type: "categorical", weight: wDistrict },
      { key: "lat", type: "numeric", weight: wLat },
      { key: "lon", type: "numeric", weight: wLon },
      { key: "total_finished_area", type: "numeric", weight: wFinished },
      { key: "total_unfinished_area", type: "numeric", weight: wUnfinished },
      { key: "avg_condition", type: "numeric", weight: wAvgCond },
    ],
    [wLandUse, wDistrict, wLat, wLon, wFinished, wUnfinished, wAvgCond]
  );

  const ranked = useMemo(() => {
    if (!subject || candidates.length === 0) return [];
    return gowerDistances(subject, candidates, fields);
  }, [subject, candidates, fields]);

  // subject search (over full dataset)
  const subjectMatches = useMemo(() => {
    if (!data || !search.trim()) return [];
    const q = search.trim().toLowerCase();
    return data
      .map((r, idx) => ({ r, idx }))
      .filter(({ r }) =>
        [
          r.parcel_id,
          `${r.house_number ?? ""} ${r.street ?? ""}`,
          r.district,
          r.land_use,
        ]
          .map(String)
          .some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [data, search]);

  // ---------- UI ----------
  return (
    <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
      {/* Sidebar */}
      <aside className="space-y-4 p-3 border rounded-md bg-white">
        <div className="space-y-2">
          <div className="font-medium">Filters</div>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w.full"
            />
          </div>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          />
          <div className="flex items-center gap-2">
            <input
              id="sameLU"
              type="checkbox"
              checked={forceSameLandUse}
              onChange={(e) => setForceSameLandUse(e.target.checked)}
            />
            <label htmlFor="sameLU" className="text-sm">
              Force same land use
            </label>
          </div>
          <label className="text-sm flex items-center gap-2">
            Living area band (± sq ft)
            <input
              type="number"
              min={0}
              value={livingAreaBand}
              onChange={(e) => setLivingAreaBand(toInt(e.target.value, 0))}
              className="border rounded px-2 py-1 text-sm w-24"
            />
          </label>
          <label className="text-sm flex items-center gap-2">
            Distance limit (miles)
            <input
              type="number"
              min={0}
              step={0.1}
              value={maxDistanceMiles}
              onChange={(e) => setMaxDistanceMiles(toNum(e.target.value) || 0)}
              className="border rounded px-2 py-1 text-sm w-24"
            />
          </label>
          <label className="text-sm flex items-center gap-2">
            Top K comps
            <input
              type="number"
              min={1}
              value={k}
              onChange={(e) => setK(Math.max(1, toInt(e.target.value, 5)))}
              className="border rounded px-2 py-1 text-sm w-20"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLandUses(RESIDENTIAL_LU_DEFAULTS)}
              className="border rounded px-2 py-1 text-sm"
            >
              Reset Land Uses
            </button>
            <button
              type="button"
              onClick={() => setLandUses([])}
              className="border rounded px-2 py-1 text-sm"
            >
              Clear Land Uses
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Weights</div>
          <WeightRow label="Land use" value={wLandUse} setValue={setWLandUse} />
          <WeightRow
            label="District"
            value={wDistrict}
            setValue={setWDistrict}
          />
          <WeightRow label="Latitude" value={wLat} setValue={setWLat} />
          <WeightRow label="Longitude" value={wLon} setValue={setWLon} />
          <WeightRow
            label="Finished area"
            value={wFinished}
            setValue={setWFinished}
          />
          <WeightRow
            label="Unfinished area"
            value={wUnfinished}
            setValue={setWUnfinished}
            step={0.1}
          />
          <WeightRow
            label="Avg condition"
            value={wAvgCond}
            setValue={setWAvgCond}
          />
        </div>

        {/* Subject search & picker */}
        <div className="space-y-2">
          <div className="font-medium">Subject</div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
            placeholder="Search parcel, address, district, land use…"
          />
          {search && subjectMatches.length > 0 && (
            <div className="max-h-48 overflow-auto border rounded">
              <table className="w-full text-xs">
                <tbody>
                  {subjectMatches.map(({ r, idx }) => (
                    <tr
                      key={`${idx}-${r.parcel_id}`}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSubjectIndex(idx);
                        setSearch("");
                      }}
                    >
                      <td className="px-2 py-1 w-20">
                        {String(r.parcel_id ?? "—")}
                      </td>
                      <td className="px-2 py-1">
                        {`${r.house_number ?? ""} ${r.street ?? ""}`.trim() ||
                          "—"}
                      </td>
                      <td className="px-2 py-1 w-28">{r.district ?? "—"}</td>
                      <td className="px-2 py-1 w-16">{r.land_use ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Current index: {subjectIndex} • Rows: {data?.length ?? 0} • Loading:{" "}
            {String(isLoading)} • Error: {error ? "Yes" : "No"}
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="min-w-0 space-y-3">
        {/* Subject summary */}
        <div className="border rounded-md p-3 bg-white">
          <div className="font-medium mb-2">Subject</div>
          {subject ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <Info label="Parcel" value={subject.parcel_id} />
              <Info
                label="Address"
                value={`${subject.house_number ?? ""} ${subject.street ?? ""}`.trim()}
              />
              <Info label="District" value={subject.district} />
              <Info label="Land Use" value={subject.land_use} />
              <Info
                label="Finished"
                value={numFmt(subject.total_finished_area)}
              />
              <Info
                label="Unfinished"
                value={numFmt(subject.total_unfinished_area)}
              />
              <Info
                label="Avg Condition"
                value={numFmt(subject.avg_condition, 2)}
              />
              <Info label="Lat" value={numFmt(subject.lat, 6)} />
              <Info label="Lon" value={numFmt(subject.lon, 6)} />
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data</div>
          )}
        </div>

        {/* Comps table */}
        <div className="border rounded-md overflow-x-auto bg-white">
          <div className="px-3 py-2 border-b text-sm font-medium">
            Top {k} closest comps (candidates after filters: {candidates.length}
            )
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Rank</Th>
                <Th>Distance</Th>
                <Th>Miles</Th>
                <Th>Parcel</Th>
                <Th>Address</Th>
                <Th>District</Th>
                <Th>Land Use</Th>
                <Th className="text-right">Finished</Th>
                <Th className="text-right">Unfinished</Th>
                <Th className="text-right">Avg Cond</Th>
                <Th>Sale Date</Th>
                <Th className="text-right">Sale Price</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {subject &&
                ranked.slice(0, k).map((r, i) => {
                  const miles = haversineMiles(
                    subject.lat,
                    subject.lon,
                    (r.item as any).lat,
                    (r.item as any).lon
                  );
                  return (
                    <tr key={i} className={i % 2 ? "bg-white" : "bg-gray-50"}>
                      <Td>{i + 1}</Td>
                      <Td>{r.distance.toFixed(4)}</Td>
                      <Td>{miles == null ? "—" : miles.toFixed(2)}</Td>
                      <Td>{String((r.item as any).parcel_id ?? "—")}</Td>
                      <Td>
                        {`${(r.item as any).house_number ?? ""} ${(r.item as any).street ?? ""}`.trim() ||
                          "—"}
                      </Td>
                      <Td>{String((r.item as any).district ?? "—")}</Td>
                      <Td>{String((r.item as any).land_use ?? "—")}</Td>
                      <Td className="text-right">
                        {numFmt((r.item as any).total_finished_area)}
                      </Td>
                      <Td className="text-right">
                        {numFmt((r.item as any).total_unfinished_area)}
                      </Td>
                      <Td className="text-right">
                        {numFmt((r.item as any).avg_condition, 2)}
                      </Td>
                      <Td>{String((r.item as any).sale_date ?? "—")}</Td>
                      <Td className="text-right">
                        {moneyFmt((r.item as any).sale_price)}
                      </Td>
                      <Td>
                        <button
                          type="button"
                          className="border rounded px-2 py-1 text-xs"
                          onClick={() => {
                            const idx =
                              data?.findIndex(
                                (d) => d.parcel_id === (r.item as any).parcel_id
                              ) ?? -1;
                            if (idx >= 0) setSubjectIndex(idx);
                          }}
                        >
                          Set subject
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              {!ranked.length && (
                <tr>
                  <td colSpan={13} className="px-3 py-4 text-gray-500">
                    No comps found with current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ---------- Small UI helpers ----------
function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded border p-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value ?? "—"}</div>
    </div>
  );
}

function WeightRow({
  label,
  value,
  setValue,
  step = 0.5,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        min={0}
        className="border rounded px-2 py-1 w-24 text-right"
        value={value}
        onChange={(e) => setValue(clampNonNeg(toNum(e.target.value) ?? 0))}
      />
    </label>
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
function toInt(v: any, fallback = 0) {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : fallback;
}
function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
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
