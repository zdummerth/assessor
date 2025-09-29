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
import { ArrowUpDown } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

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
}: {
  columns: ColumnDef<Row, any>[];
  data: Row[];
  compact?: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "parcel", desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table className={compact ? "text-sm" : ""}>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id} className="whitespace-nowrap">
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
                      ? "text-right tabular-nums"
                      : ""
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
              className="text-muted-foreground"
            >
              No parcels
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function ParcelsTable({
  parcels,
  compact = false,
}: {
  parcels: Row[];
  compact?: boolean;
}) {
  const data = React.useMemo<Row[]>(
    () =>
      [...(parcels ?? [])].sort(
        (a, b) => (a.parcel_id ?? 0) - (b.parcel_id ?? 0)
      ),
    [parcels]
  );

  const columns = React.useMemo<ColumnDef<Row, any>[]>(() => {
    return [
      {
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
          return pn ? (
            <Link href={`/test/parcels/${pn}`} className="underline">
              {pn}
            </Link>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
        sortingFn: "alphanumeric",
      },
      {
        id: "agr_base",
        accessorKey: "agr_base_assessed",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-auto p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            AGR Base
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
        sortingFn: "basic",
        meta: { align: "right" },
      },
      {
        id: "com_base",
        accessorKey: "com_base_assessed",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-auto p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            COM Base
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
        sortingFn: "basic",
        meta: { align: "right" },
      },
      {
        id: "res_base",
        accessorKey: "res_base_assessed",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-auto p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            RES Base
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => currency(Number(getValue() ?? 0)),
        sortingFn: "basic",
        meta: { align: "right" },
      },
    ];
  }, []);

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
          <DataTable columns={columns} data={data} compact={compact} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
