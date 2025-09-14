import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

function parseBool(v: string | null, dflt = true): boolean {
  if (v == null) return dflt;
  return /^(1|true|t|yes|y)$/i.test(v);
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const startDate = sp.get("start_date");
    const endDate = sp.get("end_date");
    const asOfDate = sp.get("as_of_date");
    const validOnly = parseBool(sp.get("valid_only"), true);

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
      // @ts-ignore rpc is typed loosely in supabase-js
      .rpc("get_sold_parcel_features_multi", {
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_land_uses: landUses,
        p_valid_only: validOnly,
      });

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    const rows = Array.isArray(data) ? data : [];

    return Response.json(rows);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
