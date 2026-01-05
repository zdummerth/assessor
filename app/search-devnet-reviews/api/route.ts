import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const p_filtersRaw = searchParams.get("p_filters");
    const p_filters = p_filtersRaw ? JSON.parse(p_filtersRaw) : undefined;

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("search_devnet_reviews", {
      p_filters
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
