// app/test/field-reviews/reviews-with-map.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { FieldReviewWithDetails } from "./table-client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ---------------------- Types & Helpers ---------------------- */

type MapPoint = {
  review_id: number;
  parcel_id: number;
  lat: number;
  lon: number;
  address?: string | null;
};

type UserLocation = {
  lat: number;
  lon: number;
};

const tileLayerUrl =
  "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "—";

const fmtShortDateTime = (s?: string | null) =>
  s
    ? new Date(s).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/* ---------------------- Map Effects ---------------------- */

function FitBoundsOnInit({
  points,
  userLocation,
}: {
  points: MapPoint[];
  userLocation: UserLocation | null;
}) {
  const map = useMap();
  useEffect(() => {
    const coords: [number, number][] = [];

    for (const p of points) {
      if (Number.isFinite(p.lat) && Number.isFinite(p.lon)) {
        coords.push([p.lat, p.lon]);
      }
    }

    if (userLocation) {
      if (
        Number.isFinite(userLocation.lat) &&
        Number.isFinite(userLocation.lon)
      ) {
        coords.push([userLocation.lat, userLocation.lon]);
      }
    }

    if (!coords.length) return;

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(0.2), { animate: false });
  }, [map, points, userLocation]);
  return null;
}

function FocusOnSelection({
  points,
  selectedReviewId,
}: {
  points: MapPoint[];
  selectedReviewId: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedReviewId) return;

    const point = points.find((p) => p.review_id === selectedReviewId);
    if (!point) return;

    const lat = Number(point.lat);
    const lon = Number(point.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    const targetZoom = 16; // fixed, safe zoom
    map.flyTo([lat, lon], targetZoom, { duration: 0.6 });
  }, [map, points, selectedReviewId]);

  return null;
}

function InvalidateOnResize() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);
  return null;
}

/* ---------------------- Map Component ---------------------- */

function FieldReviewsMap({
  reviews,
  selectedReviewId,
  onSelectReview,
}: {
  reviews: FieldReviewWithDetails[];
  selectedReviewId: number | null;
  onSelectReview: (reviewId: number) => void;
}) {
  const points = useMemo<MapPoint[]>(
    () =>
      reviews.reduce<MapPoint[]>((acc, r) => {
        if (r.address_lat == null || r.address_lon == null) return acc;

        const lat = Number(r.address_lat);
        const lon = Number(r.address_lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return acc;

        acc.push({
          review_id: r.field_review_id,
          parcel_id: r.parcel_id,
          lat,
          lon,
          address: r.address_line1 || r.address_formatted,
        });
        return acc;
      }, []),
    [reviews]
  );

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cityGeoJson, setCityGeoJson] = useState<any>(null);

  const startCenter: [number, number] =
    points.length &&
    Number.isFinite(points[0].lat) &&
    Number.isFinite(points[0].lon)
      ? [points[0].lat, points[0].lon]
      : [38.62651237193593, -90.19960005817383];

  // Get user's current location
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  // Load City of St. Louis boundary as GeoJSON
  useEffect(() => {
    const run = async () => {
      try {
        const resp = await fetch(
          "https://nominatim.openstreetmap.org/search?city=St%20Louis&country=United%20States&format=geojson&polygon_geojson=1"
        );
        if (!resp.ok) return;
        const data = await resp.json();
        setCityGeoJson(data);
      } catch (e) {
        console.warn("Failed to load city GeoJSON:", e);
      }
    };
    run();
  }, []);

  return (
    <MapContainer
      center={startCenter}
      zoom={12}
      className="h-full w-full rounded-md border z-0"
      scrollWheelZoom
    >
      <TileLayer
        url={tileLayerUrl}
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* City of St. Louis boundary */}
      {cityGeoJson && (
        <GeoJSON
          data={cityGeoJson}
          style={{ color: "orange", weight: 1, fillOpacity: 0.03 }}
          interactive={false}
        />
      )}

      {/* User location */}
      {userLocation &&
        Number.isFinite(userLocation.lat) &&
        Number.isFinite(userLocation.lon) && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lon]}
            pathOptions={{
              color: "#FF4081",
              fillColor: "#FF4081",
              fillOpacity: 0.9,
              weight: 2,
            }}
            radius={6}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Your Location
                </div>
                <div className="text-xs text-muted-foreground">
                  ({userLocation.lat.toFixed(5)}, {userLocation.lon.toFixed(5)})
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}

      {/* Review points */}
      {points.map((p) => {
        const isSelected = selectedReviewId === p.review_id;
        const color = isSelected ? "#00E676" : "#1F51FF";
        const radius = isSelected ? 9 : 6;

        return (
          <CircleMarker
            key={p.review_id}
            center={[p.lat, p.lon]}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: isSelected ? 3 : 2,
            }}
            radius={radius}
            eventHandlers={{
              click: () => onSelectReview(p.review_id),
            }}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Review #{p.review_id}
                </div>
                <div className="font-semibold">
                  <Link href={`/parcels/${p.parcel_id}`} target="_blank">
                    Parcel {p.parcel_id}
                  </Link>
                </div>
                {p.address && <div>{p.address}</div>}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      <FitBoundsOnInit points={points} userLocation={userLocation} />
      <FocusOnSelection points={points} selectedReviewId={selectedReviewId} />
      <InvalidateOnResize />
    </MapContainer>
  );
}

