import { createClient } from "@/utils/supabase/server";
import FormattedDate from "../ui/formatted-date";

export default async function ParcelAppealsTable({
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
    .from("appeals")
    .select("*")
    .eq("parcel_number", parcel)
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appeals</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No appeals found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Year
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Appeal
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Type
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Before Total
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              After Total
            </th>

            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Complaint Type
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Filed
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Hearing
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Appraiser
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data
            // @ts-ignore
            .sort((a, b) =>
              b.year !== a.year
                ? // @ts-ignore
                  b.year - a.year
                : // @ts-ignore
                  b.appeal_number - a.appeal_number
            )
            .map((item: any) => (
              <tr
                key={`${item.parcel_number}-${item.appeal_number}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.year}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.appeal_number}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.appeal_type}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.status}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  ${item.before_total.toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  ${item.after_total.toLocaleString()}
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.complaint_type}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <FormattedDate date={item.filed_ts} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.hearing_ts ? (
                    <FormattedDate date={item.hearing_ts} showTime />
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.appeal_appraiser}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
