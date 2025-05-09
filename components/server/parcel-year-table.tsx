import { createClient } from "@/utils/supabase/server";
import FormattedDate from "@/components/ui/formatted-date";

export default async function ParcelYearTable({
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
    .from("parcel_year")
    .select("*")
    .eq("parcel_number", parcel)
    .order("year", { ascending: false });

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
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Year</th>
            <th className="px-3 py-2 text-left font-medium">Appraised Total</th>
            <th className="px-3 py-2 text-left font-medium">Tax Status</th>
            <th className="px-3 py-2 text-left font-medium">Owner</th>
            <th className="px-3 py-2 text-left font-medium">Land Use</th>
            <th className="px-3 py-2 text-left font-medium">Property Class</th>

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
              <td className="px-3 py-2 whitespace-nowrap">
                ${p.appraised_total?.toLocaleString() ?? "—"}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{p.tax_status}</td>
              {/* @ts-ignore */}
              <td className="px-3 py-2 whitespace-nowrap">{p.owner_name}</td>
              <td className="px-3 py-2 whitespace-nowrap">{p.land_use}</td>
              <td className="px-3 py-2 whitespace-nowrap">{p.prop_class}</td>

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
  );
}
