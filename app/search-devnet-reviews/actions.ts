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
      p_filters: formData.get("p_filters") ? JSON.parse(formData.get("p_filters") as string) : undefined,
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
