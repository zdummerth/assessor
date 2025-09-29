// components/abatements/ParcelsTable.tsx
"use client";

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

function currency(n: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return String(n);
  }
}

import { Tables } from "@/database-types";
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;
export default function ParcelsTable({
  parcels,
  compact = false,
}: {
  parcels: (ParcelRow & { test_parcels?: ParcelLite | null })[];
  compact?: boolean;
}) {
  const rows = [...(parcels ?? [])].sort(
    (a, b) => (a.parcel_id ?? 0) - (b.parcel_id ?? 0)
  );
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
          <Table className={compact ? "text-sm" : ""}>
            <TableHeader>
              <TableRow>
                <TableHead>Parcel</TableHead>
                <TableHead className="text-right">AGR Base</TableHead>
                <TableHead className="text-right">COM Base</TableHead>
                <TableHead className="text-right">RES Base</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    No parcels
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => {
                  const pn = r.test_parcels?.id ?? r.parcel_id;
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Link
                          href={`/test/parcels/${pn}`}
                          className="underline"
                        >
                          {pn}
                        </Link>
                      </TableCell>

                      <TableCell className="text-right">
                        {currency(r.agr_base_assessed)}
                      </TableCell>
                      <TableCell className="text-right">
                        {currency(r.com_base_assessed)}
                      </TableCell>
                      <TableCell className="text-right">
                        {currency(r.res_base_assessed)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          timeZone: "America/Chicago",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
