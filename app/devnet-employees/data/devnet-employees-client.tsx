"use client";

import useSWR from "swr";
import { DevnetEmployeesPresentation } from "../devnet-employees-presentation";
import type { Database } from "@/database-types";

interface DevnetEmployeesClientProps {
  filters?: {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  user_id?: string;
  };
  limit?: number;
  offset?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DevnetEmployeesClient({
  filters,
  limit = 25,
  offset = 0,
}: DevnetEmployeesClientProps) {
  const params = new URLSearchParams();

  // Apply filters
  if (filters?.email) params.append("email", filters.email);
  if (filters?.first_name) params.append("first_name", filters.first_name);
  if (filters?.last_name) params.append("last_name", filters.last_name);
  if (filters?.role) params.append("role", filters.role);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.user_id) params.append("user_id", filters.user_id);

  // Apply pagination
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const { data, error, isLoading } = useSWR(
    `/api/devnet-employees?${params.toString()}`,
    fetcher
  );

  return (
    <DevnetEmployeesPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
