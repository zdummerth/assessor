// components/features/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ParcelValueFeatureRow } from "@/lib/client-queries";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import Link from "next/link";
const money = (n: number, maxFrac = 0) =>
  Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFrac,
  }).format(n);

export function makeColumns() {
  const sortKeyFor: Record<string, string> = {
    parcel_id: "parcel_id",
    address: "street",
    land_use: "land_use",
    structure_count: "structure_count",
    total_finished_area: "total_finished_area",
    land_area: "land_area",
    current_value: "current_value",
    values_per_sqft_finished: "values_per_sqft_finished",
    values_per_sqft_building_total: "values_per_sqft_building_total",
    values_per_sqft_land: "values_per_sqft_land",
    avg_year_built: "avg_year_built",
    avg_condition: "avg_condition",
  };

  const columns: ColumnDef<ParcelValueFeatureRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 36,
    },
    {
      accessorKey: "parcel_id",
      header: "Parcel",
      cell: ({ row }) => (
        <div className="min-w-[150px] font-mono text-sm">
          <ParcelNumber
            id={row.original.parcel_id}
            ext={row.original.ext}
            lot={parseInt(row.original.lot)}
            block={row.original.block}
          />
        </div>
      ),
    },
    {
      id: "address",
      header: "Address",
      cell: ({ row }) => {
        const house = row.original.house_number ?? "";
        const street = row.original.street ?? "";
        const postcode = row.original.postcode ?? "";
        return (
          <div className="min-w-[200px]">
            <div className="font-medium">
              <Address address={`${house} ${street}`} />
            </div>
            <div className="text-xs text-muted-foreground">
              <Address
                address={`${postcode}`}
                fullAddress={`${house} ${street}, ${postcode}`}
                showButtons
              />
            </div>
          </div>
        );
      },
      sortingFn: "text",
    },
    {
      accessorKey: "land_use",
      header: "Land Use",
      cell: ({ getValue }) => (
        <div className="min-w-[100px]">{String(getValue() ?? "")}</div>
      ),
    },
    {
      accessorKey: "structure_count",
      header: "Structs",
      cell: ({ getValue }) => (
        <span className="tabular-nums min-w-[100px]">
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: "total_finished_area",
      header: "Finished (sf)",
      cell: ({ getValue }) => (
        <span className="tabular-nums min-w-[140px]">
          {Number(getValue() ?? 0).toLocaleString()}
        </span>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "current_value",
      header: "Current Value",
      cell: ({ getValue }) => {
        const n = Number(getValue() ?? 0);
        return (
          <span className="tabular-nums min-w-[140px]">{money(n, 0)}</span>
        );
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "values_per_sqft_finished",
      header: "Value/sf (fin)",
      cell: ({ getValue }) => {
        const n = Number(getValue() ?? 0);
        return (
          <span className="tabular-nums min-w-[140px]">{money(n, 2)}</span>
        );
      },
    },
    {
      accessorKey: "values_per_sqft_building_total",
      header: "Value/sf (bldg)",
      cell: ({ getValue }) => {
        const n = Number(getValue() ?? 0);
        return (
          <span className="tabular-nums min-w-[140px]">{money(n, 2)}</span>
        );
      },
    },
    {
      accessorKey: "land_area",
      header: "Land (sf)",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {Number(getValue() ?? 0).toLocaleString()}
        </span>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "values_per_sqft_land",
      header: "Value/sf (land)",
      cell: ({ getValue }) => {
        const n = Number(getValue() ?? 0);
        return (
          <span className="tabular-nums min-w-[140px]">{money(n, 2)}</span>
        );
      },
    },
    {
      accessorKey: "avg_year_built",
      header: "Avg YB",
      cell: ({ getValue }) => (
        <span className="tabular-nums min-w-[100px]">
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: "avg_condition",
      header: "Avg Cond",
      cell: ({ getValue }) => (
        <span className="tabular-nums min-w-[100px]">
          {Number(getValue() ?? 0).toFixed(1)}
        </span>
      ),
    },

    // --- NEW: Abatements dialog column ---
    {
      id: "abatements",
      header: "Abatements",
      enableSorting: false,
      cell: ({ row }) => {
        const programs = Array.isArray((row.original as any).abatement)
          ? ((row.original as any).abatement as any[])
          : [];
        if (!programs.length) {
          return <span className="text-muted-foreground min-w-[80px]">—</span>;
        }

        console.log("programs", programs);
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 min-w-[80px]"
              >
                {programs.map((p: any) => (
                  <div
                    key={`${p.abatement_program_id}-${p.first_year}-${p.last_year}`}
                    className="flex gap-2"
                  >
                    {p.type && <Badge variant="secondary">{p.type}</Badge>}

                    {(p.first_year || p.last_year) && (
                      <Badge variant="secondary">
                        {p.first_year ?? "—"}–{p.last_year ?? "—"}
                      </Badge>
                    )}
                  </div>
                ))}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Abatements for parcel {row.original.parcel_id}
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-2">
                <div className="space-y-3">
                  {programs.map((p: any) => (
                    <div
                      key={`${p.program_id}-${p.first_year}-${p.last_year}`}
                      className="rounded border p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          className="font-medium"
                          href={`/abatements/${p.abatement_program_id}`}
                        >
                          Program #{p.abatement_program_id}
                        </Link>
                        {p.type && <Badge variant="secondary">{p.type}</Badge>}
                        {p.scale_type && (
                          <Badge variant="secondary">{p.scale_type}</Badge>
                        )}
                        {(p.first_year || p.last_year) && (
                          <Badge variant="secondary">
                            {p.first_year ?? "—"}–{p.last_year ?? "—"}
                          </Badge>
                        )}
                      </div>

                      {/* Bases */}
                      <div className="mt-2 text-sm text-muted-foreground">
                        Bases: AGR {p.parcel_bases.agr}, COM{" "}
                        {p.parcel_bases.com}, RES {p.parcel_bases.res}
                      </div>

                      {/* Current phase */}
                      {p.current_phase ? (
                        <div className="mt-3">
                          <div className="text-sm font-medium">
                            Current Phase
                          </div>
                          <div className="text-sm text-muted-foreground">
                            φ{p.current_phase.phase} ·{" "}
                            {p.current_phase.first_year}–
                            {p.current_phase.last_year} · AGR{" "}
                            {p.current_phase.agr_abated ?? "—"} · COM{" "}
                            {p.current_phase.com_abated ?? "—"} · RES{" "}
                            {p.current_phase.res_abated ?? "—"}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-muted-foreground">
                          No current phase.
                        </div>
                      )}

                      {/* All phases */}
                      {Array.isArray(p.phases) && p.phases.length > 0 && (
                        <>
                          <Separator className="my-3" />
                          <div className="text-sm font-medium">All Phases</div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {p.phases.map((ph: any, idx: number) => (
                              <div
                                key={ph.phase_id ?? idx}
                                className="rounded-md border p-2"
                              >
                                <div className="font-medium">φ{ph.phase}</div>
                                <div className="text-xs text-muted-foreground">
                                  {ph.first_year}–{ph.last_year}
                                </div>
                                <div className="text-xs">
                                  AGR {ph.agr_abated ?? "—"} · COM{" "}
                                  {ph.com_abated ?? "—"} · RES{" "}
                                  {ph.res_abated ?? "—"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  return { columns, sortKeyFor };
}
