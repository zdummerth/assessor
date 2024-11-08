// import BaseMap from "@/components/ui/maps/base";
import { getFilteredData, getNeighborhoods } from "@/lib/data";
import dynamic from "next/dynamic";
import SalesFilters from "@/components/ui/filters-sales";
import { getMedian, getMean } from "@/app/sales/lib";

const NbrhdMap = dynamic(() => import("@/components/ui/maps/nbrhds"), {
  ssr: false,
});

export default async function SalesMapPage({
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

  // console.log(filters);

  const { data, error } = await getFilteredData({
    filters: filters,
    selectString:
      "neighborhood_code, net_selling_price, aprtotal_2024, occupancy",
    table: "unjoined_sales",
    // sortColumn: "price",
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const formattedData = data.map((item: any) => ({
    ...item,
    neighborhood_code: parseInt(item.neighborhood_code.slice(1, 4)),
  }));

  // group data by neighborhood_code
  const groupedData = formattedData.reduce((acc: any, item: any) => {
    if (!acc[item.neighborhood_code]) {
      acc[item.neighborhood_code] = [];
    }
    acc[item.neighborhood_code].push(item);
    return acc;
  }, {});

  // console.log(groupedData);

  const uniqueNeighbohoodCodes: number[] = Array.from(
    new Set(formattedData.map((item: any) => item.neighborhood_code))
  );

  const { data: nData, error: nError } = await getNeighborhoods({
    neighborhoods: uniqueNeighbohoodCodes,
  });

  if (!nData) {
    console.error(nError);
    return <div>Failed to fetch neighborhood data</div>;
  }

  // const ratios = data.map(
  //   (item: any) => item.aprtotal_2024 / item.net_selling_price
  // );
  // const medianRatio = getMedian(ratios);

  // get ratios by neighborhood
  const ratiosByNeighborhood = Object.entries(groupedData).map(
    ([nbrhd, sales]: [string, any]) => {
      const ratios = sales.map(
        (item: any) => item.aprtotal_2024 / item.net_selling_price
      );
      return {
        nbrhd,
        medianRatio: getMedian(ratios),
        meanRatio: getMean(ratios),
        ratios,
        count: sales.length,
      };
    }
  );

  // console.log(ratiosByNeighborhood);

  const neighborHoodsWithPolygon = ratiosByNeighborhood.map((nbrhd) => {
    const neighborhood = nData.find(
      (n: any) => n.neighborhood === parseInt(nbrhd.nbrhd)
    );
    return {
      ...nbrhd,
      // ...neighborhood,
      polygon: neighborhood?.polygon,
    };
  });

  // console.log(neighborHoodsWithPolygon);

  return (
    <div className="w-full">
      {/* <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden"> */}
      {/* <SalesFilters count={data.length} currentFilters={filters} /> */}
      <div className="relative z-0 mt-4">
        <NbrhdMap data={neighborHoodsWithPolygon} />
      </div>
    </div>
  );
}
