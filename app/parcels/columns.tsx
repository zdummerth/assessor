// app/test/parcel-rollup/columns.tsx
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { JsonDialogButton } from "./json-dialog-button";
import type { ParcelRollupRow } from "./types";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number-updated";

function fmtNum(n: number | null | undefined) {
  if (!Number.isFinite(n as number)) return "—";
  return new Intl.NumberFormat("en-US").format(n as number);
}

function fmtMoney(n: number | null | undefined) {
  if (!Number.isFinite(n as number)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n as number);
}

function fmtRate(n: number | null | undefined) {
  if (!Number.isFinite(n as number)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n as number);
}

function parcelLabel(r: ParcelRollupRow) {
  if (r.block != null && r.lot != null) {
    return `${r.block}-${r.lot}${r.ext != null ? `-${r.ext}` : ""}`;
  }
  return String(r.parcel_id);
}

function addressLabel(r: ParcelRollupRow) {
  return (
    [r.address_housenumber, r.address_street].filter(Boolean).join(" ") || "—"
  );
}

export const parcelRollupColumns: ColumnDef<ParcelRollupRow>[] = [
  {
    accessorKey: "parcel_id",
    header: "Parcel",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="whitespace-nowrap">
          <ParcelNumber
            id={r.parcel_id}
            block={r.block || 0}
            lot={r.lot || 0}
            ext={r.ext || 0}
          />
        </div>
      );
    },
  },
  {
    id: "address_label",
    header: "Address",
    cell: ({ row }) => (
      //   <div className="whitespace-nowrap">{addressLabel(row.original)}</div>
      <Address address={addressLabel(row.original)} showButtons />
    ),
  },
  {
    accessorKey: "structure_count",
    header: "Structures",
    cell: ({ row }) => (
      <Badge variant="secondary">{fmtNum(row.original.structure_count)}</Badge>
    ),
  },
  {
    accessorKey: "total_structure_sqft",
    header: "Sqft",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {fmtNum(row.original.total_structure_sqft)}
      </div>
    ),
  },
  {
    accessorKey: "total_structure_livable_sqft",
    header: "Livable",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {fmtNum(row.original.total_structure_livable_sqft)}
      </div>
    ),
  },
  {
    accessorKey: "total_value",
    header: "Total Value",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {fmtMoney(row.original.total_value)}
      </div>
    ),
  },
  {
    accessorKey: "value_per_total_sqft",
    header: "$/Total",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {fmtRate(row.original.value_per_total_sqft)}
      </div>
    ),
  },
  {
    accessorKey: "value_per_livable_sqft",
    header: "$/Livable",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {fmtRate(row.original.value_per_livable_sqft)}
      </div>
    ),
  },
  {
    id: "json",
    header: "JSON",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-wrap gap-2 whitespace-nowrap">
          <JsonDialogButton
            label="Address"
            title={`Parcel ${r.parcel_id} — Address`}
            value={r.address}
          />
          <JsonDialogButton
            label="Nbhds"
            title={`Parcel ${r.parcel_id} — Neighborhoods`}
            value={r.neighborhoods_at_as_of}
          />
          <JsonDialogButton
            label="Class"
            title={`Parcel ${r.parcel_id} — Property Class`}
            value={r.property_class}
          />
          <JsonDialogButton
            label="Value"
            title={`Parcel ${r.parcel_id} — Value Snapshot`}
            value={r.value_snapshot}
          />
          <JsonDialogButton
            label="Structures"
            title={`Parcel ${r.parcel_id} — Structures`}
            value={r.structure_snapshot}
          />
        </div>
      );
    },
  },
];
