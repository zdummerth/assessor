// app/test/field-reviews/reviews-with-map.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import type { FieldReviewWithDetails } from "./table-client";
import BulkStatusDialog from "../parcels/[id]/field-reviews/bulk-status-dialog";
import BulkAssignmentsDialog from "../parcels/[id]/field-reviews/bulk-assignments-dialog";

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

/** Update this type to match get_field_reviews_with_parcel_details_v2() */
export type FieldReviewWithParcelDetailsV2 = {
  field_review_id: number;
  parcel_id: number;
  block: number | null;
  lot: number | null;
  ext: number | null;

  parcel_created_at: string | null;
  parcel_retired_at: string | null;

  review_created_at: string;
  review_due_date: string | null;
  site_visited_at: string | null;

  review_type_id: number | null;
  review_type_slug: string | null;
  review_type_name: string | null;

  latest_status_hist_id: number | null;
  latest_status_set_at: string | null;
  latest_status_id: number | null;
  latest_status_name: string | null;

  status_history: any[] | null; // jsonb array
  notes: any[] | null; // jsonb array
  assignments: any[] | null; // jsonb array

  current_land_use: number | null;
  current_structures: any[] | null; // jsonb array of {structure, sections}

  address_place_id: string | null;
  address_line1: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postcode: string | null;
  address_formatted: string | null;
  address_lat: number | null;
  address_lon: number | null;

  assessor_neighborhood_id: number | null;
  assessor_neighborhood: number | null;
  cda_neighborhood: string | null;
  cda_neighborhood_id: number | null;
};

function firstLineAddress(r: FieldReviewWithParcelDetailsV2) {
  const a =
    r.address_line1 ||
    r.address_formatted ||
    [r.address_city, r.address_state, r.address_postcode]
      .filter(Boolean)
      .join(", ");
  return a || null;
}

