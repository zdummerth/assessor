// app/(whatever)/ParcelFeaturesBrowser.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useParcelValueFeatures,
  useLandUseOptions,
  useNeighborhoods,
  type ParcelValueFeatureRow,
} from "@/lib/client-queries";
import FiltersSidebar from "./features/sidebar";
import PaginationToolbar from "./features/pagination";
import ParcelTable from "./features/table";
import StructuresDialog from "./features/structure-dialogue";

// NEW: land-use sets JSON
import luSets from "@/lib/land_use_arrays.json";

const NUM = (n: number | string | null | undefined) =>
  Number.isFinite(Number(n)) ? Number(n) : undefined;

// ---- Build the 3 sets from JSON (same grouping as before) ----
const residential = (luSets as any).residential as number[];
const commercial = (luSets as any).commercial as number[];
const industrial = (luSets as any).agriculture as number[]; // matches prior code
const lots = (luSets as any).lots as number[];
const single_family = (luSets as any).single_family as number[];
const condo = (luSets as any).condo as number[];

const all_residential = [...residential, ...single_family, ...condo];
const all_other = [...commercial, ...industrial];
const all_lots = lots;

type LuSet = "residential" | "other" | "lots";
const setCodes = (setKey: LuSet): string[] => {
  switch (setKey) {
    case "residential":
      return all_residential.map(String);
    case "other":
      return all_other.map(String);
    case "lots":
      return all_lots.map(String);
  }
};

