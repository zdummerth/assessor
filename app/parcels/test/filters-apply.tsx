// app/(whatever)/features/filters-dialog.tsx
"use client";

import * as React from "react";
import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReactSelectMulti, { RSOption } from "@/components/ui/react-select-multi";
import { Button } from "@/components/ui/button";
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

const stateToParams = (s: FiltersState): Record<string, string | null> => {
  return {
    set: s.setKey === "all" ? null : s.setKey,
    abated: s.abated ? "1" : null,
    tax_status: s.tax_status.length ? s.tax_status.join(",") : null,
    property_class: s.property_class.length ? s.property_class.join(",") : null,
    nbhds: s.nbhds.length ? s.nbhds.join(",") : null,
    lus: s.lus.length ? s.lus.join(",") : null,
    page: "1", // reset page whenever filters apply
  };
};

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

  // Normalize options
  const luOptionsAll: RSOption[] = useMemo(() => {
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

  const nbOptions: RSOption[] = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  const tsOptions: RSOption[] = useMemo(
    () =>
      (taxStatusOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.name),
      })),
    [taxStatusOptions]
  );

  const pcOptions: RSOption[] = useMemo(
    () =>
      (propertyClassOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.name),
      })),
    [propertyClassOptions]
  );

  // ---- URL snapshot & component state ----
  const urlState = useMemo(() => readURLToState(searchParams), [searchParams]);
  const mounted = useRef(false);
  const [state, setState] = useState<FiltersState>(urlState);

  //   // Initialize from URL only once on mount
  //   useEffect(() => {
  //     if (!mounted.current) {
  //       setState(urlState);
  //       mounted.current = true;
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  // Recompute allowed LUs when setKey changes; clamp selected LUs to allowed
  const allowedLUs = useMemo(() => setCodes(state.setKey), [state.setKey]);
  useEffect(() => {
    if (!allowedLUs) return; // "all" => no clamping
    const allowed = new Set(allowedLUs);
    const filtered = state.lus.filter((v) => allowed.has(String(v)));
    if (filtered.length !== state.lus.length) {
      setState((prev) => ({ ...prev, lus: filtered }));
    }
  }, [allowedLUs]); // eslint-disable-line react-hooks/exhaustive-deps

  // LU options constrained by set
  const luOptionsWithinSet: RSOption[] = useMemo(() => {
    if (!allowedLUs) return luOptionsAll;
    const allowed = new Set(allowedLUs.map(String));
    return luOptionsAll.filter((o) => allowed.has(o.value));
  }, [luOptionsAll, allowedLUs]);

  // ---- dirty check (URL vs local state) ----
  const isDirty = useMemo(
    () => !statesEqual(state, urlState),
    [state, urlState]
  );

  // ---- handlers ----
  const applyAll = () => {
    const next = new URLSearchParams();
    const params = stateToParams(state);
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== "") next.set(k, v);
    }
    // persist all at once
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.replace(`${pathname}`, { scroll: false });
    setState({
      setKey: "all",
      abated: false,
      tax_status: [],
      property_class: [],
      nbhds: [],
      lus: [],
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 items-end flex-wrap">
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
            checked={state.abated}
            onCheckedChange={(v) => setState((s) => ({ ...s, abated: !!v }))}
          />
        </div>

        {/* Land-use set */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Set</div>
          <Select
            value={state.setKey}
            onValueChange={(v) =>
              setState((s) => ({ ...s, setKey: v as LuSet }))
            }
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

        {/* Tax Status */}
        <div className="space-y-2 w-[320px]">
          <ReactSelectMulti
            instanceId="tax_status"
            options={tsOptions}
            value={state.tax_status}
            onChange={(arr) =>
              setState((s) => ({ ...s, tax_status: arr as string[] }))
            }
            placeholder="Search tax status…"
          />
        </div>

        {/* Property Class */}
        <div className="space-y-2 w-[320px]">
          <ReactSelectMulti
            instanceId="property_class"
            options={pcOptions}
            value={state.property_class}
            onChange={(arr) =>
              setState((s) => ({ ...s, property_class: arr as string[] }))
            }
            placeholder="Search property class…"
          />
        </div>

        {/* Neighborhoods */}
        <div className="space-y-2 w-[320px]">
          <ReactSelectMulti
            instanceId="neighborhoods"
            options={nbOptions}
            value={state.nbhds}
            onChange={(arr) =>
              setState((s) => ({ ...s, nbhds: arr as string[] }))
            }
            placeholder="Search neighborhoods…"
          />
        </div>

        {/* Land Uses (constrained by set) */}
        <div className="space-y-2 w-[360px]">
          <ReactSelectMulti
            instanceId="land-uses"
            options={luOptionsWithinSet}
            value={state.lus}
            onChange={(arr) =>
              setState((s) => ({ ...s, lus: arr as string[] }))
            }
            placeholder="Search land uses…"
          />
        </div>

        {/* Actions */}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={clearAll} disabled={false}>
            Clear
          </Button>
          <Button onClick={applyAll} disabled={!isDirty}>
            Apply
          </Button>
        </div>
      </div>

      {/* Optional: tiny hint about dirty state */}
      {/* <div className="text-xs text-muted-foreground">
        {isDirty ? "Unsaved filter changes" : "Filters match URL"}
      </div> */}
    </div>
  );
}
