// app/components/ui/maps/CompsMapClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  Circle,
  Polyline,
  GeoJSON,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import L from "leaflet";

type MapPoint = {
  lat: number;
  long: number;
  parcel_number: number | string;
  address?: string;
  kind?: "subject" | "comp";
  sale_price?: number;
  gower_distance?: number;
};

type Neighborhood = {
  neighborhood: number | string;
  polygon: number[][][]; // array of rings; each ring is [lat, lon][] (Leaflet accepts lat-lng order)
  group?: number;
};

const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  CartoDB_Light:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  CartoDB_Dark:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
};

const colorByGower = (d?: number) => {
  if (d == null) return "#888";
  const x = Math.max(0, Math.min(1, d));
  const r = Math.round(255 * x);
  const g = Math.round(180 * (1 - x));
  const b = Math.round(60 * (1 - x));
  return `rgb(${r},${g},${b})`;
};

const radiusByPrice = (price?: number) => {
  if (!price || price <= 0) return 6;
  const r = 4 + Math.log10(Math.max(1, price)) * 2;
  return Math.max(4, Math.min(18, r));
};

const FitBounds: React.FC<{ points: MapPoint[] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.long]));
    map.fitBounds(bounds.pad(0.2), { animate: false });
  }, [map, points]);
  return null;
};

export default function CompsMapClient({
  points,
  neighborhoods,
  cityGeoJson = true,
  className = "",
  height = "10vh",
}: {
  points: MapPoint[];
  neighborhoods?: Neighborhood[];
  cityGeoJson?: boolean;
  className?: string;
  height?: string | number;
}) {
  const subject = useMemo(
    () => points.find((p) => p.kind === "subject"),
    [points]
  );
  const startCenter: [number, number] = subject
    ? [subject.lat, subject.long]
    : points.length
      ? [points[0].lat, points[0].long]
      : [38.62651237193593, -90.19960005817383];

  const [tileLayer, setTileLayer] = useState<string>(tileLayers.CartoDB_Dark);
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    if (!cityGeoJson) return;
    const run = async () => {
      try {
        const resp = await fetch(
          "https://nominatim.openstreetmap.org/search?city=St%20Louis&country=United%20States&format=geojson&polygon_geojson=1"
        );
        const data = await resp.json();
        setGeoJson(data);
      } catch (e) {
        console.warn("Failed to load city GeoJSON:", e);
      }
    };
    run();
  }, [cityGeoJson]);

  const comps = points.filter((p) => p.kind !== "subject");

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-2">
        <label
          htmlFor="tileLayerSelect"
          className="text-sm text-muted-foreground"
        >
          Map Style:
        </label>
        <select
          id="tileLayerSelect"
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          className="p-[4px] rounded-md border border-gray-300 bg-background"
        >
          {Object.entries(tileLayers).map(([name, url]) => (
            <option key={name} value={url}>
              {name.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={startCenter}
        zoom={12}
        style={{ height, width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url={tileLayer}
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {geoJson && (
          <GeoJSON
            data={geoJson}
            style={{ color: "blue", weight: 1, fillOpacity: 0.03 }}
            interactive={false}
          />
        )}

        {neighborhoods?.map((n) => (
          <Polygon
            key={String(n.neighborhood)}
            // @ts-ignore Leaflet accepts LatLngExpression[][]
            positions={n.polygon}
            color="orange"
            weight={1}
            fillOpacity={0.08}
            fillColor="orange"
          />
        ))}

        {subject && (
          <CircleMarker
            center={[subject.lat, subject.long]}
            pathOptions={{ color: "#00E676", weight: 3, fillOpacity: 0.85 }}
            radius={5}
          >
            <Popup>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Subject
                </div>
                <div className="font-semibold">
                  <Link
                    href={`/parcels/${subject.parcel_number}`}
                    target="_blank"
                  >
                    Parcel {subject.parcel_number}
                  </Link>
                </div>
                {subject.address && (
                  <div className="text-sm">{subject.address}</div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )}

        {subject &&
          comps.map((c, i) => (
            <Polyline
              key={`line-${c.parcel_number}-${i}`}
              positions={[
                [subject.lat, subject.long],
                [c.lat, c.long],
              ]}
              pathOptions={{ color: "#999", weight: 1, opacity: 0.5 }}
            />
          ))}

        {comps.map((c, i) => {
          const color = colorByGower(c.gower_distance);
          const radius = radiusByPrice(c.sale_price);
          return (
            <Circle
              key={`comp-${c.parcel_number}-${i}`}
              center={[c.lat, c.long]}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
              radius={radius}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Comparable Sale
                  </div>
                  <div className="font-semibold">
                    <Link href={`/parcels/${c.parcel_number}`} target="_blank">
                      Parcel {c.parcel_number}
                    </Link>
                  </div>
                  {c.address && <div className="text-sm">{c.address}</div>}
                  {typeof c.sale_price === "number" && (
                    <div className="text-sm">
                      Price:{" "}
                      <span className="font-medium">
                        {c.sale_price.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  )}
                  {typeof c.gower_distance === "number" && (
                    <div className="text-sm">
                      Gower:{" "}
                      <span className="font-medium">
                        {c.gower_distance.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}

        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
