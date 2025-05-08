import { createClient } from "@/utils/supabase/server";
import FormattedDate from "../ui/formatted-date";
import Address from "../ui/address";
import Link from "next/link";
import ParcelNumber from "../ui/parcel-number";
export default async function Comparables({
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
    .from("comparables")
    .select("*")
    .eq("subject_parcel", parcel)
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching comparables</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Parcel #
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Address
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Neighborhood
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Condition
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              GLA
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Construction
            </th>

            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Sale Price
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Date of Sale
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Gower Dist
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Touched
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <ParcelNumber parcelNumber={item.parcel_number} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <Address address={item.address} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.neighborhood}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.condition}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.gla}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.construction_type}
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                ${item.net_selling_price?.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <FormattedDate date={item.date_of_sale} />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.gower_dist?.toFixed(2)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.touched}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
