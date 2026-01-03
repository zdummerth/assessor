// app/abatements/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database-types";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProgramHeaderCard from "../program-header-card";
import ParcelsTable from "../parcels-table";

// --- local relation types ---
type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

export type ProgramWithRelations = ProgramRow & {
  abatement_phases?: PhaseRow[];
  abatement_parcels?: (ParcelRow & { test_parcels?: ParcelLite | null })[];
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  return { title: `Abatement Program ${id}` };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Invalid abatement program ID</p>
      </div>
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("abatement_programs")
    .select(
      `
      *,
      abatement_phases(*),
      abatement_parcels(*, test_parcels(*))
    `
    )
    .eq("id", idNum)
    .single();

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching abatement program</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Abatement program not found</p>
      </div>
    );
  }

  const program = data as ProgramWithRelations;

  return (
    <div className="w-full p-4 mb-10 max-w-8xl mx-auto">
      {/* On md+ fix height so each column can scroll independently */}
      <div className="grid gap-4 md:grid-cols-2 md:h-[calc(100vh-8rem)]">
        {/* Header column */}
        <div className="min-h-0 md:h-full">
          <ScrollArea className="h-full">
            <div className="pr-2">
              {" "}
              {/* padding to avoid scrollbar overlay */}
              <ProgramHeaderCard program={program} />
            </div>
          </ScrollArea>
        </div>

        {/* Parcels table column */}
        <div className="min-h-0 md:h-full">
          <ScrollArea className="h-full">
            <div className="pr-2">
              <ParcelsTable parcels={program.abatement_parcels ?? []} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
