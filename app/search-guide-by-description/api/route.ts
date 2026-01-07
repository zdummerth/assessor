import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const searchText = searchParams.get("p_search_text");

    if (!searchText) {
      return Response.json(
        { error: "p_search_text is required" },
        { status: 400 }
      );
    }

    const args: { p_search_text: string; p_limit?: number } = {
      p_search_text: searchText,
    };

    if (searchParams.has("p_limit")) {
      args.p_limit = Number(searchParams.get("p_limit"));
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
      "search_guide_by_description",
      args
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
