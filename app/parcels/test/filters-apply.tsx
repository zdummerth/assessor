// app/(whatever)/features/filters-dialog.tsx
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  useLandUseOptions,
  useNeighborhoods,
  useTaxStatusOptions,
  usePropertyClassOptions,
} from "@/lib/client-queries";

import {
  ComboboxMulti,
  type ComboOption,
} from "@/components/ui/combobox-multi";

import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type FiltersState = {
  abated: boolean;
  tax_status: string[];
  property_class: string[];
  nbhds: string[];
  lus: string[];
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
  return {
    abated: (sp?.get("abated") ?? "") === "1",
    tax_status: getArrayParam(sp, "tax_status"),
    property_class: getArrayParam(sp, "property_class"),
    nbhds: getArrayParam(sp, "nbhds"),
    lus: getArrayParam(sp, "lus"),
  };
};

const stateToParams = (s: FiltersState): Record<string, string | null> => ({
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
  a.abated === b.abated &&
  arraysEqualAsSets(a.tax_status, b.tax_status) &&
  arraysEqualAsSets(a.property_class, b.property_class) &&
  arraysEqualAsSets(a.nbhds, b.nbhds) &&
  arraysEqualAsSets(a.lus, b.lus);

// Simple group wrapper for badges
function BadgeGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-start gap-2 rounded-md border px-2 py-1",
        "bg-background",
        className
      )}
    >
      <span className="mt-0.5 shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

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

  // Grouped badges (read-only) from URL
  const hasAny =
    urlState.abated ||
    urlState.tax_status.length > 0 ||
    urlState.property_class.length > 0 ||
    urlState.nbhds.length > 0 ||
    urlState.lus.length > 0;

  const groupedBadges = (
    <div className="flex flex-wrap items-start gap-2">
      {urlState.abated && (
        <BadgeGroup label="abated">
          <Badge variant="secondary">Abated</Badge>
        </BadgeGroup>
      )}

      {urlState.tax_status.length > 0 && (
        <BadgeGroup label="tax_status">
          {urlState.tax_status.map((id) => (
            <Badge key={`ts-${id}`} variant="secondary">
              {mapLabel(tsOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {urlState.property_class.length > 0 && (
        <BadgeGroup label="property_class">
          {urlState.property_class.map((id) => (
            <Badge key={`pc-${id}`} variant="secondary">
              {mapLabel(pcOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {urlState.nbhds.length > 0 && (
        <BadgeGroup label="nbhds">
          {urlState.nbhds.map((id) => (
            <Badge key={`nb-${id}`} variant="secondary">
              {mapLabel(nbOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {urlState.lus.length > 0 && (
        <BadgeGroup label="lus">
          {urlState.lus.map((code) => (
            <Badge key={`lu-${code}`} variant="secondary">
              {mapLabel(luOptionsAll, code)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {!hasAny && (
        <span className="text-xs text-muted-foreground">
          No filters applied
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
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

              {/* Tax Status */}
              <div className="space-y-2">
                <Label className="text-sm">Tax Status</Label>
                <ComboboxMulti
                  options={tsOptions}
                  value={state.tax_status}
                  onChange={(arr) =>
                    setState((s) => ({ ...s, tax_status: arr }))
                  }
                  placeholder="Search tax status…"
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
                  placeholder="Search property class…"
                />
              </div>

              {/* Neighborhoods */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Neighborhoods</Label>
                <ComboboxMulti
                  options={nbOptions}
                  value={state.nbhds}
                  onChange={(arr) => setState((s) => ({ ...s, nbhds: arr }))}
                  placeholder="Search neighborhoods…"
                />
              </div>

              {/* Land Uses */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Land Uses</Label>
                <ComboboxMulti
                  options={luOptionsAll}
                  value={state.lus}
                  onChange={(arr) => setState((s) => ({ ...s, lus: arr }))}
                  placeholder="Search land uses…"
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

        <div className="flex-1">{groupedBadges}</div>
      </div>
    </div>
  );
}
