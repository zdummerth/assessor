import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Optional date filters
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Valid-only flag (default true)
    const validOnlyParam = searchParams.get("valid_only");
    const validOnly =
      validOnlyParam === null
        ? true
        : validOnlyParam === "true" || validOnlyParam === "1";

    // Address filter
    const addressSearch = searchParams.get("address");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Base RPC call
    let query = supabase
      // @ts-ignore
      .rpc("find_sold_parcel_features", {
        p_start_date: startDate ? startDate : null,
        p_end_date: endDate ? endDate : null,
        p_valid_only: validOnly,
      });

    // If we want to apply address filtering, tack on an .or()
    if (addressSearch) {
      // Case-insensitive "ilike" match
      query = query.or(
        `street.ilike.%${addressSearch}%,house_number.ilike.%${addressSearch}%`
      );
    }

    query = query.order("sale_date", { ascending: false }).limit(10);

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
