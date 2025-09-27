"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OnChangeFn, Updater } from "@tanstack/react-table";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // server sort plumbing
  sortKeyFor: Record<string, string>;
  sort: string;
  setSort: (v: string) => void;
  setPage: (n: number) => void;
  isLoading?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  sortKeyFor,
  sort,
  setSort,
  setPage,
  isLoading,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Accept Updater<SortingState>, resolve to the next value, then mirror to server
  const handleSortingChange: OnChangeFn<SortingState> = (
    updaterOrValue: Updater<SortingState>
  ) => {
    const next =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (old: SortingState) => SortingState)(sorting)
        : updaterOrValue;

    setSorting(next);

    if (!next?.length) {
      setSort("");
      setPage(1);
      return;
    }

    const { id, desc } = next[0];
    const serverKey = sortKeyFor[id] ?? id;
    setSort(desc ? `-${serverKey}` : serverKey);
    setPage(1);
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // server-driven
  });

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className={
                    h.column.getCanSort() ? "cursor-pointer select-none" : ""
                  }
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === "asc" ? " ↑" : ""}
                  {h.column.getIsSorted() === "desc" ? " ↓" : ""}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllLeafColumns().length}
                className="h-24"
              >
                Loading…
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllLeafColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
