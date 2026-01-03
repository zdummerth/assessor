"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// ============================================================
// TYPESCRIPT TYPES FOR DEVNET REVIEWS
// ============================================================

export type DevnetReviewKind =
  | "sale_review"
  | "permit_review"
  | "appeal_review"
  | "custom_review";

export type DevnetDataStatus =
  | "not_collected"
  | "in_field"
  | "collected"
  | "entered"
  | "copied_to_devnet"
  | "verified";

export type DevnetEntityType =
  | "devnet_parcel"
  | "devnet_sale"
  | "devnet_neighborhood"
  | "devnet_sales"
  | "devnet_parcels";

export type ReviewPriority = "low" | "medium" | "high" | "urgent";

export type EmployeeRole =
  | "appraiser"
  | "supervisor"
  | "data_entry"
  | "reviewer";

export type EmployeeStatus = "active" | "inactive" | "pending";

export interface DevnetEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  specialties: string[];
  can_approve: boolean;
  created_at: string;
  updated_at: string;
}

export interface DevnetReviewStatus {
  id: number;
  review_kind: DevnetReviewKind;
  slug: string;
  name: string;
  is_terminal: boolean;
  needs_approval: boolean;
  requires_assignment: boolean;
  preferred_role?: EmployeeRole;
  required_specialties: string[];
  sort_order: number;
}

