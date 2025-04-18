import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import TogglePaid, { TestPaid } from "@/components/ui/invoices/toggle-paid";
import Update, { UpdateLineItem } from "@/components/ui/invoices/update";
import { DeleteLineItem } from "@/components/ui/invoices/delete";
import { CreateLineItem } from "@/components/ui/invoices/create";
import FormattedDate from "@/components/ui/formatted-date";
import PrintableInvoice from "@/components/ui/invoices/printable";

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
    .from("invoices")
    .select("*, invoice_line_item(*)")
    .eq("id", params.id)
    .single();

  console.log({ data, error });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching invoice</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log(data);
  //sort line items by id
  const sorted = data.invoice_line_item.sort((a, b) => a.id - b.id);
  return (
    <div className="w-full p-4">
      <div className="w-full gap-4">
        <div id="detail" className="w-full">
          <div className="flex gap-4 items-center mb-6 text-sm print:hidden">
            <p className="">Invoice Number:</p>
            <div>{data.id}</div>
          </div>
          <div className="w-full print:hidden mb-4">
            <Update item={data} />
          </div>
          {data.invoice_line_item.length > 0 && (
            <div className="mb-6 print:hidden">
              {sorted.map((item) => (
                <div key={item.id} className="flex items-end gap-6">
                  <UpdateLineItem id={data.id.toString()} item={item} />
                  <DeleteLineItem id={item.id.toString()} />
                </div>
              ))}
            </div>
          )}
          <div className="print:hidden">
            <CreateLineItem id={data.id.toString()} />
          </div>
          <div className="">
            <PrintableInvoice data={data} lineItems={data.invoice_line_item} />
          </div>
        </div>
      </div>
    </div>
  );
}
