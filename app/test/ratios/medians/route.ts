// app/test/ratios/medians/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const asOfDate = searchParams.get("as_of_date");

    // group_by: comma-separated -> text[]
    const groupByParam = searchParams.get("group_by");
    const groupBy =
      groupByParam && groupByParam.trim().length
        ? groupByParam
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null;

    // land_uses: comma-separated -> text[]
    const landUsesParam = searchParams.get("land_uses");
    const landUses =
      landUsesParam && landUsesParam.trim().length
        ? landUsesParam
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null;

    // trim_factor: "1.5" | "3" | null
    const trimParam = searchParams.get("trim_factor");
    const trimFactor = trimParam && trimParam.length ? Number(trimParam) : null;

    // include_raw: "1"/"true" => true (default false)
    const includeRawParam = searchParams.get("include_raw");
    const includeRaw =
      includeRawParam === "1" ||
      includeRawParam === "true" ||
      includeRawParam === "TRUE";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      // @ts-ignore rpc typed loosely
      .rpc("get_ratio_medians", {
        p_start_date: startDate ? startDate : null,
        p_end_date: endDate ? endDate : null,
        p_as_of_date: asOfDate ? asOfDate : null,
        p_group_by: groupBy,
        p_land_uses: landUses,
        p_trim_factor: trimFactor,
        p_include_raw: includeRaw,
      });

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    return Response.json(data ?? []);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
