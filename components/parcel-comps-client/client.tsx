"use client";

import { useMemo, useState } from "react";
import { useRatiosFeatures } from "@/lib/client-queries"; // ⟵ no type import
import { haversineMiles, gowerDistances, FieldSpec } from "@/lib/gower";
import data from "@/lib/land_use_arrays.json";
import { Database } from "@/database-types";

// ---------- Types ----------
type FeatureRow =
  Database["public"]["Functions"]["get_parcel_value_features_asof"]["Returns"][0];

type Candidates =
  Database["public"]["Functions"]["test_get_sold_parcel_ratios_features"]["Returns"];

type CandidateRow = Candidates extends Array<infer R> ? R : never;

// ---------- land use sets ----------
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

export default function GowerCompsClient({ subject }: { subject: FeatureRow }) {
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

  // dates (defaults)
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
  const candidates = useMemo<CandidateRow[]>(() => {
    if (!data) return [];
    let cand = (data as unknown as CandidateRow[]).filter(
      (r) => r.parcel_id !== subject.parcel_id
    );

    if (clientValidOnly) {
      // tolerate either boolean flag or truthy
      cand = cand.filter((r: any) => r.is_valid === true);
    }

    if (forceSameLandUse && subject.land_use) {
      cand = cand.filter((r) => r.land_use === subject.land_use);
    }

    const sTFA = toNum(subject.total_finished_area);
    if (livingAreaBand > 0 && Number.isFinite(sTFA)) {
      const min = sTFA - livingAreaBand;
      const max = sTFA + livingAreaBand;
      cand = cand.filter((r) => {
        const t = toNum(r.total_finished_area as any);
        return Number.isFinite(t) ? t >= min && t <= max : false;
      });
    }

    if (maxDistanceMiles > 0) {
      const sLat = toNum(subject.lat),
        sLon = toNum(subject.lon);
      if (Number.isFinite(sLat) && Number.isFinite(sLon)) {
        cand = cand.filter((r) => {
          const miles = haversineMiles(
            sLat,
            sLon,
            toNum(r.lat as any),
            toNum(r.lon as any)
          );
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

  // Fields for Gower (exclude lat/lon from display later)
  const fields = useMemo<FieldSpec<CandidateRow>[]>(
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
      subject as unknown as CandidateRow,
      candidates,
      fields
    );
  }, [subject, candidates, fields]);

  // Build table rows (subject first)
  const tableRows = useMemo(() => {
    const subjectDisplay: Partial<CandidateRow> & {
      parcel_id: number;
      house_number?: string | null;
      street?: string | null;
      sale_date?: string | null;
      sale_price?: number | null;
      land_use?: string | null;
      district?: string | null;
    } = {
      parcel_id: subject.parcel_id,
      house_number: subject.house_number,
      street: subject.street,
      sale_date: undefined,
      sale_price: undefined,
      land_use: subject.land_use,
      district: subject.district,
      total_finished_area: subject.total_finished_area,
      total_unfinished_area: subject.total_unfinished_area,
      avg_condition: subject.avg_condition,
      lat: subject.lat,
      lon: subject.lon,
      total_units: subject.total_units,
      land_area: subject.land_area,
      avg_year_built: subject.avg_year_built,
      land_to_building_area_ratio: subject.land_to_building_area_ratio,
      structure_count: subject.structure_count,
    };

    const subjectRow = {
      isSubject: true as const,
      distance: 0,
      miles: 0,
      item: subjectDisplay as CandidateRow,
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
        item: r.item as CandidateRow,
      };
    });

    return [subjectRow, ...compRows];
  }, [ranked, k, subject]);

  // ---------- UI ----------
  return (
    <div className="grid gap-4 mt-4">
      {/* Controls */}
      <div className="border rounded p-3">
        <div className="flex flex-wrap gap-3">
          <InputCol
            id="startDate"
            label="Start date"
            type="date"
            value={startDate}
            onChange={setStartDate}
          />
          <InputCol
            id="endDate"
            label="End date"
            type="date"
            value={endDate}
            onChange={setEndDate}
          />
          <InputCol
            id="asOfDate"
            label="As-of date"
            type="date"
            value={asOfDate}
            onChange={setAsOfDate}
          />

          <CheckboxCol
            id="validOnly"
            label="Valid sales only"
            checked={clientValidOnly}
            onChange={setClientValidOnly}
          />
          <CheckboxCol
            id="sameLU"
            label="Force same land use"
            checked={forceSameLandUse}
            onChange={setForceSameLandUse}
          />

          <NumberCol
            id="livingBand"
            label="Living area band (± sq ft)"
            value={livingAreaBand}
            onChange={(v) => setLivingAreaBand(toInt(v, 0))}
          />
          <NumberCol
            id="milesLimit"
            label="Miles limit"
            step={0.1}
            value={maxDistanceMiles}
            onChange={(v) => setMaxDistanceMiles(toNum(v) || 0)}
          />
          <NumberCol
            id="topK"
            label="Top K comps"
            min={1}
            value={k}
            onChange={(v) => setK(Math.max(1, toInt(v, 5)))}
          />

          {/* Weights */}
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
                    className={
                      isNumericField<CandidateRow>(f) ? "text-right" : ""
                    }
                  >
                    {/* @ts-expect-error label on FieldSpec */}
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
                      const v = it[f.key as keyof CandidateRow];
                      const right = isNumericField<CandidateRow>(f)
                        ? "text-right"
                        : "";
                      return (
                        <Td
                          key={`${String(f.key)}-${isSubject ? "subj" : i}`}
                          className={right}
                        >
                          {isNumericField<CandidateRow>(f)
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

function InputCol(props: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <label htmlFor={props.id} className="text-sm">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-full"
      />
    </div>
  );
}
function NumberCol(props: {
  id: string;
  label: string;
  value: number;
  onChange: (v: string) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <label htmlFor={props.id} className="text-sm">
        {props.label}
      </label>
      <input
        id={props.id}
        type="number"
        value={props.value}
        min={props.min}
        step={props.step}
        onChange={(e) => props.onChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-full"
      />
    </div>
  );
}
function CheckboxCol(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <label htmlFor={props.id} className="text-sm">
        {props.label}
      </label>
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </div>
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

// generic numeric check over FieldSpec<T>
function isNumericField<T>(f: FieldSpec<T>) {
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
