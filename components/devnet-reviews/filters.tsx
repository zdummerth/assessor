"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComboboxMulti, ComboOption } from "@/components/ui/combobox-multi";
import { Filter, X } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  useDevnetReviewStatuses,
  useDevnetEmployees,
} from "@/lib/client-queries";

type FiltersState = {
  review_kind: string[];
  status_ids: string[];
  assigned_to_id: string | null;
  data_status: string[];
  priority: string[];
  entity_type: string[];
  requires_field_review: string | null; // "true", "false", or null
};

type FiltersDialogProps = {
  showReviewKind?: boolean;
  showStatuses?: boolean;
  showAssignedTo?: boolean;
  showDataStatus?: boolean;
  showPriority?: boolean;
  showEntityType?: boolean;
  showFieldReview?: boolean;
};

// URL helpers
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
  const assigned_to_id_raw = sp?.get("assigned_to_id");
  const assigned_to_id =
    typeof assigned_to_id_raw === "string" && assigned_to_id_raw.trim() !== ""
      ? assigned_to_id_raw.trim()
      : null;

  const requires_field_review_raw = sp?.get("requires_field_review");
  const requires_field_review =
    requires_field_review_raw === "true" ||
    requires_field_review_raw === "false"
      ? requires_field_review_raw
      : null;

  return {
    review_kind: getArrayParam(sp, "review_kind"),
    status_ids: getArrayParam(sp, "status_ids"),
    assigned_to_id,
    data_status: getArrayParam(sp, "data_status"),
    priority: getArrayParam(sp, "priority"),
    entity_type: getArrayParam(sp, "entity_type"),
    requires_field_review,
  };
};

const stateToParams = (s: FiltersState): Record<string, string | null> => ({
  review_kind: s.review_kind.length ? s.review_kind.join(",") : null,
  status_ids: s.status_ids.length ? s.status_ids.join(",") : null,
  assigned_to_id: s.assigned_to_id ? s.assigned_to_id : null,
  data_status: s.data_status.length ? s.data_status.join(",") : null,
  priority: s.priority.length ? s.priority.join(",") : null,
  entity_type: s.entity_type.length ? s.entity_type.join(",") : null,
  requires_field_review: s.requires_field_review,
  page: "1",
});

const arraysEqualAsSets = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  for (const x of b) if (!A.has(x)) return false;
  return true;
};

const statesEqual = (a: FiltersState, b: FiltersState) =>
  arraysEqualAsSets(a.review_kind, b.review_kind) &&
  arraysEqualAsSets(a.status_ids, b.status_ids) &&
  String(a.assigned_to_id ?? "") === String(b.assigned_to_id ?? "") &&
  arraysEqualAsSets(a.data_status, b.data_status) &&
  arraysEqualAsSets(a.priority, b.priority) &&
  arraysEqualAsSets(a.entity_type, b.entity_type) &&
  String(a.requires_field_review ?? "") ===
    String(b.requires_field_review ?? "");

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

