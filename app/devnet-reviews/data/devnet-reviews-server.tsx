import { createClient } from "@/lib/supabase/server";
import { DevnetReviewsPresentation } from "../devnet-reviews-presentation";
import { DevnetReviewsPagination } from "../devnet-reviews-pagination";
import type { Database } from "@/database-types";

type DevnetDataStatus = Database["public"]["Enums"]["devnet_data_status"];
type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];

interface DevnetReviewsServerProps {
  filters?: {
  completed_at?: string;
  copied_to_devnet_at?: string;
  data_collected_at?: string;
  data_status?: DevnetDataStatus;
  description?: string;
  due_date?: string;
  entity_type?: string;
  field_notes?: string;
  kind?: DevnetReviewKind;
  priority?: string;
  title?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function DevnetReviewsServer({
  filters,
  currentPage = 1,
  pageSize = 25,
}: DevnetReviewsServerProps) {
  const supabase = await createClient();

  // Build query for data
  let dataQuery = supabase.from("devnet_reviews").select("*");
  
  // Build query for count
  let countQuery = supabase.from("devnet_reviews").select("*", { count: "exact", head: true });

  // Apply filters to data query
  if (filters?.completed_at) {
    dataQuery = dataQuery.eq("completed_at", filters.completed_at);
  }

  if (filters?.copied_to_devnet_at) {
    dataQuery = dataQuery.eq("copied_to_devnet_at", filters.copied_to_devnet_at);
  }

  if (filters?.data_collected_at) {
    dataQuery = dataQuery.eq("data_collected_at", filters.data_collected_at);
  }

  if (filters?.data_status) {
    dataQuery = dataQuery.eq("data_status", filters.data_status);
  }

  if (filters?.description) {
    dataQuery = dataQuery.eq("description", filters.description);
  }

  if (filters?.due_date) {
    dataQuery = dataQuery.eq("due_date", filters.due_date);
  }

  if (filters?.entity_type) {
    dataQuery = dataQuery.eq("entity_type", filters.entity_type);
  }

  if (filters?.field_notes) {
    dataQuery = dataQuery.eq("field_notes", filters.field_notes);
  }

  if (filters?.kind) {
    dataQuery = dataQuery.eq("kind", filters.kind);
  }

  if (filters?.priority) {
    dataQuery = dataQuery.eq("priority", filters.priority);
  }

  if (filters?.title) {
    dataQuery = dataQuery.eq("title", filters.title);
  }

  // Apply filters to count query
  if (filters?.completed_at) {
    countQuery = countQuery.eq("completed_at", filters.completed_at);
  }

  if (filters?.copied_to_devnet_at) {
    countQuery = countQuery.eq("copied_to_devnet_at", filters.copied_to_devnet_at);
  }

  if (filters?.data_collected_at) {
    countQuery = countQuery.eq("data_collected_at", filters.data_collected_at);
  }

  if (filters?.data_status) {
    countQuery = countQuery.eq("data_status", filters.data_status);
  }

  if (filters?.description) {
    countQuery = countQuery.eq("description", filters.description);
  }

  if (filters?.due_date) {
    countQuery = countQuery.eq("due_date", filters.due_date);
  }

  if (filters?.entity_type) {
    countQuery = countQuery.eq("entity_type", filters.entity_type);
  }

  if (filters?.field_notes) {
    countQuery = countQuery.eq("field_notes", filters.field_notes);
  }

  if (filters?.kind) {
    countQuery = countQuery.eq("kind", filters.kind);
  }

  if (filters?.priority) {
    countQuery = countQuery.eq("priority", filters.priority);
  }

  if (filters?.title) {
    countQuery = countQuery.eq("title", filters.title);
  }

  // Apply pagination to data query
  const offset = (currentPage - 1) * pageSize;
  dataQuery = dataQuery.range(offset, offset + pageSize - 1);

  const [{ data, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <>
      <DevnetReviewsPresentation
        data={data || []}
        error={error?.message}
      />
      <DevnetReviewsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
