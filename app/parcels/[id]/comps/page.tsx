import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import SalesAddressSearch from "@/components/ui/sales/search-by-address";
import ManualComps from "@/components/parcel-comps-client/manual";
import ParcelNumber from "@/components/ui/parcel-number-updated";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return {
    title: id,
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_parcel_features")
    .eq("parcel_id", params.id)
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
    <div className="flex gap-2 p-2">
      <div className="w-[400px]">
        <SalesAddressSearch className="w-full" />
      </div>
      <div>
        <div className="rounded-lg border p-2 shadow-sm space-y-4">
          {/* Header: Parcel number + address */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <ParcelNumber
              id={p.parcel_id}
              block={p.block}
              lot={Number(p.lot)}
              ext={p.ext}
            />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium">
                {p.house_number} {p.street}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
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

        <ManualComps subject={subject} />
      </div>
    </div>
  );
}