export default function DevnetReviewsFiltersDialog({
  showReviewKind = true,
  showStatuses = true,
  showAssignedTo = true,
  showDataStatus = true,
  showPriority = true,
  showEntityType = true,
  showFieldReview = true,
}: FiltersDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch options
  const { options: reviewStatusOptions } = useDevnetReviewStatuses();
  const { options: employeeOptions } = useDevnetEmployees();

  // Static options
  const reviewKindOptions: ComboOption[] = [
    { value: "sale_review", label: "Sale Review" },
    { value: "permit_review", label: "Permit Review" },
    { value: "appeal_review", label: "Appeal Review" },
    { value: "custom_review", label: "Custom Review" },
  ];

  const dataStatusOptions: ComboOption[] = [
    { value: "not_collected", label: "Not Collected" },
    { value: "in_progress", label: "In Progress" },
    { value: "collected", label: "Collected" },
    { value: "needs_review", label: "Needs Review" },
    { value: "approved", label: "Approved" },
    { value: "verified", label: "Verified" },
  ];

  const priorityOptions: ComboOption[] = [
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
    { value: "4", label: "Critical" },
  ];

  const entityTypeOptions: ComboOption[] = [
    { value: "sale", label: "Sale" },
    { value: "permit", label: "Permit" },
    { value: "appeal", label: "Appeal" },
    { value: "parcel", label: "Parcel" },
  ];

  const fieldReviewOptions: ComboOption[] = [
    { value: "true", label: "Field Review Required" },
    { value: "false", label: "No Field Review" },
  ];

  // Convert to ComboOption format
  const statusOptions: ComboOption[] = useMemo(() => {
    const raw = Array.isArray(reviewStatusOptions) ? reviewStatusOptions : [];
    return raw.map((s: any) => ({
      value: String(s.id),
      label: `${s.name} (${s.review_kind})`,
    }));
  }, [reviewStatusOptions]);

  const empOptions: ComboOption[] = useMemo(() => {
    const raw = Array.isArray(employeeOptions) ? employeeOptions : [];
    return raw.map((e: any) => ({
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
    if (showReviewKind && urlState.review_kind.length) count++;
    if (showStatuses && urlState.status_ids.length) count++;
    if (showAssignedTo && !!urlState.assigned_to_id) count++;
    if (showDataStatus && urlState.data_status.length) count++;
    if (showPriority && urlState.priority.length) count++;
    if (showEntityType && urlState.entity_type.length) count++;
    if (showFieldReview && !!urlState.requires_field_review) count++;
    return count;
  }, [
    urlState,
    showReviewKind,
    showStatuses,
    showAssignedTo,
    showDataStatus,
    showPriority,
    showEntityType,
    showFieldReview,
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

  // Single-select helpers
  const assignedToValueArray = useMemo(
    () => (state.assigned_to_id ? [state.assigned_to_id] : []),
    [state.assigned_to_id]
  );

  const fieldReviewValueArray = useMemo(
    () => (state.requires_field_review ? [state.requires_field_review] : []),
    [state.requires_field_review]
  );

  const groupedBadges = (
    <div className="flex flex-wrap items-center gap-2">
      {showReviewKind && urlState.review_kind.length > 0 && (
        <BadgeGroup label="review type">
          {urlState.review_kind.map((kind) => (
            <Badge key={`kind-${kind}`} variant="secondary" className="text-xs">
              {mapLabel(reviewKindOptions, kind)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showStatuses && urlState.status_ids.length > 0 && (
        <BadgeGroup label="status">
          {urlState.status_ids.map((id) => (
            <Badge key={`status-${id}`} variant="secondary" className="text-xs">
              {mapLabel(statusOptions, id)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showAssignedTo && urlState.assigned_to_id && (
        <BadgeGroup label="assigned">
          <Badge variant="outline" className="text-xs">
            {mapLabel(empOptions, urlState.assigned_to_id)}
          </Badge>
        </BadgeGroup>
      )}

      {showDataStatus && urlState.data_status.length > 0 && (
        <BadgeGroup label="data status">
          {urlState.data_status.map((status) => (
            <Badge
              key={`data-${status}`}
              variant="secondary"
              className="text-xs"
            >
              {mapLabel(dataStatusOptions, status)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showPriority && urlState.priority.length > 0 && (
        <BadgeGroup label="priority">
          {urlState.priority.map((p) => (
            <Badge
              key={`priority-${p}`}
              variant="secondary"
              className="text-xs"
            >
              {mapLabel(priorityOptions, p)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showEntityType && urlState.entity_type.length > 0 && (
        <BadgeGroup label="entity">
          {urlState.entity_type.map((type) => (
            <Badge
              key={`entity-${type}`}
              variant="secondary"
              className="text-xs"
            >
              {mapLabel(entityTypeOptions, type)}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {showFieldReview && urlState.requires_field_review && (
        <BadgeGroup label="field review">
          <Badge variant="outline" className="text-xs">
            {mapLabel(fieldReviewOptions, urlState.requires_field_review)}
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
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filter Reviews</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {showReviewKind && (
                <div>
                  <label className="text-sm font-medium">Review Type</label>
                  <ComboboxMulti
                    options={reviewKindOptions}
                    value={state.review_kind}
                    onChange={(newValue) =>
                      setState({ ...state, review_kind: newValue })
                    }
                    placeholder="Select review types..."
                  />
                </div>
              )}

              {showStatuses && (
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <ComboboxMulti
                    options={statusOptions}
                    value={state.status_ids}
                    onChange={(newValue) =>
                      setState({ ...state, status_ids: newValue })
                    }
                    placeholder="Select statuses..."
                  />
                </div>
              )}

              {showAssignedTo && (
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <ComboboxMulti
                    options={empOptions}
                    value={assignedToValueArray}
                    onChange={(newValue) =>
                      setState({
                        ...state,
                        assigned_to_id: newValue[0] || null,
                      })
                    }
                    placeholder="Select employee..."
                  />
                </div>
              )}

              {showDataStatus && (
                <div>
                  <label className="text-sm font-medium">Data Status</label>
                  <ComboboxMulti
                    options={dataStatusOptions}
                    value={state.data_status}
                    onChange={(newValue) =>
                      setState({ ...state, data_status: newValue })
                    }
                    placeholder="Select data statuses..."
                  />
                </div>
              )}

              {showPriority && (
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <ComboboxMulti
                    options={priorityOptions}
                    value={state.priority}
                    onChange={(newValue) =>
                      setState({ ...state, priority: newValue })
                    }
                    placeholder="Select priorities..."
                  />
                </div>
              )}

              {showEntityType && (
                <div>
                  <label className="text-sm font-medium">Entity Type</label>
                  <ComboboxMulti
                    options={entityTypeOptions}
                    value={state.entity_type}
                    onChange={(newValue) =>
                      setState({ ...state, entity_type: newValue })
                    }
                    placeholder="Select entity types..."
                  />
                </div>
              )}

              {showFieldReview && (
                <div>
                  <label className="text-sm font-medium">Field Review</label>
                  <ComboboxMulti
                    options={fieldReviewOptions}
                    value={fieldReviewValueArray}
                    onChange={(newValue) =>
                      setState({
                        ...state,
                        requires_field_review: newValue[0] || null,
                      })
                    }
                    placeholder="Select field review requirement..."
                  />
                </div>
              )}

              <div className="flex justify-between gap-2 pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetLocal}
                    disabled={!isDirty}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={activeFilterCount === 0}
                  >
                    Clear All
                  </Button>
                </div>
                <Button onClick={applyAll} disabled={!isDirty}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Active Filters ({activeFilterCount})
          </div>
          {groupedBadges}
        </div>
      )}
    </div>
  );
}
