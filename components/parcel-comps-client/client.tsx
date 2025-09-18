"use client";

import { useMemo, useState } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";
import { haversineMiles, gowerDistances, FieldSpec } from "@/lib/gower";
import data from "@/lib/land_use_arrays.json";
import { ParcelFeaturesRow } from "./server";

const residential = data.residential as number[];
const commercial = data.commercial as number[];
const industrial = data.agriculture as number[];
const lots = data.lots as number[];
const single_family = data.single_family as number[];
const condo = data.condo as number[];

// ---------- date helpers ----------
function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const TODAY_STR = fmtDate(new Date());
const START_TWO_YEARS_AGO_STR = `${new Date().getFullYear() - 2}-01-01`;

export default function GowerCompsClient({
  subject,
}: {
  subject: ParcelFeaturesRow;
}) {
  const subjectLandUse = subject.land_use;
  const landUseSet = subjectLandUse
    ? residential.includes(Number(subjectLandUse))
      ? residential
      : commercial.includes(Number(subjectLandUse))
        ? commercial
        : industrial.includes(Number(subjectLandUse))
          ? industrial
          : lots.includes(Number(subjectLandUse))
            ? lots
            : single_family.includes(Number(subjectLandUse))
              ? single_family
              : condo.includes(Number(subjectLandUse))
                ? condo
                : [subjectLandUse]
    : null;

  // dates (defaults set per request)
  const [startDate, setStartDate] = useState<string>(
    () => START_TWO_YEARS_AGO_STR
  );
  const [endDate, setEndDate] = useState<string>(() => TODAY_STR);
  const [asOfDate, setAsOfDate] = useState<string>(() => TODAY_STR);

  // filters
  const [clientValidOnly, setClientValidOnly] = useState<boolean>(true);
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
  const [wLandToBuilding, setWLandToBuilding] = useState<number>(1);
  const [wStructureCount, setWStructureCount] = useState<number>(1);
  const [wTotalUnits, setWTotalUnits] = useState<number>(1);

  // Fetch
  const { data, isLoading, error } = useRatiosFeatures({
    start_date: startDate,
    end_date: endDate,
    as_of_date: asOfDate,
    valid_only: clientValidOnly,
    // @ts-expect-error types can be numeric[]
    land_uses: landUseSet,
  });

  // Candidates
  const candidates = useMemo(() => {
    if (!data) return [] as RatiosFeaturesRow[];
    let cand = data.filter((r) => r.parcel_id !== subject.parcel_id);

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

  // Fields for Gower (keep lat/lon for distance but HIDE in table)
  const fields = useMemo<FieldSpec<RatiosFeaturesRow>[]>(
    () => [
      {
        key: "land_use",
        type: "categorical",
        weight: wLandUse,
        label: "Land Use",
      },
      {
        key: "district",
        type: "categorical",
        weight: wDistrict,
        label: "District",
      },
      { key: "lat", type: "numeric", weight: wLat, label: "Latitude" },
      { key: "lon", type: "numeric", weight: wLon, label: "Longitude" },
      {
        key: "total_finished_area",
        type: "numeric",
        weight: wFinished,
        label: "Finished (sf)",
      },
      {
        key: "total_unfinished_area",
        type: "numeric",
        weight: wUnfinished,
        label: "Unfinished (sf)",
      },
      {
        key: "avg_condition",
        type: "numeric",
        weight: wAvgCond,
        label: "Avg Cond",
      },
      {
        key: "total_units",
        type: "numeric",
        weight: wTotalUnits,
        label: "Units",
      },
      { key: "land_area", type: "numeric", weight: 1, label: "Land Area" },
      {
        key: "avg_year_built",
        type: "numeric",
        weight: 1,
        label: "Avg Yr Built",
      },
      {
        key: "land_to_building_area_ratio",
        type: "numeric",
        weight: wLandToBuilding,
        label: "Land/Building",
      },
      {
        key: "structure_count",
        type: "numeric",
        weight: wStructureCount,
        label: "Structures",
      },
    ],
    [
      wLandUse,
      wDistrict,
      wLat,
      wLon,
      wFinished,
      wUnfinished,
      wAvgCond,
      wTotalUnits,
      wLandToBuilding,
      wStructureCount,
    ]
  );

  // Columns to display (exclude lat/lon)
  const displayFields = useMemo(
    () => fields.filter((f) => f.key !== "lat" && f.key !== "lon"),
    [fields]
  );

  const ranked = useMemo(() => {
    if (!subject || candidates.length === 0) return [];
    return gowerDistances(
      subject as unknown as RatiosFeaturesRow,
      candidates,
      fields
    );
  }, [subject, candidates, fields]);

  // Build table rows (subject first)
  const tableRows = useMemo(() => {
    const subjectDisplay: Partial<RatiosFeaturesRow> & {
      parcel_id: number;
      house_number?: string | null;
      street?: string | null;
      sale_date?: string | null;
      sale_price?: number | null;
      land_use?: string | null;
      district?: string | null;
    } = {
      parcel_id: subject.parcel_id,
      house_number: subject.house_number ?? null,
      street: subject.street ?? null,
      sale_date: null,
      sale_price: null,
      land_use: (subject.land_use as any) ?? null,
      district: subject.district ?? null,
      total_finished_area: subject.total_finished_area ?? null,
      total_unfinished_area: subject.total_unfinished_area ?? null,
      avg_condition: subject.avg_condition ?? null,
      lat: subject.lat ?? null,
      lon: subject.lon ?? null,
      total_units: (subject as any).total_units ?? null,
      land_area: (subject as any).land_area ?? null,
      avg_year_built: (subject as any).avg_year_built ?? null,
      land_to_building_area_ratio:
        (subject as any).land_to_building_area_ratio ?? null,
      structure_count: (subject as any).structure_count ?? null,
    };

    const subjectRow = {
      isSubject: true as const,
      distance: 0,
      miles: 0,
      item: subjectDisplay as RatiosFeaturesRow,
    };

    const compRows = ranked.slice(0, k).map((r, i) => {
      const miles = haversineMiles(
        subject.lat,
        subject.lon,
        (r.item as any).lat,
        (r.item as any).lon
      );
      return {
        isSubject: false as const,
        distance: r.distance,
        miles,
        item: r.item as RatiosFeaturesRow,
      };
    });

    return [subjectRow, ...compRows];
  }, [ranked, k, subject]);

  // ---------- UI ----------
  return (
    <div className="grid gap-4 mt-4">
      {/* Controls above the table */}
      <div className="border rounded p-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="startDate" className="text-sm">
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="endDate" className="text-sm">
              End date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="asOfDate" className="text-sm">
              As-of date
            </label>
            <input
              id="asOfDate"
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="validOnly" className="text-sm">
              Valid sales only
            </label>
            <input
              id="validOnly"
              type="checkbox"
              checked={clientValidOnly}
              onChange={(e) => setClientValidOnly(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="sameLU" className="text-sm">
              Force same land use
            </label>
            <input
              id="sameLU"
              type="checkbox"
              checked={forceSameLandUse}
              onChange={(e) => setForceSameLandUse(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="livingBand" className="text-sm">
              Living area band (± sq ft)
            </label>
            <input
              id="livingBand"
              type="number"
              min={0}
              value={livingAreaBand}
              onChange={(e) => setLivingAreaBand(toInt(e.target.value, 0))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="milesLimit" className="text-sm">
              Miles limit
            </label>
            <input
              id="milesLimit"
              type="number"
              min={0}
              step={0.1}
              value={maxDistanceMiles}
              onChange={(e) => setMaxDistanceMiles(toNum(e.target.value) || 0)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="topK" className="text-sm">
              Top K comps
            </label>
            <input
              id="topK"
              type="number"
              min={1}
              value={k}
              onChange={(e) => setK(Math.max(1, toInt(e.target.value, 5)))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          {/* Weights (also flex-wrap, label over input) */}
          <div className="flex flex-wrap gap-2 w-full mt-1">
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
            <WeightRow
              label="Latitude (kept for score)"
              value={wLat}
              setValue={setWLat}
            />
            <WeightRow
              label="Longitude (kept for score)"
              value={wLon}
              setValue={setWLon}
            />
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
            <WeightRow
              label="Land/Building ratio"
              value={wLandToBuilding}
              setValue={setWLandToBuilding}
            />
            <WeightRow
              label="Structure count"
              value={wStructureCount}
              setValue={setWStructureCount}
            />
            <WeightRow
              label="Total units"
              value={wTotalUnits}
              setValue={setWTotalUnits}
            />
          </div>

          <div className="text-xs text-gray-500 w-full">
            Rows: {data?.length ?? 0} • Loading: {String(isLoading)} • Error:{" "}
            {error ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="min-w-0">
        <div className="border rounded overflow-x-auto">
          <div className="p-2 border-b text-sm font-medium">
            Subject + Top {k} comps (candidates after filters:{" "}
            {candidates.length})
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <Th>Parcel</Th>
                <Th>Address</Th>
                <Th>Dissim</Th>
                <Th>Miles</Th>
                <Th>Sale Date</Th>
                <Th className="text-right">Sale Price</Th>
                {displayFields.map((f) => (
                  <Th
                    key={String(f.key)}
                    className={isNumericField(f) ? "text-right" : ""}
                  >
                    {/* @ts-expect-error ts */}
                    {f.label ?? toLabel(String(f.key))}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => {
                const it = r.item as any;
                const isSubject = r.isSubject;
                return (
                  <tr
                    key={isSubject ? "subject" : `comp-${i}`}
                    className={
                      isSubject
                        ? "bg-yellow-50 font-medium"
                        : i % 2
                          ? "bg-background"
                          : "bg-background/70"
                    }
                  >
                    <Td>{String(it.parcel_id ?? "—")}</Td>
                    <Td>
                      {`${it.house_number ?? ""} ${it.street ?? ""}`.trim() ||
                        "—"}
                    </Td>
                    <Td>{numFmt(r.distance, 4)}</Td>
                    <Td>{r.miles == null ? "—" : numFmt(r.miles, 2)}</Td>
                    <Td>{String(it.sale_date ?? "—")}</Td>
                    <Td className="text-right">{moneyFmt(it.sale_price)}</Td>

                    {displayFields.map((f) => {
                      const v = it[f.key as keyof RatiosFeaturesRow];
                      const right = isNumericField(f) ? "text-right" : "";
                      return (
                        <Td
                          key={`${String(f.key)}-${isSubject ? "subj" : i}`}
                          className={right}
                        >
                          {isNumericField(f)
                            ? numFmt(v as any)
                            : String(v ?? "—")}
                        </Td>
                      );
                    })}
                  </tr>
                );
              })}

              {!tableRows.length && !isLoading && (
                <tr>
                  <td
                    colSpan={6 + displayFields.length}
                    className="px-3 py-4 text-gray-500"
                  >
                    No comps found with current filters.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td
                    colSpan={6 + displayFields.length}
                    className="px-3 py-4 text-gray-500"
                  >
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
    <label className="flex flex-col gap-1 text-sm min-w-[180px] grow basis-48">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        min={0}
        className="border rounded px-2 py-1 text-sm w-full"
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

function isNumericField(f: FieldSpec<RatiosFeaturesRow>) {
  return f.type === "numeric";
}
function toLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
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
