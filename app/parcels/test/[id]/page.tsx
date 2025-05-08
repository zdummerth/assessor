import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import CopyToClipboard from "@/components/copy-to-clipboard";
import Comparables from "@/components/server/comparables";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelSalesTable from "@/components/server/parcel-sales-table";
import StructuresTable from "@/components/server/structures-table";

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
    .order("year", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-4">Failed to fetch data: {error.message}</div>;
  }
  if (!data || data.length === 0) {
    return <div className="p-4">Parcel not found</div>;
  }

  // grab the most recent record for header
  const mostRecent = data[0];

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

      {/* ─── Parcel Year Table ─── */}
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Parcel Year History</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Year</th>
              <th className="px-3 py-2 text-left font-medium">Tax Status</th>
              <th className="px-3 py-2 text-left font-medium">Owner</th>
              <th className="px-3 py-2 text-left font-medium">Land Use</th>
              <th className="px-3 py-2 text-left font-medium">
                Property Class
              </th>
              <th className="px-3 py-2 text-left font-medium">
                Appraised Total
              </th>
              <th className="px-3 py-2 text-left font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((p) => (
              <tr
                key={`${p.parcel_number}-${p.year}`}
                className="hover:bg-gray-50"
              >
                <td className="px-3 py-2 whitespace-nowrap">{p.year}</td>
                <td className="px-3 py-2 whitespace-nowrap">{p.tax_status}</td>
                {/* @ts-ignore */}
                <td className="px-3 py-2 whitespace-nowrap">{p.owner_name}</td>
                <td className="px-3 py-2 whitespace-nowrap">{p.land_use}</td>
                <td className="px-3 py-2 whitespace-nowrap">{p.prop_class}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ${p.appraised_total?.toLocaleString() ?? "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {p.report_timestamp ? (
                    <FormattedDate date={p.report_timestamp} />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
