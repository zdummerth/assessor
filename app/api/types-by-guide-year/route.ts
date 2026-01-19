import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideYear = searchParams.get("guide_year");

  if (!guideYear) {
    return NextResponse.json(
      { error: "guide_year parameter is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_distinct_types_by_guide_year",
    {
      p_guide_year: parseInt(guideYear),
    }
  );

  if (error) {
    console.error("Error fetching types by guide year:", error);
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
