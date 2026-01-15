import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const supabase = await createClient();

    const params: any = {
      p_search_text: searchParams.get("p_search_text") || "",
    };

    // Add search type
    const searchType = searchParams.get("p_search_type");
    if (searchType) {
      params.p_search_type = searchType;
    }

    // Add optional parameters
    const guideYear = searchParams.get("p_guide_year");
    if (guideYear) {
      params.p_guide_year = Number(guideYear);
    }

    const matchLimit = searchParams.get("p_match_limit");
    if (matchLimit) {
      params.p_match_limit = Number(matchLimit);
    }

    const similarityThreshold = searchParams.get("p_similarity_threshold");
    if (similarityThreshold) {
      params.p_similarity_threshold = Number(similarityThreshold);
    }

    const yearTolerance = searchParams.get("p_year_tolerance");
    if (yearTolerance) {
      params.p_year_tolerance = Number(yearTolerance);
    }

    const { data, error } = await supabase.rpc(
      "search_vehicle_unified",
      params
    );

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error("Error in search-vehicle-unified API:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
