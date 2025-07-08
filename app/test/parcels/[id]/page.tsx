import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import ParcelValues from "@/components/parcel-values/server";
import ParcelImagePrimary from "@/components/parcel-image-primary/server";
import ParcelComparables from "@/components/parcel-comparables/layouts";
import AppealForm from "@/components/ui/notices/appeal/main";

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
    <div className="w-full p-4">
      <div className="flex items-center mb-4 gap-4 print:hidden">
        <h1 className="text-2xl font-semibold print:hidden">
          <ParcelNumber
            id={parcel.id}
            block={parcel.block}
            lot={parcel.lot}
            ext={parcel.ext}
          />
        </h1>
        {parcel.retired_at && (
          <p className="bg-red-100 text-red-800 p-2 rounded print:hidden">
            Retired: <FormattedDate date={parcel.retired_at} />
          </p>
        )}
      </div>
      <div className="w-full md:w-96 print:hidden">
        <ParcelImagePrimary parcel_id={parcel.id} />
      </div>

      <h2 className="mt-4 mb-2 print:hidden">Value</h2>
      <span className="print:hidden">
        <Suspense fallback={<div>Loading parcel values...</div>}>
          <ParcelValues parcel={parcel} />
        </Suspense>
      </span>

      <Suspense fallback={<div>Loading parcel comparables...</div>}>
        {/* <ParcelComparables parcel={parcel} /> */}
      </Suspense>

      {/* <AppealForm /> */}
    </div>
  );
}
