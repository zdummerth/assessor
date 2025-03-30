import dynamic from "next/dynamic";

const NeighborhoodMap = dynamic(() => import("@/components/ui/maps/base"), {
  ssr: false,
});

export default async function ParcelSearchResultsMap({ data }: { data: any }) {
  const uniqueNeighborhoods = data.reduce((acc: any, item: any) => {
    // Use neighborhood_int as key; adjust if you prefer to use a different field.
    const key = item.neighborhood_int;
    // If the neighborhood hasn't been added yet and the item has a neighborhoods object, add it.
    if (item.neighborhoods && !acc[key]) {
      acc[key] = item.neighborhoods;
    }
    return acc;
  }, {});

  // const uniqueNeighborhoodsArray = Object.values(uniqueNeighborhoods);

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

  return (
    <div className="">
      <NeighborhoodMap
        points={points}
        //@ts-ignore
        // neighborhoods={uniqueNeighborhoodsArray}
      />
    </div>
  );
}
