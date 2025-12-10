// app/test/land-uses/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  console.log("Fetching land use options from Supabase...");
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("land_use_codes")
      .select("code")
      .not("code", "is", null);

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    const options = Array.from(
      new Set((data ?? []).map((r: any) => r.code.toString()))
    ).sort();

    return Response.json(options);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
