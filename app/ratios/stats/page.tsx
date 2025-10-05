// app/sales/stats/page.tsx
"use server";

import * as React from "react";
import { Suspense } from "react";

import FiltersDialog from "@/app/ratios/stats/filters";
import { createClient } from "@/utils/supabase/server";
import RatioStatsClient from "./ratio-stats-client";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/* -----------------------------------------
   Utilities shared with server/client
------------------------------------------*/
function csvToArray(v: string | null | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Types from your ratios RPC (subset used for stats)
export type RatioRow = {
  sale_id: number;
  ratio: number | null;
  sale_date: string | null;
  sale_price: number | null;
  land_use_sale: string | null;
  neighborhoods_at_sale: any;
  // ... other fields exist; not needed for stats
};

/* -----------------------------------------
   Skeleton (Suspense fallback)
------------------------------------------*/
function StatsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Controls card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Overall status badges */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-28 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>

      {/* Group cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {[...Array(3)].map((_, idx) => (
          <Card key={idx}>
            <CardHeader className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[260px] w-full rounded-md" />
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {[...Array(8)].map((__, j) => (
                  <div key={j} className="rounded-lg border p-3">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------------------
   Streaming server component (data fetch)
------------------------------------------*/
async function StatsServer(props: {
  searchParams?: Promise<{
    as_of_date?: string;
    start_date?: string;
    end_date?: string;
    lus?: string;
    ndbhds?: string; // kept for parity if you add later
  }>;
}) {
  const searchParams = (await props.searchParams) || {};

  // Same filters as your ratios page (no sorting, no pagination)
  const asOfDate = searchParams.as_of_date || "";
  const startDate = searchParams.start_date || "";
  const endDate = searchParams.end_date || "";
  const selectedLandUses = csvToArray(searchParams.lus);

  const supabase = await createClient();

  // @ts-expect-error need to generate types
  const { data, error } = await supabase.rpc<RatioRow>("get_ratios", {
    p_as_of_date: asOfDate || undefined,
    p_start_date: startDate || undefined,
    p_end_date: endDate || undefined,
    p_land_uses: selectedLandUses.length > 0 ? selectedLandUses : undefined,
    p_valid_only: true,
  });

  if (error) {
    return (
      <div className="rounded-lg border p-4">
        <div className="font-medium">Error loading data</div>
        <div className="text-sm text-muted-foreground mt-1">
          {error.message}
        </div>
      </div>
    );
  }

  const rows = (data ?? []) as RatioRow[];

  return <RatioStatsClient rows={rows} />;
}

/* -----------------------------------------
   Page: wraps server fetch with Suspense
------------------------------------------*/
export default async function Page(props: {
  searchParams?: Promise<{
    as_of_date?: string;
    start_date?: string;
    end_date?: string;
    lus?: string;
    ndbhds?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const suspenseKey = JSON.stringify(searchParams); // to reset on param change
  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Ratio Statistics</h1>
        <FiltersDialog />
      </div>

      <Suspense key={suspenseKey} fallback={<StatsSkeleton />}>
        <StatsServer searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
