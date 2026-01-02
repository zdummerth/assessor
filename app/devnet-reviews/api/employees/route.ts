// app/devnet-reviews/api/employees/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("devnet_employees")
      .select("id, first_name, last_name, email, role, status")
      .eq("status", "active")
      .order("last_name", { ascending: true });

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
