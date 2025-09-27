"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import type { ParcelValueFeatureRow } from "@/lib/client-queries";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number-updated";

export function makeColumns(
  onOpenStructures: (row: ParcelValueFeatureRow) => void
) {
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
        <div className="min-w-[80px]">{String(getValue() ?? "")}</div>
      ),
    },
    {
      accessorKey: "structure_count",
      header: "Structs",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "total_finished_area",
      header: "Finished (sf)",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
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
          <span className="tabular-nums">
            {Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(n)}
          </span>
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
          <span className="tabular-nums">
            {Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(n)}
          </span>
        );
      },
    },
    {
      accessorKey: "values_per_sqft_building_total",
      header: "Value/sf (bldg)",
      cell: ({ getValue }) => {
        const n = Number(getValue() ?? 0);
        return (
          <span className="tabular-nums">
            {Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(n)}
          </span>
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
          <span className="tabular-nums">
            {Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(n)}
          </span>
        );
      },
    },
    {
      accessorKey: "avg_year_built",
      header: "Avg YB",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "avg_condition",
      header: "Avg Cond",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {Number(getValue() ?? 0).toFixed(1)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onOpenStructures(row.original)}
        >
          <Eye className="size-4" />
          Structures
        </Button>
      ),
    },
  ];

  return { columns, sortKeyFor };
}
