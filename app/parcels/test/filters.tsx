// app/(whatever)/features/filters-dialog.tsx
"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Select from "react-select";

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
  Select as ShadSelect,
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

// For react-select options
type RSOption = { value: string; label: string };

export default function FiltersDialog() {
  const { searchParams, setParams, getArray } = useURLState();

  // URL-derived values
  const setKey = ((searchParams?.get("set") as LuSet) ?? "all") as LuSet;
  const asOfDate = searchParams?.get("as_of_date") ?? "";
  const selectedLandUses = getArray("lus");
  const selectedNeighborhoods = getArray("nbhds");
  const ilikeStreet = searchParams?.get("street") ?? "";
  const tfaMin = searchParams?.get("tfa_min") ?? "";
  const tfaMax = searchParams?.get("tfa_max") ?? "";
  const cvMin = searchParams?.get("cv_min") ?? "";
  const cvMax = searchParams?.get("cv_max") ?? "";
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

  // react-select "value" needs the full option objects
  const luValue: RSOption[] = useMemo(
    () =>
      landUseOptionsWithinSet.filter((o) =>
        selectedLandUses.includes(String(o.value))
      ),
    [landUseOptionsWithinSet, selectedLandUses]
  );

  const nbValue: RSOption[] = useMemo(
    () => nbOptions.filter((o) => selectedNeighborhoods.includes(o.value)),
    [nbOptions, selectedNeighborhoods]
  );

  // react-select styling to match compact UI
  const rsStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: 32,
      height: "auto",
      borderColor: "hsl(var(--border))",
      backgroundColor: "transparent",
      boxShadow: "none",
      ":hover": { borderColor: "hsl(var(--border))" },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "2px 8px" }),
    indicatorsContainer: (base: any) => ({ ...base, height: 28 }),
    dropdownIndicator: (base: any) => ({ ...base, padding: 4 }),
    clearIndicator: (base: any) => ({ ...base, padding: 4 }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      fontSize: 12,
      color: "hsl(var(--secondary-foreground))",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      ":hover": {
        backgroundColor: "transparent",
        color: "hsl(var(--foreground))",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50,
      border: "1px solid hsl(var(--border))",
      boxShadow: "var(--shadow)",
      backgroundColor: "hsl(var(--background))",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "hsl(var(--muted))" : "transparent",
      color: "hsl(var(--foreground))",
    }),
  } as const;

  // Avoid SSR portal crash
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined;

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
            checked={isAbatedOnly}
            onCheckedChange={(v) =>
              setParams({ abated: v ? 1 : null, page: 1 })
            }
          />
        </div>

        {/* Land-use set (shadcn single select) */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Set</div>
          <ShadSelect
            value={setKey}
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
          </ShadSelect>
        </div>

        {/* Land uses (react-select multi) */}
        <div className="space-y-2 w-[320px]">
          <div className="text-xs text-muted-foreground">Land uses</div>
          <Select
            instanceId="land-uses"
            isMulti
            options={landUseOptionsWithinSet}
            defaultValue={luValue}
            onChange={(next) => {
              const arr = Array.isArray(next) ? next.map((o) => o.value) : [];
              setParams({ page: 1, lus: arr.length ? arr.join(",") : null });
            }}
            placeholder="Search land uses…"
            classNamePrefix="rs"
            styles={rsStyles}
            menuPortalTarget={menuPortalTarget}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </div>

        {/* Neighborhoods (react-select multi) */}
        <div className="space-y-2 w-[360px]">
          <div className="text-xs text-muted-foreground">Neighborhoods</div>
          <Select
            instanceId="neighborhoods"
            isMulti
            options={nbOptions}
            defaultValue={nbValue}
            onChange={(next) => {
              const arr = Array.isArray(next) ? next.map((o) => o.value) : [];
              setParams({ page: 1, nbhds: arr.length ? arr.join(",") : null });
            }}
            placeholder="Search neighborhoods…"
            classNamePrefix="rs"
            styles={rsStyles}
            menuPortalTarget={menuPortalTarget}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
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
