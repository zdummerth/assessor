"use server";

import { createClient } from "@/lib/supabase/server";
import { DecodeVinNhtsaResult, DecodeVinNhtsaParams } from "./types";

export async function executeDecodeVinNhtsa(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{
  error: string;
  success: string;
  data?: DecodeVinNhtsaResult;
  searchedVin?: string;
}> {
  try {
    const supabase = await createClient();

    const params: DecodeVinNhtsaParams = {
      p_vin: formData.get("p_vin") as string,
    };

    // Add optional parameters if provided
    const yearTolerance = formData.get("p_year_tolerance");
    if (yearTolerance) {
      params.p_year_tolerance = Number(yearTolerance);
    }

    const matchThreshold = formData.get("p_match_threshold");
    if (matchThreshold) {
      params.p_match_threshold = Number(matchThreshold);
    }

    const makeThreshold = formData.get("p_make_threshold");
    if (makeThreshold) {
      params.p_make_threshold = Number(makeThreshold);
    }

    const modelThreshold = formData.get("p_model_threshold");
    if (modelThreshold) {
      params.p_model_threshold = Number(modelThreshold);
    }

    const trimThreshold = formData.get("p_trim_threshold");
    if (trimThreshold) {
      params.p_trim_threshold = Number(trimThreshold);
    }

    const limit = formData.get("p_limit");
    if (limit) {
      params.p_limit = Number(limit);
    }

    const guideYear = formData.get("p_guide_year");
    if (guideYear) {
      params.p_guide_year = Number(guideYear);
    }

    const { data, error } = await supabase.rpc("decode_vin_nhtsa", params);

    if (error) {
      return { error: error.message, success: "" };
    }

    // Cast to any to check for error property from function
    const result = data as any;

    // Check if the API returned an error
    if (result?.error) {
      return {
        error: result.message || "Failed to decode VIN",
        success: "",
      };
    }

    return {
      error: "",
      success: "VIN decoded successfully",
      data: result as DecodeVinNhtsaResult,
      searchedVin: params.p_vin,
    };
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
