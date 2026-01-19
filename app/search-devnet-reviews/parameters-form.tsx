"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { ComboboxMultiLookup } from "@/components/ui/combobox-multi-lookup";

interface FormData {
  p_active_only?: boolean;
  p_assigned_to_devnet_employees_id?: number;
  p_completed_only?: boolean;
  p_created_after?: string;
  p_created_before?: string;
  p_data_status?: string;
  p_devnet_review_statuses_ids?: string[];
  p_due_after?: string;
  p_due_before?: string;
  p_entity_type?: string;
  p_kind?: string;
  p_overdue_only?: boolean;
  p_priority?: string;
  p_requires_field_review?: boolean;
  p_search_text?: string;
}

export function ParametersForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data from URL params
  const [formData, setFormData] = useState<FormData>({});

  // Function to get form data from URL params
  const getFormDataFromParams = () => ({
    p_active_only:
      searchParams.get("p_active_only") === "true" ? true : undefined,
    p_assigned_to_devnet_employees_id: searchParams.get(
      "p_assigned_to_devnet_employees_id"
    )
      ? Number(searchParams.get("p_assigned_to_devnet_employees_id"))
      : undefined,
    p_completed_only:
      searchParams.get("p_completed_only") === "true" ? true : undefined,
    p_created_after: searchParams.get("p_created_after") || undefined,
    p_created_before: searchParams.get("p_created_before") || undefined,
    p_data_status: searchParams.get("p_data_status") || undefined,
    p_devnet_review_statuses_ids: searchParams.get(
      "p_devnet_review_statuses_ids"
    )
      ? searchParams.get("p_devnet_review_statuses_ids")!.split(",")
      : undefined,
    p_due_after: searchParams.get("p_due_after") || undefined,
    p_due_before: searchParams.get("p_due_before") || undefined,
    p_entity_type: searchParams.get("p_entity_type") || undefined,
    p_kind: searchParams.get("p_kind") || undefined,
    p_overdue_only:
      searchParams.get("p_overdue_only") === "true" ? true : undefined,
    p_priority: searchParams.get("p_priority") || undefined,
    p_requires_field_review:
      searchParams.get("p_requires_field_review") === "true" ? true : undefined,
    p_search_text: searchParams.get("p_search_text") || undefined,
  });

  // Sync form state with URL params
  useEffect(() => {
    setFormData(getFormDataFromParams());
  }, [searchParams]);

  // Check if form data differs from URL params
  const hasUnsavedChanges = () => {
    const urlData = getFormDataFromParams();
    return JSON.stringify(formData) !== JSON.stringify(urlData);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      // Add form values to URL params
      if (formData.p_active_only !== undefined) {
        params.set("p_active_only", formData.p_active_only.toString());
      }
      if (formData.p_assigned_to_devnet_employees_id) {
        params.set(
          "p_assigned_to_devnet_employees_id",
          formData.p_assigned_to_devnet_employees_id.toString()
        );
      }
      if (formData.p_completed_only !== undefined) {
        params.set("p_completed_only", formData.p_completed_only.toString());
      }
      if (formData.p_created_after) {
        params.set("p_created_after", formData.p_created_after);
      }
      if (formData.p_created_before) {
        params.set("p_created_before", formData.p_created_before);
      }
      if (formData.p_data_status) {
        params.set("p_data_status", formData.p_data_status.toString());
      }
      if (
        formData.p_devnet_review_statuses_ids &&
        formData.p_devnet_review_statuses_ids.length > 0
      ) {
        params.set(
          "p_devnet_review_statuses_ids",
          formData.p_devnet_review_statuses_ids.join(",")
        );
      }
      if (formData.p_due_after) {
        params.set("p_due_after", formData.p_due_after);
      }
      if (formData.p_due_before) {
        params.set("p_due_before", formData.p_due_before);
      }
      if (formData.p_entity_type) {
        params.set("p_entity_type", formData.p_entity_type.toString());
      }
      if (formData.p_kind) {
        params.set("p_kind", formData.p_kind.toString());
      }
      if (formData.p_overdue_only !== undefined) {
        params.set("p_overdue_only", formData.p_overdue_only.toString());
      }
      if (formData.p_priority) {
        params.set("p_priority", formData.p_priority.toString());
      }
      if (formData.p_requires_field_review !== undefined) {
        params.set(
          "p_requires_field_review",
          formData.p_requires_field_review.toString()
        );
      }
      if (formData.p_search_text) {
        params.set("p_search_text", formData.p_search_text.toString());
      }

      // Navigate with search params to trigger server component refresh
      router.push(`?${params.toString()}`);
      setOpen(false);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(getFormDataFromParams());
  };

  const handleClear = () => {
    setFormData({
      p_active_only: undefined,
      p_assigned_to_devnet_employees_id: undefined,
      p_completed_only: undefined,
      p_created_after: undefined,
      p_created_before: undefined,
      p_data_status: undefined,
      p_devnet_review_statuses_ids: undefined,
      p_due_after: undefined,
      p_due_before: undefined,
      p_entity_type: undefined,
      p_kind: undefined,
      p_overdue_only: undefined,
      p_priority: undefined,
      p_requires_field_review: undefined,
      p_search_text: undefined,
    });
  };

  const handleClose = () => {
    setFormData(getFormDataFromParams());
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form data when closing
      setFormData(getFormDataFromParams());
    }
    setOpen(isOpen);
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={hasFilters ? "default" : "outline"}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-2 bg-background text-foreground rounded-full px-2 py-0.5 text-xs">
              {Array.from(searchParams.keys()).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Filter Devnet Reviews</DialogTitle>
        </DialogHeader>

        {/* Action buttons at top */}
        <div className="flex gap-2 pb-4 border-b sticky top-0 bg-background z-10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasUnsavedChanges()}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            Clear All
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit as any}
            disabled={isLoading || !hasUnsavedChanges()}
          >
            {isLoading ? "Applying..." : "Apply Filters"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Close
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto flex-1"
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="p_active_only"
              checked={formData.p_active_only || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, p_active_only: checked }))
              }
            />
            <Label htmlFor="p_active_only">P Active Only</Label>
          </div>
          <div>
            <Label htmlFor="p_assigned_to_devnet_employees_id">
              P Assigned To Devnet Employees Id
            </Label>
            <Combobox
              endpoint="/devnet-employees/api"
              value={
                formData.p_assigned_to_devnet_employees_id?.toString() || ""
              }
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  p_assigned_to_devnet_employees_id: value
                    ? Number(value)
                    : undefined,
                }))
              }
              placeholder="Select assigned employee..."
              transformData={(data: any) => {
                return data.map((d: any) => ({
                  value: String(d.id),
                  label: `${d.first_name} ${d.last_name}`,
                }));
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="p_completed_only"
              checked={formData.p_completed_only || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, p_completed_only: checked }))
              }
            />
            <Label htmlFor="p_completed_only">Completed Only</Label>
          </div>
          <div>
            <DatePicker
              label="P Created After"
              value={
                formData.p_created_after
                  ? new Date(formData.p_created_after)
                  : undefined
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  p_created_after: date?.toISOString(),
                }))
              }
              // optional
            />
          </div>
          <div>
            <DatePicker
              label="Created Before"
              value={
                formData.p_created_before
                  ? new Date(formData.p_created_before)
                  : undefined
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  p_created_before: date?.toISOString(),
                }))
              }
              // optional
            />
          </div>
          <div>
            <Label htmlFor="p_data_status">Data Status</Label>
            <Input
              id="p_data_status"
              name="p_data_status"
              type="text"
              value={formData.p_data_status || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  p_data_status: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <ComboboxMultiLookup
              endpoint="/devnet-review-statuses/api"
              value={formData.p_devnet_review_statuses_ids || []}
              onChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  p_devnet_review_statuses_ids: values,
                }))
              }
              placeholder="Select p devnet review statuses ids..."
              title="P Devnet Review Statuses Ids"
              valueKey="id"
              labelKey="name"
              // optional
            />
          </div>
          <div>
            <DatePicker
              label="P Due After"
              value={
                formData.p_due_after
                  ? new Date(formData.p_due_after)
                  : undefined
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  p_due_after: date?.toISOString(),
                }))
              }
              // optional
            />
          </div>
          <div>
            <DatePicker
              label="P Due Before"
              value={
                formData.p_due_before
                  ? new Date(formData.p_due_before)
                  : undefined
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  p_due_before: date?.toISOString(),
                }))
              }
              // optional
            />
          </div>
          <div>
            <Label htmlFor="p_entity_type">P Entity Type</Label>
            <Input
              id="p_entity_type"
              name="p_entity_type"
              type="text"
              value={formData.p_entity_type || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  p_entity_type: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="p_kind">P Kind</Label>
            <Input
              id="p_kind"
              name="p_kind"
              type="text"
              value={formData.p_kind || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, p_kind: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="p_overdue_only"
              checked={formData.p_overdue_only || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, p_overdue_only: checked }))
              }
            />
            <Label htmlFor="p_overdue_only">P Overdue Only</Label>
          </div>
          <div>
            <Label htmlFor="p_priority">P Priority</Label>
            <Input
              id="p_priority"
              name="p_priority"
              type="text"
              value={formData.p_priority || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, p_priority: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="p_requires_field_review"
              checked={formData.p_requires_field_review || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  p_requires_field_review: checked,
                }))
              }
            />
            <Label htmlFor="p_requires_field_review">
              P Requires Field Review
            </Label>
          </div>
          <div>
            <Label htmlFor="p_search_text">P Search Text</Label>
            <Input
              id="p_search_text"
              name="p_search_text"
              type="text"
              value={formData.p_search_text || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  p_search_text: e.target.value,
                }))
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
