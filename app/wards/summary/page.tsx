import wardGroups from "@/public/data/by_ward_groups.json";
import { createClient } from "@/utils/supabase/server";

const WardSummaryTable = async () => {
  const supabase = createClient();

  const { error, data } = await supabase.from("wards_summary").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }

  console.log("Fetched data:", data);
  // Prepare the data rows by computing the values for each ward.
  const rows = wardGroups
    .filter((ward) => ward.ward !== 99)
    .map((ward) => {
      // For 2024
      const residential2024 =
        ward.total_appraised_value_2024_condo +
        ward.total_appraised_value_2024_multi_family +
        ward.total_appraised_value_2024_other_residential +
        ward.total_appraised_value_2024_single_family;
      const commercial2024 = ward.total_appraised_value_2024_commercial;
      const total2024 = residential2024 + commercial2024;

      // For 2025
      const residential2025 =
        ward.total_appraised_value_2025_condo +
        ward.total_appraised_value_2025_multi_family +
        ward.total_appraised_value_2025_other_residential +
        ward.total_appraised_value_2025_single_family;
      const commercial2025 = ward.total_appraised_value_2025_commercial;
      const total2025 = residential2025 + commercial2025;

      // Calculate the percent change from 2024 to 2025
      const percentChange = ((total2025 - total2024) / total2024) * 100;

      return {
        ward: ward.ward,
        residential2024,
        commercial2024,
        total2024,
        residential2025,
        commercial2025,
        total2025,
        percentChange,
      };
    });

  // Calculate totals across all wards.
  const totals = rows.reduce(
    (acc, row) => ({
      residential2024: acc.residential2024 + row.residential2024,
      commercial2024: acc.commercial2024 + row.commercial2024,
      total2024: acc.total2024 + row.total2024,
      residential2025: acc.residential2025 + row.residential2025,
      commercial2025: acc.commercial2025 + row.commercial2025,
      total2025: acc.total2025 + row.total2025,
    }),
    {
      residential2024: 0,
      commercial2024: 0,
      total2024: 0,
      residential2025: 0,
      commercial2025: 0,
      total2025: 0,
    }
  );

  const overallPercentChange =
    ((totals.total2025 - totals.total2024) / totals.total2024) * 100;

  return (
    <div className="text-center break-before-page">
      <h2 className="text-xl font-bold mb-4">Wards Summary</h2>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 font-semibold">Ward</th>
            <th className="px-4 py-2 font-semibold">2024 Residential Value</th>
            <th className="px-4 py-2 font-semibold">2024 Commercial Value</th>
            <th className="px-4 py-2 font-semibold">2024 Total Value</th>
            <th className="px-4 py-2 font-semibold">2025 Residential Value</th>
            <th className="px-4 py-2 font-semibold">2025 Commercial Value</th>
            <th className="px-4 py-2 font-semibold">2025 Total Value</th>
            <th className="px-4 py-2 font-semibold">Total % Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {rows.map((row, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100">
              <td className="px-4 py-2 font-medium">{row.ward}</td>
              <td className="px-4 py-2">
                ${row.residential2024.toLocaleString()}
              </td>
              <td className="px-4 py-2">
                ${row.commercial2024.toLocaleString()}
              </td>
              <td className="px-4 py-2">${row.total2024.toLocaleString()}</td>
              <td className="px-4 py-2">
                ${row.residential2025.toLocaleString()}
              </td>
              <td className="px-4 py-2">
                ${row.commercial2025.toLocaleString()}
              </td>
              <td className="px-4 py-2">${row.total2025.toLocaleString()}</td>
              <td className="px-4 py-2">{row.percentChange.toFixed(2)}%</td>
            </tr>
          ))}
          <tr className="bg-gray-300 font-semibold">
            <td className="px-4 py-2">Totals</td>
            <td className="px-4 py-2">
              ${totals.residential2024.toLocaleString()}
            </td>
            <td className="px-4 py-2">
              ${totals.commercial2024.toLocaleString()}
            </td>
            <td className="px-4 py-2">${totals.total2024.toLocaleString()}</td>
            <td className="px-4 py-2">
              ${totals.residential2025.toLocaleString()}
            </td>
            <td className="px-4 py-2">
              ${totals.commercial2025.toLocaleString()}
            </td>
            <td className="px-4 py-2">${totals.total2025.toLocaleString()}</td>
            <td className="px-4 py-2">{overallPercentChange.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WardSummaryTable;
