"use client";

import useSWR from "swr";
import { DevnetReviewsPresentation } from "../devnet-reviews-presentation";
import type { Database } from "@/database-types";

type DevnetDataStatus = Database["public"]["Enums"]["devnet_data_status"];
type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];

interface DevnetReviewsClientProps {
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
  limit?: number;
  offset?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DevnetReviewsClient({
  filters,
  limit = 25,
  offset = 0,
}: DevnetReviewsClientProps) {
  const params = new URLSearchParams();

  // Apply filters
  if (filters?.completed_at) params.append("completed_at", filters.completed_at);
  if (filters?.copied_to_devnet_at) params.append("copied_to_devnet_at", filters.copied_to_devnet_at);
  if (filters?.data_collected_at) params.append("data_collected_at", filters.data_collected_at);
  if (filters?.data_status) params.append("data_status", filters.data_status);
  if (filters?.description) params.append("description", filters.description);
  if (filters?.due_date) params.append("due_date", filters.due_date);
  if (filters?.entity_type) params.append("entity_type", filters.entity_type);
  if (filters?.field_notes) params.append("field_notes", filters.field_notes);
  if (filters?.kind) params.append("kind", filters.kind);
  if (filters?.priority) params.append("priority", filters.priority);
  if (filters?.title) params.append("title", filters.title);

  // Apply pagination
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const { data, error, isLoading } = useSWR(
    `/api/devnet-reviews?${params.toString()}`,
    fetcher
  );

  return (
    <DevnetReviewsPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
