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
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  useLandUseOptions,
  useNeighborhoods,
  useTaxStatusOptions,
  usePropertyClassOptions,
  useReviewStatusOptions,
  useReviewTypeOptions,
  useEmployees, // ✅ NEW
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
  review_statuses: string[];
  review_types: string[];
  employee_id: string | null; // ✅ NEW (single select)
};

type FiltersDialogProps = {
  showAbated?: boolean;
  showTaxStatus?: boolean;
  showPropertyClass?: boolean;
  showNeighborhoods?: boolean;
  showLandUses?: boolean;
  showReviewStatuses?: boolean;
  showReviewTypes?: boolean;
  showEmployee?: boolean; // ✅ NEW
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
  const employee_id_raw = sp?.get("employee_id");
  const employee_id =
    typeof employee_id_raw === "string" && employee_id_raw.trim() !== ""
      ? employee_id_raw.trim()
      : null;

  return {
    abated: (sp?.get("abated") ?? "") === "1",
    tax_status: getArrayParam(sp, "tax_status"),
    property_class: getArrayParam(sp, "property_class"),
    nbhds: getArrayParam(sp, "nbhds"),
    lus: getArrayParam(sp, "lus"),
    review_statuses: getArrayParam(sp, "review_statuses"),
    review_types: getArrayParam(sp, "review_types"),
    employee_id, // ✅ NEW
  };
};

const stateToParams = (s: FiltersState): Record<string, string | null> => ({
  abated: s.abated ? "1" : null,
  tax_status: s.tax_status.length ? s.tax_status.join(",") : null,
  property_class: s.property_class.length ? s.property_class.join(",") : null,
  nbhds: s.nbhds.length ? s.nbhds.join(",") : null,
  lus: s.lus.length ? s.lus.join(",") : null,
  review_statuses: s.review_statuses.length
    ? s.review_statuses.join(",")
    : null,
  review_types: s.review_types.length ? s.review_types.join(",") : null,
  employee_id: s.employee_id ? s.employee_id : null, // ✅ NEW
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
  arraysEqualAsSets(a.lus, b.lus) &&
  arraysEqualAsSets(a.review_statuses, b.review_statuses) &&
  arraysEqualAsSets(a.review_types, b.review_types) &&
  String(a.employee_id ?? "") === String(b.employee_id ?? ""); // ✅ NEW

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
        "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5",
        className
      )}
    >
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

