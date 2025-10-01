"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ServerPagination(props: {
  page: number;
  setPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  hasMore?: boolean;
  pageCount?: number;
  isLoading?: boolean;
}) {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    hasMore,
    pageCount,
    isLoading,
  } = props;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1 || !!isLoading}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="text-sm">
          Page {page} {pageCount ? `of ${pageCount}` : ""}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={hasMore === false || !!isLoading}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <select
          className="h-8 rounded-md border bg-background px-2 text-sm"
          defaultValue={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
