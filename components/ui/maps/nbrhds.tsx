"use client";

import polygons from "../../../custom_polygons.json";

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

const getColorForPrice = (price: number): string => {
  if (price < 100000) return "#4B0082"; // Indigo
  if (price < 200000) return "#9400D3"; // Dark Violet
  if (price < 400000) return "#FF00FF"; // Magenta
  if (price < 600000) return "#FF4500"; // Orange Red
  if (price < 800000) return "#FF1493"; // Deep Pink
  return "#FF0000"; // Red
};

const test = 100;

const MapComponent = () => {
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

        {/* Render the custom polygons */}
        {polygons.features.map((feature, index) => (
          <Polygon
            key={index}
            //@ts-ignore
            positions={feature.coordinates}
            color={feature.id[0] <= test ? "red" : "blue"}
            weight={1}
            fillOpacity={feature.id[0] <= test ? 1 : 0.2}
          >
            <Tooltip>{feature.id}</Tooltip>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
