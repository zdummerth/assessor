import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "../ui/parcel-number-updated";
import GowerCompsClient from "./client";

type ParcelFeaturesRow = {
  parcel_id: number;
  block: number;
  lot: string;
  ext: number;
  structure_count: number;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
};

export default async function ParcelCompsClient({
  parcelId,
}: {
  parcelId: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    // @ts-expect-error rpc name typing varies by codegen
    .rpc("find_parcel_features")
    .eq("parcel_id", parcelId)
    .single<ParcelFeaturesRow>();

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

  // Subject object for the client comps component
  const subject = {
    parcel_id: p.parcel_id,
    land_use: p.land_use,
    district: p.district,
    total_finished_area: p.total_finished_area,
    total_unfinished_area: p.total_unfinished_area,
    avg_condition: p.avg_condition,
    lat: p.lat,
    lon: p.lon,
    house_number: p.house_number,
    street: p.street,
  };

  return (
    <div className="">
      <div className="rounded border p-2">
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
            <dd className="font-medium">{p.land_use ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Structures</dt>
            <dd className="font-medium">{p.structure_count}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Avg Year Built</dt>
            <dd className="font-medium">{p.avg_year_built ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Avg Condition</dt>
            <dd className="font-medium">{p.avg_condition ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Finished (sf)</dt>
            <dd className="font-medium">{p.total_finished_area ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Unfinished (sf)</dt>
            <dd className="font-medium">{p.total_unfinished_area ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <GowerCompsClient subject={subject} />
    </div>
  );
}
