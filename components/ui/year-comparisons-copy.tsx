import React from "react";

export interface WardGroupData {
  ward: number;
  property_type: string;
  year: number;
  count: number;
  average_appraised_value: number;
  total_appraised_value: number;
}

interface RealEstateData {
  type: string;
  year2024: {
    total: number;
    average: number;
  } | null;
  year2025: {
    total: number;
    average: number;
  } | null;
}

interface WardDataTableProps {
  ward: number;
  data: WardGroupData[];
}

const WardDataTable: React.FC<WardDataTableProps> = ({ ward, data }) => {
  // Data is passed in via props; filter data for the current ward (in case it's not pre-filtered)
  const dataForWard = data.filter((item) => item.ward === ward);

  // Group the records by property type and separate into 2024 and 2025 data
  const grouped = dataForWard.reduce<
    Record<string, { year2024?: WardGroupData; year2025?: WardGroupData }>
  >((acc, item) => {
    const type = item.property_type;
    if (!acc[type]) {
      acc[type] = {};
    }
    if (item.year === 2024) {
      acc[type].year2024 = item;
    } else if (item.year === 2025) {
      acc[type].year2025 = item;
    }
    return acc;
  }, {});

  // Transform the grouped data into an array of display objects
  const realEstateData: RealEstateData[] = Object.entries(grouped).map(
    ([type, records]) => ({
      type,
      year2024: records.year2024
        ? {
            total: records.year2024.total_appraised_value,
            average: records.year2024.average_appraised_value,
          }
        : null,
      year2025: records.year2025
        ? {
            total: records.year2025.total_appraised_value,
            average: records.year2025.average_appraised_value,
          }
        : null,
    })
  );

  // Calculate overall totals for 2024 and 2025
  const overall2024Total = realEstateData.reduce(
    (sum, item) => sum + (item.year2024 ? item.year2024.total : 0),
    0
  );
  const overall2025Total = realEstateData.reduce(
    (sum, item) => sum + (item.year2025 ? item.year2025.total : 0),
    0
  );
  const overallPercentChange =
    overall2024Total !== 0
      ? ((overall2025Total - overall2024Total) / overall2024Total) * 100
      : 0;

  return (
    <div className="">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden text-center">
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
          {realEstateData.map((item, index) => {
            const year2024Total = item.year2024 ? item.year2024.total : 0;
            const year2025Total = item.year2025 ? item.year2025.total : 0;
            const percentChange =
              year2024Total !== 0
                ? ((year2025Total - year2024Total) / year2024Total) * 100
                : 0;
            return (
              <tr key={index}>
                <td className="px-4 py-2 font-medium">{item.type}</td>
                <td className="px-4 py-2">
                  {item.year2024
                    ? `$${item.year2024.total.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.year2024
                    ? `$${item.year2024.average.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.year2025
                    ? `$${item.year2025.total.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.year2025
                    ? `$${item.year2025.average.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.year2024 ? `${percentChange.toFixed(2)}%` : "-"}
                </td>
              </tr>
            );
          })}
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

export default WardDataTable;
