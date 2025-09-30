"use client";

import React, { useMemo, useState, useEffect } from "react";

// data hooks
import {
  useParcelValueFeatures,
  useLandUseOptions,
  useNeighborhoods,
} from "@/lib/client-queries";

// table + dialogs you already have
import { DataTable } from "./features/data-table";
import { makeColumns } from "./features/columns";
import { ServerPagination } from "./features/server-pagination";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// icons
import { Filter, X } from "lucide-react";

// your multi-select
import MultiSelect from "@/components/inputs/multi-select";

// land-use sets JSON
import luSets from "@/lib/land_use_arrays.json";

const NUM = (n: number | string | null | undefined) =>
  Number.isFinite(Number(n)) ? Number(n) : undefined;

// ---- Build the 3 sets from JSON (same grouping as before) ----
const residential = (luSets as any).residential as number[];
const commercial = (luSets as any).commercial as number[];
const industrial = (luSets as any).agriculture as number[];
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
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  // NEW: boolean abated filter (abated only)
  const [isAbatedOnly, setIsAbatedOnly] = useState<boolean>(false);

  // --- server pagination + sorting ---
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("");

  // filter options
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();

  // Normalize options to {value,label} for MultiSelect
  const landUseOptionsWithinSet = useMemo(() => {
    const raw = Array.isArray(landUseOptions) ? landUseOptions : [];
    const values =
      raw.length && typeof raw[0] === "string"
        ? (raw as string[])
        : (raw as any[]).map((o) => String((o as any)?.value ?? o));
    const labels =
      raw.length && typeof raw[0] === "string"
        ? (raw as string[])
        : (raw as any[]).map((o) =>
            String((o as any)?.label ?? (o as any)?.value ?? o)
          );

    const options = values.map((v, i) => ({
      value: v,
      label: labels[i] ?? v,
    }));

    // constrain to active set
    const allowed = new Set(activeSetOptions.map(String));
    return options.filter((o) => allowed.has(o.value));
  }, [landUseOptions, activeSetOptions]);

  const formattedNeighborhoodOptions = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  // quick maps for chip labels
  const luLabelMap = useMemo(
    () => new Map(landUseOptionsWithinSet.map((o) => [o.value, o.label])),
    [landUseOptionsWithinSet]
  );
  const nbLabelMap = useMemo(
    () => new Map(formattedNeighborhoodOptions.map((o) => [o.value, o.label])),
    [formattedNeighborhoodOptions]
  );

  const resetToFirst = () => setPage(1);

  // Clamp selected LUs to active set
  useEffect(() => {
    setSelectedLandUses((prev) =>
      prev.filter((c) => activeSetOptions.includes(String(c)))
    );
    setPage(1);
  }, [setKey, activeSetOptions]);

  // ---------------- hook options ----------------
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
      is_abated: isAbatedOnly ? true : undefined, // NEW: include only if true
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
    isAbatedOnly, // <— include in deps
  ]);

  const {
    data = [],
    meta,
    isLoading,
    error,
  } = useParcelValueFeatures(hookOpts);

  const { columns, sortKeyFor } = makeColumns();

  // chip helpers
  const removeLandUse = (v: string) => {
    setSelectedLandUses((prev) => prev.filter((x) => x !== v));
    resetToFirst();
  };
  const removeNeighborhood = (v: string) => {
    setSelectedNeighborhoods((prev) => prev.filter((x) => x !== v));
    resetToFirst();
  };

  // cap massive chip lists when defaulting to the set (we only chip explicit selections)
  const luChips = selectedLandUses.map((v) => ({
    value: v,
    label: luLabelMap.get(v) ?? v,
  }));
  const nbChips = selectedNeighborhoods.map((v) => ({
    value: v,
    label: nbLabelMap.get(v) ?? v,
  }));

  return (
    <div className="p-4 space-y-3">
      {/* Top toolbar: Filters dialog + active chips + quick controls */}
      <div className="rounded-lg border bg-background p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: Filters button + chips */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>

                  <ScrollArea className="max-h-[70vh] pr-1">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Land-use Set */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Land-use set
                        </div>
                        <div className="inline-flex rounded border p-1">
                          {(["residential", "other", "lots"] as LuSet[]).map(
                            (k) => (
                              <Button
                                key={k}
                                type="button"
                                size="sm"
                                variant={setKey === k ? "default" : "ghost"}
                                className="px-3"
                                onClick={() => {
                                  setSetKey(k);
                                  setPage(1);
                                }}
                              >
                                {k === "residential"
                                  ? "Residential"
                                  : k === "other"
                                    ? "Other"
                                    : "Lots"}
                              </Button>
                            )
                          )}
                        </div>
                      </div>

                      {/* As-of date */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          As-of date
                        </div>
                        <Input
                          type="date"
                          value={asOfDate}
                          onChange={(e) => {
                            setAsOfDate(e.target.value);
                            setPage(1);
                          }}
                        />
                      </div>

                      {/* Land Uses (MultiSelect) */}
                      <div className="space-y-2 md:col-span-1">
                        <MultiSelect
                          label="Land uses"
                          options={landUseOptionsWithinSet}
                          value={selectedLandUses}
                          onChange={(next) => {
                            setSelectedLandUses(next);
                            setPage(1);
                          }}
                          placeholder="Search land uses…"
                        />
                      </div>

                      {/* Neighborhoods (MultiSelect) */}
                      <div className="space-y-2 md:col-span-1">
                        <MultiSelect
                          label="Neighborhoods"
                          options={formattedNeighborhoodOptions}
                          value={selectedNeighborhoods}
                          onChange={(next) => {
                            setSelectedNeighborhoods(next);
                            setPage(1);
                          }}
                          placeholder="Search neighborhoods…"
                        />
                      </div>

                      {/* Street contains */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Street contains
                        </div>
                        <Input
                          placeholder="e.g. MAIN"
                          value={ilikeStreet}
                          onChange={(e) => {
                            setIlikeStreet(e.target.value);
                            setPage(1);
                          }}
                        />
                      </div>

                      {/* Finished area range */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Finished area (sf)
                        </div>
                        <div className="flex gap-2">
                          <Input
                            inputMode="numeric"
                            placeholder="Min"
                            value={tfaMin}
                            onChange={(e) => {
                              setTfaMin(e.target.value);
                              setPage(1);
                            }}
                          />
                          <Input
                            inputMode="numeric"
                            placeholder="Max"
                            value={tfaMax}
                            onChange={(e) => {
                              setTfaMax(e.target.value);
                              setPage(1);
                            }}
                          />
                        </div>
                      </div>

                      {/* Current value range */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Current value ($)
                        </div>
                        <div className="flex gap-2">
                          <Input
                            inputMode="numeric"
                            placeholder="Min"
                            value={cvMin}
                            onChange={(e) => {
                              setCvMin(e.target.value);
                              setPage(1);
                            }}
                          />
                          <Input
                            inputMode="numeric"
                            placeholder="Max"
                            value={cvMax}
                            onChange={(e) => {
                              setCvMax(e.target.value);
                              setPage(1);
                            }}
                          />
                        </div>
                      </div>

                      {/* NEW: Abated only (boolean) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-md border p-3">
                          <Label htmlFor="abated-only">Abated only</Label>
                          <Switch
                            id="abated-only"
                            checked={isAbatedOnly}
                            onCheckedChange={(v) => {
                              setIsAbatedOnly(!!v);
                              setPage(1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAsOfDate("");
                        setSelectedLandUses([]);
                        setSelectedNeighborhoods([]);
                        setIlikeStreet("");
                        setTfaMin("");
                        setTfaMax("");
                        setCvMin("");
                        setCvMax("");
                        setSetKey("residential");
                        setIsAbatedOnly(false); // clear abated filter
                        setPage(1);
                      }}
                    >
                      Clear all
                    </Button>
                    <Button type="button" onClick={() => setFiltersOpen(false)}>
                      Done
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Rows per page (quick) */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Rows</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active chips (individual LU + NB + abated) */}
            <div className="flex flex-wrap gap-1">
              {/* Always show set chip */}
              <Badge variant="secondary">set: {setKey}</Badge>

              {/* land uses (chips for selected) */}
              {selectedLandUses.map((v) => {
                const label = luLabelMap.get(v) ?? v;
                return (
                  <Badge key={`lu-${v}`} variant="secondary" className="gap-1">
                    {label}
                    <button
                      className="ml-1"
                      aria-label={`Remove ${label}`}
                      onClick={() => removeLandUse(v)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}

              {/* neighborhoods (chips) */}
              {selectedNeighborhoods.map((v) => {
                const label = nbLabelMap.get(v) ?? v;
                return (
                  <Badge key={`nb-${v}`} variant="secondary" className="gap-1">
                    {label}
                    <button
                      className="ml-1"
                      aria-label={`Remove ${label}`}
                      onClick={() => removeNeighborhood(v)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}

              {/* NEW: Abated chip */}
              {isAbatedOnly && (
                <Badge variant="secondary" className="gap-1">
                  abated
                  <button
                    className="ml-1"
                    aria-label="Remove abated filter"
                    onClick={() => setIsAbatedOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Other filter chips */}
              {asOfDate && (
                <Badge variant="secondary" className="gap-1">
                  as-of {asOfDate}
                  <button className="ml-1" onClick={() => setAsOfDate("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {ilikeStreet && (
                <Badge variant="secondary" className="gap-1">
                  street ~ {ilikeStreet}
                  <button className="ml-1" onClick={() => setIlikeStreet("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(tfaMin || tfaMax) && (
                <Badge variant="secondary" className="gap-1">
                  tfa {tfaMin || "—"}–{tfaMax || "—"}
                  <button
                    className="ml-1"
                    onClick={() => {
                      setTfaMin("");
                      setTfaMax("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(cvMin || cvMax) && (
                <Badge variant="secondary" className="gap-1">
                  value {cvMin || "—"}–{cvMax || "—"}
                  <button
                    className="ml-1"
                    onClick={() => {
                      setCvMin("");
                      setCvMax("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={data}
        sortKeyFor={sortKeyFor}
        sort={sort}
        setSort={(v) => {
          setSort(v);
          setPage(1);
        }}
        setPage={setPage}
        isLoading={isLoading}
      />

      {/* Server pagination controls */}
      <ServerPagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        hasMore={meta?.has_more}
        isLoading={isLoading}
      />

      {error && (
        <div className="rounded-lg border bg-white px-3 py-2 text-sm text-red-600">
          Error loading data. Check console.
        </div>
      )}
    </div>
  );
}
