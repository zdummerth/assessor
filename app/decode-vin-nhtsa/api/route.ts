import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const supabase = await createClient();

    const params: any = {
      p_vin: searchParams.get("p_vin") || "",
    };

    // Add optional parameters
    const yearTolerance = searchParams.get("p_year_tolerance");
    if (yearTolerance) {
      params.p_year_tolerance = Number(yearTolerance);
    }

    const matchThreshold = searchParams.get("p_match_threshold");
    if (matchThreshold) {
      params.p_match_threshold = Number(matchThreshold);
    }

    const makeThreshold = searchParams.get("p_make_threshold");
    if (makeThreshold) {
      params.p_make_threshold = Number(makeThreshold);
    }

    const modelThreshold = searchParams.get("p_model_threshold");
    if (modelThreshold) {
      params.p_model_threshold = Number(modelThreshold);
    }

    const trimThreshold = searchParams.get("p_trim_threshold");
    if (trimThreshold) {
      params.p_trim_threshold = Number(trimThreshold);
    }

    const limit = searchParams.get("p_limit");
    if (limit) {
      params.p_limit = Number(limit);
    }

    const guideYear = searchParams.get("p_guide_year");
    if (guideYear) {
      params.p_guide_year = Number(guideYear);
    }

    const { data, error } = await supabase.rpc("decode_vin_nhtsa", params);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Cast to any to check for error property from function
    const result = data as any;

    // Check if the API returned an error
    if (result?.error) {
      return Response.json(
        { error: result.message || "Failed to decode VIN" },
        { status: 400 }
      );
    }

    return Response.json({
      data: result,
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
