// app/devnet-reviews/api/review-statuses/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewKind = searchParams.get("review_kind");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let query = supabase
      .from("devnet_review_statuses")
      .select("id, name, slug, review_kind, is_terminal, sort_order")
      .order("sort_order", { ascending: true });

    if (reviewKind) {
      query = query.eq("review_kind", reviewKind);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
