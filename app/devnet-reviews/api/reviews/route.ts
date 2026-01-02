// app/devnet-reviews/api/reviews/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "25");
    const kind = searchParams.get("kind");
    const statusIds = searchParams
      .get("status_ids")
      ?.split(",")
      .filter(Boolean);
    const assignedToId = searchParams.get("assigned_to_id");
    const dataStatus = searchParams.get("data_status");
    const priority = searchParams.get("priority");
    const entityType = searchParams.get("entity_type");
    const requiresFieldReview = searchParams.get("requires_field_review");
    const searchText = searchParams.get("search_text");
    const overdueOnly = searchParams.get("overdue_only");
    const createdAfter = searchParams.get("created_after");
    const createdBefore = searchParams.get("created_before");
    const dueAfter = searchParams.get("due_after");
    const dueBefore = searchParams.get("due_before");
    const completedOnly = searchParams.get("completed_only");
    const activeOnly = searchParams.get("active_only");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Build filters object for the database function
    const filters: Record<string, any> = {};

    if (kind) filters.kind = kind;
    if (statusIds && statusIds.length > 0) {
      filters.status_ids = statusIds.join(",");
    }
    if (assignedToId) filters.assigned_to_id = assignedToId;
    if (dataStatus) filters.data_status = dataStatus;
    if (priority) filters.priority = priority;
    if (entityType) filters.entity_type = entityType;
    if (requiresFieldReview !== null && requiresFieldReview !== undefined) {
      filters.requires_field_review = requiresFieldReview === "true";
    }
    if (searchText) filters.search_text = searchText;
    if (overdueOnly !== null && overdueOnly !== undefined) {
      filters.overdue_only = overdueOnly === "true";
    }
    if (createdAfter) filters.created_after = createdAfter;
    if (createdBefore) filters.created_before = createdBefore;
    if (dueAfter) filters.due_after = dueAfter;
    if (dueBefore) filters.due_before = dueBefore;
    if (completedOnly !== null && completedOnly !== undefined) {
      filters.completed_only = completedOnly === "true";
    }
    if (activeOnly !== null && activeOnly !== undefined) {
      filters.active_only = activeOnly === "true";
    }

    // Call the database search function
    const {
      data: searchResults,
      error,
      count,
    } = await supabase.rpc(
      "search_devnet_reviews",
      { p_filters: filters },
      { count: "estimated" }
    );

    if (error) {
      console.error("Supabase RPC error:", error.message);
      return Response.json(
        { error: "Database search failed." },
        { status: 500 }
      );
    }

    // Apply client-side pagination since the function returns all results
    const totalResults = count || 0;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedData = searchResults?.slice(from, to) || [];

    return Response.json({
      data: paginatedData,
      pagination: {
        page,
        page_size: pageSize,
        total: totalResults,
        has_more: to < totalResults,
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
