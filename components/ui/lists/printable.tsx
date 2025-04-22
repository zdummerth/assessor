import { Tables } from "@/database-types";
import FormattedDate from "../formatted-date";
import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";

export default function PrintableInvoice({
  data,
  lineItems,
}: {
  data: Tables<"invoices">;
  lineItems: Tables<"invoice_line_item">[];
}) {
  const total_amount = lineItems
    .reduce((acc, item) => {
      const amount = item.amount || 0;
      const qty = item.qty || 0;

      return acc + amount * qty;
    }, 0)
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return (
    <div className="break-inside-auto w-full flex flex-col border rounded-md mx-auto p-8 w-[215.9mm] h-[279.4mm] print:p-0 print:border-none print:bg-white print:text-black">
      <div id="header" className="w-full flex justify-between mb-16">
        <Image
          src={stlSeal}
          alt="St. Louis City Seal"
          width={100}
          height={100}
        />
        <div>
          <p>City of St. Louis Assessor's Office</p>
          <p>1200 Market St, Room 120</p>
          <p>St. Louis, MO 63103</p>
          <p>314-622-4050</p>
        </div>
      </div>
      <div className="w-full mb-24">
        <div id="detail" className="w-full">
          <div className="flex justify-between">
            <div className="">
              <p className="text-sm">Bill To</p>
              <div>{data.customer_name}</div>
            </div>
            <div className="">
              <div className="text-sm">
                <p className="">Invoice Number:</p>
                <div>{data.id}</div>
              </div>
              <p className="text-sm">Invoice Date</p>
              <div>
                <FormattedDate date={data.created_at} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-">
        <table className="w-full table-auto mb-6">
          <thead>
            <tr>
              <th className="text-left text-sm pb-2">Description</th>
              <th className="text-left text-sm pb-2">Qty</th>
              <th className="text-left text-sm pb-2">Unit</th>
              <th className="text-right text-sm pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 text-sm">{item.description}</td>
                <td className="py-2 text-sm">{item.qty}</td>
                <td className="py-2 text-sm">{item.unit}</td>
                <td className="py-2 text-sm text-right">
                  {item.amount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td colSpan={3} className="py-2 text-sm">
                Total Amount Due
              </td>
              <td className="py-2 text-sm text-right">{total_amount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div>
        <p>Make check payable to:</p>
        <p>City of St. Louis Assessor's Office</p>
      </div>
      <div className="border-t-2 border-black pt-4 mt-auto mb-4 w-48">
        <p>Shawn T. Ordway</p>
        <p>Interim Assessor</p>
      </div>
    </div>
  );
}
