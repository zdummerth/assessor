// Generated types for search_devnet_reviews function
import type { Database } from "@/database-types";
import type { Json } from "@/database-types";

export interface SearchDevnetReviewsParams {
  p_active_only?: boolean;
  p_assigned_to_id?: number;
  p_completed_only?: boolean;
  p_created_after?: string;
  p_created_before?: string;
  p_data_status?: string;
  p_due_after?: string;
  p_due_before?: string;
  p_entity_type?: string;
  p_kind?: string;
  p_overdue_only?: boolean;
  p_priority?: string;
  p_requires_field_review?: boolean;
  p_search_text?: string;
  p_status_ids?: string;
}

export interface SearchDevnetReviewsResult {
  assigned_to_email: string;
  assigned_to_name: string;
  assigned_to_role: string;
  completed_at: string;
  created_at: string;
  data_status: string;
  days_until_due: number;
  description: string;
  due_date: string;
  entity_id: number;
  entity_type: string;
  id: number;
  kind: string;
  neighborhood_name: string;
  parcel_address: string;
  parcel_data: Json;
  parcel_number: string;
  priority: string;
  requires_field_review: boolean;
  sale_date: string;
  sale_parcels_data: Json;
  sale_price: number;
  sales_data: Json;
  status_name: string;
  status_slug: string;
  title: string;
  updated_at: string;
}