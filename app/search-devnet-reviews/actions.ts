"use server";

import { createClient } from "@/lib/supabase/server";
import { SearchDevnetReviewsParams, SearchDevnetReviewsResult } from "./types";

export async function executeSearchDevnetReviews(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string; data?: SearchDevnetReviewsResult[]; totalCount?: number }> {
  try {
    const supabase = await createClient();

    const params: any = {
      p_active_only: formData.get("p_active_only") === "true",
      p_assigned_to_id: formData.get("p_assigned_to_id") ? Number(formData.get("p_assigned_to_id")) : undefined,
      p_completed_only: formData.get("p_completed_only") === "true",
      p_created_after: formData.get("p_created_after") || undefined,
      p_created_before: formData.get("p_created_before") || undefined,
      p_data_status: formData.get("p_data_status") || undefined,
      p_due_after: formData.get("p_due_after") || undefined,
      p_due_before: formData.get("p_due_before") || undefined,
      p_entity_type: formData.get("p_entity_type") || undefined,
      p_kind: formData.get("p_kind") || undefined,
      p_overdue_only: formData.get("p_overdue_only") === "true",
      p_priority: formData.get("p_priority") || undefined,
      p_requires_field_review: formData.get("p_requires_field_review") === "true",
      p_search_text: formData.get("p_search_text") || undefined,
      p_status_ids: formData.get("p_status_ids") || undefined,
    };

    // Add pagination
    const page = formData.get("page") ? Number(formData.get("page")) : 1;
    const pageSize = formData.get("page_size") ? Number(formData.get("page_size")) : 25;
    if (params.p_filters) {
      params.p_filters = { ...params.p_filters, page, page_size: pageSize };
    }

    const { data, error } = await supabase.rpc("search_devnet_reviews", params);

    if (error) {
      return { error: error.message, success: "" };
    }

    return { error: "", success: "", data, totalCount: Array.isArray(data) ? data.length : 0 };
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
