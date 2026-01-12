"use server";

import { createClient } from "@/lib/supabase/server";
import {
  SearchGuideByDescriptionParams,
  SearchGuideByDescriptionResult,
} from "./types";

export async function executeSearchGuideByDescription(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{
  error: string;
  success: string;
  data?: SearchGuideByDescriptionResult[];
  totalCount?: number;
}> {
  try {
    const supabase = await createClient();

    const searchText = formData.get("p_search_text");
    if (!searchText) {
      return { error: "Search text is required", success: "" };
    }

    const params: SearchGuideByDescriptionParams = {
      p_search_text: searchText.toString(),
      p_guide_year: formData.get("p_guide_year")
        ? Number(formData.get("p_guide_year"))
        : undefined,
      p_limit: formData.get("p_limit")
        ? Number(formData.get("p_limit"))
        : undefined,
    };

    const { data, error } = await supabase.rpc(
      "search_guide_by_description",
      params
    );

    if (error) {
      return { error: error.message, success: "" };
    }

    return {
      error: "",
      success: "",
      //@ts-expect-error not sure about this one
      data,
      totalCount: Array.isArray(data) ? data.length : 0,
    };
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
