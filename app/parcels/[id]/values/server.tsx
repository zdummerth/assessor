// app/components/ServerParcelValues.tsx
import { createClient } from "@/utils/supabase/server";

export type ParcelValueRow = {
  id: number;
  parcel_id: number;
  year: number;
  category: string | null;
  date_of_assessment: string | null; // timestamptz
  last_changed: string | null; // date
  changed_by: string | null;
  reason_for_change: string | null;

  app_bldg_agriculture: number | null;
  app_bldg_commercial: number | null;
  app_bldg_residential: number | null;
  app_bldg_exempt: number | null;

  app_land_agriculture: number | null;
  app_land_commercial: number | null;
  app_land_residential: number | null;
  app_land_exempt: number | null;

  app_new_const_agriculture: number | null;
  app_new_const_commercial: number | null;
  app_new_const_residential: number | null;
  app_new_const_exempt: number | null;

  bldg_agriculture: number | null;
  bldg_commercial: number | null;
  bldg_residential: number | null;
  bldg_exempt: number | null;

  land_agriculture: number | null;
  land_commercial: number | null;
  land_residential: number | null;
  land_exempt: number | null;

  new_const_agriculture: number | null;
  new_const_commercial: number | null;
  new_const_residential: number | null;
  new_const_exempt: number | null;

  app_total_value: number | null; // generated column
};

import ClientParcelValues from "./client";

export default async function ServerParcelValues({
  parcelId,
  className = "",
  title,
}: {
  parcelId: number;
  className?: string;
  title?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcel_values")
    .select("*")
    .eq("parcel_id", parcelId)
    .order("year", { ascending: false })
    .order("date_of_assessment", { ascending: false })
    .order("last_changed", { ascending: false });

  if (error) {
    console.error("ServerParcelValues error:", error);
    return (
      <section className={`rounded-lg border bg-white p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 text-sm text-red-700">
          Failed to load values: {error.message}
        </div>
      </section>
    );
  }

  //@ts-expect-error TS2345
  const rows = (data ?? []) as ParcelValueRow[];

  return (
    <section className={className}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <ClientParcelValues rows={rows} />
    </section>
  );
}
