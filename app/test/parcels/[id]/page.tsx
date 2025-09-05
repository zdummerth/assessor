import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import ParcelValues from "@/components/parcel-values/server";
import ParcelImagePrimary from "@/components/parcel-image-primary/server";
import ParcelStructures from "@/components/parcel-structures/server";
import ParcelAddress from "@/components/parcel-addresses/server";
import ParcelSales from "@/components/parcel-sales/server";
import ParcelLandUses from "@/components/parcel-land-uses/server";
import ParcelScores from "@/components/parcel-scores/server";
import ParcelCompsControls from "./comps/controls";

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
  const land_uses = parcel.test_parcel_land_uses || [];
  //@ts-expect-error TS2345
  const current_land_use = land_uses.find((lu) => !lu.end_date);
  const residentailLandUses = [
    "1110",
    "1111",
    "1114",
    "1115",
    "1120",
    "1130",
    "1140",
  ];

  const isResidential = residentailLandUses.includes(
    //@ts-expect-error TS2532
    current_land_use?.land_use
  );

  return (
    <div className="w-full flex flex-col gap-4 p-4 mb-10 max-w-4xl mx-auto">
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
        <ParcelSales parcelId={parcel.id} />
      </Suspense>
      <Suspense fallback={<div>Loading parcel scores...</div>}>
        <ParcelScores parcelId={parcel.id} />
      </Suspense>
      <h2 className="font-semibold mt-6 mb-2">Comparable Sales</h2>
      <Link
        href={`/test/parcels/${parcel.id}/comps`}
        className="text-sm text-blue-600 underline mb-2"
        target="_blank"
        rel="noreferrer"
      >
        Select Manual Comps
      </Link>

      <ParcelCompsControls
        parcelId={parcel.id}
        defaults={{
          md: isResidential ? 1 : 2,
          band: isResidential ? 500 : 10000,
          same_lu: isResidential,
        }}
      />
    </div>
  );
}
