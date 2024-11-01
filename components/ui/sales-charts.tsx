import { getFilteredData, SalesFilters } from "@/lib/data";
import BarChart from "./charts/bar";

export default async function SalesCharts({
  filters,
}: {
  filters: SalesFilters;
}) {
  console.log(filters);
  const { data, error } = await getFilteredData({
    filters,
    selectString: "neighborhood_code, net_selling_price.avg()",
    table: "unjoined_sales",
    // sortColumn: "price",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  console.log(data);
  const chartData = [
    ["Neighborhood", "Average Net Selling Price"],
    ...data
      .map((row: any) => [
        row.neighborhood_code,
        parseFloat(row.avg.toFixed(0)),
      ])
      .sort((a: any, b: any) => b[1] - a[1]),
  ];

  console.log(chartData);

  return (
    <div className="mt-6 flow-root">
      <BarChart data={chartData} />
    </div>
  );
}
