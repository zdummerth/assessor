// app/sales/stats/ratio-filters-dialog.tsx
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
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

import { useLandUseOptions, useNeighborhoods } from "@/lib/client-queries";

import {
  ComboboxMulti,
  type ComboOption,
} from "@/components/ui/combobox-multi";
import { cn } from "@/lib/utils";

/* -------------------------
   URL helpers
   ------------------------- */
const getArrayParam = (sp: URLSearchParams | null, key: string): string[] => {
  const raw = sp?.get(key);
  return raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
};
const getNumParam = (
  sp: URLSearchParams | null,
  key: string
): number | null => {
  const raw = sp?.get(key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};
const getBoolParam = (sp: URLSearchParams | null, key: string): boolean => {
  return (sp?.get(key) ?? "") === "1";
};

type FiltersState = {
  // common
  valid_only: boolean;
  lus: string[]; // land uses
  nbhds: string[]; // neighborhood ids
  sale_type_ids: string[]; // sale type ids

  // numeric ranges
  price_min: number | null;
  price_max: number | null;
  fa_min: number | null; // finished area
  fa_max: number | null;
  cond_min: number | null; // avg condition
  cond_max: number | null;
  la_min: number | null; // land area
  la_max: number | null;

  // section materials
  mat_any: string[]; // any section has material in list
  mat_upper_same: string[]; // upper floors all share same material, optionally constrained to this list

  // basement / stories
  has_basement: boolean;
  stories_min: number | null;
  stories_max: number | null;
};

const readURLToState = (sp: URLSearchParams | null): FiltersState => ({
  valid_only: getBoolParam(sp, "valid"),
  lus: getArrayParam(sp, "lus"),
  nbhds: getArrayParam(sp, "nbhds"),
  sale_type_ids: getArrayParam(sp, "sale_type_ids"),

  price_min: getNumParam(sp, "price_min"),
  price_max: getNumParam(sp, "price_max"),
  fa_min: getNumParam(sp, "fa_min"),
  fa_max: getNumParam(sp, "fa_max"),
  cond_min: getNumParam(sp, "cond_min"),
  cond_max: getNumParam(sp, "cond_max"),
  la_min: getNumParam(sp, "la_min"),
  la_max: getNumParam(sp, "la_max"),

  mat_any: getArrayParam(sp, "mat_any"),
  mat_upper_same: getArrayParam(sp, "mat_upper_same"),

  has_basement: getBoolParam(sp, "has_basement"),
  stories_min: getNumParam(sp, "stories_min"),
  stories_max: getNumParam(sp, "stories_max"),
});

const stateToParams = (s: FiltersState): Record<string, string | null> => ({
  valid: s.valid_only ? "1" : null,
  lus: s.lus.length ? s.lus.join(",") : null,
  nbhds: s.nbhds.length ? s.nbhds.join(",") : null,
  sale_type_ids: s.sale_type_ids.length ? s.sale_type_ids.join(",") : null,

  price_min: s.price_min != null ? String(s.price_min) : null,
  price_max: s.price_max != null ? String(s.price_max) : null,
  fa_min: s.fa_min != null ? String(s.fa_min) : null,
  fa_max: s.fa_max != null ? String(s.fa_max) : null,
  cond_min: s.cond_min != null ? String(s.cond_min) : null,
  cond_max: s.cond_max != null ? String(s.cond_max) : null,
  la_min: s.la_min != null ? String(s.la_min) : null,
  la_max: s.la_max != null ? String(s.la_max) : null,

  mat_any: s.mat_any.length ? s.mat_any.join(",") : null,
  mat_upper_same: s.mat_upper_same.length ? s.mat_upper_same.join(",") : null,

  has_basement: s.has_basement ? "1" : null,
  stories_min: s.stories_min != null ? String(s.stories_min) : null,
  stories_max: s.stories_max != null ? String(s.stories_max) : null,

  page: "1", // reset pagination on apply
});

const arraysEqualAsSets = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  for (const x of b) if (!A.has(x)) return false;
  return true;
};

const numsEqual = (a: number | null, b: number | null) =>
  a === b || (a == null && b == null);

