import dynamic from "next/dynamic";

const ParcelMap = dynamic(() => import("@/components/ui/maps/multipolygons"), {
  ssr: false,
});

export default async function MultipolygonMapWrapper({
  data,
}: {
  data: any[];
}) {
  // console.log("Data:", data);

  function flipCoordinatesInGeometry(geometry: any) {
    // Check if geometry exists and has coordinates
    if (!geometry || !geometry.coordinates) {
      console.warn("Invalid geometry object:", geometry);
      return geometry;
    }

    // Recursive helper function to flip coordinates
    function flip(coords: any) {
      // If coords is a coordinate pair (an array of numbers), swap them
      if (Array.isArray(coords) && typeof coords[0] === "number") {
        return [coords[1], coords[0]];
      }
      // Otherwise, map over the array recursively
      return coords.map(flip);
    }

    return {
      ...geometry,
      coordinates: flip(geometry.coordinates),
    };
  }

  const coordinates = data
    .filter((parcel: any) => !!parcel.geometry)
    .map((parcel: any) => {
      const json = JSON.parse(parcel.geometry);
      const flippedGeometry = flipCoordinatesInGeometry(json);
      //   console.log("Flipped Geometry:", flippedGeometry.coordinates[0][0]);
      //   console.log("JSON:", json);
      return {
        coordinates: json?.coordinates,
        parcel_number: parcel.parcel_number,
      };
    });
  console.log("Coordinates:", coordinates);
  // filter out parcels with no coordinates

  return (
    <div className="w-full flex">
      <div className="w-full flex items-center justify-center mb-4">
        <ParcelMap data={coordinates} />
      </div>
    </div>
  );
}
