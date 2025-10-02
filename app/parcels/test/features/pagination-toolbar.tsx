// components/parcel-features/PaginationToolbar.tsx
"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

type Props = {
  page: number;
  setPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  total: number; // required
  hasMore?: boolean; // kept for compatibility (not used)
  isLoading?: boolean;
};

export default function PaginationToolbar(props: Props) {
  const [isPending, startTransition] = React.useTransition();

  // Optimistic shadow state for snappy UI
  const [optimistic, addOptimistic] = React.useOptimistic<
    { page: number; pageSize: number },
    Partial<{ page: number; pageSize: number }>
  >({ page: props.page, pageSize: props.pageSize }, (state, patch) => ({
    ...state,
    ...patch,
  }));

  const totalPages = Math.ceil(props.total / Math.max(1, optimistic.pageSize));

  const clampPage = (n: number) => Math.min(totalPages, Math.max(1, n || 1));

  const isFirstPage = optimistic.page <= 1;
  const isLastPage = optimistic.page >= totalPages;

  const prevDisabled = isFirstPage || props.isLoading || isPending;
  const nextDisabled = isLastPage || props.isLoading || isPending;
  const firstDisabled = prevDisabled;
  const lastDisabled = nextDisabled;

  const applyPage = (n: number) => {
    const safe = clampPage(n);
    startTransition(() => {
      addOptimistic({ page: safe });
      props.setPage(safe);
    });
  };

  const applyPageSize = (n: number) => {
    startTransition(() => {
      addOptimistic({ pageSize: n });
      props.setPageSize(n);
      // Optionally reset to first page when size changes:
      // addOptimistic({ page: 1 });
      // props.setPage(1);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => applyPage(1)}
          disabled={firstDisabled}
          className="px-2 py-1 border rounded disabled:opacity-50"
          aria-label="First page"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First</span>
        </button>

        <button
          onClick={() => applyPage(optimistic.page - 1)}
          disabled={prevDisabled}
          className="px-2 py-1 border rounded disabled:opacity-50"
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </button>

        <span className="text-sm">
          Page {optimistic.page} of {totalPages || "-"}
        </span>

        <button
          onClick={() => applyPage(optimistic.page + 1)}
          disabled={nextDisabled}
          className="px-2 py-1 border rounded disabled:opacity-50"
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </button>

        <button
          onClick={() => applyPage(totalPages)}
          disabled={lastDisabled}
          className="px-2 py-1 border rounded disabled:opacity-50"
          aria-label="Last page"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Rows per page</label>
        <select
          value={optimistic.pageSize}
          onChange={(e) => applyPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
          disabled={props.isLoading || isPending}
        >
          {[10, 25, 50, 100, 250].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <span className="text-sm text-gray-600">
          Total: {props.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
