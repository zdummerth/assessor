// app/abatements/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database-types";

import ProgramHeaderCard from "../program-header-card";
import PhasesTable from "../phases-table";
import ParcelsTable from "../parcels-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    .eq("id", id)
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
    <div className="w-full flex flex-col gap-6 p-4 mb-10 max-w-8xl mx-auto">
      <div className="grid gap-4 md:grid-cols-[425px,1fr]">
        <aside className="space-y-4 max-w-[425px] w-full">
          <Link href="/abatements" className="text-sm underline">
            ← All Programs
          </Link>
          <ProgramHeaderCard program={program} />
        </aside>

        <section className="flex flex-col gap-4">
          <Tabs defaultValue="parcels" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="parcels">Parcels</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="mt-4">
              <Suspense fallback={<div>Loading phases…</div>}>
                <PhasesTable phases={program.abatement_phases ?? []} />
              </Suspense>
            </TabsContent>

            <TabsContent value="parcels" className="mt-4">
              <Suspense fallback={<div>Loading parcels…</div>}>
                <ParcelsTable parcels={program.abatement_parcels ?? []} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
