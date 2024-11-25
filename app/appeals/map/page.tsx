// import BaseMap from "@/components/ui/maps/base";
import { getFilteredData } from "@/lib/data";
import dynamic from "next/dynamic";
import SalesFilters from "@/components/ui/filters-sales";

const BaseMap = dynamic(() => import("@/components/ui/maps/appeals"), {
  ssr: false,
});

export default async function AppealsMapPage({
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

  console.log(filters);

  const { data, error } = await getFilteredData({
    filters: filters,
    selectString:
      "appeal_number, status_code, appraiser, case_year, parcel_number, total_difference, lat, long",
    table: "appeals",
    // sortColumn: "price",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  // console.log(data);

  return (
    <div className="w-full">
      {/* <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden"> */}
      <SalesFilters count={data.length} currentFilters={filters} />
      <div className="relative z-0 mt-4">
        <BaseMap points={data} />
      </div>
    </div>
  );
}
