"use client";

import useSWR from "swr";
import { SearchDevnetReviewsPresentation } from "../search-devnet-reviews-presentation";

interface SearchDevnetReviewsClientProps {
  params?: {
  p_active_only?: boolean;\n  p_assigned_to_id?: number;\n  p_completed_only?: boolean;\n  p_created_after?: string;\n  p_created_before?: string;\n  p_data_status?: string;\n  p_due_after?: string;\n  p_due_before?: string;\n  p_entity_type?: string;\n  p_kind?: string;\n  p_overdue_only?: boolean;\n  p_priority?: string;\n  p_requires_field_review?: boolean;\n  p_search_text?: string;\n  p_status_ids?: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchDevnetReviewsClient({
  params,
}: SearchDevnetReviewsClientProps) {
  const urlParams = new URLSearchParams();

  if (params?.p_active_only) urlParams.append("p_active_only", String(params.p_active_only));\n  if (params?.p_assigned_to_id) urlParams.append("p_assigned_to_id", String(params.p_assigned_to_id));\n  if (params?.p_completed_only) urlParams.append("p_completed_only", String(params.p_completed_only));\n  if (params?.p_created_after) urlParams.append("p_created_after", String(params.p_created_after));\n  if (params?.p_created_before) urlParams.append("p_created_before", String(params.p_created_before));\n  if (params?.p_data_status) urlParams.append("p_data_status", String(params.p_data_status));\n  if (params?.p_due_after) urlParams.append("p_due_after", String(params.p_due_after));\n  if (params?.p_due_before) urlParams.append("p_due_before", String(params.p_due_before));\n  if (params?.p_entity_type) urlParams.append("p_entity_type", String(params.p_entity_type));\n  if (params?.p_kind) urlParams.append("p_kind", String(params.p_kind));\n  if (params?.p_overdue_only) urlParams.append("p_overdue_only", String(params.p_overdue_only));\n  if (params?.p_priority) urlParams.append("p_priority", String(params.p_priority));\n  if (params?.p_requires_field_review) urlParams.append("p_requires_field_review", String(params.p_requires_field_review));\n  if (params?.p_search_text) urlParams.append("p_search_text", String(params.p_search_text));\n  if (params?.p_status_ids) urlParams.append("p_status_ids", String(params.p_status_ids));

  const { data, error, isLoading } = useSWR(
    `/search-devnet-reviews/api?${urlParams.toString()}`,
    fetcher
  );

  return (
    <SearchDevnetReviewsPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
