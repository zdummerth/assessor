import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const p_active_only = searchParams.get("p_active_only") === "true";
    const p_assigned_to_id = searchParams.get("p_assigned_to_id") ? Number(searchParams.get("p_assigned_to_id")) : undefined;
    const p_completed_only = searchParams.get("p_completed_only") === "true";
    const p_created_after = searchParams.get("p_created_after") || undefined;
    const p_created_before = searchParams.get("p_created_before") || undefined;
    const p_data_status = searchParams.get("p_data_status") || undefined;
    const p_due_after = searchParams.get("p_due_after") || undefined;
    const p_due_before = searchParams.get("p_due_before") || undefined;
    const p_entity_type = searchParams.get("p_entity_type") || undefined;
    const p_kind = searchParams.get("p_kind") || undefined;
    const p_overdue_only = searchParams.get("p_overdue_only") === "true";
    const p_priority = searchParams.get("p_priority") || undefined;
    const p_requires_field_review = searchParams.get("p_requires_field_review") === "true";
    const p_search_text = searchParams.get("p_search_text") || undefined;
    const p_status_ids = searchParams.get("p_status_ids") || undefined;

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("search_devnet_reviews", {
      p_active_only,
      p_assigned_to_id,
      p_completed_only,
      p_created_after,
      p_created_before,
      p_data_status,
      p_due_after,
      p_due_before,
      p_entity_type,
      p_kind,
      p_overdue_only,
      p_priority,
      p_requires_field_review,
      p_search_text,
      p_status_ids
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
