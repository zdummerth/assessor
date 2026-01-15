"use server";

import { createClient } from "@/lib/supabase/server";
import {
  SearchVehicleUnifiedResult,
  SearchVehicleUnifiedParams,
} from "./types";

export async function executeSearchVehicleUnified(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{
  error: string;
  success: string;
  data?: SearchVehicleUnifiedResult;
  searchText?: string;
}> {
  try {
    const supabase = await createClient();

    const params: SearchVehicleUnifiedParams = {
      p_search_text: formData.get("p_search_text") as string,
    };

    // Add search type
    const searchType = formData.get("p_search_type");
    if (searchType) {
      params.p_search_type = searchType as "auto" | "vin" | "description";
    }

    // Add optional parameters if provided
    const guideYear = formData.get("p_guide_year");
    if (guideYear) {
      params.p_guide_year = Number(guideYear);
    }

    const matchLimit = formData.get("p_match_limit");
    if (matchLimit) {
      params.p_match_limit = Number(matchLimit);
    }

    const similarityThreshold = formData.get("p_similarity_threshold");
    if (similarityThreshold) {
      params.p_similarity_threshold = Number(similarityThreshold);
    }

    const yearTolerance = formData.get("p_year_tolerance");
    if (yearTolerance) {
      params.p_year_tolerance = Number(yearTolerance);
    }

    const { data, error } = await supabase.rpc(
      "search_vehicle_unified",
      params
    );

    if (error) {
      console.error("Database error:", error);
      return {
        error: `Failed to search vehicles: ${error.message}`,
        success: "",
      };
    }

    if (!data) {
      return {
        error: "No results found",
        success: "",
      };
    }

    return {
      error: "",
      success: "Vehicle search completed successfully",
      data: data as SearchVehicleUnifiedResult,
      searchText: params.p_search_text,
    };
  } catch (error) {
    console.error("Error executing search:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: "",
    };
  }
}
