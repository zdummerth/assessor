"use client";

import useSWR from "swr";
import type { Json } from "@/database-types";
import { SearchDevnetReviewsPresentation } from "../search-devnet-reviews-presentation";

interface SearchDevnetReviewsClientProps {
  params?: {
  p_filters?: Json;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchDevnetReviewsClient({
  params,
}: SearchDevnetReviewsClientProps) {
  const urlParams = new URLSearchParams();

  if (params?.p_filters) urlParams.append("p_filters", String(params.p_filters));

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
