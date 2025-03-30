"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({
  data,
}: {
  data: { coordinates: any; parcel_number: string }[];
}) => {
  console.log("Mult poly rendered", data[0]);
  // Default center position (you may want to compute a more dynamic center)
  const defaultCenter: [number, number] = [38.6265, -90.1996];
  //   const defaultCenter: [number, number] = [-90.1996, 38.6265];

  const tileLayers = {
    OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    CartoDB_Light:
      "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    CartoDB_Dark:
      "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  };

  // State for the selected tile layer
  const [tileLayer, setTileLayer] = useState<string>(tileLayers.CartoDB_Dark);

  // State for GeoJSON data
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Fetch GeoJSON data from Nominatim
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(
          "https://nominatim.openstreetmap.org/search?city=St%20Louis&country=United%20States&format=geojson&polygon_geojson=1"
        );
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON from Nominatim:", error);
      }
    };

    fetchGeoJson();
  }, []);

  return (
    <div className="w-full relative">
      <div className="my-2">
        <label htmlFor="tileLayerSelect">Map Style: </label>
        <select
          id="tileLayerSelect"
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          className="p-[1px] rounded-md"
        >
          {Object.entries(tileLayers).map(([name, url]) => (
            <option key={name} value={url}>
              {name.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          url={tileLayer}
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Render the GeoJSON layer first, with `interactive: false` */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{ color: "blue", weight: 2, fillOpacity: 0.03 }}
            interactive={false} // Prevents GeoJSON layer from intercepting clicks
          />
        )}
        {data.map((mp, index) => {
          //   console.log("MP:", mp);
          return (
            <Polygon
              key={index}
              positions={mp.coordinates}
              pathOptions={{ color: "orange", weight: 1, fillOpacity: 0.1 }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
