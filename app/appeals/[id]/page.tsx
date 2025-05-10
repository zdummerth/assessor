import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import ParcelYearTable from "@/components/server/parcel-year-table";
import StructuresTable from "@/components/server/structures-table";
import ParcelSalesTable from "@/components/server/parcel-sales-table";
import AppealFiles from "@/components/server/appeal-files";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import UploadFile from "@/components/ui/files/upload";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id}-Appeal` };
}

export default async function AppealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: appealRow, error } = await supabase
    // @ts-ignore
    .from("appeals")
    .select("*, appraisers(*)")
    .eq("appeal_number", id)
    .single();

  if (error) {
    console.error(error);
    return <div className="p-4">Failed to load appeal: {error.message}</div>;
  }
  if (!appealRow) {
    return <div className="p-4">Appeal not found</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">
        Appeal {appealRow.appeal_number} — Parcel {appealRow.parcel_number}
      </h1>

      {/* ─── Appeal Details ─── */}
      <div className="p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Status & Types</h2>
          {/*@ts-ignore */}
          <p className="text-sm">Status: {appealRow.status ?? "—"}</p>
          {/*@ts-ignore */}
          <p className="text-sm">Appeal Type: {appealRow.appeal_type ?? "—"}</p>
          <p className="text-sm">
            {/*@ts-ignore */}
            Complaint Type: {appealRow.complaint_type ?? "—"}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Dates & Times</h2>
          <p className="text-sm">
            Filed: {/*@ts-ignore */}
            {appealRow.filed_ts ? (
              //@ts-ignore
              <FormattedDate date={appealRow.filed_ts} showTime />
            ) : (
              "—"
            )}
          </p>
          <p className="text-sm">
            Hearing: {/*@ts-ignore */}
            {appealRow.hearing_ts ? (
              //@ts-ignore
              <FormattedDate date={appealRow.hearing_ts} showTime />
            ) : (
              "—"
            )}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Values & Differences</h2>
          <p className="text-sm">
            Before Total: ${appealRow.before_total?.toLocaleString() ?? "—"}
          </p>
          <p className="text-sm">
            After Total: ${appealRow.after_total?.toLocaleString() ?? "—"}
          </p>
          <p className="text-sm">
            Total Δ: ${appealRow.total_difference?.toLocaleString() ?? "—"}
          </p>
          <p className="text-sm">
            Land Δ: ${appealRow.land_difference?.toLocaleString() ?? "—"} | Bldg
            Δ: ${appealRow.bldg_difference?.toLocaleString() ?? "—"}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Appraiser</h2>
          <p className="text-sm">
            {/*@ts-ignore */}
            {appealRow.appeal_appraiser ?? "—"}
          </p>
        </div>
      </div>

      {/* Appeal Files */}
      <section>
        <div className="mb-4">
          <UploadFile
            bucket="appeals"
            path={appealRow.appeal_number?.toString() || ""}
          />
        </div>
        <Suspense fallback={<div>Loading files…</div>}>
          {/*@ts-ignore */}
          <AppealFiles appeal={appealRow.appeal_number} page={1} />
        </Suspense>
      </section>

      {/* ─── Parcel History ─── */}
      <section>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">
          Parcel History
        </h2>
        <Suspense fallback={<div>Loading parcel history…</div>}>
          {/*@ts-ignore */}
          <ParcelYearTable parcel={appealRow.parcel_number} page={1} />
        </Suspense>
      </section>

      {/* ─── Structures ─── */}
      <section>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">
          Structures
        </h2>
        <Suspense fallback={<div>Loading structures…</div>}>
          {/*@ts-ignore */}
          <StructuresTable parcel={appealRow.parcel_number} page={1} />
        </Suspense>
      </section>

      {/* ─── Sales ─── */}
      <section>
        <h2 className="text-2xl font-semibold border-t pt-4 mb-2">Sales</h2>
        <Suspense fallback={<div>Loading sales…</div>}>
          {/*@ts-ignore */}
          <ParcelSalesTable parcel={appealRow.parcel_number} page={1} />
        </Suspense>
      </section>
    </div>
  );
}