const statesEqual = (a: FiltersState, b: FiltersState) =>
  a.valid_only === b.valid_only &&
  a.has_basement === b.has_basement &&
  arraysEqualAsSets(a.lus, b.lus) &&
  arraysEqualAsSets(a.nbhds, b.nbhds) &&
  arraysEqualAsSets(a.sale_type_ids, b.sale_type_ids) &&
  arraysEqualAsSets(a.mat_any, b.mat_any) &&
  arraysEqualAsSets(a.mat_upper_same, b.mat_upper_same) &&
  numsEqual(a.price_min, b.price_min) &&
  numsEqual(a.price_max, b.price_max) &&
  numsEqual(a.fa_min, b.fa_min) &&
  numsEqual(a.fa_max, b.fa_max) &&
  numsEqual(a.cond_min, b.cond_min) &&
  numsEqual(a.cond_max, b.cond_max) &&
  numsEqual(a.la_min, b.la_min) &&
  numsEqual(a.la_max, b.la_max) &&
  numsEqual(a.stories_min, b.stories_min) &&
  numsEqual(a.stories_max, b.stories_max);

/* -------------------------
   Small UI helpers
   ------------------------- */
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

const toCombo = (
  arr: any[],
  valueKey = "value",
  labelKey = "label"
): ComboOption[] =>
  (arr ?? []).map((o) => ({
    value: String(o?.[valueKey] ?? o),
    label: String(o?.[labelKey] ?? o?.[valueKey] ?? o),
  }));

/* -------------------------
   Component
   ------------------------- */
