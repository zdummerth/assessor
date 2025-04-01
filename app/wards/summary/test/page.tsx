import { createClient } from "@/utils/supabase/server";

const WardSummaryTable = async () => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("wards_summary")
    .select("*")
    .neq("ward", 99);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }

  // Calculate the sum of each column for the totals row.
  const totals = data.reduce(
    (acc, row) => ({
      //   other_2024: acc.other_2024 + row.other_2024,
      residential_2024: acc.residential_2024 + row.residential_2024,
      total_2024: acc.total_2024 + row.total_2024,
      //   other_2025: acc.other_2025 + row.other_2025,
      residential_2025: acc.residential_2025 + row.residential_2025,
      total_2025: acc.total_2025 + row.total_2025,
    }),
    {
      //   other_2024: 0,
      residential_2024: 0,
      total_2024: 0,
      //   other_2025: 0,
      residential_2025: 0,
      total_2025: 0,
    }
  );

  // Calculate overall percent change based on the total values.
  const overallPercentChange = totals.total_2024
    ? ((totals.total_2025 - totals.total_2024) / totals.total_2024) * 100
    : 0;

  return (
    <div className="text-center break-before-page">
      <h2 className="text-xl font-bold mb-4">Wards Summary</h2>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2">Ward</th>
            {/* <th className="px-4 py-2">2024 Other</th> */}
            <th className="px-4 py-2">2024 Residential</th>
            <th className="px-4 py-2">2024 Total</th>
            {/* <th className="px-4 py-2">2025 Other</th> */}
            <th className="px-4 py-2">2025 Residential</th>
            <th className="px-4 py-2">2025 Total</th>
            <th className="px-4 py-2">Total % Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100">
              <td className="px-4 py-2 font-medium">{row.ward}</td>
              {/* <td className="px-4 py-2">${row.other_2024.toLocaleString()}</td> */}
              <td className="px-4 py-2">
                ${row.residential_2024.toLocaleString()}
              </td>
              <td className="px-4 py-2">${row.total_2024.toLocaleString()}</td>
              {/* <td className="px-4 py-2">${row.other_2025.toLocaleString()}</td> */}
              <td className="px-4 py-2">
                ${row.residential_2025.toLocaleString()}
              </td>
              <td className="px-4 py-2">${row.total_2025.toLocaleString()}</td>
              <td className="px-4 py-2">
                {row.total_percent_change.toFixed(2)}%
              </td>
            </tr>
          ))}
          <tr className="bg-gray-300 font-semibold">
            <td className="px-4 py-2">Totals</td>
            {/* <td className="px-4 py-2">${totals.other_2024.toLocaleString()}</td> */}
            <td className="px-4 py-2">
              ${totals.residential_2024.toLocaleString()}
            </td>
            <td className="px-4 py-2">${totals.total_2024.toLocaleString()}</td>
            {/* <td className="px-4 py-2">${totals.other_2025.toLocaleString()}</td> */}
            <td className="px-4 py-2">
              ${totals.residential_2025.toLocaleString()}
            </td>
            <td className="px-4 py-2">${totals.total_2025.toLocaleString()}</td>
            <td className="px-4 py-2">{overallPercentChange.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WardSummaryTable;
