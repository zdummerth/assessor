"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import ParcelNumber, {
  formatParcelNumber,
} from "@/components/ui/parcel-number-updated";

import { Tables } from "@/database-types";
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

function currency(n: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return String(n ?? 0);
  }
}

type Row = ParcelRow & { test_parcels?: ParcelLite | null };

function DataTable({
  columns,
  data,
  compact,
  showPagination = false,
}: {
  columns: ColumnDef<Row, any>[];
  data: Row[];
  compact?: boolean;
  showPagination?: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "parcel", desc: false },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ search: false });
  const [search, setSearch] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Drive the hidden "search" column's filter with the text input
  React.useEffect(() => {
    table.getColumn("search")?.setFilterValue(search);
    table.setPageIndex(0);
  }, [search, table]);

  const total = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = total ? pageIndex * pageSize + 1 : 0;
  const end = Math.min(total, (pageIndex + 1) * pageSize);

  const Pagination = showPagination ? (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-2">
      <div className="flex flex-1 items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="mx-2 px-2 h-8 max-w-xs"
        />
        <span className="text-sm text-muted-foreground">
          {`Showing ${start}-${end} of ${total}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">Rows</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="h-8 w-[88px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm tabular-nums">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Top toolbar: search + page size + counts + pager */}
      {Pagination}

      <Table className={compact ? "text-sm" : ""}>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="whitespace-nowrap text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id.endsWith("_base")
                        ? "tabular-nums text-left"
                        : "text-left"
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground text-left"
              >
                No parcels
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default function ParcelsTable({
  parcels,
  compact = false,
  showProgramId = false,
  showPagination = false,
}: {
  parcels: Row[];
  compact?: boolean;
  showProgramId?: boolean;
  showPagination?: boolean;
}) {
  const data = React.useMemo<Row[]>(
    () =>
      [...(parcels ?? [])].sort(
        (a, b) => (a.parcel_id ?? 0) - (b.parcel_id ?? 0)
      ),
    [parcels]
  );

  const columns = React.useMemo<ColumnDef<Row, any>[]>(() => {
    // Hidden "search" column to power global text search
    const searchCol: ColumnDef<Row, any> = {
      id: "search",
      accessorFn: (r) => {
        const pn = formatParcelNumber(
          r.test_parcels?.block ?? 0,
          r.test_parcels?.lot ?? 0,
          r.test_parcels?.ext ?? 0
        );
        const pnid = r.test_parcels?.id ?? r.parcel_id ?? "";
        const pid = r.abatement_program_id ?? "";
        const block = r.test_parcels?.block ?? "";
        const lot = r.test_parcels?.lot ?? "";
        const ext = r.test_parcels?.ext ?? "";
        const agr = r.agr_base_assessed ?? "";
        const com = r.com_base_assessed ?? "";
        const res = r.res_base_assessed ?? "";
        return `${pn} ${pnid} ${pid} ${block}-${lot}-${ext} ${agr} ${com} ${res}`;
      },
      filterFn: "includesString",
      enableHiding: true,
      enableSorting: false,
      header: () => null,
      cell: () => null,
    };

    const parcelCol: ColumnDef<Row, any> = {
      id: "parcel",
      accessorFn: (r) => r.test_parcels?.id ?? r.parcel_id ?? 0,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parcel
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const pn = row.original.test_parcels?.id ?? row.original.parcel_id;
        const block = row.original.test_parcels?.block || 0;
        const lot = row.original.test_parcels?.lot || 0;
        const ext = row.original.test_parcels?.ext || 0;
        return pn ? (
          <ParcelNumber id={pn} block={block} lot={lot} ext={ext} />
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      sortingFn: "alphanumeric",
    };

    const programCol: ColumnDef<Row, any> = {
      id: "program",
      accessorKey: "abatement_program_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const pid = Number(getValue() ?? 0);
        return pid ? (
          <Link href={`/abatements/${pid}`} className="underline">
            {pid}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      sortingFn: "alphanumeric",
    };

    const agrCol: ColumnDef<Row, any> = {
      id: "agr_base",
      accessorKey: "agr_base_assessed",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          AGR Base
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
      sortingFn: "basic",
    };

    const comCol: ColumnDef<Row, any> = {
      id: "com_base",
      accessorKey: "com_base_assessed",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          COM Base
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
      sortingFn: "basic",
    };

    const resCol: ColumnDef<Row, any> = {
      id: "res_base",
      accessorKey: "res_base_assessed",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 h-auto font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RES Base
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
      sortingFn: "basic",
    };

    const cols: ColumnDef<Row, any>[] = [searchCol, parcelCol];
    if (showProgramId) cols.push(programCol);
    cols.push(agrCol, comCol, resCol);
    return cols;
  }, [showProgramId]);

  return (
    <Card className="border rounded">
      <CardHeader>
        <CardTitle className="text-base">Program Parcels</CardTitle>
        <CardDescription>
          Base assessed values associated with this program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <DataTable
            columns={columns}
            data={data}
            compact={compact}
            showPagination={showPagination}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
