import { getFilteredData, SalesFilters } from "@/lib/data";

export default async function SalesCharts({
  filters,
}: {
  filters: SalesFilters;
}) {
  console.log(filters);
  const { data, error } = await getFilteredData({
    filters,
    selectString: "net_selling_price, date_of_sale, neighborhood_code",
    table: "unjoined_sales",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  console.log(data);

  return <div className="mt-6 flow-root"></div>;
}
