// app/test/parcels/compare/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request?.nextUrl?.searchParams;

    // Required: subject parcel
    const subjectParcelId = searchParams.get("subject_parcel_id");
    if (!subjectParcelId) {
      return Response.json(
        { error: "subject_parcel_id is required" },
        { status: 400 }
      );
    }

    const compSaleIdsParam = searchParams.get("comp_sale_ids");
    if (!compSaleIdsParam) {
      return Response.json(
        { error: "comp_sale_ids is required" },
        { status: 400 }
      );
    }

    const compSaleIds = compSaleIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map(Number);

    if (compSaleIds.length === 0) {
      return Response.json(
        { error: "At least one valid comp_sale_id is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the Postgres function
    const { data, error } = await supabase.rpc("compare_parcel_to_comp_sales", {
      p_subject_parcel_id: Number(subjectParcelId),
      p_comp_sale_ids: compSaleIds,
    });

    // console.log("RPC result", { data, error });

    if (error) {
      console.error("Supabase error:", error.message);
      return Response.json({ error: "Database query failed" }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
