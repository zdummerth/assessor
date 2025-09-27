"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useParcelValueFeatures,
  useLandUseOptions,
  useNeighborhoods,
  type ParcelValueFeatureRow,
} from "@/lib/client-queries";
import FiltersSidebar from "../features/sidebar";
import StructuresDialog from "./features/structures-dialog";
import { DataTable } from "./features/data-table";
import { makeColumns } from "./features/columns";
import { TableToolbar } from "./features/table-toolbar";
import { ServerPagination } from "./features/server-pagination";

// land-use sets JSON
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
  // --- land use SET state ---
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

  // --- server pagination + sorting ---
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("");

  // filter options
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
      neighborhoodOptions.map((n: any) => ({
        value: n.id,
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  const resetToFirst = () => setPage(1);

  useEffect(() => {
    setSelectedLandUses((prev) =>
      prev.filter((c) => activeSetOptions.includes(String(c)))
    );
    setPage(1);
  }, [setKey, activeSetOptions]);

  const landUseOptionsWithinSet = useMemo(() => {
    if (!Array.isArray(landUseOptions)) return landUseOptions;
    if (landUseOptions.length && typeof landUseOptions[0] === "string") {
      return (landUseOptions as string[]).filter((code) =>
        activeSetOptions.includes(String(code))
      );
    }
    return (landUseOptions as any[]).filter((o) =>
      activeSetOptions.includes(String(o?.value ?? o))
    );
  }, [landUseOptions, activeSetOptions]);

  const hookOpts = useMemo(() => {
    const filters: any = {};
    if (ilikeStreet) {
      filters.ilike = { ...(filters.ilike || {}), street: `%${ilikeStreet}%` };
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

  const {
    data = [],
    meta,
    isLoading,
    error,
  } = useParcelValueFeatures(hookOpts);

  // Structures dialog state
  const [structuresOpen, setStructuresOpen] = useState(false);
  const [structuresData, setStructuresData] = useState<{
    parcelId: number;
    structures: any[];
  } | null>(null);

  const onOpenStructures = (row: ParcelValueFeatureRow) => {
    // @ts-expect-error upstream payload
    const raw = row.structures ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    setStructuresData({ parcelId: row.parcel_id, structures: arr });
    setStructuresOpen(true);
  };

  const { columns, sortKeyFor } = makeColumns(onOpenStructures);

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 p-4">
      <aside className="mb-4 lg:mb-0">
        {/* Land-use Set Tabs (shadcn buttons in your sidebar if you want) */}
        <div className="mb-3 inline-flex rounded border p-1">
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
          // setters
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
          // options
          landUseOptions={landUseOptionsWithinSet}
          luLoading={luLoading}
          luError={luError}
          neighborhoodOptions={formattedNeighborhoodOptions}
          nbLoading={nbLoading}
          nbError={nbError}
        />
      </aside>

      <section className="space-y-3">
        <TableToolbar
          ilikeStreet={ilikeStreet}
          setIlikeStreet={setIlikeStreet}
          total={meta?.total || undefined}
          onChange={() => setPage(1)}
        />

        <DataTable
          columns={columns}
          data={data}
          sortKeyFor={sortKeyFor}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
          isLoading={isLoading}
        />

        <ServerPagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          hasMore={meta?.has_more}
          //   pageCount={meta?.page_count}
          isLoading={isLoading}
        />

        {error && (
          <div className="rounded-lg border bg-white px-3 py-2 text-sm text-red-600">
            Error loading data. Check console.
          </div>
        )}
      </section>

      <StructuresDialog
        open={structuresOpen}
        onOpenChange={setStructuresOpen}
        parcelId={structuresData?.parcelId ?? null}
        structures={structuresData?.structures ?? []}
      />
    </div>
  );
}
