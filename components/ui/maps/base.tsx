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

const getColorForPrice = (price: number): string => {
  if (price < 100000) return "#4B0082"; // Indigo
  if (price < 200000) return "#9400D3"; // Dark Violet
  if (price < 400000) return "#FF00FF"; // Magenta
  if (price < 600000) return "#FF4500"; // Orange Red
  if (price < 800000) return "#FF1493"; // Deep Pink
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
    <div className="w-full">
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="tileLayerSelect">Choose Map Style: </label>
        <select
          id="tileLayerSelect"
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
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
        zoom={13}
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

        {/* Render the points on top of the GeoJSON layer */}
        {points.map((point: any, index: number) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.long]}
            pathOptions={{
              color: getColorForPrice(point.net_selling_price),
            }}
            radius={5}
          >
            <Popup>
              <div>
                <p>Parcel Number: {point.parcel_number}</p>
                <p>Neighborhood Code: {point.neighborhood_code}</p>
                <p>Occupancy: {point.occupancy}</p>
                <p>Sale Type: {point.sale_type}</p>
                <p>
                  Net Selling Price: ${point.net_selling_price.toLocaleString()}
                </p>
                <p>Date of Sale: {point.date_of_sale}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
