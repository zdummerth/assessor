import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideYear = searchParams.get("guide_year");
  const type = searchParams.get("type");

  if (!guideYear) {
    return NextResponse.json(
      { error: "guide_year parameter is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_distinct_makes_by_guide_year_type",
    {
      p_guide_year: parseInt(guideYear),
      p_type: type || undefined,
    }
  );

  if (error) {
    console.error("Error fetching makes by guide year and type:", error);
    return NextResponse.json(
      { error: "Failed to fetch makes" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
