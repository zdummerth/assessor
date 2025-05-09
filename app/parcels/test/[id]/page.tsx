import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import Comparables from "@/components/server/comparables";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelSalesTable from "@/components/server/parcel-sales-table";
import StructuresTable from "@/components/server/structures-table";
import ParcelYearTable from "@/components/server/parcel-year-table";
import ParcelAppealsTable from "@/components/server/parcel-appeals-table";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  return { title: id };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const supabase = await createClient();

  const { data, error } = await supabase
    // @ts-ignore
    .from("parcel_year")
    .select("*, appraisers(*)")
    .eq("parcel_number", id)
    .eq("year", 2025)
    .single();

  if (error) {
    console.error(error);
    return <div className="p-4">Failed to fetch data: {error.message}</div>;
  }
  if (!data) {
    return <div className="p-4">Parcel not found</div>;
  }

  // grab the most recent record for header
  const mostRecent = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">{id}</h1>
      {/* ─── Header Section ─── */}
      <div className="p-6 rounded shadow shadow-foreground grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Appraiser */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Appraiser</h2>
          {/* @ts-ignore */}
          <p className="text-sm">{mostRecent.appraisers?.name ?? "—"}</p>
          {/* @ts-ignore */}
          {mostRecent.appraisers?.email && (
            // @ts-ignore
            <p className="text-sm">{mostRecent.appraisers.email}</p>
          )}
          {/* @ts-ignore */}
          {mostRecent.appraisers?.phone && (
            // @ts-ignore
            <p className="text-sm">{mostRecent.appraisers.phone}</p>
          )}
        </div>

        {/* Owner */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Owner</h2>
          {/* @ts-ignore */}
          <p className="text-sm">{mostRecent.owner_name}</p>
          {/* @ts-ignore */}
          <p className="text-sm">{mostRecent.owner_address_1}</p>
          {/* @ts-ignore */}
          {mostRecent.owner_address_2 && (
            // @ts-ignore
            <p className="text-sm">{mostRecent.owner_address_2}</p>
          )}
          <p className="text-sm">
            {/* @ts-ignore */}
            {mostRecent.owner_city}, {mostRecent.owner_state} {/* @ts-ignore */}
            {mostRecent.owner_zip}
          </p>
        </div>

        {/* Site Address */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Site Address</h2>
          <p className="text-sm">
            {/* @ts-ignore */}
            {mostRecent.site_street_number} {mostRecent.prefix_directional}{" "}
            {/* @ts-ignore */}
            {mostRecent.site_street_name}
          </p>
          {/* @ts-ignore */}
          <p className="text-sm">{mostRecent.site_zip_code}</p>
        </div>
        {/* Neighborhood */}
        <div className="">
          <h2 className="text-lg font-semibold mb-2">Detail</h2>
          <p className="text-sm">{mostRecent.neighborhood}</p>
          <p className="text-sm">{mostRecent.land_use}</p>
          <p className="text-sm">{mostRecent.prop_class}</p>
        </div>
      </div>

      {/* ─── Parcel ─── */}
      <div>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">Parcel</h2>
        <Suspense fallback={<div>Loading parcel history…</div>}>
          <ParcelYearTable parcel={id} page={1} />
        </Suspense>
      </div>

      {/* ─── Structures ─── */}
      <div>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">
          Structures
        </h2>
        <Suspense fallback={<div>Loading structures…</div>}>
          <StructuresTable parcel={id} page={1} />
        </Suspense>
      </div>

      {/* ─── Sales ─── */}
      <div>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">Sales</h2>
        <Suspense fallback={<div>Loading sales…</div>}>
          <ParcelSalesTable parcel={id} page={1} />
        </Suspense>
      </div>

      {/* ─── Appeals ─── */}
      <div>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">Appeals</h2>
        <Suspense fallback={<div>Loading appeals…</div>}>
          <ParcelAppealsTable parcel={id} page={1} />
        </Suspense>
      </div>

      {/* ─── Comparables ─── */}
      <div>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">
          Comparables
        </h2>
        <Suspense fallback={<div>Loading comparables…</div>}>
          <Comparables parcel={id} page={1} />
        </Suspense>
      </div>

      {/* Sales, Appeals, Permits sections would follow similarly */}
    </div>
  );
}
