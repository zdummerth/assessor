"use client";

import useSWR from "swr";
import { NeighborhoodsPresentation } from "../neighborhoods-presentation";
import type { Database } from "@/database-types";

interface NeighborhoodsClientProps {
  filters?: {
  name?: string;
  };
  limit?: number;
  offset?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NeighborhoodsClient({
  filters,
  limit = 25,
  offset = 0,
}: NeighborhoodsClientProps) {
  const params = new URLSearchParams();

  // Apply filters
  if (filters?.name) params.append("name", filters.name);

  // Apply pagination
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const { data, error, isLoading } = useSWR(
    `/api/neighborhoods?${params.toString()}`,
    fetcher
  );

  return (
    <NeighborhoodsPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