export interface DevnetReview {
  id: number;
  kind: DevnetReviewKind;
  current_status_id: number;
  assigned_to_id?: number;
  due_date?: string;
  entity_type: DevnetEntityType;
  entity_id: number;
  data_status: DevnetDataStatus;
  requires_field_review: boolean;
  title: string;
  description?: string;
  priority: ReviewPriority;
  data: Record<string, any>;
  field_data?: Record<string, any>;
  field_notes?: string;
  required_data_fields?: Record<string, any>;
  data_validation_rules?: Record<string, any>;
  completion_criteria?: Record<string, any>;
  data_collected_at?: string;
  data_collected_by_id?: number;
  copied_to_devnet_at?: string;
  copied_to_devnet_by_id?: number;
  devnet_copy_confirmed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface DevnetReviewAssignment {
  id: number;
  review_id: number;
  status_id: number;
  employee_id: number;
  assigned_by_id?: number;
  due_date?: string;
  notes?: string;
  assigned_at: string;
  completed_at?: string;
  completed_by_id?: number;
  completion_notes?: string;
  is_active: boolean;
}

export interface ReviewConfig {
  kind: DevnetReviewKind;
  entity_type: DevnetEntityType;
  entity_id: number;
  title: string;
  description?: string;
  priority?: ReviewPriority;
  requires_field_review?: boolean;
  required_data_fields?: Record<string, any>;
  data_validation_rules?: Record<string, any>;
  completion_criteria?: Record<string, any>;
  data?: Record<string, any>;
  due_date?: string;
  assigned_to_id?: number;
}

export interface ReviewSearchFilters {
  kind?: DevnetReviewKind;
  status_ids?: string;
  assigned_to_id?: number;
  data_status?: DevnetDataStatus;
  priority?: ReviewPriority;
  entity_type?: DevnetEntityType;
  requires_field_review?: boolean;
  search_text?: string;
  overdue_only?: boolean;
  created_after?: string;
  created_before?: string;
  due_after?: string;
  due_before?: string;
  completed_only?: boolean;
  active_only?: boolean;
  neighborhood?: string;
  parcel_number?: string;
  address?: string;
  assigned_to_name?: string;
  min_sale_price?: number;
  max_sale_price?: number;
  is_terminal?: boolean;
}

export interface ReviewDataCompleteness {
  is_complete: boolean;
  missing_fields: string[];
  validation_errors: string[];
  checked_at: string;
}

export interface FilterOptions {
  kinds: DevnetReviewKind[];
  statuses: Array<{
    slug: string;
    name: string;
    kind: DevnetReviewKind;
  }>;
  priorities: ReviewPriority[];
  data_statuses: DevnetDataStatus[];
  employees: Array<{
    id: number;
    name: string;
    email: string;
    role: EmployeeRole;
  }>;
  neighborhoods: string[];
}

export interface ReviewCounts {
  kind: DevnetReviewKind;
  status_name: string;
  status_slug: string;
  review_count: number;
}

export interface FieldMeasurements {
  length?: number;
  width?: number;
  height?: number;
  area?: number;
}

export interface FieldData {
  inspection_date?: string;
  inspector_notes?: string;
  photos_taken?: number;
  measurements?: FieldMeasurements;
  condition_rating?: number;
  [key: string]: any;
}

type ActionState = { error: string; success: string };

// ============================================================
// REVIEW MANAGEMENT ACTIONS
// ============================================================

export async function createDevnetReview(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const kind = String(formData.get("kind"));
    const entity_type = String(formData.get("entity_type"));
    const entity_id = Number(formData.get("entity_id"));
    const title = String(formData.get("title"));
    const description = String(formData.get("description") || "");
    const assigned_to_id = formData.get("assigned_to_id")
      ? Number(formData.get("assigned_to_id"))
      : null;
    const data = String(formData.get("data") || "{}");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: reviewId, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "create_devnet_review",
      {
        p_kind: kind,
        p_entity_type: entity_type,
        p_entity_id: entity_id,
        p_title: title,
        p_description: description,
        p_assigned_to_id: assigned_to_id,
        p_data: JSON.parse(data),
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return { success: `Review #${reviewId} created successfully`, error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to create review" };
  }
}

export async function massCreateDevnetReviews(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_configs = String(formData.get("review_configs"));
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: reviewIds, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_create_devnet_reviews",
      {
        p_review_configs: JSON.parse(review_configs),
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Created reviews successfully`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to create reviews" };
  }
}

export async function transitionReviewStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const new_status_slug = String(formData.get("new_status_slug"));
    const changed_by_id = formData.get("changed_by_id")
      ? Number(formData.get("changed_by_id"))
      : null;
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "transition_devnet_review_status",
      {
        p_review_id: review_id,
        p_new_status_slug: new_status_slug,
        p_changed_by_id: changed_by_id,
        p_notes: notes,
      }
    );

    if (error || !success) throw error || new Error("Status transition failed");

    if (revalidate_path) rp(revalidate_path);
    return { success: "Status updated successfully", error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to update status" };
  }
}

export async function massUpdateReviewStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_ids_json = String(formData.get("review_ids") || "[]");
    const review_ids = JSON.parse(review_ids_json) as number[];
    const new_status_slug = String(formData.get("new_status_slug"));
    const changed_by_id = formData.get("changed_by_id")
      ? Number(formData.get("changed_by_id"))
      : null;
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!review_ids.length) throw new Error("No reviews selected");

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_update_devnet_review_status",
      {
        p_review_ids: review_ids,
        p_new_status_slug: new_status_slug,
        p_changed_by_id: changed_by_id,
        p_notes: notes,
      }
    );

    if (error || !success)
      throw error || new Error("Mass status update failed");

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Updated status for ${review_ids.length} review(s)`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to update statuses" };
  }
}

// ============================================================
// ASSIGNMENT MANAGEMENT ACTIONS
// ============================================================

export async function assignReview(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const employee_id = Number(formData.get("employee_id"));
    const assigned_by_id = formData.get("assigned_by_id")
      ? Number(formData.get("assigned_by_id"))
      : null;
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "assign_devnet_review",
      {
        p_review_id: review_id,
        p_employee_id: employee_id,
        p_assigned_by_id: assigned_by_id,
        p_notes: notes,
      }
    );

    if (error || !success) throw error || new Error("Assignment failed");

    if (revalidate_path) rp(revalidate_path);
    return { success: "Review assigned successfully", error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to assign review" };
  }
}

export async function massAssignReviews(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_ids_json = String(formData.get("review_ids") || "[]");
    const review_ids = JSON.parse(review_ids_json) as number[];
    const employee_id = Number(formData.get("employee_id"));
    const assigned_by_id = formData.get("assigned_by_id")
      ? Number(formData.get("assigned_by_id"))
      : null;
    const due_date = formData.get("due_date")
      ? String(formData.get("due_date"))
      : null;
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!review_ids.length) throw new Error("No reviews selected");

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_assign_devnet_reviews",
      {
        p_review_ids: review_ids,
        p_employee_id: employee_id,
        p_assigned_by_id: assigned_by_id,
        p_due_date: due_date,
      }
    );

    if (error || !success) throw error || new Error("Mass assignment failed");

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Assigned ${review_ids.length} review(s) successfully`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to assign reviews" };
  }
}

export async function massReassignReviews(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_ids_json = String(formData.get("review_ids") || "[]");
    const review_ids = JSON.parse(review_ids_json) as number[];
    const from_employee_id = Number(formData.get("from_employee_id"));
    const to_employee_id = Number(formData.get("to_employee_id"));
    const assigned_by_id = formData.get("assigned_by_id")
      ? Number(formData.get("assigned_by_id"))
      : null;
    const due_date = formData.get("due_date")
      ? String(formData.get("due_date"))
      : null;
    const notes = String(formData.get("notes") || "Mass reassignment");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!review_ids.length) throw new Error("No reviews selected");

    const supabase = await createClient();

    const { data: reassignments_made, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_reassign_devnet_reviews",
      {
        p_review_ids: review_ids,
        p_from_employee_id: from_employee_id,
        p_to_employee_id: to_employee_id,
        p_assigned_by_id: assigned_by_id,
        p_due_date: due_date,
        p_notes: notes,
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Reassigned ${reassignments_made} review(s) successfully`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to reassign reviews" };
  }
}

