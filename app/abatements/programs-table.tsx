// components/abatements/ProgramListTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import ParcelsTable from "./parcels-table";
import PhasesTable from "./phases-table";
import { Tables } from "@/database-types";

type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

export type ProgramWithRelations = ProgramRow & {
  abatement_phases?: PhaseRow[];
  abatement_parcels?: (ParcelRow & { test_parcels?: ParcelLite | null })[];
};

type Row = ProgramWithRelations;

function YearsCell({ p }: { p: Row }) {
  return (
    <span>
      {p.first_year}–{p.last_year}
    </span>
  );
}

export default function ProgramListTable({
  programs,
}: {
  programs: ProgramWithRelations[];
}) {
  const [openFor, setOpenFor] = React.useState<number | null>(null);

  const data = React.useMemo<Row[]>(() => programs ?? [], [programs]);

  const columns = React.useMemo<ColumnDef<Row, any>[]>(() => {
    return [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const id = row.original.id as number;
          return (
            <Link href={`/abatements/${id}`} className="underline">
              {id}
            </Link>
          );
        },
        sortingFn: "alphanumeric",
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge variant="secondary">{String(getValue())}</Badge>
          ) : (
            "—"
          ),
        sortingFn: "alphanumeric",
      },
      {
        id: "scale_type",
        accessorKey: "scale_type",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Scale
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => String(getValue() ?? "—"),
        sortingFn: "alphanumeric",
      },
      {
        id: "years",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Years
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        accessorFn: (r) =>
          [r.first_year ?? 0, r.last_year ?? 0] as [number, number],
        cell: ({ row }) => <YearsCell p={row.original} />,
        sortingFn: (a, b, _id) => {
          const [af, al] = a.getValue<[number, number]>("years");
          const [bf, bl] = b.getValue<[number, number]>("years");
          if (af !== bf) return af - bf;
          return al - bl;
        },
      },
      {
        id: "phase_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-auto p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            # Phases
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        accessorFn: (r) => r.abatement_phases?.length ?? 0,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{Number(getValue())}</span>
        ),
        sortingFn: "basic",
      },
      {
        id: "parcel_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="ml-auto p-0 h-auto font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            # Parcels
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        accessorFn: (r) => r.abatement_parcels?.length ?? 0,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{Number(getValue())}</span>
        ),
        sortingFn: "basic",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => {
          const p = row.original;
          const pid = p.id as number;
          return (
            <div className="flex justify-end gap-2">
              <Dialog
                open={openFor === pid}
                onOpenChange={(o) => setOpenFor(o ? pid : null)}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Parcels
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Program #{pid} Parcels</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <ParcelsTable parcels={p.abatement_parcels ?? []} compact />
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    View Phases
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Program #{pid} Phases</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <PhasesTable phases={p.abatement_phases ?? []} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ];
  }, [openFor]);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: false },
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Abatement Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.column.id === "phase_count" ||
                      header.column.id === "parcel_count" ||
                      header.column.id === "actions"
                        ? "text-right"
                        : ""
                    }
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
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "phase_count" ||
                        cell.column.id === "parcel_count" ||
                        cell.column.id === "actions"
                          ? "text-right"
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No programs
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
