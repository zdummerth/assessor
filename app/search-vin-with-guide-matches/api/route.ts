import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
      "search_vin_with_guide_matches",
      {
        p_vin: searchParams.get("p_vin") || "",
      }
    );

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
