"use server";

import { createClient } from "@/lib/supabase/server";
import { SearchVinWithGuideMatchesResult } from "./types";

export async function executeSearchVinWithGuideMatches(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{
  error: string;
  success: string;
  data?: SearchVinWithGuideMatchesResult[];
  searchedVin?: string;
  totalCount?: number;
}> {
  try {
    const supabase = await createClient();

    const params: any = {
      p_vin: formData.get("p_vin") as string,
    };

    // Add pagination
    const page = formData.get("page") ? Number(formData.get("page")) : 1;
    const pageSize = formData.get("page_size")
      ? Number(formData.get("page_size"))
      : 25;

    const { data, error } = await supabase
      .rpc("search_vin_with_guide_matches", params)
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return { error: error.message, success: "" };
    }

    return {
      error: "",
      success: "",
      data,
      searchedVin: params.p_vin,
      totalCount: Array.isArray(data) ? data.length : 0,
    };
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
