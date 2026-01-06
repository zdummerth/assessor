import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "25");
    
    const supabase = await createClient();

    let query = supabase
      .from("devnet_employees")
      .select("*", { count: "exact" });

    const created_at = searchParams.get("created_at");
    if (created_at) {
      query = query.ilike("created_at", `%${created_at}%`);
    }

    const email = searchParams.get("email");
    if (email) {
      query = query.ilike("email", `%${email}%`);
    }

    const first_name = searchParams.get("first_name");
    if (first_name) {
      query = query.ilike("first_name", `%${first_name}%`);
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
