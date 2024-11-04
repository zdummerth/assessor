import { Suspense } from "react";
import SalesCharts from "@/components/ui/sales-charts";
import SalesFilters from "@/components/ui/filters-sales";
import { getFilteredData } from "@/lib/data";
import { getMedian, getMean } from "../lib";

export default async function ChartsPage({
  searchParams,
}: {
  searchParams?: {
    nbrhdcode?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );
  const { data, error } = await getFilteredData({
    filters: formattedSearchParams,
    selectString: "net_selling_price, aprtotal_2024",
    table: "unjoined_sales",
    // sortColumn: "price",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const netSellingPrices = data.map((item: any) => item.net_selling_price);
  const aprTotals = data.map((item: any) => item.aprtotal_2024);
  const ratios = data.map(
    (item: any) => item.aprtotal_2024 / item.net_selling_price
  );

  const medianNetSellingPrice = getMedian(netSellingPrices);
  const medianAprTotal = getMedian(aprTotals);
  const medianRatio = getMedian(ratios);
  const meanNetSellingPrice = getMean(netSellingPrices);
  const meanAprTotal = getMean(aprTotals);
  const meanRatio = getMean(ratios);

  return (
    <div className="w-full">
      <h2 className="text-lg mb-4">Filters</h2>
      <SalesFilters
        count={data.length}
        currentFilters={formattedSearchParams}
      />
      <h2 className="text-lg my-4">Stats</h2>
      <div className="flex">
        <span className="p-2 border border-forground rounded-md">
          Number of Sales: {data.length}
        </span>
        <span className="p-2 border border-forground rounded-md">
          Median Ratio: {medianRatio.toFixed(5)}
        </span>
        <span className="p-2 border border-forground rounded-md">
          Mean Ratio: {meanRatio.toFixed(5)}
        </span>
        <span className="p-2 border border-forground rounded-md">
          Median Net Selling Price: $
          {Math.round(medianNetSellingPrice).toLocaleString()}
        </span>
        <span className="p-2 border border-forground rounded-md">
          Mean Net Selling Price: $
          {Math.round(meanNetSellingPrice).toLocaleString()}
        </span>
        <span className="p-2 border border-forground rounded-md">
          Median Appraised Total: ${Math.round(medianAprTotal).toLocaleString()}
        </span>

        <span className="p-2 border border-forground rounded-md">
          Mean Appraised Value: ${Math.round(meanAprTotal).toLocaleString()}
        </span>
      </div>
      <div className="w-full">
        <SalesCharts data={ratios} />
      </div>
    </div>
  );
}
