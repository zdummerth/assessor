"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  Circle,
  GeoJSON,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Define tile layer options
const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  CartoDB_Light:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  CartoDB_Dark:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
};

const getColorForPrice = (price: number): string => {
  if (price < 100000) return "#4B0082"; // Indigo
  if (price < 200000) return "#9400D3"; // Dark Violet
  if (price < 400000) return "#FF00FF"; // Magenta
  if (price < 600000) return "#FF4500"; // Orange Red
  if (price < 800000) return "#FF1493"; // Deep Pink
  return "#FF0000"; // Red
};

const MapComponent = ({
  points,
  neighborhoods,
}: {
  points: any;
  neighborhoods?: {
    neighborhood: number;
    polygon: number[];
    group: number;
  }[];
}) => {
  const startingPosition: [number, number] = points[0]
    ? [points[0].lat, points[0].long]
    : [38.62651237193593, -90.19960005817383];

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
        center={startingPosition}
        zoom={12}
        style={{
          height: "80vh",
          width: "100%",
        }}
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

        {neighborhoods &&
          neighborhoods.map((n: any) => (
            <Polygon
              key={n.neighborhood}
              //@ts-ignore
              positions={n.polygon}
              color="orange"
              weight={1}
              fillOpacity={0.1}
              // fillColor={getColorForRatio(n.medianRatio)}
              fillColor="orange"
            >
              <Popup>
                <div>
                  <h2 className="text-2xl text-center">{n.neighborhood}</h2>
                  {/* <p>Median Ratio: {n.medianRatio.toFixed(5)}</p>
                        <p>Mean Ratio: {n.meanRatio.toFixed(5)}</p>
                        <p>Number of Sales: {n.count}</p> */}
                  {/* <SalesCharts data={n.ratios} width="300px" height="300px" /> */}
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Render the points on top of the GeoJSON layer */}
        {points.map((point: any, index: number) => (
          <Circle
            key={index}
            center={[point.lat, point.long]}
            pathOptions={{ color: "orange" }}
            radius={4}
          >
            <Popup>
              <div>
                <Link
                  href={`/parcels/${point.parcel_number}`}
                  key={point.parcel_number}
                  className="border border-gray-200 rounded-lg shadow-sm shadow-foreground"
                  target="_blank"
                >
                  {point.parcel_number}
                </Link>
                <p>Address: {point.address}</p>
                <p>Neighborhood: {point.neighborhood}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
