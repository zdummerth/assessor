// components/abatements/AbatementsTabs.tsx
"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgramListTable from "./programs-table";
import ParcelsTable from "./parcels-table";
import { Tables } from "@/database-types";

type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

export type ProgramWithRelations = ProgramRow & {
  abatement_phases?: PhaseRow[];
  abatement_parcels?: (ParcelRow & { test_parcels?: ParcelLite | null })[];
};

export default function AbatementsTabs({
  programs,
  parcels,
}: {
  programs: ProgramWithRelations[];
  parcels: (ParcelRow & { test_parcels?: ParcelLite | null })[];
}) {
  return (
    <Tabs defaultValue="programs" className="w-full">
      <TabsList>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="parcels">All Abated Parcels</TabsTrigger>
      </TabsList>

      <TabsContent value="programs" className="mt-4">
        <ProgramListTable programs={programs} />
      </TabsContent>

      <TabsContent value="parcels" className="mt-4">
        <ParcelsTable parcels={parcels} showProgramId showPagination />
      </TabsContent>
    </Tabs>
  );
}