export default function ParcelFeaturesBrowser() {
  // --- land use SET state (NEW) ---
  const [setKey, setSetKey] = useState<LuSet>("residential");
  const activeSetOptions = useMemo(() => setCodes(setKey), [setKey]);

  // --- filters state ---
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [selectedLandUses, setSelectedLandUses] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    []
  );
  const [ilikeStreet, setIlikeStreet] = useState<string>("");
  const [tfaMin, setTfaMin] = useState<string>("");
  const [tfaMax, setTfaMax] = useState<string>("");
  const [cvMin, setCvMin] = useState<string>("");
  const [cvMax, setCvMax] = useState<string>("");

  // --- pagination + sorting ---
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("");

  // data for filter inputs
  const {
    options: landUseOptions,
    isLoading: luLoading,
    error: luError,
  } = useLandUseOptions();
  const {
    options: neighborhoodOptions,
    isLoading: nbLoading,
    error: nbError,
  } = useNeighborhoods();

  const formattedNeighborhoodOptions = useMemo(
    () =>
      neighborhoodOptions.map((n) => ({
        //@ts-expect-error d
        value: n.id,
        //@ts-expect-error d
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  const resetToFirst = () => setPage(1);

  // When the active SET changes, clamp any selected LUs to that set and reset page.
  useEffect(() => {
    setSelectedLandUses((prev) =>
      prev.filter((c) => activeSetOptions.includes(String(c)))
    );
    setPage(1);
  }, [setKey, activeSetOptions]);

  // Filter the LU options shown in the sidebar to the active set (if options are strings).
  // If your landUseOptions are objects, adapt the predicate accordingly.
  const landUseOptionsWithinSet = useMemo(() => {
    if (!Array.isArray(landUseOptions)) return landUseOptions;
    // Try to support either string[] or {value,label}[]
    if (landUseOptions.length && typeof landUseOptions[0] === "string") {
      return (landUseOptions as string[]).filter((code) =>
        activeSetOptions.includes(String(code))
      );
    }
    return landUseOptions.filter((o) =>
      //@ts-expect-error d
      activeSetOptions.includes(String(o?.value ?? o))
    );
  }, [landUseOptions, activeSetOptions]);

  const hookOpts = useMemo(() => {
    const filters: any = {};

    if (ilikeStreet) {
      filters.ilike = {
        ...(filters.ilike || {}),
        street: `%${ilikeStreet}%`,
      };
    }

    const gte: Record<string, number> = {};
    const lte: Record<string, number> = {};

    if (NUM(tfaMin) !== undefined && tfaMin !== "")
      gte.total_finished_area = NUM(tfaMin)!;
    if (NUM(tfaMax) !== undefined && tfaMax !== "")
      lte.total_finished_area = NUM(tfaMax)!;

    if (NUM(cvMin) !== undefined && cvMin !== "")
      gte.current_value = NUM(cvMin)!;
    if (NUM(cvMax) !== undefined && cvMax !== "")
      lte.current_value = NUM(cvMax)!;

    if (Object.keys(gte).length) filters.gte = gte;
    if (Object.keys(lte).length) filters.lte = lte;

    // IMPORTANT: If no explicit LUs selected, default to the active SET
    const land_uses =
      selectedLandUses.length > 0
        ? selectedLandUses
        : activeSetOptions.length > 0
          ? activeSetOptions
          : undefined;

    return {
      as_of_date: asOfDate || undefined,
      land_uses,
      neighborhoods: selectedNeighborhoods.length
        ? selectedNeighborhoods
        : undefined,
      page,
      page_size: pageSize,
      sort: sort || undefined,
      filters,
    };
  }, [
    asOfDate,
    selectedLandUses,
    selectedNeighborhoods,
    page,
    pageSize,
    sort,
    ilikeStreet,
    tfaMin,
    tfaMax,
    cvMin,
    cvMax,
    activeSetOptions,
  ]);

  const { data, meta, isLoading, error } = useParcelValueFeatures(hookOpts);

  // Structures dialog state
  const [structuresOpen, setStructuresOpen] = useState(false);
  const [structuresData, setStructuresData] = useState<{
    parcelId: number;
    structures: any[];
  } | null>(null);

  const onOpenStructures = (row: ParcelValueFeatureRow) => {
    //@ts-expect-error d
    const raw = row.structures ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    setStructuresData({ parcelId: row.parcel_id, structures: arr });
    setStructuresOpen(true);
  };

  // Sorting helpers
  const toggleSort = (col: string) => {
    const parts = sort
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const top = parts[0] ?? "";
    const bare = top.replace(/^-/, "");
    let next = "";
    if (bare !== col) next = col;
    else if (!top.startsWith("-")) next = `-${col}`;
    else next = "";
    setSort(next);
    setPage(1);
  };

  const sortDirFor = (col: string): "asc" | "desc" | "" => {
    const top = sort.split(",").map((s) => s.trim())[0] || "";
    if (!top) return "";
    const bare = top.replace(/^-/, "");
    if (bare !== col) return "";
    return top.startsWith("-") ? "desc" : "asc";
  };

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 p-4">
      <aside className="mb-4 lg:mb-0">
        {/* NEW: Land-use Set Tabs */}
        <div className="mb-3">
          <div className="inline-flex rounded border p-1">
            {(["residential", "other", "lots"] as LuSet[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSetKey(k)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  setKey === k ? "bg-gray-900 text-white" : ""
                }`}
              >
                {k === "residential"
                  ? "Residential"
                  : k === "other"
                    ? "Other"
                    : "Lots"}
              </button>
            ))}
          </div>
        </div>

        <FiltersSidebar
          // values
          asOfDate={asOfDate}
          selectedLandUses={selectedLandUses}
          selectedNeighborhoods={selectedNeighborhoods}
          ilikeStreet={ilikeStreet}
          tfaMin={tfaMin}
          tfaMax={tfaMax}
          cvMin={cvMin}
          cvMax={cvMax}
          // setters (auto apply + reset page)
          setAsOfDate={(v) => {
            setAsOfDate(v);
            resetToFirst();
          }}
          setSelectedLandUses={(v) => {
            setSelectedLandUses(v);
            resetToFirst();
          }}
          setSelectedNeighborhoods={(v) => {
            setSelectedNeighborhoods(v);
            resetToFirst();
          }}
          setIlikeStreet={(v) => {
            setIlikeStreet(v);
            resetToFirst();
          }}
          setTfaMin={(v) => {
            setTfaMin(v);
            resetToFirst();
          }}
          setTfaMax={(v) => {
            setTfaMax(v);
            resetToFirst();
          }}
          setCvMin={(v) => {
            setCvMin(v);
            resetToFirst();
          }}
          setCvMax={(v) => {
            setCvMax(v);
            resetToFirst();
          }}
          // options (land uses constrained to active set)
          landUseOptions={landUseOptionsWithinSet}
          luLoading={luLoading}
          luError={luError}
          neighborhoodOptions={formattedNeighborhoodOptions}
          nbLoading={nbLoading}
          nbError={nbError}
        />
      </aside>

      <section className="space-y-4">
        <PaginationToolbar
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={(n) => {
            setPageSize(n);
            setPage(1);
          }}
          total={meta?.total ?? undefined}
          hasMore={meta?.has_more ?? undefined}
          isLoading={isLoading}
          dataLen={data?.length ?? 0}
        />

        {error && (
          <div className="rounded-lg border bg-white px-3 py-2 text-sm text-red-600">
            Error loading data. Check console.
          </div>
        )}

        <div className="max-h-[75vh] min-h-[200px] overflow-auto border rounded">
          <ParcelTable
            rows={data ?? []}
            isLoading={isLoading}
            onHeaderClick={toggleSort}
            sortDirFor={sortDirFor}
            onOpenStructures={onOpenStructures}
          />
        </div>
      </section>

      <StructuresDialog
        open={structuresOpen}
        onClose={() => setStructuresOpen(false)}
        parcelId={structuresData?.parcelId ?? null}
        structures={structuresData?.structures ?? []}
      />
    </div>
  );
}
