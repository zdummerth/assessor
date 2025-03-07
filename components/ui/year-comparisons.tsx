import React from "react";

const realEstateData = [
  {
    type: "Single Family",
    year2024: { total: 1000000, average: 250000 },
    year2025: { total: 1100000, average: 275000 },
  },
  {
    type: "Multi Family",
    year2024: { total: 800000, average: 200000 },
    year2025: { total: 850000, average: 212500 },
  },
  {
    type: "Condos",
    year2024: { total: 500000, average: 150000 },
    year2025: { total: 550000, average: 165000 },
  },
];

const RealEstateComparison = () => {
  // Calculate overall total sums for 2024 and 2025
  const overall2024Total = realEstateData.reduce(
    (sum, item) => sum + item.year2024.total,
    0
  );
  const overall2025Total = realEstateData.reduce(
    (sum, item) => sum + item.year2025.total,
    0
  );
  const overallPercentChange =
    ((overall2025Total - overall2024Total) / overall2024Total) * 100;

  return (
    <div className="">
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
          {realEstateData.map((item, index) => {
            const percentChange =
              ((item.year2025.total - item.year2024.total) /
                item.year2024.total) *
              100;
            return (
              <tr key={index}>
                <td className="px-4 py-2 font-medium">{item.type}</td>
                <td className="px-4 py-2">
                  ${item.year2024.total.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  ${item.year2024.average.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  ${item.year2025.total.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  ${item.year2025.average.toLocaleString()}
                </td>
                <td className="px-4 py-2">{percentChange.toFixed(2)}%</td>
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

export default RealEstateComparison;
