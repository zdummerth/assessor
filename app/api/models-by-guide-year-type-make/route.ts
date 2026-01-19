import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideYear = searchParams.get("guide_year");
  const type = searchParams.get("type");
  const make = searchParams.get("make");

  if (!guideYear) {
    return NextResponse.json(
      { error: "guide_year parameter is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_distinct_models_by_guide_year_type_make",
    {
      p_guide_year: parseInt(guideYear),
      p_type: type || undefined,
      p_make: make || undefined,
    }
  );

  if (error) {
    console.error(
      "Error fetching models by guide year, type, and make:",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
