// app/(whatever)/ParcelFeaturesBrowser.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";

import {
  useParcelValueFeatures,
  useLandUseOptions,
  useNeighborhoods,
  type ParcelValueFeatureRow,
} from "@/lib/client-queries";

import StructuresDialog from "./features/structure-dialogue";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Filter,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X,
  Info,
} from "lucide-react";

// land-use sets JSON
import luSets from "@/lib/land_use_arrays.json";

// ---------------- helpers ----------------
const NUM = (n: number | string | null | undefined) =>
  Number.isFinite(Number(n)) ? Number(n) : undefined;

const currency = (n: number | string | null | undefined) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return String(n ?? "—");
  }
};

const pct = (n: number | string | null | undefined) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${(v * 100).toFixed(0)}%`;
};

const sortIconClass = (dir: "asc" | "desc" | "") =>
  `ml-1 h-4 w-4 transition-transform ${dir === "desc" ? "rotate-180" : ""} ${dir ? "" : "opacity-50"}`;

// build LU sets (same grouping)
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

// Limit sorting to safe columns (server should also guard)
const allowedSortCols = new Set([
  "parcel_id",
  "current_value",
  "total_finished_area",
  "land_area",
  "value_year",
]);

export default function ParcelFeaturesBrowser() {
  // land-use SET state
  const [setKey, setSetKey] = useState<LuSet>("residential");
  const activeSetOptions = useMemo(() => setCodes(setKey), [setKey]);

  // filters
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

  // NEW: abatement filters
  const [isAbated, setIsAbated] = useState<"any" | "true" | "false">("any");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]); // id strings

  // pagination + sorting
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("parcel_id"); // e.g. "parcel_id" or "-parcel_id"

  // data for filter inputs
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();

  const formattedNeighborhoodOptions = useMemo(
    () =>
      neighborhoodOptions.map((n) => ({
        // @ts-expect-error hook shape
        value: n.id,
        // @ts-expect-error hook shape
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
    return landUseOptions.filter((o) =>
      // @ts-expect-error flexible shape
      activeSetOptions.includes(String(o?.value ?? o))
    );
  }, [landUseOptions, activeSetOptions]);

  // hook options (server-driven)
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

    // default LUs to active set when none selected
    const land_uses =
      selectedLandUses.length > 0
        ? selectedLandUses
        : activeSetOptions.length > 0
          ? activeSetOptions
          : undefined;

    const abatement_programs =
      selectedPrograms.length > 0
        ? selectedPrograms.map((s) => Number(s)).filter(Number.isFinite)
        : undefined;

    const is_abated =
      isAbated === "any" ? undefined : isAbated === "true" ? true : false;

    // guard sort (server guards too)
    const top = (sort || "").trim();
    const bare = top.replace(/^-/, "");
    const safeSort = bare && allowedSortCols.has(bare) ? top : "parcel_id";

    return {
      as_of_date: asOfDate || undefined,
      land_uses,
      neighborhoods: selectedNeighborhoods.length
        ? selectedNeighborhoods
        : undefined,
      page,
      page_size: pageSize,
      sort: safeSort || undefined,
      filters,

      // NEW
      is_abated,
      abatement_programs,
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
    isAbated,
    selectedPrograms,
  ]);

  const { data, meta, isLoading, error } = useParcelValueFeatures(hookOpts);

  // Program options (derived from current data page for convenience)
  const programOptions = useMemo(() => {
    const map = new Map<
      number,
      { id: number; type: string | null; scale_type: string | null }
    >();
    for (const r of data ?? []) {
      const abs = (r as any).abatement as any[] | undefined;
      if (!Array.isArray(abs)) continue;
      for (const a of abs) {
        if (typeof a?.program_id === "number" && !map.has(a.program_id)) {
          map.set(a.program_id, {
            id: a.program_id,
            type: a.type ?? null,
            scale_type: a.scale_type ?? null,
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  }, [data]);

  // Structures dialog
  const [structuresOpen, setStructuresOpen] = useState(false);
  const [structuresData, setStructuresData] = useState<{
    parcelId: number;
    structures: any[];
  } | null>(null);

  const onOpenStructures = (row: ParcelValueFeatureRow) => {
    const raw = (row as any).structures ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    setStructuresData({ parcelId: row.parcel_id, structures: arr });
    setStructuresOpen(true);
  };

  // Abatement detail dialog
  const [abDetailOpen, setAbDetailOpen] = useState(false);
  const [abDetailData, setAbDetailData] = useState<{
    parcelId: number;
    programs: any[];
  } | null>(null);

  const openAbatementDetail = (row: ParcelValueFeatureRow) => {
    const arr = Array.isArray((row as any).abatement)
      ? (row as any).abatement
      : [];
    setAbDetailData({ parcelId: row.parcel_id, programs: arr });
    setAbDetailOpen(true);
  };

  // Sorting
  const toggleSort = (col: string) => {
    const top = (sort || "").trim();
    const bare = top.replace(/^-/, "");
    let next = "";
    if (bare !== col) next = col;
    else if (!top.startsWith("-")) next = `-${col}`;
    else next = "parcel_id";
    setSort(next);
    setPage(1);
  };

  const sortDirFor = (col: string): "asc" | "desc" | "" => {
    const top = (sort || "").trim();
    const bare = top.replace(/^-/, "");
    if (bare !== col) return "";
    return top.startsWith("-") ? "desc" : "asc";
  };

  // Paging
  const total = meta?.total ?? 0;
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(total, page * pageSize);
  const pageCount = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));

  // ---------------- UI ----------------
  return (
    <div className="p-4 space-y-4">
      {/* Top toolbar: Filters + active chips + quick page controls */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* Filters dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {/* Land-use set */}
                    <div className="space-y-2">
                      <div className="inline-flex rounded border p-1">
                        {(["residential", "other", "lots"] as LuSet[]).map(
                          (k) => (
                            <Button
                              key={k}
                              type="button"
                              variant={setKey === k ? "default" : "ghost"}
                              size="sm"
                              className="px-3"
                              onClick={() => {
                                setSetKey(k);
                                resetToFirst();
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
                      <label className="text-xs text-muted-foreground">
                        As of date
                      </label>
                      <Input
                        type="date"
                        value={asOfDate}
                        onChange={(e) => {
                          setAsOfDate(e.target.value);
                          resetToFirst();
                        }}
                      />
                    </div>

                    {/* Land uses (multi) */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Land uses
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between w-full"
                          >
                            {selectedLandUses.length
                              ? `${selectedLandUses.length} selected`
                              : "All (from active set)"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[300px] w-[320px] overflow-auto">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLandUses([]);
                              resetToFirst();
                            }}
                          >
                            Clear selection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(landUseOptionsWithinSet || []).map((o: any) => {
                            const value =
                              typeof o === "string" ? o : String(o?.value ?? o);
                            const label =
                              typeof o === "string" ? o : String(o?.label ?? o);
                            const checked = selectedLandUses.includes(value);
                            return (
                              <DropdownMenuCheckboxItem
                                key={value}
                                checked={checked}
                                onCheckedChange={(c) => {
                                  setSelectedLandUses((prev) => {
                                    const set = new Set(prev);
                                    c ? set.add(value) : set.delete(value);
                                    return Array.from(set);
                                  });
                                  resetToFirst();
                                }}
                              >
                                {label}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Neighborhoods (multi) */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Neighborhoods
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between w-full"
                          >
                            {selectedNeighborhoods.length
                              ? `${selectedNeighborhoods.length} selected`
                              : "All neighborhoods"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[300px] w-[360px] overflow-auto">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedNeighborhoods([]);
                              resetToFirst();
                            }}
                          >
                            Clear selection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(formattedNeighborhoodOptions || []).map((n) => {
                            const value = String(n.value);
                            const checked =
                              selectedNeighborhoods.includes(value);
                            return (
                              <DropdownMenuCheckboxItem
                                key={value}
                                checked={checked}
                                onCheckedChange={(c) => {
                                  setSelectedNeighborhoods((prev) => {
                                    const set = new Set(prev);
                                    c ? set.add(value) : set.delete(value);
                                    return Array.from(set);
                                  });
                                  resetToFirst();
                                }}
                              >
                                {n.label}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Street contains */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Street contains
                      </label>
                      <Input
                        placeholder="e.g. MAIN"
                        value={ilikeStreet}
                        onChange={(e) => {
                          setIlikeStreet(e.target.value);
                          resetToFirst();
                        }}
                      />
                    </div>

                    {/* Finished area range */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Finished area (min–max)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          inputMode="numeric"
                          placeholder="Min"
                          value={tfaMin}
                          onChange={(e) => {
                            setTfaMin(e.target.value);
                            resetToFirst();
                          }}
                        />
                        <Input
                          inputMode="numeric"
                          placeholder="Max"
                          value={tfaMax}
                          onChange={(e) => {
                            setTfaMax(e.target.value);
                            resetToFirst();
                          }}
                        />
                      </div>
                    </div>

                    {/* Current value range */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Current value (min–max)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          inputMode="numeric"
                          placeholder="Min"
                          value={cvMin}
                          onChange={(e) => {
                            setCvMin(e.target.value);
                            resetToFirst();
                          }}
                        />
                        <Input
                          inputMode="numeric"
                          placeholder="Max"
                          value={cvMax}
                          onChange={(e) => {
                            setCvMax(e.target.value);
                            resetToFirst();
                          }}
                        />
                      </div>
                    </div>

                    {/* Abated select */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Abated
                      </label>
                      <Select
                        value={isAbated}
                        onValueChange={(v) => {
                          setIsAbated(v as any);
                          resetToFirst();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Programs multi (derived from current data) */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Programs
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between w-full"
                          >
                            {selectedPrograms.length
                              ? `${selectedPrograms.length} selected`
                              : "All programs"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[300px] w-[360px] overflow-auto">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPrograms([]);
                              resetToFirst();
                            }}
                          >
                            Clear selection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {programOptions.map((p) => {
                            const idStr = String(p.id);
                            const checked = selectedPrograms.includes(idStr);
                            return (
                              <DropdownMenuCheckboxItem
                                key={p.id}
                                checked={checked}
                                onCheckedChange={(c) => {
                                  setSelectedPrograms((prev) => {
                                    const set = new Set(prev);
                                    c ? set.add(idStr) : set.delete(idStr);
                                    return Array.from(set);
                                  });
                                  resetToFirst();
                                }}
                              >
                                <span className="tabular-nums mr-2 w-14">
                                  {p.id}
                                </span>
                                <span className="text-muted-foreground">
                                  {p.type ?? "—"}
                                </span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {p.scale_type ?? ""}
                                </span>
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <DialogFooter>
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
                        setIsAbated("any");
                        setSelectedPrograms([]);
                        setSetKey("residential");
                        resetToFirst();
                      }}
                    >
                      Clear all
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Active filter chips (always show land-use set) */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">set: {setKey}</Badge>

                {asOfDate && (
                  <Badge variant="secondary">
                    as-of {asOfDate}
                    <button className="ml-1" onClick={() => setAsOfDate("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {!!selectedLandUses.length && (
                  <Badge variant="secondary">
                    {selectedLandUses.length} LU
                    <button
                      className="ml-1"
                      onClick={() => setSelectedLandUses([])}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {!!selectedNeighborhoods.length && (
                  <Badge variant="secondary">
                    {selectedNeighborhoods.length} neighborhoods
                    <button
                      className="ml-1"
                      onClick={() => setSelectedNeighborhoods([])}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {ilikeStreet && (
                  <Badge variant="secondary">
                    street ~ {ilikeStreet}
                    <button className="ml-1" onClick={() => setIlikeStreet("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(tfaMin || tfaMax) && (
                  <Badge variant="secondary">
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
                  <Badge variant="secondary">
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
                {isAbated !== "any" && (
                  <Badge variant="secondary">
                    abated: {isAbated === "true" ? "yes" : "no"}
                    <button className="ml-1" onClick={() => setIsAbated("any")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {!!selectedPrograms.length && (
                  <Badge variant="secondary">
                    {selectedPrograms.length} program(s)
                    <button
                      className="ml-1"
                      onClick={() => setSelectedPrograms([])}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Right: rows + pager */}
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

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page <= 1 || isLoading}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm tabular-nums">
                  {start ? `Showing ${start}-${end} of ${total}` : `0 of 0`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
                  disabled={page >= pageCount || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pageCount)}
                  disabled={page >= pageCount || isLoading}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table with full columns + Abatements */}
      <div className="max-h-[75vh] min-h-[200px] overflow-auto border rounded">
        <Table className="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSort("parcel_id")}
                >
                  Parcel
                  <ArrowUpDown
                    className={sortIconClass(sortDirFor("parcel_id"))}
                  />
                </Button>
              </TableHead>

              <TableHead>Address</TableHead>
              <TableHead>Land Use</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSort("current_value")}
                >
                  Value
                  <ArrowUpDown
                    className={sortIconClass(sortDirFor("current_value"))}
                  />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSort("total_finished_area")}
                >
                  Finished SF
                  <ArrowUpDown
                    className={sortIconClass(sortDirFor("total_finished_area"))}
                  />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSort("land_area")}
                >
                  Land SF
                  <ArrowUpDown
                    className={sortIconClass(sortDirFor("land_area"))}
                  />
                </Button>
              </TableHead>

              <TableHead>Units</TableHead>
              <TableHead>Avg Year Built</TableHead>
              <TableHead>Avg Condition</TableHead>
              <TableHead>$/Finished SF</TableHead>
              <TableHead>$/Land SF</TableHead>
              <TableHead>$/Unit</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSort("value_year")}
                >
                  Value Year
                  <ArrowUpDown
                    className={sortIconClass(sortDirFor("value_year"))}
                  />
                </Button>
              </TableHead>

              <TableHead>Abatements</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={15} className="text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={15} className="text-red-600">
                  Error loading data. Check console.
                </TableCell>
              </TableRow>
            ) : (data?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-muted-foreground">
                  No parcels
                </TableCell>
              </TableRow>
            ) : (
              (data as ParcelValueFeatureRow[]).map((r) => {
                const ble = [r.block ?? "—", r.lot ?? "—", r.ext ?? "—"].join(
                  "-"
                );
                const addr = [r.house_number, r.street, r.postcode]
                  .filter(Boolean)
                  .join(" ");
                const ab: any[] = Array.isArray((r as any).abatement)
                  ? ((r as any).abatement as any[])
                  : [];

                return (
                  <TableRow key={r.parcel_id}>
                    <TableCell className="whitespace-nowrap">
                      <Link
                        className="underline"
                        href={`/test/parcels/${r.parcel_id}`}
                      >
                        {r.parcel_id}
                      </Link>{" "}
                      <span className="text-muted-foreground">({ble})</span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {addr || "—"}
                    </TableCell>

                    <TableCell>{r.land_use ?? "—"}</TableCell>

                    <TableCell className="tabular-nums">
                      {currency(r.current_value)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.total_finished_area ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.land_area ?? "—"}
                    </TableCell>

                    <TableCell className="tabular-nums">
                      {r.total_units ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.avg_year_built ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {Number.isFinite(Number(r.avg_condition))
                        ? pct(Number(r.avg_condition) / 5)
                        : "—"}
                    </TableCell>

                    <TableCell className="tabular-nums">
                      {r.values_per_sqft_finished
                        ? currency(r.values_per_sqft_finished)
                        : "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.values_per_sqft_land
                        ? currency(r.values_per_sqft_land)
                        : "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.values_per_unit ? currency(r.values_per_unit) : "—"}
                    </TableCell>

                    <TableCell className="tabular-nums">
                      {r.value_year ?? "—"}
                    </TableCell>

                    {/* Abatements button */}
                    <TableCell>
                      {ab.length ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAbatementDetail(r)}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          View ({ab.length})
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenStructures(r)}
                      >
                        Structures
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Abatement Detail Dialog */}
      <Dialog open={abDetailOpen} onOpenChange={setAbDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Abatements{" "}
              {abDetailData?.parcelId ? `for #${abDetailData.parcelId}` : ""}
            </DialogTitle>
          </DialogHeader>
          {!!abDetailData?.programs?.length ? (
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {abDetailData.programs.map((a: any) => (
                <Card key={a.program_id}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">
                      Program #{a.program_id} {a.type ? `· ${a.type}` : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        Scale: {a.scale_type ?? "—"}
                      </Badge>
                      <Badge variant="secondary">
                        Years: {a.first_year ?? "—"}–{a.last_year ?? "—"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Bases: AGR {a?.parcel_bases?.agr ?? "—"}, COM{" "}
                      {a?.parcel_bases?.com ?? "—"}, RES{" "}
                      {a?.parcel_bases?.res ?? "—"}
                    </div>
                    {a.current_phase ? (
                      <div>
                        <div className="font-medium">Current Phase</div>
                        <div className="text-muted-foreground">
                          φ{a.current_phase.phase} {a.current_phase.first_year}–
                          {a.current_phase.last_year} · AGR{" "}
                          {a.current_phase.agr_abated ?? "—"} · COM{" "}
                          {a.current_phase.com_abated ?? "—"} · RES{" "}
                          {a.current_phase.res_abated ?? "—"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No current phase
                      </div>
                    )}
                    {!!a.phases?.length && (
                      <div>
                        <div className="font-medium">All Phases</div>
                        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {a.phases.map((p: any) => (
                            <div
                              key={p.phase_id}
                              className="rounded border p-2"
                            >
                              <div className="font-medium">φ{p.phase}</div>
                              <div className="text-muted-foreground text-xs">
                                {p.first_year}–{p.last_year}
                              </div>
                              <div className="text-xs">
                                AGR {p.agr_abated ?? "—"} · COM{" "}
                                {p.com_abated ?? "—"} · RES{" "}
                                {p.res_abated ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              No abatement programs.
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setAbDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Structures dialog */}
      <StructuresDialog
        open={structuresOpen}
        onClose={() => setStructuresOpen(false)}
        parcelId={structuresData?.parcelId ?? null}
        structures={structuresData?.structures ?? []}
      />
    </div>
  );
}
