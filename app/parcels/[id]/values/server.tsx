// app/components/ServerParcelValues.tsx
import { createClient } from "@/utils/supabase/server";

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

  const rows = data ?? [];

  return (
    <section className={className}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <ClientParcelValues rows={rows} />
    </section>
  );
}
