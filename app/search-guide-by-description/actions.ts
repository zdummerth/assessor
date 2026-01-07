"use server";

import { createClient } from "@/lib/supabase/server";
import { SearchGuideByDescriptionParams, SearchGuideByDescriptionResult } from "./types";

export async function executeSearchGuideByDescription(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string; data?: SearchGuideByDescriptionResult[]; totalCount?: number }> {
  try {
    const supabase = await createClient();

    const params: any = {
      p_limit: formData.get("p_limit") ? Number(formData.get("p_limit")) : undefined,
    };

    // Add pagination
    const page = formData.get("page") ? Number(formData.get("page")) : 1;
    const pageSize = formData.get("page_size") ? Number(formData.get("page_size")) : 25;
    if (params.p_filters) {
      params.p_filters = { ...params.p_filters, page, page_size: pageSize };
    }

    const { data, error } = await supabase.rpc("search_guide_by_description", params);

    if (error) {
      return { error: error.message, success: "" };
    }

    return { error: "", success: "", data, totalCount: Array.isArray(data) ? data.length : 0 };
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
