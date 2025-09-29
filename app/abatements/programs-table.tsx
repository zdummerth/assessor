// components/abatements/ProgramListTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

export default function ProgramListTable({
  programs,
}: {
  programs: ProgramWithRelations[];
}) {
  const [openFor, setOpenFor] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Abatement Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Scale</TableHead>
              <TableHead>Years</TableHead>
              <TableHead className="text-right"># Phases</TableHead>
              <TableHead className="text-right"># Parcels</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  No programs
                </TableCell>
              </TableRow>
            ) : (
              programs.map((p) => {
                const phaseCount = p.abatement_phases?.length ?? 0;
                const parcelCount = p.abatement_parcels?.length ?? 0;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link href={`/abatements/${p.id}`} className="underline">
                        {p.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {p.type ? (
                        <Badge variant="secondary">{p.type}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{p.scale_type ?? "—"}</TableCell>
                    <TableCell>
                      {p.first_year}–{p.last_year}
                    </TableCell>
                    <TableCell className="text-right">{phaseCount}</TableCell>
                    <TableCell className="text-right">{parcelCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={openFor === p.id}
                          onOpenChange={(o) => setOpenFor(o ? p.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Parcels
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl">
                            <DialogHeader>
                              <DialogTitle>Program #{p.id} Parcels</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2">
                              <ParcelsTable
                                parcels={p.abatement_parcels ?? []}
                                compact
                              />
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
                              <DialogTitle>Program #{p.id} Phases</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2">
                              <PhasesTable phases={p.abatement_phases ?? []} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
