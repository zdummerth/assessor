// app/test/field-reviews/reviews-with-map.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { FieldReviewWithDetails } from "./table-client";
import BulkStatusDialog from "../parcels/[id]/field-reviews/bulk-status-dialog";

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

    if (
      userLocation &&
      Number.isFinite(userLocation.lat) &&
      Number.isFinite(userLocation.lon)
    ) {
      coords.push([userLocation.lat, userLocation.lon]);
    }

    if (!coords.length) return;

    // a little further out by default
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(0.35), { animate: false });
  }, [map, points, userLocation]);
  return null;
}

function FitBoundsOnSelected({
  points,
  selectedReviewIds,
}: {
  points: MapPoint[];
  selectedReviewIds: number[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedReviewIds.length) return;

    const set = new Set(selectedReviewIds);
    const coords: [number, number][] = [];

    for (const p of points) {
      if (!set.has(p.review_id)) continue;
      if (Number.isFinite(p.lat) && Number.isFinite(p.lon)) {
        coords.push([p.lat, p.lon]);
      }
    }

    if (!coords.length) return;

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(0.25), { animate: true });
  }, [map, points, selectedReviewIds.join(",")]);

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
  selectedReviewIds,
  onToggleSelectedFromMap,
}: {
  reviews: FieldReviewWithDetails[];
  selectedReviewIds: number[];
  onToggleSelectedFromMap: (reviewId: number) => void;
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

  // default zoom a bit further out
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
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Load City boundary as GeoJSON
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

  const selectedSet = useMemo(
    () => new Set(selectedReviewIds),
    [selectedReviewIds]
  );

  return (
    <MapContainer
      center={startCenter}
      zoom={11} // further out than before
      className="h-full w-full rounded-md border z-0"
      scrollWheelZoom
    >
      <TileLayer
        url={tileLayerUrl}
        attribution="&copy; OpenStreetMap contributors"
      />

      {cityGeoJson && (
        <GeoJSON
          data={cityGeoJson}
          style={{ color: "orange", weight: 1, fillOpacity: 0.03 }}
          interactive={false}
        />
      )}

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
        const isChecked = selectedSet.has(p.review_id);

        // checked vs unchecked
        const color = isChecked ? "#FF9800" : "#1F51FF";
        const radius = isChecked ? 8 : 6;

        return (
          <CircleMarker
            key={p.review_id}
            center={[p.lat, p.lon]}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: isChecked ? 3 : 2,
            }}
            radius={radius}
            eventHandlers={{
              // optional: clicking a marker toggles selection
              click: () => onToggleSelectedFromMap(p.review_id),
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
      <FitBoundsOnSelected
        points={points}
        selectedReviewIds={selectedReviewIds}
      />
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
  // Multi-select (checkboxes)
  const [selectedReviewIds, setSelectedReviewIds] = useState<Set<number>>(
    () => new Set<number>()
  );

  const toggleSelected = (id: number) => {
    setSelectedReviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedReviewIds(new Set(reviews.map((r) => r.field_review_id)));
  };

  const deselectAll = () => setSelectedReviewIds(new Set());

  const selectedCount = selectedReviewIds.size;

  const selectedReviewIdsArray = useMemo(
    () => Array.from(selectedReviewIds),
    [selectedReviewIds]
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
      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-medium hover:bg-muted"
          onClick={() => setIsMapOpen((v) => !v)}
        >
          <MapPin className="h-4 w-4" />
          {isMapOpen ? "Hide Map" : "Show Map"}
        </button>

        <button
          type="button"
          className="inline-flex items-center rounded border px-3 py-2 text-xs font-medium hover:bg-muted"
          onClick={selectAll}
          disabled={!reviews.length}
        >
          Select all
        </button>

        <button
          type="button"
          className="inline-flex items-center rounded border px-3 py-2 text-xs font-medium hover:bg-muted"
          onClick={deselectAll}
          disabled={selectedCount === 0}
        >
          Deselect all
        </button>

        <div className="ml-auto text-xs text-muted-foreground">
          {selectedCount > 0 ? `${selectedCount} selected` : null}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 rounded border bg-background/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
          <div className="font-medium">{selectedCount} selected</div>

          <div className="flex items-center gap-2">
            <BulkStatusDialog
              reviewIds={selectedReviewIdsArray}
              revalidatePath="/test/field-reviews"
              triggerLabel="Update Statuses"
              title="Bulk Update Field Review Status"
              description="Apply a status update to all selected field reviews."
            />

            <button
              type="button"
              className="inline-flex items-center rounded border px-2 py-1 text-[11px] font-medium hover:bg-muted"
              onClick={deselectAll}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className={`grid gap-4 ${gridColsClass}`}>
        {/* Map column (only rendered when open) */}
        {isMapOpen && (
          <div className="space-y-2 md:h-[75vh]">
            <div className="h-64 md:h-[75vh]">
              <FieldReviewsMap
                reviews={reviews}
                selectedReviewIds={selectedReviewIdsArray}
                onToggleSelectedFromMap={toggleSelected}
              />
            </div>
          </div>
        )}

        {/* Cards column */}
        <div className="space-y-2 md:h-[75vh] md:overflow-y-auto">
          {reviews.map((r) => {
            const isChecked = selectedReviewIds.has(r.field_review_id);

            return (
              <div
                key={r.field_review_id}
                className={`w-full rounded border px-3 py-2 text-left text-xs shadow-sm transition-colors ${
                  isChecked
                    ? "border-orange-500 bg-orange-50"
                    : "border-border bg-background hover:bg-muted/60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4"
                    checked={isChecked}
                    onChange={() => toggleSelected(r.field_review_id)}
                    aria-label={`Select review ${r.field_review_id}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="truncate font-semibold text-[11px] text-blue-700">
                        Parcel {r.parcel_id}
                      </div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">
                        Review #{r.field_review_id}
                      </div>
                    </div>

                    {r.address_line1 || r.address_formatted ? (
                      <div className="mt-1 truncate text-[11px]">
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
                      >
                        View thread
                      </Link>
                      <span className="text-[10px] text-muted-foreground">
                        Created {fmtShortDateTime(r.review_created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
