import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { Database } from "@/database-types";

type SearchVehicleValuesArgs =
  Database["public"]["Functions"]["search_vehicle_values"]["Args"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const guide_year = searchParams.get("guide_year");
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const model_year_max = searchParams.get("model_year_max");
  const model_year_min = searchParams.get("model_year_min");
  const trim = searchParams.get("trim");
  const type = searchParams.get("type");

  const params: Partial<SearchVehicleValuesArgs> = {};

  if (guide_year) params.p_guide_year = parseInt(guide_year);
  if (make) params.p_make = make;
  if (model) params.p_model = model;
  if (model_year_max) params.p_model_year_max = parseInt(model_year_max);
  if (model_year_min) params.p_model_year_min = parseInt(model_year_min);
  if (trim) params.p_trim = trim;
  if (type) params.p_type = type;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_vehicle_values", params);

  if (error) {
    console.error("Error calling search_vehicle_values:", error);
    return NextResponse.json(
      { error: "Failed to execute search_vehicle_values" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
