// app/api/find-parcel-features/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Required
    const parcelIdRaw = searchParams.get("parcel_id");
    const parcelId = parcelIdRaw ? Number(parcelIdRaw) : NaN;
    if (!Number.isFinite(parcelId) || parcelId <= 0) {
      return Response.json({ error: "parcel_id is required" }, { status: 400 });
    }

    // Optional: as_of_date ("YYYY-MM-DD"); if omitted, SQL default (CURRENT_DATE) is used.
    const asOfDate = searchParams.get("as_of_date") || undefined;
    if (asOfDate) {
      // quick validation
      const d = new Date(asOfDate);
      if (isNaN(d.getTime())) {
        return Response.json({ error: "Invalid as_of_date" }, { status: 400 });
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Build args, omit p_as_of_date to use the SQL default
    const args: { p_as_of_date?: string } = {};
    if (asOfDate) args.p_as_of_date = asOfDate;

    // Call the Postgres function and filter to the requested parcel_id
    let query = supabase
      .rpc("find_parcel_features", args)
      .eq("parcel_id", parcelId);

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
