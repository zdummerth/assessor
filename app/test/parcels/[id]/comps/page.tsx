import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import ParcelValues from "@/components/parcel-values/server";
import ParcelStructures from "@/components/parcel-structures/server";
import ParcelAddress from "@/components/parcel-addresses/server";
import ParcelLandUses from "@/components/parcel-land-uses/server";
import ParcelCompsControls from "./controls";

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
    .from("test_parcels")
    .select("*, test_parcel_land_uses(*)")
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
    <div className="w-full flex flex-col gap-4 p-4 mb-10 max-w-4xl mx-auto">
      <div className="grid gap-8 md:grid-cols-[24rem,1fr]">
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

          <div className="">
            <Suspense fallback={<div>Loading parcel address...</div>}>
              <ParcelAddress parcel={parcel} />
            </Suspense>
          </div>

          <div className="">
            <Suspense fallback={<div>Loading land use...</div>}>
              <ParcelLandUses parcel={parcel} />
            </Suspense>
          </div>

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
      <ParcelCompsControls parcelId={parcel.id} />
    </div>
  );
}
