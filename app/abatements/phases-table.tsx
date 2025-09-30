// components/abatements/PhasesTable.tsx
"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/database-types";

type PhaseRow = Tables<"abatement_phases">;

export default function PhasesTable({
  phases,
  asOfYear,
}: {
  phases: PhaseRow[];
  /** Optional override for testing (defaults to current year) */
  asOfYear?: number;
}) {
  const year = asOfYear ?? new Date().getFullYear();
  const pct = (n: number) => `${(Number(n) * 100).toFixed(0)}%`;

  // Mark current-phase rows, then sort so current is first, otherwise by phase #
  const rows = [...(phases ?? [])]
    .map((p) => ({
      ...p,
      __isCurrent: (p.first_year ?? 0) <= year && year <= (p.last_year ?? 0),
    }))
    .sort(
      (a, b) =>
        Number(b.__isCurrent) - Number(a.__isCurrent) || a.phase - b.phase
    );

  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phase</TableHead>
            <TableHead>Years</TableHead>
            <TableHead className="text-right">AGR</TableHead>
            <TableHead className="text-right">COM</TableHead>
            <TableHead className="text-right">RES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground">
                No phases
              </TableCell>
            </TableRow>
          ) : (
            rows.map((p) => {
              const isCurrent = (p as any).__isCurrent as boolean;
              return (
                <TableRow
                  key={p.id}
                  className={
                    isCurrent
                      ? "bg-primary/5 hover:bg-primary/10 transition-colors"
                      : ""
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{p.phase}</Badge>
                      {isCurrent && <Badge variant="default">Current</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.first_year}–{p.last_year}
                  </TableCell>
                  <TableCell className="text-right">
                    {pct(p.agr_abated)}
                  </TableCell>
                  <TableCell className="text-right">
                    {pct(p.com_abated)}
                  </TableCell>
                  <TableCell className="text-right">
                    {pct(p.res_abated)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
