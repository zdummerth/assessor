// Generated types for search_devnet_reviews function
import type { Database } from "@/database-types";
import type { Json } from "@/database-types";

export interface SearchDevnetReviewsParams {
  p_filters?: Json;
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