export async function massCreateAssignments(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_ids_json = String(formData.get("review_ids") || "[]");
    const status_ids_json = String(formData.get("status_ids") || "[]");
    const review_ids = JSON.parse(review_ids_json) as number[];
    const status_ids = JSON.parse(status_ids_json) as number[];
    const employee_id = Number(formData.get("employee_id"));
    const assigned_by_id = formData.get("assigned_by_id")
      ? Number(formData.get("assigned_by_id"))
      : null;
    const due_date = formData.get("due_date")
      ? String(formData.get("due_date"))
      : null;
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!review_ids.length) throw new Error("No reviews selected");
    if (!status_ids.length) throw new Error("No statuses selected");

    const supabase = await createClient();

    const { data: assignments_created, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_create_devnet_assignments",
      {
        p_review_ids: review_ids,
        p_status_ids: status_ids,
        p_employee_id: employee_id,
        p_assigned_by_id: assigned_by_id,
        p_due_date: due_date,
        p_notes: notes,
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Created ${assignments_created} assignment(s) successfully`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to create assignments" };
  }
}

export async function massCompleteAssignments(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const assignment_ids_json = String(formData.get("assignment_ids") || "[]");
    const assignment_ids = JSON.parse(assignment_ids_json) as number[];
    const completed_by_id = Number(formData.get("completed_by_id"));
    const completion_notes = String(formData.get("completion_notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!assignment_ids.length) throw new Error("No assignments selected");

    const supabase = await createClient();

    const { data: completions_made, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_complete_devnet_assignments",
      {
        p_assignment_ids: assignment_ids,
        p_completed_by_id: completed_by_id,
        p_completion_notes: completion_notes,
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Completed ${completions_made} assignment(s) successfully`,
      error: "",
    };
  } catch (e: any) {
    return {
      success: "",
      error: e.message || "Failed to complete assignments",
    };
  }
}

