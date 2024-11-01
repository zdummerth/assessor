// import BaseMap from "@/components/ui/maps/base";
import { getFilteredData } from "@/lib/data";
import dynamic from "next/dynamic";
import SalesFilters from "@/components/ui/filters-sales";

const BaseMap = dynamic(() => import("@/components/ui/maps/base"), {
  ssr: false,
});

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

  const filters = {
    ...formattedSearchParams,
    with_coords: true,
  };

  const { data, error } = await getFilteredData({
    filters: filters,
    selectString:
      "neighborhood_code, net_selling_price, date_of_sale, parcel_number, occupancy, sale_type, lat, long",
    table: "unjoined_sales",
    // sortColumn: "price",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  console.log(data);

  return (
    <div className="w-full flex gap-4">
      <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden">
        <SalesFilters />
      </div>
      <BaseMap points={data} />
    </div>
  );
}
