"use client";

import { useMemo, useState, useEffect } from "react";
import { useRatiosFeatures } from "@/lib/client-queries";
import CompsMapFromRows from "./comp-map";
import { haversineMiles, gowerDistances, FieldSpec } from "@/lib/gower";
import ParcelNumber from "../ui/parcel-number-updated";
import data from "@/lib/land_use_arrays.json";
import { Database } from "@/database-types";

// ---------- Types ----------
type FeatureRow =
  Database["public"]["Functions"]["get_parcel_value_features_asof"]["Returns"][0];

type Candidates =
  Database["public"]["Functions"]["test_get_sold_parcel_ratios_features"]["Returns"];

type CandidateRow = Candidates[number];

// Allow optional UI label on fields (not used by Gower math)
type DisplayField = FieldSpec<CandidateRow> & { label?: string };

// Display-only column descriptor (for PPSF + base fields)
type DisplayCol = {
  key: string;
  label: string;
  align?: "left" | "right";
  get: (row: Partial<CandidateRow>, isSubject: boolean) => unknown;
};

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

// ---------- small utils ----------
function toNum(v: unknown): number {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : NaN;
}
function toInt(v: unknown, fallback = 0) {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : fallback;
}
function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
}
function numFmt(v: unknown, digits = 0) {
  const n = toNum(v);
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}
function moneyFmt(v: unknown) {
  const n = toNum(v);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
function toLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

// ---- neighborhoods → district (set_id = 2) helpers ----
function ensureArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
function districtFromNeighborhoods(value: any, setId = 2): string | undefined {
  const arr = ensureArray(value);
  const match = arr.find((n: any) => Number(n?.set_id) === setId);
  return match?.neighborhood_name;
}

// Pick the correct LU array (or a single-item array fallback)
function pickLandUseSet(lu?: string | null): number[] | null {
  if (!lu) return null;
  const code = Number(lu);
  const groups = [
    residential,
    commercial,
    industrial,
    lots,
    single_family,
    condo,
  ];
  for (const g of groups) if (g.includes(code)) return g;
  return [code];
}

/** =========================
 * Parent (state + data + math)
 * ========================= */
export default function GowerCompsClient({ subject }: { subject: FeatureRow }) {
  const landUseSet = pickLandUseSet(subject.land_use);

  // dates (defaults)
  const [startDate, setStartDate] = useState(START_TWO_YEARS_AGO_STR);
  const [endDate, setEndDate] = useState(TODAY_STR);
  const [asOfDate, setAsOfDate] = useState(TODAY_STR);

  // filters
  const [clientValidOnly, setClientValidOnly] = useState(true);
  const [k, setK] = useState(5);
  const [livingAreaBand, setLivingAreaBand] = useState(500); // 0 = off
  const [forceSameLandUse, setForceSameLandUse] = useState(false);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(1); // 0 = off

  // weights
  const [wLandUse, setWLandUse] = useState(1);
  const [wDistrict, setWDistrict] = useState(1);
  const [wLat, setWLat] = useState(1);
  const [wLon, setWLon] = useState(1);
  const [wFinished, setWFinished] = useState(1);
  const [wUnfinished, setWUnfinished] = useState(0.5);
  const [wAvgCond, setWAvgCond] = useState(1);
  const [wLandToBuilding, setWLandToBuilding] = useState(1);
  const [wStructureCount, setWStructureCount] = useState(1);
  const [wTotalUnits, setWTotalUnits] = useState(1);

  // Fetch
  const { data, isLoading, error } = useRatiosFeatures({
    start_date: startDate,
    end_date: endDate,
    as_of_date: asOfDate,
    valid_only: clientValidOnly,
    land_uses: landUseSet?.map(String),
  });

  // ---- compute district via neighborhoods (set_id = 2) ----
  const subjectDistrict = useMemo(
    () =>
      districtFromNeighborhoods((subject as any)?.neighborhoods_at_as_of, 2) ??
      subject.district ??
      undefined,
    [subject]
  );

  // Candidates (apply filters, then override their district from neighborhoods_at_sale)
  const candidates = useMemo<CandidateRow[]>(() => {
    //@ts-expect-error s
    const rows = (data ?? []) as Candidates;
    let cand = rows.filter((r) => r.parcel_id !== subject.parcel_id);

    if (clientValidOnly) {
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

    // *** override district based on neighborhoods_at_sale (set_id = 2) ***
    const withDistrict = cand.map((r) => {
      const district2 =
        districtFromNeighborhoods((r as any)?.neighborhoods_at_sale, 2) ??
        r.district;
      // keep type shape; just replace district value
      return { ...r, district: district2 } as CandidateRow;
    });

    return withDistrict;
  }, [
    data,
    subject,
    clientValidOnly,
    forceSameLandUse,
    livingAreaBand,
    maxDistanceMiles,
  ]);

  // Fields for Gower (exclude lat/lon from display later)
  const fields = useMemo<DisplayField[]>(
    () =>
      [
        {
          key: "land_use",
          type: "categorical",
          weight: wLandUse,
          label: "Land Use",
        },
        {
          key: "district", // <- computed for subject & candidates from set_id 2
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
      ] as const,
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

  // Base display fields (exclude lat/lon from table)
  const displayFields = useMemo(
    () => fields.filter((f) => f.key !== "lat" && f.key !== "lon"),
    [fields]
  );

  // Build display columns (base + two PPSF columns, which are NOT used in Gower)
  const displayCols = useMemo<DisplayCol[]>(() => {
    const base: DisplayCol[] = displayFields.map((f) => ({
      key: String(f.key),
      label: f.label ?? toLabel(String(f.key)),
      align: f.type === "numeric" ? "right" : "left",
      get: (row) => row[f.key as keyof CandidateRow],
    }));

    base.push(
      {
        key: "ppsf_finished",
        label: "Price/Sf (Finished)",
        align: "right",
        get: (_row, isSubject) =>
          isSubject
            ? (subject as any).values_per_sqft_finished
            : (_row as any).price_per_sqft_finished,
      },
      {
        key: "ppsf_building_total",
        label: "Price/Sf (Total)",
        align: "right",
        get: (_row, isSubject) =>
          isSubject
            ? (subject as any).values_per_sqft_building_total
            : (_row as any).price_per_sqft_building_total,
      }
    );

    return base;
  }, [displayFields, subject]);

  // Subject for gower: override district with set_id=2 neighborhood name
  const subjectForGower = useMemo(() => {
    return {
      ...(subject as any),
      district: subjectDistrict,
    } as unknown as CandidateRow;
  }, [subject, subjectDistrict]);

  // One localized cast so gower gets the exact row type it expects
  const ranked = useMemo(() => {
    if (!subjectForGower || candidates.length === 0) return [];
    return gowerDistances(subjectForGower, candidates, fields);
  }, [subjectForGower, candidates, fields]);

  // Build table rows (subject first)
  type TableRow = {
    isSubject: boolean;
    distance: number;
    miles: number | null;
    item: Partial<CandidateRow>;
  };

  const tableRows = useMemo<TableRow[]>(() => {
    const subjectDisplay: Partial<CandidateRow> = {
      parcel_id: subject.parcel_id,
      house_number: subject.house_number,
      street: subject.street,
      sale_date: undefined,
      sale_price: undefined,
      land_use: subject.land_use,
      district: subjectDistrict ?? subject.district,
      total_finished_area: subject.total_finished_area,
      total_unfinished_area: subject.total_unfinished_area,
      avg_condition: subject.avg_condition,
      lat: subject.lat,
      lon: subject.lon,
      total_units: (subject as any).total_units,
      land_area: subject.land_area,
      avg_year_built: subject.avg_year_built,
      land_to_building_area_ratio: subject.land_to_building_area_ratio,
      structure_count: subject.structure_count,
      lot: subject.lot,
      ext: subject.ext,
      block: subject.block,
    };

    const subjectRow: TableRow = {
      isSubject: true,
      distance: 0,
      miles: 0,
      item: subjectDisplay,
    };

    const compRows: TableRow[] = ranked.slice(0, k).map((r) => {
      const miles = haversineMiles(
        subject.lat,
        subject.lon,
        r.item.lat,
        r.item.lon
      );
      return { isSubject: false, distance: r.distance, miles, item: r.item };
    });

    return [subjectRow, ...compRows];
  }, [ranked, k, subject, subjectDistrict]);

  return (
    <div className="grid gap-4 mt-4">
      <GowerCompsControls
        // dates
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        asOfDate={asOfDate}
        setAsOfDate={setAsOfDate}
        // filters
        clientValidOnly={clientValidOnly}
        setClientValidOnly={setClientValidOnly}
        forceSameLandUse={forceSameLandUse}
        setForceSameLandUse={setForceSameLandUse}
        livingAreaBand={livingAreaBand}
        setLivingAreaBand={(v) => setLivingAreaBand(toInt(v, 0))}
        maxDistanceMiles={maxDistanceMiles}
        setMaxDistanceMiles={(v) => setMaxDistanceMiles(toNum(v) || 0)}
        k={k}
        setK={(v) => setK(Math.max(1, toInt(v, 5)))}
        // weights
        wLandUse={wLandUse}
        setWLandUse={setWLandUse}
        wDistrict={wDistrict}
        setWDistrict={setWDistrict}
        wLat={wLat}
        setWLat={setWLat}
        wLon={wLon}
        setWLon={setWLon}
        wFinished={wFinished}
        setWFinished={setWFinished}
        wUnfinished={wUnfinished}
        setWUnfinished={setWUnfinished}
        wAvgCond={wAvgCond}
        setWAvgCond={setWAvgCond}
        wLandToBuilding={wLandToBuilding}
        setWLandToBuilding={setWLandToBuilding}
        wStructureCount={wStructureCount}
        setWStructureCount={setWStructureCount}
        wTotalUnits={wTotalUnits}
        setWTotalUnits={setWTotalUnits}
        // status
        totalRows={data?.length ?? 0}
        isLoading={isLoading}
        hasError={!!error}
      />

      <GowerCompsDisplay
        k={k}
        candidatesCount={candidates.length}
        tableRows={tableRows}
        displayCols={displayCols}
        isLoading={isLoading}
      />
    </div>
  );
}

/** =========================
 * Controls component
 * ========================= */
function GowerCompsControls(props: {
  // dates
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  asOfDate: string;
  setAsOfDate: (v: string) => void;
  // filters
  clientValidOnly: boolean;
  setClientValidOnly: (v: boolean) => void;
  forceSameLandUse: boolean;
  setForceSameLandUse: (v: boolean) => void;
  livingAreaBand: number;
  setLivingAreaBand: (v: string) => void;
  maxDistanceMiles: number;
  setMaxDistanceMiles: (v: string) => void;
  k: number;
  setK: (v: string) => void;
  // weights
  wLandUse: number;
  setWLandUse: (v: number) => void;
  wDistrict: number;
  setWDistrict: (v: number) => void;
  wLat: number;
  setWLat: (v: number) => void;
  wLon: number;
  setWLon: (v: number) => void;
  wFinished: number;
  setWFinished: (v: number) => void;
  wUnfinished: number;
  setWUnfinished: (v: number) => void;
  wAvgCond: number;
  setWAvgCond: (v: number) => void;
  wLandToBuilding: number;
  setWLandToBuilding: (v: number) => void;
  wStructureCount: number;
  setWStructureCount: (v: number) => void;
  wTotalUnits: number;
  setWTotalUnits: (v: number) => void;
  // status
  totalRows: number;
  isLoading: boolean;
  hasError: boolean;
}) {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    asOfDate,
    setAsOfDate,
    clientValidOnly,
    setClientValidOnly,
    forceSameLandUse,
    setForceSameLandUse,
    livingAreaBand,
    setLivingAreaBand,
    maxDistanceMiles,
    setMaxDistanceMiles,
    k,
    setK,
    wLandUse,
    setWLandUse,
    wDistrict,
    setWDistrict,
    wLat,
    setWLat,
    wLon,
    setWLon,
    wFinished,
    setWFinished,
    wUnfinished,
    setWUnfinished,
    wAvgCond,
    setWAvgCond,
    wLandToBuilding,
    setWLandToBuilding,
    wStructureCount,
    setWStructureCount,
    wTotalUnits,
    setWTotalUnits,
    totalRows,
    isLoading,
    hasError,
  } = props;

  return (
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
          onChange={setLivingAreaBand}
        />
        <NumberCol
          id="milesLimit"
          label="Miles limit"
          step={0.1}
          value={maxDistanceMiles}
          onChange={setMaxDistanceMiles}
        />
        <NumberCol
          id="topK"
          label="Top K comps"
          min={1}
          value={k}
          onChange={setK}
        />

        <div className="flex flex-wrap gap-2 w-full mt-1">
          <WeightRow label="Land use" value={wLandUse} setValue={setWLandUse} />
          <WeightRow
            label="District"
            value={wDistrict}
            setValue={setWDistrict}
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
          Rows: {totalRows} • Loading: {String(isLoading)} • Error:{" "}
          {hasError ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}

/** =========================
 * Display component
 * ========================= */
function GowerCompsDisplay(props: {
  k: number;
  candidatesCount: number;
  tableRows: Array<{
    isSubject: boolean;
    distance: number;
    miles: number | null;
    item: Partial<CandidateRow>;
  }>;
  displayCols: DisplayCol[];
  isLoading: boolean;
}) {
  const { k, candidatesCount, tableRows, displayCols, isLoading } = props;

  // --- stable row id for selection ---
  const getRowId = (r: { isSubject: boolean; item: Partial<CandidateRow> }) => {
    const it = r.item as any;
    return String(
      it?.sale_id ?? `${it?.parcel_id ?? "p"}-${it?.sale_date ?? "d"}`
    );
  };

  // --- selection state (defaults to all comps whenever the list changes) ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allCompIds = useMemo(
    () => tableRows.filter((r) => !r.isSubject).map(getRowId),
    [tableRows]
  );

  useEffect(() => {
    setSelectedIds(new Set(allCompIds));
  }, [allCompIds]);

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectedComps = useMemo(
    () => tableRows.filter((r) => !r.isSubject && selectedIds.has(getRowId(r))),
    [tableRows, selectedIds]
  );

  // --- stats helpers ---
  const onlyNums = (arr: unknown[]) =>
    arr.map((v) => toNum(v)).filter((n) => Number.isFinite(n)) as number[];

  const computeStats = (arr: number[]) => {
    if (!arr.length)
      return null as null | {
        n: number;
        med: number;
        avg: number;
        min: number;
        max: number;
      };
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    const mid = Math.floor(n / 2);
    const med = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const sum = sorted.reduce((a, b) => a + b, 0);
    return { n, med, avg: sum / n, min: sorted[0], max: sorted[n - 1] };
  };

  const salePrices = onlyNums(selectedComps.map((r) => r.item.sale_price));
  const ppsfFinished = onlyNums(
    selectedComps.map((r) => (r.item as any).price_per_sqft_finished)
  );
  const ppsfTotal = onlyNums(
    selectedComps.map((r) => (r.item as any).price_per_sqft_building_total)
  );

  const saleStats = computeStats(salePrices);
  const finStats = computeStats(ppsfFinished);
  const totStats = computeStats(ppsfTotal);

  // --- subject areas & estimated values ---
  const subjectItem = useMemo(
    () => tableRows.find((r) => r.isSubject)?.item,
    [tableRows]
  );
  const subjFinished = toNum(subjectItem?.total_finished_area);
  const subjUnfinished = toNum(subjectItem?.total_unfinished_area);
  const subjTotalArea =
    (Number.isFinite(subjFinished) ? subjFinished : 0) +
    (Number.isFinite(subjUnfinished) ? subjUnfinished : 0);

  const estFinished =
    finStats && Number.isFinite(subjFinished)
      ? Math.round(finStats.med) * subjFinished
      : NaN;
  const estTotal =
    totStats && subjTotalArea > 0
      ? Math.round(totStats.med) * subjTotalArea
      : NaN;

  // --- small card component ---
  const StatCard = ({
    label,
    value,
    sub,
  }: {
    label: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
  }) => (
    <div className="rounded-md border bg-background p-3 min-w-[160px] w-full">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
      {sub ? (
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      ) : null}
    </div>
  );

  // --- concise stats table (Med/Avg/Min/Max) ---
  const StatsTableRow = ({
    label,
    s,
    money = false,
  }: {
    label: string;
    s: ReturnType<typeof computeStats>;
    money?: boolean;
  }) => (
    <tr>
      <td className="px-3 py-1 text-xs text-muted-foreground">{label}</td>
      <td className="px-3 py-1 tabular-nums text-right">{s?.n ?? 0}</td>
      <td className="px-3 py-1 tabular-nums text-right">
        {s ? (money ? moneyFmt(s.med) : numFmt(s.med, 2)) : "—"}
      </td>
      <td className="px-3 py-1 tabular-nums text-right">
        {s ? (money ? moneyFmt(s.avg) : numFmt(s.avg, 2)) : "—"}
      </td>
      <td className="px-3 py-1 tabular-nums text-right">
        {s ? (money ? moneyFmt(s.min) : numFmt(s.min, 2)) : "—"}
      </td>
      <td className="px-3 py-1 tabular-nums text-right">
        {s ? (money ? moneyFmt(s.max) : numFmt(s.max, 2)) : "—"}
      </td>
    </tr>
  );

  return (
    <section className="min-w-0">
      <div className="border rounded overflow-x-auto">
        <div className="p-2 border-b text-sm font-medium">
          Subject + Top {k} comps (candidates after filters: {candidatesCount})
        </div>

        {/* --- Table of subject + comps --- */}
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <Th>Sel</Th>
              <Th>Parcel</Th>
              <Th>Address</Th>
              <Th>Dissim</Th>
              <Th>Miles</Th>
              <Th>Sale Date</Th>
              <Th className="text-right">Sale Price</Th>
              {displayCols.map((c) => (
                <Th
                  key={c.key}
                  className={c.align === "right" ? "text-right" : ""}
                >
                  {c.label}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r, i) => {
              const it = r.item;
              const isSubject = r.isSubject;
              const id = getRowId(r);

              return (
                <tr
                  key={isSubject ? "subject" : `comp-${id}`}
                  className={
                    isSubject
                      ? "bg-yellow-50 font-medium"
                      : i % 2
                        ? "bg-background"
                        : "bg-background/70"
                  }
                >
                  <Td>
                    {!isSubject ? (
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedIds.has(id)}
                        onChange={() => toggleSelected(id)}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </Td>
                  <Td>
                    <ParcelNumber
                      id={it.parcel_id || 0}
                      lot={parseInt(it.lot || "0", 10) || 0}
                      ext={it.ext || 0}
                      block={it.block || 0}
                    />
                  </Td>
                  <Td>
                    {`${it.house_number ?? ""} ${it.street ?? ""}`.trim() ||
                      "—"}
                  </Td>
                  <Td>{numFmt(r.distance, 4)}</Td>
                  <Td>{r.miles == null ? "—" : numFmt(r.miles, 2)}</Td>
                  <Td>{String(it.sale_date ?? "—")}</Td>
                  <Td className="text-right">{moneyFmt(it.sale_price)}</Td>

                  {displayCols.map((c, idx) => {
                    const v = c.get(it, isSubject);
                    const right = c.align === "right" ? "text-right" : "";
                    return (
                      <Td
                        key={`${c.key}-${isSubject ? "subj" : idx}`}
                        className={right}
                      >
                        {c.align === "right" ? numFmt(v) : String(v ?? "—")}
                      </Td>
                    );
                  })}
                </tr>
              );
            })}

            {!tableRows.length && !isLoading && (
              <tr>
                <td
                  colSpan={7 + displayCols.length}
                  className="px-3 py-4 text-gray-500"
                >
                  No comps found with current filters.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td
                  colSpan={7 + displayCols.length}
                  className="px-3 py-4 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Cards + concise stats table --- */}
      <div className="flex gap-2">
        <div className="p-3 border-b space-y-3 w-[70%]">
          {/* Cards */}
          <div className="flex gap-2 w-full">
            <StatCard
              label="Est. Value (Finished × Median $/sf)"
              value={Number.isFinite(estFinished) ? moneyFmt(estFinished) : "—"}
              sub={
                Number.isFinite(subjFinished) && finStats
                  ? `${numFmt(subjFinished)} sf × ${moneyFmt(finStats.med)}/sf`
                  : undefined
              }
            />
            <StatCard
              label="Est. Value (Total × Median $/sf)"
              value={Number.isFinite(estTotal) ? moneyFmt(estTotal) : "—"}
              sub={
                Number.isFinite(subjTotalArea) && totStats
                  ? `${numFmt(subjTotalArea)} sf × ${moneyFmt(totStats.med)}/sf`
                  : undefined
              }
            />
          </div>

          {/* Concise stats table */}
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-1 text-left text-xs font-medium text-muted-foreground">
                    Metric
                  </th>
                  <th className="px-3 py-1 text-right text-xs font-medium text-muted-foreground">
                    N
                  </th>
                  <th className="px-3 py-1 text-right text-xs font-medium text-muted-foreground">
                    Median
                  </th>
                  <th className="px-3 py-1 text-right text-xs font-medium text-muted-foreground">
                    Avg
                  </th>
                  <th className="px-3 py-1 text-right text-xs font-medium text-muted-foreground">
                    Min
                  </th>
                  <th className="px-3 py-1 text-right text-xs font-medium text-muted-foreground">
                    Max
                  </th>
                </tr>
              </thead>
              <tbody>
                <StatsTableRow label="Sale Price" s={saleStats} money />
                <StatsTableRow label="Price/Sf (Finished)" s={finStats} money />
                <StatsTableRow label="Price/Sf (Total)" s={totStats} money />
              </tbody>
            </table>
          </div>
        </div>
        <CompsMapFromRows
          tableRows={[
            ...tableRows.filter(
              (r) => r.isSubject || selectedIds.has(getRowId(r))
            ),
            ...selectedComps,
          ]}
          className="h-64 md:h-96 flex-1 border-b"
        />
      </div>
    </section>
  );
}

/** =========================
 * UI helpers
 * ========================= */
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