export async function massUpdateAssignmentDueDates(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const assignment_ids_json = String(formData.get("assignment_ids") || "[]");
    const assignment_ids = JSON.parse(assignment_ids_json) as number[];
    const new_due_date = String(formData.get("new_due_date"));
    const updated_by_id = formData.get("updated_by_id")
      ? Number(formData.get("updated_by_id"))
      : null;
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!assignment_ids.length) throw new Error("No assignments selected");

    const supabase = await createClient();

    const { data: updates_made, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mass_update_assignment_due_dates",
      {
        p_assignment_ids: assignment_ids,
        p_new_due_date: new_due_date,
        p_updated_by_id: updated_by_id,
        p_notes: notes,
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Updated due dates for ${updates_made} assignment(s) successfully`,
      error: "",
    };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to update due dates" };
  }
}

// ============================================================
// DATA MANAGEMENT ACTIONS
// ============================================================

export async function setReviewDataRequirements(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const required_fields = String(formData.get("required_fields") || "{}");
    const validation_rules = String(formData.get("validation_rules") || "{}");
    const completion_criteria = String(
      formData.get("completion_criteria") || "{}"
    );
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "set_review_data_requirements",
      {
        p_review_id: review_id,
        p_required_fields: JSON.parse(required_fields),
        p_validation_rules: JSON.parse(validation_rules),
        p_completion_criteria: JSON.parse(completion_criteria),
      }
    );

    if (error || !success)
      throw error || new Error("Failed to set data requirements");

    if (revalidate_path) rp(revalidate_path);
    return { success: "Data requirements updated successfully", error: "" };
  } catch (e: any) {
    return {
      success: "",
      error: e.message || "Failed to set data requirements",
    };
  }
}

export async function markDataCollected(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const field_data = String(formData.get("field_data") || "{}");
    const employee_id = Number(formData.get("employee_id"));
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();
    //@ts-expect-error need to generate types for RPC
    const { data: success, error } = await supabase.rpc("mark_data_collected", {
      p_review_id: review_id,
      p_field_data: JSON.parse(field_data),
      p_employee_id: employee_id,
      p_notes: notes,
    });

    if (error || !success)
      throw error || new Error("Failed to mark data as collected");

    if (revalidate_path) rp(revalidate_path);
    return { success: "Data marked as collected successfully", error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to mark data collected" };
  }
}

export async function markCopiedToDevnet(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const employee_id = Number(formData.get("employee_id"));
    const notes = String(formData.get("notes") || "");
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "mark_copied_to_devnet",
      {
        p_review_id: review_id,
        p_employee_id: employee_id,
        p_notes: notes,
      }
    );

    if (error || !success)
      throw error || new Error("Failed to mark as copied to devnet");

    if (revalidate_path) rp(revalidate_path);
    return { success: "Marked as copied to Devnet successfully", error: "" };
  } catch (e: any) {
    return {
      success: "",
      error: e.message || "Failed to mark copied to devnet",
    };
  }
}

export async function autoAssignFieldReviews(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: assignments_made, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "auto_assign_field_reviews"
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return {
      success: `Auto-assigned ${assignments_made} field review(s)`,
      error: "",
    };
  } catch (e: any) {
    return {
      success: "",
      error: e.message || "Failed to auto-assign field reviews",
    };
  }
}

// ============================================================
// UTILITY ACTIONS
// ============================================================

export async function checkReviewDataCompleteness(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const review_id = Number(formData.get("review_id"));
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { data: completeness_check, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for RPC
      "check_review_data_completeness",
      {
        p_review_id: review_id,
      }
    );

    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);

    const result = completeness_check as any;
    if (result.is_complete) {
      return { success: "Review data is complete", error: "" };
    } else {
      return {
        success: "",
        error: `Missing fields: ${result.missing_fields.join(", ")}`,
      };
    }
  } catch (e: any) {
    return {
      success: "",
      error: e.message || "Failed to check data completeness",
    };
  }
}
