// app/(whatever)/ParcelFeaturesBrowser.tsx
"use client";

import React, { useMemo, useState } from "react";
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

const NUM = (n: number | string | null | undefined) =>
  Number.isFinite(Number(n)) ? Number(n) : undefined;

export default function ParcelFeaturesBrowser() {
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

  console.log({ landUseOptions, neighborhoodOptions });
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

    return {
      as_of_date: asOfDate || undefined,
      land_uses: selectedLandUses.length ? selectedLandUses : undefined,
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
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6">
      <aside className="mb-4 lg:mb-0">
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
          // options
          landUseOptions={landUseOptions}
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

        <ParcelTable
          rows={data ?? []}
          isLoading={isLoading}
          onHeaderClick={toggleSort}
          sortDirFor={sortDirFor}
          onOpenStructures={onOpenStructures}
        />
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
