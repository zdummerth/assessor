import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "25");
    
    const supabase = await createClient();

    let query = supabase
      .from("neighborhoods")
      .select("*", { count: "exact" });

    const name = searchParams.get("name");
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }


    const { data, error, count } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order("id", { ascending: false });

    if (error) {
      return Response.json({ error: "Database query failed" }, { status: 500 });
    }

    return Response.json({
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
