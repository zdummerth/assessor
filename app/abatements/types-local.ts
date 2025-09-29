import { Tables } from "@/database-types";

// Base row types
type ProgramRow = Tables<"abatement_programs">;
type PhaseRow = Tables<"abatement_phases">;
type ParcelRow = Tables<"abatement_parcels">;
type ParcelLite = Tables<"test_parcels">;

// Relation-augmented types
export type ProgramWithRelations = ProgramRow & {
  abatement_phases?: PhaseRow[];
  abatement_parcels?: (ParcelRow & { test_parcels?: ParcelLite | null })[];
};
