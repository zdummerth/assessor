"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define tile layer options
const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  CartoDB_Light:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  CartoDB_Dark:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
};

const MapComponent = ({ lat, lon }: { lat: number; lon: number }) => {
  const position: [number, number] = [lat, lon];

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
      <MapContainer
        center={position}
        zoom={11.25}
        style={{
          height: "300px",
          width: "300px",
        }}
      >
        <TileLayer
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
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
        <CircleMarker
          center={[lat, lon]}
          pathOptions={{
            color: "blue",
          }}
          radius={3}
        ></CircleMarker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
