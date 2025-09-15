import { createClient } from "@/utils/supabase/server";
import ClientParcelNeighborhoods, {
  type ParcelNeighborhoodRow,
} from "./client";

export default async function ServerParcelNeighborhoods({
  parcelId,
  className = "",
  title,
}: {
  parcelId: number;
  className?: string;
  title?: string;
}) {
  const supabase = await createClient();

  // Pull all links (newest first), and nest neighborhood + set names
  const { data, error } = await supabase
    // @ts-expect-error nested select is valid in Supabase
    .from("test_parcel_neighborhoods")
    .select(
      `
        id,
        parcel_id,
        neighborhood_id,
        effective_date,
        end_date,
        created_at,
        neighborhoods (
          id,
          name,
          neighborhood,
          set_id,
          neighborhood_sets (
            id, name
          )
        )
      `
    )
    .eq("parcel_id", parcelId)
    .order("effective_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ServerParcelNeighborhoods error:", error);
    return (
      <section className={`rounded-lg border bg-white p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 text-sm text-red-700">
          Failed to load neighborhoods: {error.message}
        </div>
      </section>
    );
  }

  //@ts-expect-error TS2345
  const rows = (data ?? []) as ParcelNeighborhoodRow[];

  return (
    <section className={className}>
      <ClientParcelNeighborhoods rows={rows} title={title} />
    </section>
  );
}
