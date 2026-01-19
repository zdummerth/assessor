import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_distinct_guide_years");

  if (error) {
    console.error("Error fetching guide years:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide years" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
