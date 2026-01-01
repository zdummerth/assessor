// app/test/parcel-rollup/rollup-table.tsx
"use client";

import * as React from "react";
import type {
  ParcelRollupApiResponse,
  ParcelRollupSearchParams,
} from "./types";

import { DataTable } from "./data-table";
import { parcelRollupColumns } from "./columns";
import { useParcelRollupSearch } from "@/app/hooks/useParcelRollupSearch"; // adjust path if needed

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Accept URL-derived params (already parsed on the server page),
 * call the SWR data hook, and render the DataTable.
 */
export function ParcelRollupDataTable(props: ParcelRollupSearchParams) {
  // If you want "don't fetch until user provides something", you can add logic here.
  // For now: fetch whenever this component mounts (as-of date can be empty and function defaults).
  // @ts-expect-error need to generate types properly
  const { data, isLoading, error } = useParcelRollupSearch(props);

  const resp = data as ParcelRollupApiResponse | undefined;
  const rows = resp?.data ?? [];

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Results</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Total</span>
            <Badge variant="secondary">{resp?.count ?? 0}</Badge>
            {isLoading && <span>Loading…</span>}
            {error && (
              <span className="text-destructive">
                {(error as Error)?.message ?? "Error"}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <DataTable columns={parcelRollupColumns} data={rows} pageSize={25} />
        </CardContent>
      </Card>
    </div>
  );
}
