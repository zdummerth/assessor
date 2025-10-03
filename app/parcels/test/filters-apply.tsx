"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  useLandUseOptions,
  useNeighborhoods,
  useTaxStatusOptions,
  usePropertyClassOptions,
} from "@/lib/client-queries";
import luSets from "@/lib/land_use_arrays.json";

// NEW: shadcn/cmdk combobox multi
import {
  ComboboxMulti,
  type ComboOption,
} from "@/components/ui/combobox-multi";

type LuSet = "all" | "residential" | "other" | "lots";
type FiltersState = {
  setKey: LuSet;
  abated: boolean;
  tax_status: string[];
  property_class: string[];
  nbhds: string[];
  lus: string[];
};

// --- land-use set helpers ---
const residential = luSets.residential;
const commercial = luSets.commercial;
const industrial = luSets.agriculture;
const lotsArr = luSets.lots;
const single_family = luSets.single_family;
const condo = luSets.condo;

const all_residential = [...residential, ...single_family, ...condo];
const all_other = [...commercial, ...industrial];

const setCodes = (k: LuSet): string[] | null => {
  switch (k) {
    case "residential":
      return all_residential.map(String);
    case "other":
      return all_other.map(String);
    case "lots":
      return lotsArr.map(String);
    case "all":
    default:
      return null;
  }
};

// ---- URL helpers ----
const getArrayParam = (sp: URLSearchParams | null, key: string): string[] => {
  const raw = sp?.get(key);
  return raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
};

const readURLToState = (sp: URLSearchParams | null): FiltersState => {
  const setKey = ((sp?.get("set") as LuSet) ?? "all") as LuSet;
  return {
    setKey,
    abated: (sp?.get("abated") ?? "") === "1",
    tax_status: getArrayParam(sp, "tax_status"),
    property_class: getArrayParam(sp, "property_class"),
    nbhds: getArrayParam(sp, "nbhds"),
    lus: getArrayParam(sp, "lus"),
  };
};

const stateToParams = (s: FiltersState): Record<string, string | null> => ({
  set: s.setKey === "all" ? null : s.setKey,
  abated: s.abated ? "1" : null,
  tax_status: s.tax_status.length ? s.tax_status.join(",") : null,
  property_class: s.property_class.length ? s.property_class.join(",") : null,
  nbhds: s.nbhds.length ? s.nbhds.join(",") : null,
  lus: s.lus.length ? s.lus.join(",") : null,
  page: "1",
});

const arraysEqualAsSets = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  for (const x of b) if (!A.has(x)) return false;
  return true;
};
const statesEqual = (a: FiltersState, b: FiltersState) =>
  a.setKey === b.setKey &&
  a.abated === b.abated &&
  arraysEqualAsSets(a.tax_status, b.tax_status) &&
  arraysEqualAsSets(a.property_class, b.property_class) &&
  arraysEqualAsSets(a.nbhds, b.nbhds) &&
  arraysEqualAsSets(a.lus, b.lus);

