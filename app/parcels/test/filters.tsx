// app/(whatever)/features/filters-dialog.tsx
"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { MultiSelect } from "@/components/ui/multi-select";

import { useLandUseOptions, useNeighborhoods } from "@/lib/client-queries";

import luSets from "@/lib/land_use_arrays.json";
import { Filter, X } from "lucide-react";

type LuSet = "all" | "residential" | "other" | "lots";

// --- land-use set helpers ---
const residential = luSets.residential;
const commercial = luSets.commercial;
const industrial = luSets.agriculture;
const lotsArr = luSets.lots;
const single_family = luSets.single_family;
const condo = luSets.condo;

const all_residential = [...residential, ...single_family, ...condo];
const all_other = [...commercial, ...industrial];

const setCodes = (k: LuSet): string[] => {
  switch (k) {
    case "residential":
      return all_residential.map(String);
    case "other":
      return all_other.map(String);
    case "lots":
      return lotsArr.map(String);
    case "all":
    default:
      return [];
  }
};

// ---- URL helpers (local, self-contained) ----
function useURLState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replaceQS = (sp: URLSearchParams) => {
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const setParams = (
    updates: Record<string, string | number | null | undefined>
  ) => {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    let changed = false;
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === undefined || v === "") {
        if (sp.has(k)) {
          sp.delete(k);
          changed = true;
        }
      } else {
        const next = String(v);
        if (sp.get(k) !== next) {
          sp.set(k, next);
          changed = true;
        }
      }
    }
    if (changed) replaceQS(sp);
  };

  const getArray = (key: string): string[] => {
    const raw = searchParams?.get(key);
    return raw
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  };

  return { searchParams, setParams, getArray };
}

export default function FiltersDialog() {
  const { searchParams, setParams, getArray } = useURLState();

  const setKey = searchParams?.get("set") as LuSet | "all";

  const asOfDate = searchParams?.get("as_of_date") ?? "";
  const selectedLandUses = getArray("lus");
  const selectedNeighborhoods = getArray("nbhds");
  const ilikeStreet = searchParams?.get("street") ?? "";
  const tfaMin = searchParams?.get("tfa_min") ?? "";
  const tfaMax = searchParams?.get("tfa_max") ?? "";
  const cvMin = searchParams?.get("cv_min") ?? "";
  const cvMax = searchParams?.get("cv_max") ?? "";

  // options from hooks
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();

  // normalize LU options to { value, label } (full set for labels/chips)
  const allLUOptionsNormalized = useMemo(() => {
    const raw = Array.isArray(landUseOptions) ? landUseOptions : [];
    const values =
      raw.length && typeof raw[0] === "string"
        ? (raw as string[])
        : (raw as any[]).map((o) => o?.value);
    const labels =
      raw.length && typeof raw[0] === "string"
        ? (raw as string[])
        : (raw as any[]).map((o) =>
            String((o as any)?.label ?? (o as any)?.value ?? o)
          );
    return values.map((v, i) => ({ value: v, label: labels[i] ?? v }));
  }, [landUseOptions]);

  const formattedNeighborhoodOptions = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  const activeSetOptions = useMemo(() => setCodes(setKey), [setKey]);

  // show all LUs if set === "all"; otherwise constrain for the selector options
  const landUseOptionsWithinSet = useMemo(() => {
    if (!activeSetOptions) return allLUOptionsNormalized;
    const allowed = new Set(activeSetOptions.map(String));
    return allLUOptionsNormalized.filter((o) => allowed.has(o.value));
  }, [allLUOptionsNormalized, activeSetOptions]);

  // When switching sets (except "all"), clamp selected LUs to allowed
  useEffect(() => {
    if (!activeSetOptions) return; // "all" => allow everything
    const allowed = new Set(activeSetOptions);
    const filtered = selectedLandUses.filter((v) => allowed.has(String(v)));
    if (filtered.length !== selectedLandUses.length) {
      setParams({ lus: filtered.length ? filtered.join(",") : null, page: 1 });
    }
  }, [setKey]);

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-end">
        {/* Abated only */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="abated-only"
            className="text-xs text-muted-foreground"
          >
            Abated
          </Label>
          <Switch
            id="abated-only"
            defaultChecked={searchParams?.get("abated") === "1"}
            onCheckedChange={(v) =>
              setParams({ abated: v ? 1 : null, page: 1 })
            }
          />
        </div>

        {/* Land-use set (includes All) */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Set</div>
          <Select
            defaultValue={setKey}
            onValueChange={(v) => setParams({ set: v as LuSet, page: 1 })}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Land-use set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="lots">Lots</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Land uses MultiSelect (shadcn) */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-xs text-muted-foreground">Land uses</div>
          <MultiSelect
            key={`lus-${selectedLandUses.join(",")}-${setKey}`} // remount on URL change to keep in sync
            options={landUseOptionsWithinSet}
            defaultValue={selectedLandUses}
            onValueChange={(next: string[]) => {
              setParams({
                page: 1,
                lus: next.length ? next.join(",") : null,
              });
            }}
          />
        </div>

        {/* Neighborhoods MultiSelect (shadcn) */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-xs text-muted-foreground">Neighborhoods</div>
          <MultiSelect
            key={`nbhds-${selectedNeighborhoods.join(",")}`}
            options={formattedNeighborhoodOptions}
            defaultValue={selectedNeighborhoods}
            onValueChange={(next: string[]) => {
              setParams({
                page: 1,
                nbhds: next.length ? next.join(",") : null,
              });
            }}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh] pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                {/* As-of date */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    As-of date
                  </div>
                  <Input
                    type="date"
                    value={asOfDate}
                    onChange={(e) =>
                      setParams({ as_of_date: e.target.value, page: 1 })
                    }
                  />
                </div>

                {/* Street contains */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Street contains
                  </div>
                  <Input
                    placeholder="e.g. MAIN"
                    defaultValue={ilikeStreet}
                    onChange={(e) =>
                      setParams({ street: e.target.value, page: 1 })
                    }
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
                      onChange={(e) =>
                        setParams({ tfa_min: e.target.value, page: 1 })
                      }
                    />
                    <Input
                      inputMode="numeric"
                      placeholder="Max"
                      value={tfaMax}
                      onChange={(e) =>
                        setParams({ tfa_max: e.target.value, page: 1 })
                      }
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
                      onChange={(e) =>
                        setParams({ cv_min: e.target.value, page: 1 })
                      }
                    />
                    <Input
                      inputMode="numeric"
                      placeholder="Max"
                      value={cvMax}
                      onChange={(e) =>
                        setParams({ cv_max: e.target.value, page: 1 })
                      }
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setParams({
                    set: "all",
                    as_of_date: null,
                    lus: null,
                    nbhds: null,
                    street: null,
                    tfa_min: null,
                    tfa_max: null,
                    cv_min: null,
                    cv_max: null,
                    abated: null,
                    sort: null,
                    page: 1,
                    page_size: 25,
                  })
                }
              >
                Clear all
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
