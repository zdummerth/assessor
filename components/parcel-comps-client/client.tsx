"use client";

import { useMemo, useState } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";
import { haversineMiles, gowerDistances, FieldSpec } from "@/lib/gower";

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

// ---------- date helpers ----------
function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const TODAY_STR = fmtDate(new Date());
const START_TWO_YEARS_AGO_STR = `${new Date().getFullYear() - 2}-01-01`;

// ---------- Component ----------
export default function GowerCompsClient({
  subject,
}: {
  subject: SubjectFeatures;
}) {
  // layout
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // dates (defaults set per request)
  const [startDate, setStartDate] = useState<string>(
    () => START_TWO_YEARS_AGO_STR
  );
  const [endDate, setEndDate] = useState<string>(() => TODAY_STR);
  const [asOfDate, setAsOfDate] = useState<string>(() => TODAY_STR);

  // filters
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [clientValidOnly, setClientValidOnly] = useState<boolean>(true); // client-side toggle
  const [k, setK] = useState<number>(5);
  const [livingAreaBand, setLivingAreaBand] = useState<number>(500); // 0 = off
  const [forceSameLandUse, setForceSameLandUse] = useState<boolean>(false);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(1); // 0 = off

  // weights
  const [wLandUse, setWLandUse] = useState<number>(1);
  const [wDistrict, setWDistrict] = useState<number>(1);
  const [wLat, setWLat] = useState<number>(1);
  const [wLon, setWLon] = useState<number>(1);
  const [wFinished, setWFinished] = useState<number>(1);
  const [wUnfinished, setWUnfinished] = useState<number>(0.5);
  const [wAvgCond, setWAvgCond] = useState<number>(1);

  // Keep fetching BOTH valid + invalid (server-side)
  const { data, isLoading, error } = useRatiosFeatures({
    start_date: startDate,
    end_date: endDate,
    as_of_date: asOfDate,
    valid_only: false,
  });

  // Build filtered candidates (drop subject, then apply client filters)
  const candidates = useMemo(() => {
    if (!data) return [] as RatiosFeaturesRow[];
    let cand = data.filter((r) => r.parcel_id !== subject.parcel_id);

    // Client-side valid-only toggle
    if (clientValidOnly) {
      cand = cand.filter((r) => (r as any).is_valid === true);
    }

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
    clientValidOnly,
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
    return gowerDistances(
      subject as unknown as RatiosFeaturesRow,
      candidates,
      fields
    );
  }, [subject, candidates, fields]);

  // ---------- UI ----------
  return (
    <div
      className={`grid gap-4 ${
        sidebarOpen ? "lg:grid-cols-[275px,1fr]" : "grid-cols-1"
      }`}
    >
      {/* Sidebar (conditionally rendered; completely hidden when closed) */}
      {sidebarOpen && (
        <aside className="space-y-4 p-3 border rounded-md bg-white">
          <div className="space-y-2">
            <div className="space-y-2">
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
                className="border rounded px-2 py-1 text-sm w-full"
              />
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              />

              <div className="flex items-center gap-2">
                <input
                  id="validOnly"
                  type="checkbox"
                  checked={clientValidOnly}
                  onChange={(e) => setClientValidOnly(e.target.checked)}
                />
                <label htmlFor="validOnly" className="text-sm">
                  Valid sales only
                </label>
              </div>

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
                Miles Limit
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={maxDistanceMiles}
                  onChange={(e) =>
                    setMaxDistanceMiles(toNum(e.target.value) || 0)
                  }
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
            </div>
          </div>

          {/* Weights */}
          <div className="space-y-2">
            <div className="font-medium">Weights</div>
            <WeightRow
              label="Land use"
              value={wLandUse}
              setValue={setWLandUse}
            />
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

          <div className="text-xs text-gray-500">
            Rows: {data?.length ?? 0} • Loading: {String(isLoading)} • Error:{" "}
            {error ? "Yes" : "No"}
          </div>
        </aside>
      )}

      {/* Main */}
      <section className="min-w-0">
        {/* Toolbar with sidebar toggle */}
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-pressed={sidebarOpen}
            className="border rounded px-3 py-1.5 text-sm"
          >
            {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </button>
        </div>

        {/* Comps table */}
        <div className="border rounded-md overflow-x-auto bg-white">
          <div className="px-3 py-2 border-b text-sm font-medium">
            Top {k} comps (candidates after filters: {candidates.length})
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Parcel</Th>
                <Th>Address</Th>
                <Th>Dissim</Th>
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
              {ranked.slice(0, k).map((r, i) => {
                const miles = haversineMiles(
                  subject.lat,
                  subject.lon,
                  (r.item as any).lat,
                  (r.item as any).lon
                );
                return (
                  <tr key={i} className={i % 2 ? "bg-white" : "bg-gray-50"}>
                    <Td>{String((r.item as any).parcel_id ?? "—")}</Td>
                    <Td>
                      {`${(r.item as any).house_number ?? ""} ${(r.item as any).street ?? ""}`.trim() ||
                        "—"}
                    </Td>
                    <Td>{r.distance.toFixed(4)}</Td>
                    <Td>{miles == null ? "—" : miles.toFixed(2)}</Td>
                    <Td>{String((r.item as any).sale_date ?? "—")}</Td>
                    <Td className="text-right">
                      {moneyFmt((r.item as any).sale_price)}
                    </Td>
                    <Td className="text-right">
                      {numFmt((r.item as any).avg_condition, 2)}
                    </Td>
                    <Td>{String((r.item as any).land_use ?? "—")}</Td>
                    <Td>{String((r.item as any).district ?? "—")}</Td>
                    <Td className="text-right">
                      {numFmt((r.item as any).total_finished_area)}
                    </Td>
                    <Td className="text-right">
                      {numFmt((r.item as any).total_unfinished_area)}
                    </Td>
                  </tr>
                );
              })}
              {!ranked.length && !isLoading && (
                <tr>
                  <td colSpan={12} className="px-3 py-4 text-gray-500">
                    No comps found with current filters.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={12} className="px-3 py-4 text-gray-500">
                    Loading...
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
