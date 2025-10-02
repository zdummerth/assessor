// app/(whatever)/features/filters-dialog.tsx
"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReactSelectMulti, { RSOption } from "@/components/ui/react-select-multi";

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

import { useLandUseOptions, useNeighborhoods } from "@/lib/client-queries";
import luSets from "@/lib/land_use_arrays.json";
import { Filter } from "lucide-react";

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

// IMPORTANT: return `null` for "all" so we don't constrain the list
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

  // URL-derived values
  const setKey = ((searchParams?.get("set") as LuSet) ?? "all") as LuSet;
  const asOfDate = searchParams?.get("as_of_date") ?? "";
  const selectedLandUses = getArray("lus");
  const selectedNeighborhoods = getArray("nbhds");
  const ilikeStreet = searchParams?.get("street") ?? "";
  const tfaMin = searchParams?.get("tfa_min") ?? "any";
  const tfaMax = searchParams?.get("tfa_max") ?? "any";
  const cvMin = searchParams?.get("cv_min") ?? "any";
  const cvMax = searchParams?.get("cv_max") ?? "any";
  const isAbatedOnly = (searchParams?.get("abated") ?? "") === "1";

  // options from hooks
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();

  // normalize Land Use options to react-select { value, label }
  const allLUOptions: RSOption[] = useMemo(() => {
    const raw = Array.isArray(landUseOptions) ? landUseOptions : [];
    // support either string[] or {value,label}[]
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

  // Neighborhoods -> react-select { value, label }
  const nbOptions: RSOption[] = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood} (${n.name ?? ""})`,
      })),
    [neighborhoodOptions]
  );

  // constrain LU options by set (null = unconstrained)
  const activeSetOptions = useMemo(() => setCodes(setKey), [setKey]);

  const landUseOptionsWithinSet: RSOption[] = useMemo(() => {
    if (!activeSetOptions) return allLUOptions; // "all" selected
    const allowed = new Set(activeSetOptions.map(String));
    return allLUOptions.filter((o) => allowed.has(o.value));
  }, [allLUOptions, activeSetOptions]);

  // When switching sets (except "all"), clamp selected LUs to allowed
  useEffect(() => {
    if (!activeSetOptions) return; // "all" => allow everything
    const allowed = new Set(activeSetOptions);
    const filtered = selectedLandUses.filter((v) => allowed.has(String(v)));
    if (filtered.length !== selectedLandUses.length) {
      setParams({ lus: filtered.length ? filtered.join(",") : null, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setKey]);

  {
    /* Helpers (put these inside the component, above the JSX) */
  }
  const TFA_MAX = 20000; // 0 → 20,000 sf in 500s (adjust if needed)
  const CV_MAX = 1000000; // 0 → 1,000,000 in 5,000s (adjust if needed)

  const tfaMinNum = Number.isFinite(Number(tfaMin))
    ? Number(tfaMin)
    : undefined;
  const tfaMaxNum = Number.isFinite(Number(tfaMax))
    ? Number(tfaMax)
    : undefined;
  const cvMinNum = Number.isFinite(Number(cvMin)) ? Number(cvMin) : undefined;
  const cvMaxNum = Number.isFinite(Number(cvMax)) ? Number(cvMax) : undefined;

  const tfaSteps = React.useMemo(
    () => Array.from({ length: TFA_MAX / 500 + 1 }, (_, i) => i * 500),
    []
  );
  const cvSteps = React.useMemo(
    () => Array.from({ length: CV_MAX / 5000 + 1 }, (_, i) => i * 5000),
    []
  );

  const tfaMinOptions = React.useMemo(
    () => tfaSteps.filter((v) => (tfaMaxNum == null ? true : v <= tfaMaxNum)),
    [tfaSteps, tfaMaxNum]
  );
  const tfaMaxOptions = React.useMemo(
    () => tfaSteps.filter((v) => (tfaMinNum == null ? true : v >= tfaMinNum)),
    [tfaSteps, tfaMinNum]
  );

  const cvMinOptions = React.useMemo(
    () => cvSteps.filter((v) => (cvMaxNum == null ? true : v <= cvMaxNum)),
    [cvSteps, cvMaxNum]
  );
  const cvMaxOptions = React.useMemo(
    () => cvSteps.filter((v) => (cvMinNum == null ? true : v >= cvMinNum)),
    [cvSteps, cvMinNum]
  );

  const fmtUSD = (n: number) =>
    Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-2">
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
            defaultChecked={isAbatedOnly}
            onCheckedChange={(v) =>
              setParams({ abated: v ? 1 : null, page: 1 })
            }
          />
        </div>

        {/* Land-use set (shadcn single select) */}
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

        <div className="space-y-2 w-[320px]">
          <ReactSelectMulti
            instanceId="neighborhoods"
            options={nbOptions /* RSOption[] */}
            value={selectedNeighborhoods /* string[] from URL */}
            onChange={(arr) =>
              setParams({ page: 1, nbhds: arr.length ? arr.join(",") : null })
            }
            placeholder="Search neighborhoods…"
          />
        </div>

        <div className="space-y-2 w-[360px]">
          <ReactSelectMulti
            instanceId="land-uses"
            options={landUseOptionsWithinSet}
            value={selectedLandUses}
            onChange={(arr) =>
              setParams({ page: 1, lus: arr.length ? arr.join(",") : null })
            }
            placeholder="Search land uses…"
          />
        </div>

        {/* Dialog for the rest of the filters */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="mr-2 h-4 w-4" />
              More
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

                {/* Finished area range (shadcn Selects, step = 500) */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Finished area (sf)
                  </div>
                  <div className="flex gap-2">
                    {/* Min */}
                    <Select
                      defaultValue={tfaMin || "any"}
                      onValueChange={(v) =>
                        setParams({ tfa_min: v || null, page: 1 })
                      }
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Min (Any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {tfaMinOptions.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v.toLocaleString()} sf
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Max */}
                    <Select
                      defaultValue={tfaMax || "any"}
                      onValueChange={(v) =>
                        setParams({ tfa_max: v || null, page: 1 })
                      }
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Max (Any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {tfaMaxOptions.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v.toLocaleString()} sf
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current value range (shadcn Selects, step = 5,000) */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Current value ($)
                  </div>
                  <div className="flex gap-2">
                    {/* Min */}
                    <Select
                      defaultValue={cvMin || "any"}
                      onValueChange={(v) =>
                        setParams({ cv_min: v || null, page: 1 })
                      }
                    >
                      <SelectTrigger className="h-8 w-[170px]">
                        <SelectValue placeholder="Min (Any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {cvMinOptions.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {fmtUSD(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Max */}
                    <Select
                      defaultValue={cvMax || "any"}
                      onValueChange={(v) =>
                        setParams({ cv_max: v || null, page: 1 })
                      }
                    >
                      <SelectTrigger className="h-8 w-[170px]">
                        <SelectValue placeholder="Max (Any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {cvMaxOptions.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {fmtUSD(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