export default function FiltersDialog({
  showAbated = false,
  showTaxStatus = false,
  showPropertyClass = false,
  showNeighborhoods = true,
  showLandUses = false,
  showReviewStatuses = true,
  showReviewTypes = true,
  showEmployee = true, // ✅ NEW
}: FiltersDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- options from hooks ----
  const { options: landUseOptions } = useLandUseOptions();
  const { options: neighborhoodOptions } = useNeighborhoods();
  const { options: taxStatusOptions } = useTaxStatusOptions();
  const { options: propertyClassOptions } = usePropertyClassOptions();
  const { options: reviewStatusOptions } = useReviewStatusOptions();
  const { options: reviewTypeOptions } = useReviewTypeOptions();
  const { options: employeeOptions, error: employeeOptionsError } =
    useEmployees(); // ✅ NEW

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

  const rsOptions: ComboOption[] = useMemo(
    () =>
      (reviewStatusOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.name),
      })),
    [reviewStatusOptions]
  );

  const rtOptions: ComboOption[] = useMemo(
    () =>
      (reviewTypeOptions as any[]).map((n) => ({
        value: String(n.id),
        label: String(n.display_name),
      })),
    [reviewTypeOptions]
  );

  // ✅ NEW: employees -> ComboOption
  const empOptions: ComboOption[] = useMemo(() => {
    const raw = Array.isArray(employeeOptions)
      ? (employeeOptions as any[])
      : [];
    return raw.map((e) => ({
      value: String(e.id),
      label: `${e.last_name}, ${e.first_name}${e.email ? ` • ${e.email}` : ""}`,
    }));
  }, [employeeOptions]);

  const mapLabel = (opts: ComboOption[], value: string) =>
    opts.find((o) => String(o.value) === String(value))?.label ?? value;

  const urlState = useMemo(() => readURLToState(searchParams), [searchParams]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FiltersState>(urlState);

  useEffect(() => {
    if (open) setState(urlState);
  }, [open, urlState]);

  const isDirty = useMemo(
    () => !statesEqual(state, urlState),
    [state, urlState]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (showAbated && urlState.abated) count++;
    if (showTaxStatus && urlState.tax_status.length) count++;
    if (showPropertyClass && urlState.property_class.length) count++;
    if (showNeighborhoods && urlState.nbhds.length) count++;
    if (showLandUses && urlState.lus.length) count++;
    if (showReviewStatuses && urlState.review_statuses.length) count++;
    if (showReviewTypes && urlState.review_types.length) count++;
    if (showEmployee && !!urlState.employee_id) count++; // ✅ NEW
    return count;
  }, [
    urlState,
    showAbated,
    showTaxStatus,
    showPropertyClass,
    showNeighborhoods,
    showLandUses,
    showReviewStatuses,
    showReviewTypes,
    showEmployee,
  ]);

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

  const resetLocal = () => setState(urlState);

  // single-select UI built from ComboboxMulti (value = [] or [id])
  const employeeValueArray = useMemo(
    () => (state.employee_id ? [state.employee_id] : []),
    [state.employee_id]
  );

  const groupedBadges = (
    <div className="flex flex-wrap items-center gap-2">
      {showAbated && urlState.abated && (
        <BadgeGroup label="abated">
          <Badge variant="outline" className="text-xs">
            Abated only
          </Badge>
        </BadgeGroup>
      )}

      {showTaxStatus && urlState.tax_status.length > 0 && (
        <BadgeGroup label="tax status">
          {urlState.tax_status.map((id) => (
            <Badge key={`ts-${id}`} variant="secondary" className="text-xs">
              {mapLabel(tsOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showPropertyClass && urlState.property_class.length > 0 && (
        <BadgeGroup label="class">
          {urlState.property_class.map((id) => (
            <Badge key={`pc-${id}`} variant="secondary" className="text-xs">
              {mapLabel(pcOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showNeighborhoods && urlState.nbhds.length > 0 && (
        <BadgeGroup label="nbhds">
          {urlState.nbhds.map((id) => (
            <Badge key={`nb-${id}`} variant="secondary" className="text-xs">
              {mapLabel(nbOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showLandUses && urlState.lus.length > 0 && (
        <BadgeGroup label="land use">
          {urlState.lus.map((code) => (
            <Badge key={`lu-${code}`} variant="secondary" className="text-xs">
              {mapLabel(luOptionsAll, code)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showReviewStatuses && urlState.review_statuses.length > 0 && (
        <BadgeGroup label="review status">
          {urlState.review_statuses.map((id) => (
            <Badge key={`rs-${id}`} variant="secondary" className="text-xs">
              {mapLabel(rsOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showReviewTypes && urlState.review_types.length > 0 && (
        <BadgeGroup label="review type">
          {urlState.review_types.map((id) => (
            <Badge key={`rt-${id}`} variant="secondary" className="text-xs">
              {mapLabel(rtOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {/* ✅ NEW: Employee (single) */}
      {showEmployee && urlState.employee_id && (
        <BadgeGroup label="employee">
          <Badge variant="secondary" className="text-xs">
            {mapLabel(empOptions, urlState.employee_id)}
          </Badge>
        </BadgeGroup>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={activeFilterCount ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 rounded-full px-1.5 text-[10px]"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <DialogTitle>Filters</DialogTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {activeFilterCount > 0 ? (
                    <>
                      <span>{activeFilterCount} active</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={clearAll}
                      >
                        Clear all
                      </Button>
                    </>
                  ) : (
                    <span>No filters applied</span>
                  )}
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-2">
              <div className="flex flex-col gap-6 pt-2">
                <section className="space-y-3">
                  <div className="flex flex-col gap-4">
                    {showAbated && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="abated-only" className="text-sm">
                            Abated only
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Show parcels with any active abatement
                          </p>
                        </div>
                        <Switch
                          id="abated-only"
                          checked={state.abated}
                          onCheckedChange={(v) =>
                            setState((s) => ({ ...s, abated: !!v }))
                          }
                        />
                      </div>
                    )}

                    {showTaxStatus && (
                      <div className="space-y-2">
                        <Label className="text-sm">Tax status</Label>
                        <ComboboxMulti
                          options={tsOptions}
                          value={state.tax_status}
                          onChange={(arr) =>
                            setState((s) => ({ ...s, tax_status: arr }))
                          }
                          placeholder="Search tax status…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Filter by current taxability / exemption.
                        </p>
                      </div>
                    )}

                    {showPropertyClass && (
                      <div className="space-y-2">
                        <Label className="text-sm">Property class</Label>
                        <ComboboxMulti
                          options={pcOptions}
                          value={state.property_class}
                          onChange={(arr) =>
                            setState((s) => ({ ...s, property_class: arr }))
                          }
                          placeholder="Search property class…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Residential, commercial, agricultural, etc.
                        </p>
                      </div>
                    )}

                    {showNeighborhoods && (
                      <div className="space-y-2">
                        <Label className="text-sm">Neighborhoods</Label>
                        <ComboboxMulti
                          options={nbOptions}
                          value={state.nbhds}
                          onChange={(arr) =>
                            setState((s) => ({ ...s, nbhds: arr }))
                          }
                          placeholder="Search neighborhoods…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Narrow to specific neighborhoods or market areas.
                        </p>
                      </div>
                    )}

                    {showLandUses && (
                      <div className="space-y-2">
                        <Label className="text-sm">Land uses</Label>
                        <ComboboxMulti
                          options={luOptionsAll}
                          value={state.lus}
                          onChange={(arr) =>
                            setState((s) => ({ ...s, lus: arr }))
                          }
                          placeholder="Search land uses…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Filter by land-use code / description.
                        </p>
                      </div>
                    )}

                    {showReviewStatuses && (
                      <div className="space-y-2">
                        <Label className="text-sm">Review statuses</Label>
                        <ComboboxMulti
                          options={rsOptions}
                          value={state.review_statuses}
                          onChange={(arr) =>
                            setState((s) => ({
                              ...s,
                              review_statuses: arr,
                            }))
                          }
                          placeholder="Search review statuses…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Limit results to reviews in specific workflow states.
                        </p>
                      </div>
                    )}

                    {showReviewTypes && (
                      <div className="space-y-2">
                        <Label className="text-sm">Review types</Label>
                        <ComboboxMulti
                          options={rtOptions}
                          value={state.review_types}
                          onChange={(arr) =>
                            setState((s) => ({ ...s, review_types: arr }))
                          }
                          placeholder="Search review types…"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Limit results to specific types of field reviews.
                        </p>
                      </div>
                    )}

                    {/* ✅ NEW: Employee single-select (implemented using ComboboxMulti) */}
                    {showEmployee && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-sm" htmlFor="employee-id">
                            Assigned employee
                          </Label>

                          {state.employee_id ? (
                            <button
                              type="button"
                              onClick={() =>
                                setState((s) => ({ ...s, employee_id: null }))
                              }
                              className="text-[11px] text-muted-foreground hover:underline"
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>

                        <select
                          id="employee-id"
                          name="employee_id"
                          className="w-full rounded border bg-background px-3 py-2 text-sm"
                          value={state.employee_id ?? ""}
                          onChange={(e) =>
                            setState((s) => ({
                              ...s,
                              employee_id: e.target.value
                                ? e.target.value
                                : null,
                            }))
                          }
                          disabled={!!employeeOptionsError}
                        >
                          <option value="">All employees</option>
                          <option value={0}>Unassigned</option>
                          {empOptions.map((o) => (
                            <option
                              key={String(o.value)}
                              value={String(o.value)}
                            >
                              {o.label}
                            </option>
                          ))}
                        </select>

                        <p className="text-[11px] text-muted-foreground">
                          Filters to reviews where this employee has any
                          assignment record. (Cards still show all assignees.)
                        </p>

                        {employeeOptionsError ? (
                          <p className="text-[11px] text-destructive">
                            Error loading employee options.
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={resetLocal}
                disabled={!isDirty}
                className="mr-auto text-xs"
              >
                Reset changes
              </Button>
              <Button variant="outline" type="button" onClick={clearAll}>
                Clear all
              </Button>
              <Button type="button" onClick={applyAll} disabled={!isDirty}>
                Apply filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Active filters summary */}
        <div className="flex-1 min-w-[200px]">
          {activeFilterCount > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Active filters:</span>
              {groupedBadges}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No filters applied. Use the Filters button to refine results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
