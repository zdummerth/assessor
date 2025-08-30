import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import ParcelValues from "@/components/parcel-values/server";
import ParcelImagePrimary from "@/components/parcel-image-primary/server";
import ParcelComparables from "@/components/parcel-comparables/server-test";
// import ParcelComparables_ from "@/components/parcel-comparables/server";
import ParcelStructures from "@/components/parcel-structures/server";
import ParcelAddress from "@/components/parcel-addresses/server";
import ParcelSales from "@/components/parcel-sales/server";
import ParcelLandUses from "@/components/parcel-land-uses/server";
import ParcelScores from "@/components/parcel-scores/server";
// import AppealForm from "@/components/ui/notices/appeal/main";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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
    .from("test_parcels")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcel</p>
        <p>{error.message}</p>
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

  const parcel = data;
  // console.log("Parcel data:", parcel);

  return (
    <div className="w-full flex flex-col gap-4 p-4 mb-10 max-w-6xl mx-auto">
      <div className="grid gap-8 md:grid-cols-[24rem,1fr] h-72">
        <div className="w-full h-full">
          <ParcelImagePrimary parcel_id={parcel.id} />
        </div>

        <div className="flex flex-col gap-1 justify-between">
          <div className="flex flex-col justify-between">
            <div>
              <ParcelNumber
                id={parcel.id}
                block={parcel.block}
                lot={parcel.lot}
                ext={parcel.ext}
              />
            </div>
            {parcel.retired_at && (
              <p className="mt-2 bg-red-100 text-red-800 p-2 rounded print:hidden">
                Retired: <FormattedDate date={parcel.retired_at} />
              </p>
            )}
          </div>

          {/* Row 2: Address */}
          <div className="">
            <Suspense fallback={<div>Loading parcel address...</div>}>
              <ParcelAddress parcel={parcel} />
            </Suspense>
          </div>

          {/* Row 3: Land use */}
          <div className="">
            <Suspense fallback={<div>Loading land use...</div>}>
              <ParcelLandUses parcel={parcel} />
            </Suspense>
          </div>

          {/* Row 4: Values */}
          <div className="">
            <Suspense fallback={<div>Loading parcel values...</div>}>
              <ParcelValues parcel={parcel} />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading parcel structures...</div>}>
        <ParcelStructures parcel={parcel} />
      </Suspense>
      <Suspense fallback={<div>Loading parcel sales...</div>}>
        <ParcelSales parcel={parcel} />
      </Suspense>
      {/* <Suspense fallback={<div>Loading parcel comparables...</div>}>
        <ParcelComparables_ parcel={parcel} />
      </Suspense> */}
      <Suspense fallback={<div>Loading parcel scores...</div>}>
        <ParcelScores parcelId={parcel.id} />
      </Suspense>
      <Suspense fallback={<div>Loading parcel comparables...</div>}>
        <ParcelComparables
          parcelId={parcel.id}
          weights={{
            land_use: 5,
            district: 4,
            lat: 3,
            lon: 3,
            floor_finished: 4,
            basement_finished: 2,
            basement_unfinished: 2,
            // crawl_finished: 2,
            // crawl_unfinished: 2,
            // addition_finished: 2,
            // addition_unfinished: 2,
            // attic_finished: 2,
            // attic_unfinished: 2,
            condition: 3,
          }}
        />
      </Suspense>

      {/* <AppealForm /> */}
    </div>
  );
}
