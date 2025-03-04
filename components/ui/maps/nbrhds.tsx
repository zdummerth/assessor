"use client";

// import polygons from "../../../custom_polygons.json";
// import SalesCharts from "@/components/ui/sales-charts";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  GeoJSON,
  Marker,
  Polygon,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define tile layer options
const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  CartoDB_Light:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  CartoDB_Dark:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
};

const getColorForRatio = (ratio: number): string => {
  if (ratio < 0.5) return "#FF0000"; // Red
  if (ratio < 0.75) return "#FF4500"; // Orange Red
  if (ratio < 0.9) return "#FFA500"; // Orange
  if (ratio < 1.1) return "#32CD32"; // Lime Green
  if (ratio < 1.25) return "#FFA500"; // Orange
  if (ratio < 1.5) return "#FF4500"; // Orange Red
  return "#FF0000"; // Red
};

const NeighborhoodMap = ({ data }: { data: any }) => {
  const position: [number, number] = [38.62651237193593, -90.19960005817383]; // Center of St. Louis

  // State for the selected tile layer
  const [tileLayer, setTileLayer] = useState<string>(tileLayers.CartoDB_Dark);

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
        center={position}
        zoom={11.25}
        style={{
          height: "80vh",
          width: "100%",
        }}
      >
        <TileLayer
          url={tileLayer}
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {data.map((n: any) => (
          <Polygon
            key={n.neighborhood}
            //@ts-ignore
            positions={n.polygon}
            color="orange"
            weight={1}
            fillOpacity={0.4}
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
      </MapContainer>
    </div>
  );
};

export default NeighborhoodMap;
