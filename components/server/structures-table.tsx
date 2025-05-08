import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "../ui/parcel-number";

export default async function StructuresTable({
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
    .from("structures")
    .select("*")
    .eq("parcel_number", parcel)
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching structures</p>
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
              CDU
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Year
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Year Built
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Grade
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Story
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Cost Group
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              EA
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              GLA
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Total Area
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
                {item.cdu}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.year}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.year_built}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.grade}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.story}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {item.cost_group}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{item.ea}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.gla}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {item.total_area}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