/* ---------------------- Main Component ---------------------- */

export default function ReviewsWithMap({
  reviews,
}: {
  reviews: FieldReviewWithDetails[];
}) {
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(
    reviews.length ? reviews[0].field_review_id : null
  );

  // Controls map visibility on both mobile and desktop
  const [isMapOpen, setIsMapOpen] = useState(true);

  if (!reviews.length) {
    return (
      <div className="rounded border bg-background p-4 text-sm text-muted-foreground">
        No field reviews found. Adjust your filters or search to see results.
      </div>
    );
  }

  const gridColsClass = isMapOpen
    ? "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]"
    : "md:grid-cols-1";

  return (
    <div className="space-y-2">
      {/* Map toggle (mobile + desktop) */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-medium hover:bg-muted"
        onClick={() => setIsMapOpen((v) => !v)}
      >
        <MapPin className="h-4 w-4" />
        {isMapOpen ? "Hide Map" : "Show Map"}
      </button>

      <div className={`grid gap-4 ${gridColsClass}`}>
        {/* Map column (only rendered when open) */}
        {isMapOpen && (
          <div className="space-y-2 md:h-[75vh]">
            <div className="h-64 md:h-[75vh]">
              <FieldReviewsMap
                reviews={reviews}
                selectedReviewId={selectedReviewId}
                onSelectReview={(id) => setSelectedReviewId(id)}
              />
            </div>
          </div>
        )}

        {/* Cards column - scrolls separately from map on desktop */}
        <div className="space-y-2 md:h-[75vh] md:overflow-y-auto">
          {reviews.map((r) => {
            const isSelected = selectedReviewId === r.field_review_id;
            return (
              <button
                key={r.field_review_id}
                type="button"
                disabled={isSelected}
                onClick={() => setSelectedReviewId(r.field_review_id)}
                className={`w-full rounded border px-3 py-2 text-left text-xs shadow-sm transition-colors ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-border bg-background hover:bg-muted/60"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-[11px] text-blue-700">
                    Parcel {r.parcel_id}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Review #{r.field_review_id}
                  </div>
                </div>

                {r.address_line1 || r.address_formatted ? (
                  <div className="mt-1 text-[11px]">
                    {r.address_line1 || r.address_formatted}
                  </div>
                ) : null}

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                  {r.review_type_name && (
                    <span>
                      <span className="uppercase">Type:</span>{" "}
                      {r.review_type_name}
                    </span>
                  )}
                  {r.latest_status_name && (
                    <span>
                      <span className="uppercase">Status:</span>{" "}
                      {r.latest_status_name}
                    </span>
                  )}
                  {r.review_due_date && (
                    <span>
                      <span className="uppercase">Due:</span>{" "}
                      {fmtDate(r.review_due_date)}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                  {r.assessor_neighborhood != null && (
                    <span>
                      <span className="uppercase">Assessor:</span>{" "}
                      {r.assessor_neighborhood}
                    </span>
                  )}
                  {r.cda_neighborhood && (
                    <span>
                      <span className="uppercase">CDA:</span>{" "}
                      {r.cda_neighborhood}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Link
                    href={`/test/field-reviews/${r.field_review_id}`}
                    className="text-[10px] font-medium text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View thread
                  </Link>
                  <span className="text-[10px] text-muted-foreground">
                    Created {fmtShortDateTime(r.review_created_at)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
