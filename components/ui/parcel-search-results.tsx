import { getFilteredData } from "@/lib/data";
import { SearchX } from "lucide-react";
import ParcelsGrid from "./parcel-grid";
import dynamic from "next/dynamic";

const NeighborhoodMap = dynamic(() => import("@/components/ui/maps/base"), {
  ssr: false,
});

export default async function ParcelSearchResults({
  query,
  filters,
  selectString,
  get_count,
  table,
  currentPage = 1,
  view,
  limit,
}: {
  query?: string;
  filters: any;
  selectString?: string;
  get_count?: boolean;
  table?: string;
  currentPage?: number;
  view: "grid" | "map";
  limit: number;
}) {
  const { data, error } = await getFilteredData({
    filters,
    sortColumn: filters.sortColumn ? filters.sortColumn[0] : "parcel_number",
    sortDirection: filters.sortDirection ? filters.sortDirection[0] : "asc",
    currentPage,
    selectString: selectString,
    get_count,
    table: table || "search_site_addresses",
    searchString: query,
    limit,
  });

  if (error && !data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const uniqueNeighborhoods = data.reduce((acc: any, item: any) => {
    // Use neighborhood_int as key; adjust if you prefer to use a different field.
    const key = item.neighborhood_int;
    // If the neighborhood hasn't been added yet and the item has a neighborhoods object, add it.
    if (item.neighborhoods && !acc[key]) {
      acc[key] = item.neighborhoods;
    }
    return acc;
  }, {});

  const uniqueNeighborhoodsArray = Object.values(uniqueNeighborhoods);

  // console.log({ uniqueNeighborhoodsArray });

  if (data.length > 0) {
    console.log(data[0]);
  }

  function bboxStringToPolygon(bboxStr: string) {
    try {
      // Parse the string to an array
      const bbox = JSON.parse(bboxStr);

      // Validate that we have an array of four numbers
      if (!Array.isArray(bbox) || bbox.length !== 4) {
        return null;
      }

      const [west, south, east, north] = bbox;

      // Create the polygon coordinates (ensuring the polygon is closed)
      const polygonCoordinates = [
        [south, west], // bottom left
        [south, east], // bottom right
        [north, east], // top right
        [north, west], // top left
        [south, west], // closing the polygon
      ];

      // Return a GeoJSON Polygon object
      return polygonCoordinates;
    } catch (error) {
      console.error("Error converting bounding box to polygon:", error);
      return null;
    }
  }

  // Example usage:
  const bboxStr = "[-90.2057734, 38.6091844, -90.2055698, 38.6093106]";
  const polygon = bboxStringToPolygon(bboxStr);
  console.log(polygon);

  let undefinedCount = 0;

  const points = data
    .filter((item: any) => {
      // Check if addresses is null, undefined, or an empty array.
      if (
        !item.addresses ||
        (Array.isArray(item.addresses) && item.addresses.length === 0)
      ) {
        undefinedCount++;
        return false;
      }
      return true;
    })
    .map((item: any) => {
      // If addresses is an array, assume we want to take the first object in the array.
      const addr = Array.isArray(item.addresses)
        ? item.addresses[0]
        : item.addresses;
      return {
        lat: addr.lat,
        long: addr.lon,
        bbox: addr.bbox,
        polygon: bboxStringToPolygon(addr.bbox),
        parcel_number: item.parcel_number,
        address: item.site_address_1,
        neighborhood: item.neighborhood_int,
      };
    });

  console.log(
    "Count of items with undefined or empty addresses:",
    undefinedCount
  );

  // console.log("points: ", points);
  if (points.length > 0) {
    console.log(points[0]);
  }

  return (
    <div className="">
      {data.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-16">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-center">
            No parcels found for search term: <strong>{query}</strong>
          </p>
        </div>
      )}
      {view === "grid" && <ParcelsGrid parcels={data} />}
      {view === "map" && (
        <NeighborhoodMap
          points={points}
          //@ts-ignore
          // neighborhoods={uniqueNeighborhoodsArray}
        />
      )}
    </div>
  );
}
