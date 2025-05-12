import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import SaleFiles from "@/components/server/sale-files";
import { Suspense } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import UploadFile from "@/components/ui/files/upload";
import ParcelNumber from "@/components/ui/parcel-number";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  return { title: `Sale ${id}` };
}

export default async function SaleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sale, error } = await supabase
    // @ts-ignore
    .from("sales_master")
    .select("*, sales_parcel(parcel_number, parcel_master(*))")
    .eq("document_number", id)
    .single();

  if (error) {
    console.error(error);
    return <div className="p-4">Failed to load sale: {error.message}</div>;
  }
  if (!sale) {
    return <div className="p-4">Sale not found</div>;
  }

  console.log("Sale data", sale);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Sale {sale.document_number}</h1>

      <div className="p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price & Type */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Price & Type</h2>
          <p className="text-sm">
            Net Selling Price:{" "}
            {sale.net_selling_price != null
              ? `$${sale.net_selling_price.toLocaleString()}`
              : "—"}
          </p>
          <p className="text-sm">Sale Type: {sale.sale_type ?? "—"}</p>
        </div>

        {/* Dates */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Dates</h2>
          <p className="text-sm">
            Date of Sale:{" "}
            {sale.date_of_sale ? (
              <FormattedDate date={sale.date_of_sale} />
            ) : (
              "—"
            )}
          </p>
          <p className="text-sm">
            Field Review Date:{" "}
            {sale.field_review_date ? (
              <FormattedDate date={sale.field_review_date} />
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      {/* ─── Parcel Details ─── */}
      <div className="p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Parcels</h2>
        <div>
          {sale.sales_parcel?.map((parcel: any) => (
            <div key={parcel.parcel_number} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                <ParcelNumber parcelNumber={parcel.parcel_number} />
              </h3>
            </div>
          ))}
        </div>
      </div>
      {/*Files */}
      <section>
        <div className="mb-4">
          <UploadFile
            bucket="sales"
            path={sale.document_number?.toString() || ""}
          />
        </div>
        <Suspense fallback={<div>Loading files…</div>}>
          {/*@ts-ignore */}
          <SaleFiles document_number={sale.document_number} page={1} />
        </Suspense>
      </section>
    </div>
  );
}
