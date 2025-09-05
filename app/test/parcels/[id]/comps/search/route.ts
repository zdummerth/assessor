import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Finding comps for parcel ID:");
    const searchParams = request.nextUrl.searchParams;

    // Required
    const parcelId = Number(searchParams.get("parcel_id"));
    if (!parcelId) {
      return Response.json({ error: "parcel_id is required" }, { status: 400 });
    }

    // Optional with defaults
    const k = Number(searchParams.get("k") ?? 8);
    const years = Number(searchParams.get("years") ?? 2);
    const maxDistance = searchParams.get("max_distance_miles");
    const livingBand = searchParams.get("living_area_band");
    const requireSameLU = searchParams.get("require_same_land_use");

    // Parse weights (JSON in query param, e.g. ?weights={"land_use":5,"district":4})
    let weights: Record<string, number> = {};
    const weightsParam = searchParams.get("weights");
    if (weightsParam) {
      try {
        weights = JSON.parse(weightsParam);
      } catch {
        return Response.json(
          { error: "Invalid weights JSON" },
          { status: 400 }
        );
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the Postgres function
    const { data, error } = await supabase
      // @ts-ignore rpc is typed loosely
      .rpc("find_comps", {
        p_parcel_ids: [parcelId],
        p_k: k,
        p_years: years,
        p_weights: weights,
        p_max_distance_miles: maxDistance ? Number(maxDistance) : null,
        p_living_area_band: livingBand ? Number(livingBand) : null,
        p_require_same_land_use:
          requireSameLU === null
            ? true
            : requireSameLU === "true" || requireSameLU === "1",
      });

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
