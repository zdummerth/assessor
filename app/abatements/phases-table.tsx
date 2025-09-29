// components/abatements/PhasesTable.tsx
"use client";

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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/database-types";

type PhaseRow = Tables<"abatement_phases">;

export default function PhasesTable({ phases }: { phases: PhaseRow[] }) {
  const rows = [...(phases ?? [])].sort((a, b) => a.phase - b.phase);
  const pct = (n: number) => `${(Number(n) * 100).toFixed(0)}%`;

  return (
    <Card className="border rounded">
      <CardHeader>
        <CardTitle className="text-base">Abatement Phases</CardTitle>
        <CardDescription>
          Configured phase windows and abatements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase</TableHead>
                <TableHead>Years</TableHead>
                <TableHead className="text-right">AGR</TableHead>
                <TableHead className="text-right">COM</TableHead>
                <TableHead className="text-right">RES</TableHead>
                <TableHead className="text-right">Created</TableHead>
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
                rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Badge variant="outline">#{p.phase}</Badge>
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
                    <TableCell className="text-right">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        timeZone: "America/Chicago",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
