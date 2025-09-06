import type { Metadata } from "next";
import SalesAddressSearch from "@/components/ui/sales/search-by-address";
import ParcelFeatures from "@/components/parcel-features/server";
import ParcelCompareViewer from "@/components/parcel-comparables/custom-comps";
import { Suspense } from "react";

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

  return (
    <div className="flex gap-2 p-2">
      <div className="w-[400px]">
        <Suspense fallback={<div>Loading...</div>}>
          <ParcelFeatures params={Promise.resolve({ id: params.id })} />
        </Suspense>
        <SalesAddressSearch className="w-full" />
      </div>
      <ParcelCompareViewer />
    </div>
  );
}
