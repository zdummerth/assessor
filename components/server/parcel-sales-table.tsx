import { createClient } from "@/utils/supabase/server";
import FormattedDate from "../ui/formatted-date";
import CopyToClipboard from "../copy-to-clipboard";
import Link from "next/link";

export default async function ParcelSalesTable({
  page = 1,
  parcel,
}: {
  page: number;
  parcel: string;
}) {
  const limit = 40;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();
  const { data, error } = await supabase
    // @ts-ignore
    .from("sales_parcel")
    .select("*, sales_master(*)")
    .eq("parcel_number", parcel)
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching sales data</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No sales found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Document #
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Sale Price
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Date of Sale
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Sale Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item: any) => (
            <tr key={item.sales_master.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text- flex items-center gap-2 text-sm">
                <Link
                  href={`/sales/${item.sales_master.document_number}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.sales_master.document_number}
                </Link>
                <CopyToClipboard
                  text={item.sales_master.document_number.toString()}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                ${item.sales_master.net_selling_price?.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <FormattedDate date={item.sales_master.date_of_sale} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.sales_master.sale_type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
