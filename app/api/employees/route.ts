// app/api/employees/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const canApprove = searchParams.get("can_approve");
    const search = searchParams.get("search");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Build query
    let query = supabase
      .from("employees_v2")
      .select("id, first_name, last_name, email, status, can_approve")
      .order("last_name", { ascending: true });

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (canApprove !== null) {
      query = query.eq("can_approve", canApprove === "true");
    }

    if (search) {
      const searchLower = search.toLowerCase();
      query = query.or(
        `first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    // Transform to ComboOption format
    const options = (data || []).map((emp) => ({
      value: emp.id.toString(),
      label: `${emp.first_name} ${emp.last_name}${emp.email ? ` (${emp.email})` : ""}`,
      // Additional data for reference
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emp.email,
      status: emp.status,
      canApprove: emp.can_approve,
    }));

    return NextResponse.json(options);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
