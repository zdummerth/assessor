"use client";

import type { DeedAbstract } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeedAbstractDialog } from "./deed-abstract-dialog";
import { DeleteDeedAbstractButton } from "./delete-deed-abstract-button";
import { PublishToggleButton } from "./publish-toggle-button";
import { Badge } from "@/components/ui/badge";

type DeedAbstractsTableProps = {
  deedAbstracts: DeedAbstract[];
};

export function DeedAbstractsTable({ deedAbstracts }: DeedAbstractsTableProps) {
  const formatCurrency = (cents: number | null) => {
    if (cents === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Filed</TableHead>
            <TableHead>Daily #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Grantor</TableHead>
            <TableHead>Grantee</TableHead>
            <TableHead>Consideration</TableHead>
            <TableHead>City Block</TableHead>
            <TableHead>Transfer</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deedAbstracts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={11}
                className="text-center text-muted-foreground"
              >
                No deed abstracts found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            deedAbstracts.map((deedAbstract) => (
              <TableRow key={deedAbstract.id}>
                <TableCell>{formatDate(deedAbstract.date_filed)}</TableCell>
                <TableCell>{deedAbstract.daily_number || "—"}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {deedAbstract.type_of_conveyance || "—"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {deedAbstract.grantor_name || "—"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {deedAbstract.grantee_name || "—"}
                </TableCell>
                <TableCell>
                  {formatCurrency(deedAbstract.consideration_amount)}
                </TableCell>
                <TableCell>{deedAbstract.city_block || "—"}</TableCell>
                <TableCell>
                  {deedAbstract.is_transfer ? (
                    <Badge variant="default">Transfer</Badge>
                  ) : (
                    <Badge variant="outline">Non-Transfer</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {deedAbstract.book_id ? (
                    <Badge variant="secondary">
                      Book {deedAbstract.book_id}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {deedAbstract.published_at ? (
                    <Badge variant="default">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <PublishToggleButton deedAbstract={deedAbstract} />
                    <DeedAbstractDialog deedAbstract={deedAbstract} />
                    <DeleteDeedAbstractButton deedAbstract={deedAbstract} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
