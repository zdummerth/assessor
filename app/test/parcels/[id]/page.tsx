import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import ParcelImagePrimary from "@/components/parcel-image-primary/server";
import ParcelStructures from "@/components/parcel-structures/server";
import ParcelAddress from "@/components/parcel-addresses/server";
import ParcelSales from "@/components/parcel-sales/server";
import ParcelLandUses from "@/components/parcel-land-uses/server";
import ParcelScores from "@/components/parcel-scores/server";
import ParcelCompsClient from "@/components/parcel-comps-client/server";
import ServerParcelFieldReviews from "@/components/field-reviews/server";
import ServerParcelSnapshot from "@/components/parcel-snapshot/server";
import { Server } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  return { title: id };
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
  // @ts-expect-error TS2345
  const current_land_use = land_uses.find((lu) => !lu.end_date);

  return (
    <div className="w-full flex flex-col gap-6 p-4 mb-10 max-w-8xl mx-auto">
      {/* Two-column layout: left (image + field reviews, max 425px) / right (everything else) */}
      <div className="grid gap-4 md:grid-cols-[425px,1fr]">
        {/* Left column */}
        <aside className="space-y-4 max-w-[425px] w-full">
          <div className="w-full">
            <ParcelImagePrimary parcel_id={parcel.id} />
          </div>

          <Suspense fallback={<div>Loading field reviews...</div>}>
            <ServerParcelFieldReviews
              parcel={parcel}
              revalidatePath={`/test/parcels/${parcel.id}`}
              title="Field Reviews"
            />
          </Suspense>
        </aside>

        {/* Right column */}
        <section className="flex flex-col gap-4">
          {/* Top info grid */}
          <ServerParcelSnapshot parcelId={parcel.id} title="Parcel Info" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Parcel Number (with retired banner) */}
            {/* <div className="flex flex-col">
              <ParcelNumber
                id={parcel.id}
                block={parcel.block}
                lot={parcel.lot}
                ext={parcel.ext}
              />
              {parcel.retired_at && (
                <p className="mt-2 bg-red-100 text-red-800 p-2 rounded print:hidden">
                  Retired: <FormattedDate date={parcel.retired_at} />
                </p>
              )}
            </div> */}

            {/* <div>
              <Suspense fallback={<div>Loading parcel address...</div>}>
                <ParcelAddress parcel={parcel} />
              </Suspense>
            </div>

            <div>
              <Suspense fallback={<div>Loading land use...</div>}>
                <ParcelLandUses parcel={parcel} />
              </Suspense>
            </div> */}

            {/* <div>
              <Suspense fallback={<div>Loading parcel scores...</div>}>
                <ParcelScores parcelId={parcel.id} />
              </Suspense>
            </div> */}
          </div>

          {/* Below the grid */}
          <Suspense fallback={<div>Loading parcel structures...</div>}>
            <ParcelStructures parcel={parcel} />
          </Suspense>

          <Suspense fallback={<div>Loading parcel sales...</div>}>
            <ParcelSales parcelId={parcel.id} />
          </Suspense>
        </section>
      </div>

      {/* Comparables (full width below) */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Comparable Sales</h2>
        <Link
          href={`/test/parcels/${parcel.id}/comps`}
          className="text-sm text-blue-600 underline mb-3 inline-block"
          target="_blank"
          rel="noreferrer"
        >
          Select Manual Comps
        </Link>
        <Suspense fallback={<div>Loading comparable sales...</div>}>
          <ParcelCompsClient parcelId={parcel.id} />
        </Suspense>
      </div>
    </div>
  );
}
