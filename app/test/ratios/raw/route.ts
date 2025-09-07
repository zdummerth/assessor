// app/test/ratios/raw/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const startDate = sp.get("start_date");
    const endDate = sp.get("end_date");
    const asOfDate = sp.get("as_of_date");

    // Optional land-uses (comma-separated)
    const landUsesParam = sp.get("land_uses");
    const landUses = landUsesParam
      ? landUsesParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the database function (server-side defaults apply if args are null)
    const { data, error } = await supabase
      // @ts-ignore rpc is typed loosely
      .rpc("get_ratios", {
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_as_of_date: asOfDate || null,
      });

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    const rows = Array.isArray(data) ? data : [];

    // Apply land-use filter here (client asks route to return only those)
    const filtered = landUses?.length
      ? rows.filter(
          (r: any) =>
            r?.land_use_sale && landUses.includes(String(r.land_use_sale))
        )
      : rows;

    return Response.json(filtered);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
