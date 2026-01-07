"use client";

import useSWR from "swr";
import { SearchGuideByDescriptionPresentation } from "../search-guide-by-description-presentation";

interface SearchGuideByDescriptionClientProps {
  params?: {
  p_limit?: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchGuideByDescriptionClient({
  params,
}: SearchGuideByDescriptionClientProps) {
  const urlParams = new URLSearchParams();

  if (params?.p_limit) urlParams.append("p_limit", String(params.p_limit));

  const { data, error, isLoading } = useSWR(
    `/search-guide-by-description/api?${urlParams.toString()}`,
    fetcher
  );

  return (
    <SearchGuideByDescriptionPresentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
