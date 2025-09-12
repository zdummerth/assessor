// app/components/ServerParcelStructures.tsx
import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelStructures from "./client";
// import ClientParcelStructures from "./client-cards";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

type ParcelStructureRow = {
  id: number;
  parcel_id: number;
  structure_id: number;
  effective_date: string | null;
  end_date: string | null;
  test_structures: // @ts-expect-error: nested select is valid in Supabase
  | (Tables<"test_structures"> & {
        // @ts-expect-error: nested select is valid in Supabase
        test_structure_sections: Tables<"test_structure_sections">[];
        // @ts-expect-error: nested select is valid in Supabase
        test_conditions: Tables<"test_conditions">[];
      })
    | null;
};

export default async function ServerParcelStructures({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  // Pull all structure links for this parcel, plus the nested structure + relations
  const { data, error } = await supabase
    // @ts-expect-error: nested select is valid in Supabase
    .from("test_parcel_structures")
    .select(
      `
        id,
        parcel_id,
        structure_id,
        effective_date,
        end_date,
        test_structures (
          *,
          test_structure_sections(*),
          test_conditions(*)
        )
      `
    )
    .eq("parcel_id", parcel.id)
    .order("effective_date", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching structure data</p>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  // Flatten: feed ClientParcelStructures the structure objects it expects,
  // but keep link metadata alongside (prefixed with _link_* for clarity).
  const structures =
    // @ts-expect-error: nested select is valid in Supabase
    (data as ParcelStructureRow[] | null)?.flatMap((row) => {
      if (!row?.test_structures) return [];
      const s = row.test_structures;
      return [
        {
          // @ts-expect-error: nested select is valid in Supabase
          ...s,
          _link_id: row.id,
          _link_effective_date: row.effective_date,
          _link_end_date: row.end_date,
          _link_structure_id: row.structure_id,
        },
      ];
    }) ?? [];

  if (!structures.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">No structures linked to this parcel.</p>
      </div>
    );
  }

  return <ClientParcelStructures data={structures} parcel={parcel} />;
}
