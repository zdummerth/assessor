// app/abatements/page.tsx (or wherever your page lives)
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/database-types";
import AbatementsTabs from "./page-tabs";

type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

export type ProgramWithRelations = ProgramRow & {
  abatement_phases?: PhaseRow[];
  abatement_parcels?: (ParcelRow & { test_parcels?: ParcelLite | null })[];
};

export const metadata = { title: "Abatement Programs" };

export default async function Page() {
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
    .order("first_year", { ascending: true });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching programs</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const programs = (data ?? []) as ProgramWithRelations[];
  const allParcels = programs.flatMap(
    (p) => p.abatement_parcels ?? []
  ) as (ParcelRow & {
    test_parcels?: ParcelLite | null;
  })[];

  return (
    <div className="w-full flex flex-col gap-6 p-4 mb-10 max-w-7xl mx-auto">
      <AbatementsTabs programs={programs} parcels={allParcels} />
    </div>
  );
}
