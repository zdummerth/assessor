"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useParcelValueFeatures } from "@/lib/client-queries";
import { DataTable } from "./features/data-table";
import { makeColumns } from "./features/columns";
import { ServerPagination } from "./features/server-pagination";
import FiltersDialog from "./filters";

type HookOpts = {
  as_of_date?: string;
  land_uses?: string[];
  neighborhoods?: string[];
  is_abated?: boolean;
  page: number;
  page_size: number;
  sort?: string;
  filters?: any;
};

type Props = {
  hookOpts: HookOpts;
};

export default function ParcelFeaturesBrowserClient({ hookOpts }: Props) {
  const {
    data = [],
    meta,
    isLoading,
    error,
  } = useParcelValueFeatures(hookOpts);

  const { columns, sortKeyFor } = makeColumns();

  const router = useRouter();
  const updateParams = React.useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      // Build from current URL (client-side) and only change what we need
      const sp = new URLSearchParams(window.location.search);
      let changed = false;
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === undefined || v === "") {
          if (sp.has(k)) {
            sp.delete(k);
            changed = true;
          }
        } else {
          const next = String(v);
          if (sp.get(k) !== next) {
            sp.set(k, next);
            changed = true;
          }
        }
      }
      if (changed) {
        router.replace(`?${sp.toString()}`, { scroll: false });
      }
    },
    [router]
  );

  const setPageURL = (n: number) => updateParams({ page: n });
  const setPageSizeURL = (n: number) => updateParams({ page_size: n, page: 1 });
  const setSortURL = (v: string) => updateParams({ sort: v, page: 1 });

  const total = meta?.total ?? 0;

  return (
    <div className="w-[95vw] mx-auto space-y-3">
      {/* Top bar: just the Filters control and meta (chips are inside FiltersDialog) */}
      <div className="rounded border p-3">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <FiltersDialog />
          <ServerPagination
            page={hookOpts.page}
            setPage={setPageURL}
            pageSize={hookOpts.page_size}
            setPageSize={setPageSizeURL}
            hasMore={meta?.has_more}
            isLoading={isLoading}
          />

          <div className="text-sm text-muted-foreground">
            Total parcels: {total}
          </div>
        </div>
      </div>

      <div className="h-[80vh] w-[100%] overflow-auto rounded border">
        <DataTable
          columns={columns}
          data={data}
          sortKeyFor={sortKeyFor}
          sort={hookOpts.sort ?? ""}
          setSort={setSortURL}
          setPage={setPageURL}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div className="rounded border px-3 py-2 text-sm text-red-600">
          Error loading data. Check console.
        </div>
      )}
    </div>
  );
}
