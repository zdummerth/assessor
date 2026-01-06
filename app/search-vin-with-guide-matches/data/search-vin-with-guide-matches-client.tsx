"use client";

import useSWR from "swr";
import { SearchVinWithGuideMatchesPresentation } from "../search-vin-with-guide-matches-presentation";

interface SearchVinWithGuideMatchesClientProps {
  params?: {
  p_max_guide_results?: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchVinWithGuideMatchesClient({
  params,
}: SearchVinWithGuideMatchesClientProps) {
  const urlParams = new URLSearchParams();

  if (params?.p_max_guide_results) urlParams.append("p_max_guide_results", String(params.p_max_guide_results));

  const { data, error, isLoading } = useSWR(
    `/search-vin-with-guide-matches/api?${urlParams.toString()}`,
    fetcher
  );

  return (
    <SearchVinWithGuideMatchesPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
