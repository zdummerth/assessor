// app/test/sales/address-search/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Required: address prefix to search
    const address = searchParams.get("address");
    if (!address) {
      return Response.json(
        { error: "address parameter is required" },
        { status: 400 }
      );
    }

    // Optional: valid_only flag (default true)
    const validOnlyParam = searchParams.get("valid_only");
    const validOnly =
      validOnlyParam === null
        ? false
        : validOnlyParam === "true" || validOnlyParam === "1";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the Postgres function
    const { data, error } = await supabase
      // @ts-ignore rpc types are loose
      .rpc("search_sold_parcels_by_address_prefix", {
        p_prefix: address,
        p_valid_only: validOnly,
      })
      .limit(10);

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json({ error: "Database query failed" }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
