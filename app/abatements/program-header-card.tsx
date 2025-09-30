// components/abatements/ProgramHeaderCard.tsx
"use client";

import { Tables } from "@/database-types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormattedDate from "@/components/ui/formatted-date";
import PhasesTable from "./phases-table";

type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

export default function ProgramHeaderCard({
  program,
}: {
  program: ProgramRow & {
    abatement_phases?: PhaseRow[] | null;
    abatement_parcels?:
      | (ParcelRow & { test_parcels?: ParcelLite | null })[]
      | null;
  };
}) {
  const phases = program.abatement_phases ?? [];
  const parcels = program.abatement_parcels ?? [];

  const phaseCount = phases.length;
  const parcelCount = parcels.length;

  const totals = parcels.reduce(
    (acc, p) => {
      acc.agr += Number(p.agr_base_assessed || 0);
      acc.com += Number(p.com_base_assessed || 0);
      acc.res += Number(p.res_base_assessed || 0);
      return acc;
    },
    { agr: 0, com: 0, res: 0 }
  );

  const currency0 = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Program #{program.id}
          {program.type ? (
            <Badge variant="secondary">{program.type}</Badge>
          ) : null}
        </CardTitle>
        <CardDescription className="space-x-1">
          <span>
            {program.scale_type ? `${program.scale_type} scale` : "—"}
          </span>
          <span>·</span>
          <span>
            {program.first_year}–{program.last_year}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Phases</span>
            <span className="font-medium">{phaseCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Parcels</span>
            <span className="font-medium">{parcelCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              <FormattedDate date={program.created_at} />
            </span>
          </div>
        </div>

        <Separator />

        {/* Base assessed totals */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Base assessed totals (all parcels in this program)
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">AGR</span>
              <span className="font-medium">{currency0(totals.agr)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">COM</span>
              <span className="font-medium">{currency0(totals.com)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">RES</span>
              <span className="font-medium">{currency0(totals.res)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Phases */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Phases</div>
          {phases.length > 0 ? (
            <PhasesTable phases={phases} />
          ) : (
            <p className="text-sm text-muted-foreground">No phases</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Notes</div>
          <ScrollArea className="h-28 rounded border p-2">
            <p className="text-sm whitespace-pre-wrap">
              {program.notes || "No notes"}
            </p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
