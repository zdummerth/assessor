import { createClient } from "@/lib/supabase/server";
import ParcelNumber from "../ui/parcel-number-updated";

export default async function ParcelFeatures(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_parcel_features")
    .eq("parcel_id", Number(id))
    .single();

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcel</p>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Parcel not found</p>
      </div>
    );
  }

  const p = data;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-lg border p-4 shadow-sm bg-white space-y-3">
        {/* Header: Parcel number + address */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <ParcelNumber
            id={p.parcel_id}
            block={p.block}
            lot={Number(p.lot)}
            ext={p.ext}
          />
          <div className="text-sm text-gray-700">
            <div className="font-medium">
              {p.house_number} {p.street}
            </div>
            <div className="text-gray-600">
              {p.district}
              {p.postcode ? `, ${p.postcode}` : ""}
            </div>
          </div>
        </div>

        {/* Compact metrics grid */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Land Use</dt>
            <dd className="font-medium">{p.land_use}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Structures</dt>
            <dd className="font-medium">{p.structure_count}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Avg Year Built</dt>
            <dd className="font-medium">{p.avg_year_built}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Avg Condition</dt>
            <dd className="font-medium">{p.avg_condition}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Finished (sf)</dt>
            <dd className="font-medium">{p.total_finished_area}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Unfinished (sf)</dt>
            <dd className="font-medium">{p.total_unfinished_area}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
