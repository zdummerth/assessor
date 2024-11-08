"use client";

// import polygons from "../../../custom_polygons.json";
import SalesCharts from "@/components/ui/sales-charts";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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

const MapComponent = ({
  data,
  onPolygonClick,
}: {
  data: any;
  onPolygonClick: (key: string) => void;
}) => {
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
            key={n.nbrhd}
            positions={n.polygon}
            color="orange"
            weight={1}
            fillOpacity={0.4}
            fillColor={getColorForRatio(n.medianRatio)}
            eventHandlers={{
              click: () => {
                onPolygonClick(n.nbrhd); // Call the callback with the key
              },
            }}
          ></Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

function ExternalStateExample({ data }: { data: any }) {
  const [clickedPolygonKey, setClickedPolygonKey] = useState<string | null>(
    null
  );

  const handlePolygonClick = (key: string) => {
    setClickedPolygonKey(key);
  };

  const dataForClickedPolygon = useMemo(() => {
    if (!clickedPolygonKey) return null;

    const clickedPolygon = data.find((n: any) => n.nbrhd === clickedPolygonKey);

    return clickedPolygon;
  }, [clickedPolygonKey]);

  const displayMap = useMemo(
    () => <MapComponent data={data} onPolygonClick={handlePolygonClick} />,
    []
  );

  return (
    <div className="relative">
      {clickedPolygonKey && dataForClickedPolygon ? (
        <div className="absolute -top-8 right-0 z-50 bg-background w-1/3 p-2 rounded border border-foreground">
          <h2 className="text-xl font-bold">
            Sales Ratios for Neighborhood {clickedPolygonKey}
          </h2>
          <p>Number of Sales: {dataForClickedPolygon.count}</p>
          <p>Median Ratio: {dataForClickedPolygon.medianRatio}</p>
          <p>Mean Ratio: {dataForClickedPolygon.meanRatio}</p>
          <p>Median Sale Price: {dataForClickedPolygon.medianSalePrice}</p>
          <p>Mean Sale Price: {dataForClickedPolygon.meanSalePrice}</p>
          {dataForClickedPolygon.ratios.length > 1 && (
            <SalesCharts data={dataForClickedPolygon.ratios} height="100%" />
          )}
        </div>
      ) : null}

      <div className="relative z-0">{displayMap}</div>
    </div>
  );
}

export default ExternalStateExample;
