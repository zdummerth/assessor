import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";
import { createClient } from "@/utils/supabase/server";

import wardGroups from "@/public/data/by_ward_groups.json";

const WardsList: React.FC = async () => {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("wards_detail")
    .select("*")
    .neq("ward", 99);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }

  console.log("Fetched data:", data);
  return (
    <div className="container mx-auto p-4">
      {wardGroups.map((ward, index) => {
        return (
          <div
            key={index}
            // className={`mb-8 ${index == wardGroups.length - 1 ? "break-before-page" : ""}`}
            className="mb-8 break-before-page"
          >
            <Image
              src={stlSeal}
              alt="St. Louis City Seal"
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-bold my-4 text-center">
              Ward {ward.ward}
            </h1>
            <WardComparison key={index} ward={ward} />
          </div>
        );
      })}
    </div>
  );
};

const propertyTypes = [
  { key: "commercial", label: "Commercial" },
  { key: "condo", label: "Condos" },
  { key: "multi_family", label: "Multi Family" },
  { key: "other_residential", label: "Other Residential" },
  { key: "single_family", label: "Single Family" },
];

const WardComparison = ({ ward }: any) => {
  // Build rows for each property type using keys from the ward data.
  const rows = propertyTypes.map((pt) => {
    const total2024 = ward[`total_appraised_value_2024_${pt.key}`];
    const total2025 = ward[`total_appraised_value_2025_${pt.key}`];
    const avg2024 = ward[`avg_appraised_value_2024_${pt.key}`];
    const avg2025 = ward[`avg_appraised_value_2025_${pt.key}`];
    const percentChange = ward[`${pt.key}_percent_change`]
      ? ward[`${pt.key}_percent_change`] * 100
      : 0;

    return {
      type: pt.label,
      total2024,
      avg2024,
      total2025,
      avg2025,
      percentChange,
    };
  });

  // Calculate overall totals for the ward
  const overall2024Total = rows.reduce((sum, row) => sum + row.total2024, 0);
  const overall2025Total = rows.reduce((sum, row) => sum + row.total2025, 0);
  const overallPercentChange =
    ((overall2025Total - overall2024Total) / overall2024Total) * 100;

  return (
    <div className="mb-8 text-center">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 font-semibold">Property Type</th>
            <th className="px-4 py-2 font-semibold">2024 Total Value</th>
            <th className="px-4 py-2 font-semibold">2024 Average Value</th>
            <th className="px-4 py-2 font-semibold">2025 Total Value</th>
            <th className="px-4 py-2 font-semibold">2025 Average Value</th>
            <th className="px-4 py-2 font-semibold">Total % Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="px-4 py-2 font-medium">{row.type}</td>
              <td className="px-4 py-2">${row.total2024.toLocaleString()}</td>
              <td className="px-4 py-2">
                ${Math.round(row.avg2024).toLocaleString()}
              </td>
              <td className="px-4 py-2">${row.total2025.toLocaleString()}</td>
              <td className="px-4 py-2">
                ${Math.round(row.avg2025).toLocaleString()}
              </td>
              <td className="px-4 py-2">{row.percentChange.toFixed(2)}%</td>
            </tr>
          ))}
          <tr className="bg-gray-200 font-semibold">
            <td className="px-4 py-2">Overall Totals</td>
            <td className="px-4 py-2">${overall2024Total.toLocaleString()}</td>
            <td className="px-4 py-2">-</td>
            <td className="px-4 py-2">${overall2025Total.toLocaleString()}</td>
            <td className="px-4 py-2">-</td>
            <td className="px-4 py-2">{overallPercentChange.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WardsList;