function lastNotePreview(r: FieldReviewWithParcelDetailsV2) {
  const notes = (r.notes ?? []) as any[];
  const n = notes[0]; // your SQL orders desc; if not, swap to last
  const text = (n?.note ?? "") as string;
  if (!text) return null;
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

function structureSummary(r: FieldReviewWithParcelDetailsV2) {
  const structs = (r.current_structures ?? []) as any[];
  if (!structs.length) return "No structures";
  const secCount = structs.reduce(
    (acc, x) => acc + ((x?.sections?.length ?? 0) as number),
    0
  );
  return `${structs.length} structure${structs.length === 1 ? "" : "s"} • ${secCount} section${
    secCount === 1 ? "" : "s"
  }`;
}

function formatAssigneesInline(r: FieldReviewWithParcelDetailsV2) {
  const asg = (r.assignments ?? []) as any[];
  if (!asg.length) return "Unassigned";

  // show unique names, keep order
  const names: string[] = [];
  const seen = new Set<string>();
  for (const a of asg) {
    const emp = a?.employee;
    const label =
      emp?.last_name && emp?.first_name
        ? `${emp.last_name}, ${emp.first_name}`
        : emp?.email || `Employee ${a?.employee_id ?? "—"}`;
    if (!seen.has(label)) {
      names.push(label);
      seen.add(label);
    }
    if (names.length >= 3) break;
  }

  const uniqueCount = (() => {
    const set = new Set<string>();
    for (const a of asg) {
      const emp = a?.employee;
      const label =
        emp?.last_name && emp?.first_name
          ? `${emp.last_name}, ${emp.first_name}`
          : emp?.email || `Employee ${a?.employee_id ?? "—"}`;
      set.add(label);
    }
    return set.size;
  })();

  return uniqueCount > names.length
    ? `${names.join(" • ")} • +${uniqueCount - names.length} more`
    : names.join(" • ");
}

function assignmentRows(r: FieldReviewWithParcelDetailsV2) {
  const asg = (r.assignments ?? []) as any[];
  if (!asg.length) return [];

  // your SQL orders by lower(valid) desc already, but we’ll be safe
  return asg.map((a) => {
    const emp = a?.employee ?? {};
    const name =
      emp.last_name && emp.first_name
        ? `${emp.last_name}, ${emp.first_name}`
        : emp.email || `Employee ${a?.employee_id ?? "—"}`;
    return {
      key: String(a?.id ?? `${a?.review_id}-${a?.employee_id}-${a?.valid}`),
      name,
      email: emp.email as string | null | undefined,
      status: emp.status as string | null | undefined,
      valid: (a?.valid as string | null | undefined) ?? null, // stored as text in json
    };
  });
}

export default function ReviewsWithMap({
  reviews,
}: {
  reviews: FieldReviewWithParcelDetailsV2[];
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

  // Condensed vs expanded per-card
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set<number>()
  );

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
              onSuccess={deselectAll}
            />

            <BulkAssignmentsDialog
              reviewIds={selectedReviewIdsArray}
              revalidatePath="/test/field-reviews"
              triggerLabel="Assign Employees"
              title="Bulk Assign Employees"
              description="Assign one or more employees to all selected field reviews."
              onSuccess={deselectAll}
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
                reviews={reviews as any}
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
            const isExpanded = expandedIds.has(r.field_review_id);

            const addr = firstLineAddress(r as any);
            const notePreview = lastNotePreview(r as any);
            const statusCount = (r.status_history ?? []).length;
            const notesCount = (r.notes ?? []).length;

            const assignmentsInline = formatAssigneesInline(r);
            const asgRows = assignmentRows(r);

            // Single-line condensed text (now includes assignees)
            const condensedLine = [
              addr ? addr : null,
              r.review_type_name ? `${r.review_type_name}` : null,
              r.latest_status_name ? `${r.latest_status_name}` : null,
              r.review_due_date ? `${fmtDate(r.review_due_date)}` : null,
              assignmentsInline ? `Assignees: ${assignmentsInline}` : null,
            ]
              .filter(Boolean)
              .join(" • ");

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
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <div className="truncate font-semibold text-[11px] text-blue-700">
                            {r.parcel_id}
                          </div>

                          <div className="shrink-0 text-[10px] text-muted-foreground">
                            Review #{r.field_review_id}
                          </div>
                        </div>

                        {/* Condensed single-line view */}
                        <div className="mt-1 truncate text-[11px] text-muted-foreground">
                          {condensedLine}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpanded(r.field_review_id)}
                        className="shrink-0 inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium hover:bg-muted"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            More
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expanded full view */}
                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        {addr ? (
                          <div className="text-[11px]">
                            <span className="text-muted-foreground uppercase">
                              Address:
                            </span>{" "}
                            {addr}
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                          {r.review_type_name && (
                            <span>
                              <span className="uppercase">Type:</span>{" "}
                              {r.review_type_name}
                            </span>
                          )}
                          {r.latest_status_name && (
                            <span>
                              <span className="uppercase">Latest status:</span>{" "}
                              {r.latest_status_name}
                            </span>
                          )}
                          {r.review_due_date && (
                            <span>
                              <span className="uppercase">Due:</span>{" "}
                              {fmtDate(r.review_due_date)}
                            </span>
                          )}
                          {r.site_visited_at && (
                            <span>
                              <span className="uppercase">Visited:</span>{" "}
                              {fmtDate(r.site_visited_at)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
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
                          {r.current_land_use != null && (
                            <span>
                              <span className="uppercase">Land use:</span>{" "}
                              {r.current_land_use}
                            </span>
                          )}
                          <span>
                            <span className="uppercase">Structures:</span>{" "}
                            {structureSummary(r as any)}
                          </span>
                        </div>

                        {/* NEW: Assignments */}
                        <div className="rounded border bg-background p-2">
                          <div className="flex items-center justify-between text-[10px] font-medium">
                            <span>Assignments</span>
                            <span className="text-muted-foreground">
                              {asgRows.length}
                            </span>
                          </div>

                          {asgRows.length ? (
                            <div className="mt-2 space-y-1 text-[10px] text-muted-foreground">
                              {asgRows.slice(0, 6).map((a) => (
                                <div
                                  key={a.key}
                                  className="flex items-baseline justify-between gap-2"
                                >
                                  <div className="min-w-0 truncate">
                                    <span className="text-foreground">
                                      {a.name}
                                    </span>
                                    {a.email ? (
                                      <span className="text-muted-foreground">
                                        {" "}
                                        • {a.email}
                                      </span>
                                    ) : null}
                                    {a.status ? (
                                      <span className="text-muted-foreground">
                                        {" "}
                                        • {a.status}
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className="shrink-0 text-[10px] text-muted-foreground">
                                    {a.valid ?? "—"}
                                  </div>
                                </div>
                              ))}
                              {asgRows.length > 6 ? (
                                <div className="text-[10px]">
                                  +{asgRows.length - 6} more…
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-1 text-[10px] text-muted-foreground">
                              Unassigned
                            </div>
                          )}
                        </div>

                        {/* Status + notes preview */}
                        <div className="grid gap-2 md:grid-cols-2">
                          <div className="rounded border bg-background p-2">
                            <div className="flex items-center justify-between text-[10px] font-medium">
                              <span>Status history</span>
                              <span className="text-muted-foreground">
                                {statusCount}
                              </span>
                            </div>
                            <div className="mt-1 space-y-1 text-[10px] text-muted-foreground">
                              {(r.status_history ?? [])
                                .slice(0, 3)
                                .map((s: any) => (
                                  <div
                                    key={String(s?.id ?? Math.random())}
                                    className="truncate"
                                    title={String(s?.status_name ?? "")}
                                  >
                                    {s?.status_name ?? "—"}{" "}
                                    {s?.created_at
                                      ? `• ${fmtShortDateTime(s.created_at)}`
                                      : null}
                                  </div>
                                ))}
                              {statusCount > 3 ? (
                                <div className="text-[10px]">
                                  +{statusCount - 3} more…
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="rounded border bg-background p-2">
                            <div className="flex items-center justify-between text-[10px] font-medium">
                              <span>Notes</span>
                              <span className="text-muted-foreground">
                                {notesCount}
                              </span>
                            </div>
                            <div className="mt-1 text-[10px] text-muted-foreground">
                              {notePreview ?? "—"}
                            </div>
                          </div>
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
                    )}
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
