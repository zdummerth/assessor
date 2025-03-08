import React from "react";
import wardGroupsData from "@/public/data/by_ward_groups.json";

export interface WardGroupData {
  ward: number;
  property_type: string;
  year: number;
  count: number;
  average_appraised_value: number;
  total_appraised_value: number;
}

const WardsSummaryCombined: React.FC = () => {
  const data = wardGroupsData as WardGroupData[];

  // Get a sorted list of unique ward numbers
  const uniqueWards = Array.from(new Set(data.map((item) => item.ward)))
    .sort((a, b) => a - b)
    .filter((x) => x !== 99); // Filter out ward 99

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 font-semibold">Ward</th>
            <th className="px-4 py-2 font-semibold">Commercial 2024</th>
            <th className="px-4 py-2 font-semibold">Commercial 2025</th>
            <th className="px-4 py-2 font-semibold">Residential 2024</th>
            <th className="px-4 py-2 font-semibold">Residential 2025</th>
            <th className="px-4 py-2 font-semibold">Total 2024</th>
            <th className="px-4 py-2 font-semibold">Total 2025</th>
            <th className="px-4 py-2 font-semibold">Percent Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {uniqueWards.map((ward) => {
            // For year 2024: sum Commercial values and non-Commercial as Residential
            const commercial2024 = data
              .filter(
                (d) =>
                  d.ward === ward &&
                  d.year === 2024 &&
                  d.property_type === "Commercial"
              )
              .reduce((sum, cur) => sum + cur.total_appraised_value, 0);
            const residential2024 = data
              .filter(
                (d) =>
                  d.ward === ward &&
                  d.year === 2024 &&
                  d.property_type !== "Commercial"
              )
              .reduce((sum, cur) => sum + cur.total_appraised_value, 0);
            const total2024 = commercial2024 + residential2024;

            // For year 2025: sum Commercial values and non-Commercial as Residential
            const commercial2025 = data
              .filter(
                (d) =>
                  d.ward === ward &&
                  d.year === 2025 &&
                  d.property_type === "Commercial"
              )
              .reduce((sum, cur) => sum + cur.total_appraised_value, 0);
            const residential2025 = data
              .filter(
                (d) =>
                  d.ward === ward &&
                  d.year === 2025 &&
                  d.property_type !== "Commercial"
              )
              .reduce((sum, cur) => sum + cur.total_appraised_value, 0);
            const total2025 = commercial2025 + residential2025;

            // Calculate percent change between overall totals for 2024 and 2025
            const percentChange =
              total2024 !== 0 ? ((total2025 - total2024) / total2024) * 100 : 0;

            return (
              <tr key={ward}>
                <td className="px-4 py-2 font-medium">{ward}</td>
                <td className="px-4 py-2">
                  {commercial2024 > 0
                    ? `$${commercial2024.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {commercial2025 > 0
                    ? `$${commercial2025.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {residential2024 > 0
                    ? `$${residential2024.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {residential2025 > 0
                    ? `$${residential2025.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {total2024 > 0 ? `$${total2024.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-2">
                  {total2025 > 0 ? `$${total2025.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-2">
                  {total2024 > 0 ? `${percentChange.toFixed(2)}%` : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WardsSummaryCombined;