export default function RatioFiltersDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Options (hooks) – robust to missing hooks by falling back to empty arrays
  const { options: landUseOptions } = useLandUseOptions?.() ?? {
    options: [] as any[],
  };
  const { options: neighborhoodOptions } = useNeighborhoods?.() ?? {
    options: [] as any[],
  };

  // Normalize to ComboOption
  const luOptionsAll: ComboOption[] = useMemo(() => {
    const raw = Array.isArray(landUseOptions) ? landUseOptions : [];
    if (raw.length && typeof raw[0] === "string") {
      return (raw as string[]).map((v) => ({
        value: String(v),
        label: String(v),
      }));
    }
    return toCombo(raw, "value", "label");
  }, [landUseOptions]);

  const nbOptions: ComboOption[] = useMemo(
    () =>
      (neighborhoodOptions as any[]).map((n) => ({
        value: String(n.id),
        label: `${n.neighborhood ?? n.code ?? n.id}${n.name ? ` (${n.name})` : ""}`,
      })),
    [neighborhoodOptions]
  );

  // URL snapshot & dialog-local state
  const urlState = useMemo(() => readURLToState(searchParams), [searchParams]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FiltersState>(urlState);

  // Reset local state when opening
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

  // Badges summary (read from URL so they’re canonical)
  const hasAny =
    urlState.valid_only ||
    urlState.lus.length > 0 ||
    urlState.nbhds.length > 0 ||
    urlState.sale_type_ids.length > 0 ||
    urlState.mat_any.length > 0 ||
    urlState.mat_upper_same.length > 0 ||
    urlState.has_basement ||
    urlState.price_min != null ||
    urlState.price_max != null ||
    urlState.fa_min != null ||
    urlState.fa_max != null ||
    urlState.cond_min != null ||
    urlState.cond_max != null ||
    urlState.la_min != null ||
    urlState.la_max != null ||
    urlState.stories_min != null ||
    urlState.stories_max != null;

  const mapLabel = (opts: ComboOption[], v: string) =>
    opts.find((o) => String(o.value) === String(v))?.label ?? v;

  const groupedBadges = (
    <div className="flex flex-wrap items-start gap-2">
      {urlState.valid_only && (
        <BadgeGroup label="valid">
          <Badge variant="secondary">Valid-only</Badge>
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
        <BadgeGroup label="land uses">
          {urlState.lus.map((code) => (
            <Badge key={`lu-${code}`} variant="secondary">
              {mapLabel(luOptionsAll, code)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {(urlState.price_min != null || urlState.price_max != null) && (
        <BadgeGroup label="price">
          <Badge variant="secondary">
            {urlState.price_min ?? "—"} – {urlState.price_max ?? "—"}
          </Badge>
        </BadgeGroup>
      )}

      {(urlState.fa_min != null || urlState.fa_max != null) && (
        <BadgeGroup label="finished sf">
          <Badge variant="secondary">
            {urlState.fa_min ?? "—"} – {urlState.fa_max ?? "—"}
          </Badge>
        </BadgeGroup>
      )}

      {(urlState.cond_min != null || urlState.cond_max != null) && (
        <BadgeGroup label="avg condition">
          <Badge variant="secondary">
            {urlState.cond_min ?? "—"} – {urlState.cond_max ?? "—"}
          </Badge>
        </BadgeGroup>
      )}

      {(urlState.la_min != null || urlState.la_max != null) && (
        <BadgeGroup label="land area">
          <Badge variant="secondary">
            {urlState.la_min ?? "—"} – {urlState.la_max ?? "—"}
          </Badge>
        </BadgeGroup>
      )}

      {(urlState.stories_min != null || urlState.stories_max != null) && (
        <BadgeGroup label="stories (≥1)">
          <Badge variant="secondary">
            {urlState.stories_min ?? "—"} – {urlState.stories_max ?? "—"}
          </Badge>
        </BadgeGroup>
      )}

      {urlState.has_basement && (
        <BadgeGroup label="basement">
          <Badge variant="secondary">Has basement</Badge>
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
              <DialogTitle>Ratio Filters</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Valid only */}
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="valid-only" className="text-sm">
                    Valid sales only
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    Enforce sale_type.is_valid = TRUE
                  </div>
                </div>
                <Switch
                  id="valid-only"
                  checked={state.valid_only}
                  onCheckedChange={(v) =>
                    setState((s) => ({ ...s, valid_only: !!v }))
                  }
                />
              </div>

              {/* Neighborhoods */}
              <div className="space-y-2">
                <Label className="text-sm">Neighborhoods (IDs)</Label>
                <ComboboxMulti
                  options={nbOptions}
                  value={state.nbhds}
                  onChange={(arr) => setState((s) => ({ ...s, nbhds: arr }))}
                  placeholder="Search neighborhoods…"
                />
              </div>

              {/* Land Uses */}
              <div className="space-y-2">
                <Label className="text-sm">Land Uses</Label>
                <ComboboxMulti
                  options={luOptionsAll}
                  value={state.lus}
                  onChange={(arr) => setState((s) => ({ ...s, lus: arr }))}
                  placeholder="Search land uses…"
                />
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <Label className="text-sm">Sale Price (min / max)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="min"
                    value={state.price_min ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        price_min: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="max"
                    value={state.price_max ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        price_max: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Finished area */}
              <div className="space-y-2">
                <Label className="text-sm">Finished Area (SF)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="min"
                    value={state.fa_min ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        fa_min: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="max"
                    value={state.fa_max ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        fa_max: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Avg condition */}
              <div className="space-y-2">
                <Label className="text-sm">Avg Condition</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="min"
                    value={state.cond_min ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        cond_min: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <Input
                    inputMode="decimal"
                    placeholder="max"
                    value={state.cond_max ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        cond_max: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Land area */}
              <div className="space-y-2">
                <Label className="text-sm">Land Area (SF)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="min"
                    value={state.la_min ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        la_min: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="max"
                    value={state.la_max ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        la_max: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Has basement */}
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="has-basement" className="text-sm">
                    Has basement
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    Requires at least one active section of type
                    &quot;basement&quot; at sale.
                  </div>
                </div>
                <Switch
                  id="has-basement"
                  checked={state.has_basement}
                  onCheckedChange={(v) =>
                    setState((s) => ({ ...s, has_basement: !!v }))
                  }
                />
              </div>

              {/* Stories (>= 1) */}
              <div className="space-y-2">
                <Label className="text-sm">Number of Stories (≥ 1)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="min"
                    value={state.stories_min ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        stories_min: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="max"
                    value={state.stories_max ?? ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        stories_max: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Stories are counted from sections with{" "}
                  <code>floor_number ≥ 1</code>.
                </div>
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