export default function FiltersDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- options from hooks ----
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();
  const { options: taxStatusOptions } = useTaxStatusOptions();
  const { options: propertyClassOptions } = usePropertyClassOptions();

  // Normalize to ComboOption for ComboboxMulti
  const luOptionsAll: ComboOption[] = useMemo(() => {
    const raw = Array.isArray(landUseOptions) ? landUseOptions : [];
    if (raw.length && typeof raw[0] === "string") {
      return (raw as string[]).map((v) => ({
        value: String(v),
        label: String(v),
      }));
    }
    return (raw as any[]).map((o) => ({
      value: String(o?.value ?? o),
      label: String(o?.label ?? o?.value ?? o),
    }));
  }, [landUseOptions]);

  const nbOptions: ComboOption[] = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  const tsOptions: ComboOption[] = useMemo(
    () =>
      (taxStatusOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.name),
      })),
    [taxStatusOptions]
  );

  const pcOptions: ComboOption[] = useMemo(
    () =>
      (propertyClassOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.name),
      })),
    [propertyClassOptions]
  );

  // Helpers to map ids->labels for badges
  const mapLabel = (opts: ComboOption[], value: string) =>
    opts.find((o) => String(o.value) === String(value))?.label ?? value;

  // ---- URL snapshot & dialog-local state ----
  const urlState = useMemo(() => readURLToState(searchParams), [searchParams]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FiltersState>(urlState);

  // Reset dialog state from URL whenever the dialog opens
  useEffect(() => {
    if (open) setState(urlState);
  }, [open, urlState]);

  // Clamp LUs by selected set
  const allowedLUs = useMemo(() => setCodes(state.setKey), [state.setKey]);
  useEffect(() => {
    if (!allowedLUs) return;
    const allowed = new Set(allowedLUs);
    const filtered = state.lus.filter((v) => allowed.has(String(v)));
    if (filtered.length !== state.lus.length) {
      setState((prev) => ({ ...prev, lus: filtered }));
    }
  }, [allowedLUs]); // eslint-disable-line react-hooks/exhaustive-deps

  const luOptionsWithinSet = useMemo(() => {
    if (!allowedLUs) return luOptionsAll;
    const allowed = new Set(allowedLUs.map(String));
    return luOptionsAll.filter((o) => allowed.has(o.value));
  }, [luOptionsAll, allowedLUs]);

  const isDirty = useMemo(
    () => !statesEqual(state, urlState),
    [state, urlState]
  );

  const applyAll = () => {
    const next = new URLSearchParams();
    const params = stateToParams(state);
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== "") next.set(k, v);
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    setOpen(false);
  };

  const clearAll = () => {
    router.replace(`${pathname}`, { scroll: false });
    setOpen(false);
  };

  // Badges (read-only) from URL
  const badges = (
    <div className="flex flex-wrap items-center gap-2">
      {urlState.abated && <Badge variant="secondary">Abated</Badge>}
      {urlState.setKey !== "all" && (
        <Badge variant="outline">Set: {urlState.setKey}</Badge>
      )}
      {urlState.tax_status.map((id) => (
        <Badge key={`ts-${id}`} variant="secondary">
          {mapLabel(tsOptions, id)}
        </Badge>
      ))}
      {urlState.property_class.map((id) => (
        <Badge key={`pc-${id}`} variant="secondary">
          {mapLabel(pcOptions, id)}
        </Badge>
      ))}
      {urlState.nbhds.map((id) => (
        <Badge key={`nb-${id}`} variant="secondary">
          {mapLabel(nbOptions, id)}
        </Badge>
      ))}
      {urlState.lus.map((code) => (
        <Badge key={`lu-${code}`} variant="secondary">
          {mapLabel(luOptionsAll, code)}
        </Badge>
      ))}
      {!urlState.abated &&
        urlState.setKey === "all" &&
        urlState.tax_status.length === 0 &&
        urlState.property_class.length === 0 &&
        urlState.nbhds.length === 0 &&
        urlState.lus.length === 0 && (
          <span className="text-xs text-muted-foreground">
            No filters applied
          </span>
        )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">{badges}</div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Filters</Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Abated */}
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="abated-only" className="text-sm">
                    Abated
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    Show only abated parcels
                  </div>
                </div>
                <Switch
                  id="abated-only"
                  checked={state.abated}
                  onCheckedChange={(v) =>
                    setState((s) => ({ ...s, abated: !!v }))
                  }
                />
              </div>

              {/* Land-use set */}
              <div className="space-y-2">
                <Label className="text-sm">Land-use Set</Label>
                <Select
                  value={state.setKey}
                  onValueChange={(v) =>
                    setState((s) => ({ ...s, setKey: v as LuSet }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="lots">Lots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tax Status */}
              <div className="space-y-2">
                <Label className="text-sm">Tax Status</Label>
                <ComboboxMulti
                  options={tsOptions}
                  value={state.tax_status}
                  onChange={(arr) =>
                    setState((s) => ({ ...s, tax_status: arr }))
                  }
                  placeholder="Select tax status…"
                />
              </div>

              {/* Property Class */}
              <div className="space-y-2">
                <Label className="text-sm">Property Class</Label>
                <ComboboxMulti
                  options={pcOptions}
                  value={state.property_class}
                  onChange={(arr) =>
                    setState((s) => ({ ...s, property_class: arr }))
                  }
                  placeholder="Select property class…"
                />
              </div>

              {/* Neighborhoods */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Neighborhoods</Label>
                <ComboboxMulti
                  options={nbOptions}
                  value={state.nbhds}
                  onChange={(arr) => setState((s) => ({ ...s, nbhds: arr }))}
                  placeholder="Select neighborhoods…"
                />
              </div>

              {/* Land Uses (constrained by set) */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Land Uses</Label>
                <ComboboxMulti
                  options={luOptionsWithinSet}
                  value={state.lus}
                  onChange={(arr) => setState((s) => ({ ...s, lus: arr }))}
                  placeholder="Select land uses…"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
              <Button onClick={applyAll} disabled={!isDirty}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
