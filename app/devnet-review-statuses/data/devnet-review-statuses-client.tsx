"use client";

import useSWR from "swr";
import { DevnetReviewStatusesPresentation } from "../devnet-review-statuses-presentation";
import type { Database } from "@/database-types";

type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];

interface DevnetReviewStatusesClientProps {
  filters?: {
  description?: string;
  name?: string;
  preferred_role?: string;
  review_kind?: DevnetReviewKind;
  slug?: string;
  };
  limit?: number;
  offset?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DevnetReviewStatusesClient({
  filters,
  limit = 25,
  offset = 0,
}: DevnetReviewStatusesClientProps) {
  const params = new URLSearchParams();

  // Apply filters
  if (filters?.description) params.append("description", filters.description);
  if (filters?.name) params.append("name", filters.name);
  if (filters?.preferred_role) params.append("preferred_role", filters.preferred_role);
  if (filters?.review_kind) params.append("review_kind", filters.review_kind);
  if (filters?.slug) params.append("slug", filters.slug);

  // Apply pagination
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const { data, error, isLoading } = useSWR(
    `/api/devnet-review-statuses?${params.toString()}`,
    fetcher
  );

  return (
    <DevnetReviewStatusesPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
