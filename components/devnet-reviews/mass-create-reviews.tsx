"use client";

import { useActionState, useEffect, useState } from "react";
import { massCreateDevnetReviews } from "@/app/devnet-reviews/actions";
import { useDevnetEmployees } from "@/lib/client-queries";
import { toast } from "sonner";
import type {
  DevnetReviewKind,
  DevnetEntityType,
  ReviewPriority,
  ReviewConfig,
} from "@/app/devnet-reviews/actions";

const initialState = { error: "", success: "" };

const REVIEW_KINDS: { value: DevnetReviewKind; label: string }[] = [
  { value: "sale_review", label: "Sale Review" },
  { value: "permit_review", label: "Permit Review" },
  { value: "appeal_review", label: "Appeal Review" },
  { value: "custom_review", label: "Custom Review" },
];

const ENTITY_TYPES: { value: DevnetEntityType; label: string }[] = [
  { value: "devnet_sale", label: "Sale" },
  { value: "devnet_parcel", label: "Parcel" },
  { value: "devnet_neighborhood", label: "Neighborhood" },
];

const PRIORITIES: { value: ReviewPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

interface ReviewTemplate extends ReviewConfig {
  id: string; // For React keys
}

export default function MassCreateReviewsForm({
  revalidatePath,
  title = "Bulk Create Reviews",
  description = "Create multiple reviews at once using entity ID ranges or lists.",
  onSuccess,
}: {
  revalidatePath?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    massCreateDevnetReviews,
    initialState
  );

  const { options: employees } = useDevnetEmployees();
  const [entityIdMode, setEntityIdMode] = useState<"range" | "list">("range");
  const [reviewTemplate, setReviewTemplate] = useState<Partial<ReviewConfig>>({
    kind: "sale_review",
    entity_type: "devnet_sale",
    priority: "medium",
    requires_field_review: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      if (onSuccess) onSuccess();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, onSuccess]);

  const generateReviewConfigs = (formData: FormData): ReviewConfig[] => {
    const configs: ReviewConfig[] = [];
    const baseConfig = {
      kind: formData.get("kind") as DevnetReviewKind,
      entity_type: formData.get("entity_type") as DevnetEntityType,
      title: String(formData.get("title_template")),
      description: formData.get("description")
        ? String(formData.get("description"))
        : undefined,
      priority: (formData.get("priority") as ReviewPriority) || "medium",
      requires_field_review: formData.get("requires_field_review") === "on",
      assigned_to_id: formData.get("assigned_to_id")
        ? Number(formData.get("assigned_to_id"))
        : undefined,
    };

    if (entityIdMode === "range") {
      const startId = Number(formData.get("start_id"));
      const endId = Number(formData.get("end_id"));

      for (let id = startId; id <= endId; id++) {
        configs.push({
          ...baseConfig,
          entity_id: id,
          title: baseConfig.title.replace("{id}", id.toString()),
        });
      }
    } else {
      const entityIds = String(formData.get("entity_ids") || "")
        .split(/[,\s]+/)
        .map((id) => id.trim())
        .filter((id) => id && !isNaN(Number(id)))
        .map(Number);

      entityIds.forEach((id) => {
        configs.push({
          ...baseConfig,
          entity_id: id,
          title: baseConfig.title.replace("{id}", id.toString()),
        });
      });
    }

    return configs;
  };

  const handleSubmit = (formData: FormData) => {
    try {
      const reviewConfigs = generateReviewConfigs(formData);
      if (reviewConfigs.length === 0) {
        toast.error("No valid entity IDs provided");
        return;
      }

      // Add the generated configs to form data
      formData.set("review_configs", JSON.stringify(reviewConfigs));
      action(formData);
    } catch (error) {
      toast.error("Error generating review configurations");
    }
  };

  return (
    <section className="w-full rounded border bg-background p-4 md:p-6 space-y-4 text-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>

      <form action={handleSubmit} className="space-y-4">
        {revalidatePath && (
          <input type="hidden" name="revalidate_path" value={revalidatePath} />
        )}

        {/* Review Template Configuration */}
        <fieldset className="border rounded p-3 space-y-3">
          <legend className="font-medium px-2">Review Template</legend>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-2">
              <label htmlFor="kind" className="font-medium">
                Review Type <span className="text-red-500">*</span>
              </label>
              <select
                id="kind"
                name="kind"
                required
                className="border rounded px-3 py-2"
                defaultValue={reviewTemplate.kind}
                onChange={(e) =>
                  setReviewTemplate((prev) => ({
                    ...prev,
                    kind: e.target.value as DevnetReviewKind,
                  }))
                }
              >
                {REVIEW_KINDS.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="entity_type" className="font-medium">
                Entity Type <span className="text-red-500">*</span>
              </label>
              <select
                id="entity_type"
                name="entity_type"
                required
                className="border rounded px-3 py-2"
                defaultValue={reviewTemplate.entity_type}
                onChange={(e) =>
                  setReviewTemplate((prev) => ({
                    ...prev,
                    entity_type: e.target.value as DevnetEntityType,
                  }))
                }
              >
                {ENTITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="priority" className="font-medium">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="border rounded px-3 py-2"
                defaultValue={reviewTemplate.priority}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="title_template" className="font-medium">
              Title Template <span className="text-red-500">*</span>
            </label>
            <input
              id="title_template"
              name="title_template"
              type="text"
              required
              placeholder="Review for {entity_type} #{id}"
              className="border rounded px-3 py-2"
              defaultValue={`${reviewTemplate.kind?.replace("_", " ")} for {entity_type} #{id}`}
            />
            <p className="text-xs text-muted-foreground">
              Use {"{id}"} as placeholder for entity ID
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="assigned_to_id" className="font-medium">
                Assign To (optional)
              </label>
              <select
                id="assigned_to_id"
                name="assigned_to_id"
                className="border rounded px-3 py-2"
                defaultValue=""
              >
                <option value="">Leave unassigned…</option>
                {employees?.map(
                  (employee: {
                    id: number;
                    first_name: string;
                    last_name: string;
                    role: string;
                  }) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} (
                      {employee.role})
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                id="requires_field_review"
                name="requires_field_review"
                type="checkbox"
                className="rounded"
                defaultChecked={reviewTemplate.requires_field_review}
              />
              <label htmlFor="requires_field_review" className="font-medium">
                Requires field review
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Default description for all reviews…"
              className="border rounded px-3 py-2 resize-none"
            />
          </div>
        </fieldset>

        {/* Entity ID Selection */}
        <fieldset className="border rounded p-3 space-y-3">
          <legend className="font-medium px-2">Entity IDs</legend>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="entity_id_mode"
                value="range"
                checked={entityIdMode === "range"}
                onChange={(e) =>
                  setEntityIdMode(e.target.value as "range" | "list")
                }
              />
              <span className="font-medium">ID Range</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="entity_id_mode"
                value="list"
                checked={entityIdMode === "list"}
                onChange={(e) =>
                  setEntityIdMode(e.target.value as "range" | "list")
                }
              />
              <span className="font-medium">ID List</span>
            </label>
          </div>

          {entityIdMode === "range" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="start_id" className="font-medium">
                  Start ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="start_id"
                  name="start_id"
                  type="number"
                  required={entityIdMode === "range"}
                  min="1"
                  placeholder="1"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="end_id" className="font-medium">
                  End ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="end_id"
                  name="end_id"
                  type="number"
                  required={entityIdMode === "range"}
                  min="1"
                  placeholder="100"
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <label htmlFor="entity_ids" className="font-medium">
                Entity IDs <span className="text-red-500">*</span>
              </label>
              <textarea
                id="entity_ids"
                name="entity_ids"
                required={entityIdMode === "list"}
                rows={3}
                placeholder="1, 2, 3, 5, 8, 13..."
                className="border rounded px-3 py-2 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Enter entity IDs separated by commas, spaces, or line breaks
              </p>
            </div>
          )}
        </fieldset>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
          <div className="text-xs">
            {state.error && <p className="text-red-600">{state.error}</p>}
            {state.success && (
              <p className="text-emerald-600">{state.success}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
            aria-busy={pending}
            disabled={pending}
          >
            {pending ? "Creating Reviews…" : "Create Reviews"}
          </button>
        </div>
      </form>
    </section>
  );
}
