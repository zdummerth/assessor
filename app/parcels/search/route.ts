// import { createClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database

import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query || query.trim().length < 2) {
      return Response.error();
    }

    console.log("Search query:", query);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      //@ts-ignore
      .rpc("search_parcels", { prefix: query })
      .order("retired", { nullsFirst: true })
      .order("parcel")
      .limit(9);

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    console.log("Search results:", data[0].addresses);

    return Response.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.error(); // Sends 500 with no body
  }
}
