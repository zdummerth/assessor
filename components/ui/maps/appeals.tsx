"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  GeoJSON,
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

const getColorForPrice = (total_difference: number): string => {
  if (total_difference < 100000) return "#4B0082"; // Indigo
  if (total_difference < 200000) return "#9400D3"; // Dark Violet
  if (total_difference < 400000) return "#FF00FF"; // Magenta
  if (total_difference < 600000) return "#FF4500"; // Orange Red
  if (total_difference < 800000) return "#FF1493"; // Deep Pink
  return "#FF0000"; // Red
};

const MapComponent = ({ points }: { points: any }) => {
  const position: [number, number] = [38.62651237193593, -90.19960005817383]; // Center of St. Louis

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

        {/* Render the GeoJSON layer first, with `interactive: false` */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{ color: "blue", weight: 2, fillOpacity: 0.03 }}
            interactive={false} // Prevents GeoJSON layer from intercepting clicks
          />
        )}

        {/* Render the points on top of the GeoJSON layer */}
        {points.map((point: any, index: number) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.long]}
            pathOptions={{
              //   color: getColorForPrice(point.total_difference),
              color: "#FF0000",
            }}
            radius={3}
          >
            <Popup>
              <div>
                <p>Parcel Number: {point.parcel_number}</p>
                <p>Appeal Number: {point.appeal_number}</p>
                <p>Status: {point.status_code}</p>
                <p>Case Year: {point.case_year}</p>
                <p>Appraiser: {point.appraiser}</p>
                <p>
                  Total Difference: ${point.total_difference.toLocaleString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
