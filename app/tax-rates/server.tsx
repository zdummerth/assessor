// app/taxes/by-year/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database-types";
import ByYearClient from "./client";

type DistrictRow = Tables<"tax_districts">;
type SubdistrictRow = Tables<"tax_subdistricts">;
type RateYearRow = Tables<"tax_rate_years">;

export type SubdistrictWithRates = SubdistrictRow & {
  tax_rate_years?: RateYearRow[];
};
export type DistrictWithRelations = DistrictRow & {
  tax_subdistricts?: SubdistrictWithRates[];
};

export const metadata = { title: "Tax Rates by Year" };

export default async function TaxRatesServer() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_districts")
    .select(
      `
      *,
      tax_subdistricts(
        *,
        tax_rate_years(*)
      )
    `
    )
    .order("code", { ascending: true })
    .order("name", { ascending: true, referencedTable: "tax_subdistricts" });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching tax data</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const districts = (data ?? []) as DistrictWithRelations[];

  return (
    <div className="w-full p-4 mb-10 max-w-7xl mx-auto">
      <ByYearClient districts={districts} />
    </div>
  );
}
