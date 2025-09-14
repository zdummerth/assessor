"use client";

import { useMemo, useState, useEffect } from "react";
import CompsCardList from "@/components/parcel-comparables/client-cards";
import { useComps } from "@/lib/client-queries";
import CompsMapClientWrapper from "@/components/ui/maps/comps-map-client-wrapper";

type Filters = {
  md: number;
  band: number;
  same_lu: boolean;
  w_lu: number;
  w_dist: number;
  w_lat: number;
  w_lon: number;
  w_cond: number;
};

export default function ParcelCompsControls({
  parcelId,
  defaults,
  /**
   * Optional: change this value to force-reset the form/applied state
   * when you intentionally want to re-apply new defaults.
   * e.g. defaultsKey={runId} or defaultsKey={`${parcelId}-${profileId}`}
   */
  defaultsKey,
}: {
  parcelId: number;
  defaults?: Partial<Filters>;
  defaultsKey?: string | number;
}) {
  // Build initial defaults exactly once (lazy initializer), so we don't loop
  const [form, setForm] = useState<Filters>(() => ({
    md: defaults?.md ?? 2,
    band: defaults?.band ?? 500,
    same_lu: defaults?.same_lu ?? true,
    w_lu: defaults?.w_lu ?? 5,
    w_dist: defaults?.w_dist ?? 4,
    w_lat: defaults?.w_lat ?? 3,
    w_lon: defaults?.w_lon ?? 3,
    w_cond: defaults?.w_cond ?? 3,
  }));

  const [applied, setApplied] = useState<Filters>(() => ({
    md: defaults?.md ?? 2,
    band: defaults?.band ?? 500,
    same_lu: defaults?.same_lu ?? true,
    w_lu: defaults?.w_lu ?? 5,
    w_dist: defaults?.w_dist ?? 4,
    w_lat: defaults?.w_lat ?? 3,
    w_lon: defaults?.w_lon ?? 3,
    w_cond: defaults?.w_cond ?? 3,
  }));

  // Optional: only reset when a *stable key* changes (NOT when the defaults object reference changes)
  useEffect(() => {
    if (defaultsKey === undefined) return;
    const next: Filters = {
      md: defaults?.md ?? 2,
      band: defaults?.band ?? 500,
      same_lu: defaults?.same_lu ?? true,
      w_lu: defaults?.w_lu ?? 5,
      w_dist: defaults?.w_dist ?? 4,
      w_lat: defaults?.w_lat ?? 3,
      w_lon: defaults?.w_lon ?? 3,
      w_cond: defaults?.w_cond ?? 3,
    };
    setForm(next);
    setApplied(next);
  }, [defaultsKey]); // <- only this, not `defaults`

  const [isApplying, setIsApplying] = useState(false);

  const weights = useMemo(
    () => ({
      land_use: applied.w_lu,
      district: applied.w_dist,
      lat: applied.w_lat,
      lon: applied.w_lon,
      condition: applied.w_cond,
    }),
    [applied.w_lu, applied.w_dist, applied.w_lat, applied.w_lon, applied.w_cond]
  );

  const {
    data: comps,
    isLoading: compsLoading,
    error: compsError,
  } = useComps(parcelId, {
    max_distance_miles: applied.md,
    living_area_band: applied.band,
    require_same_land_use: applied.same_lu,
    weights,
  });

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(applied),
    [form, applied]
  );

  useEffect(() => {
    if (!isApplying) return;
    if (!compsLoading) setIsApplying(false);
  }, [isApplying, compsLoading]);

  function handleChange<K extends keyof Filters>(key: K, val: Filters[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty) return;
    setIsApplying(true);
    setApplied(form);
  }

  const rows = useMemo(() => {
    if (!Array.isArray(comps)) return [];
    return comps.map((r: any) => {
      const finished =
        r.total_finished_area ??
        r.comp_total_finished_area ??
        r.living_area_total ??
        null;

      return {
        subject_parcel_id: parcelId,
        parcel_id: r.comp_parcel_id ?? r.parcel_id ?? null,
        structure_count: r.structure_count ?? r.comp_structure_count ?? null,
        total_finished_area: finished,
        total_unfinished_area: r.total_unfinished_area ?? null,
        avg_year_built: r.avg_year_built ?? r.year_built ?? null,
        avg_condition: r.avg_condition ?? r.condition ?? null,
        sale_price: r.sale_price ?? null,
        sale_date: r.sale_date ?? null,
        sale_type: r.sale_type ?? null,
        price_per_sqft:
          r.price_per_sqft ??
          (finished && r.sale_price ? r.sale_price / finished : null),
        lat: r.comp_lat ?? r.lat ?? null,
        lon: r.comp_lon ?? r.lon ?? null,
        district: r.comp_district ?? r.district ?? null,
        land_use: r.land_use ?? r.comp_land_use ?? null,
        house_number: r.house_number ?? r.comp_house_number ?? null,
        street: r.street ?? r.comp_street ?? null,
        postcode: r.postcode ?? r.comp_postcode ?? null,
        comp_lot: String(r.comp_lot ?? r.lot ?? ""),
        comp_block: r.comp_block ?? (r.block != null ? String(r.block) : null),
        comp_ext: r.comp_ext ?? (r.ext != null ? String(r.ext) : null),
        gower_distance: r.gower_distance ?? null,
        distance_miles: r.comp_distance_miles ?? r.distance_miles ?? null,
        subject_features: r.subject_features ?? null,
      };
    });
  }, [comps, parcelId]);

  const subjFromRows = rows.find(
    (r) => r.subject_parcel_id === parcelId
  )?.subject_features;

  const subjectPoint =
    subjFromRows?.lat != null && subjFromRows?.lon != null
      ? {
          lat: Number(subjFromRows.lat),
          long: Number(subjFromRows.lon),
          parcel_number: parcelId,
          address: [subjFromRows.district, subjFromRows.land_use]
            .filter(Boolean)
            .join(" • "),
          kind: "subject" as const,
        }
      : null;

  const compPoints = rows
    .filter((r) => r.lat != null && r.lon != null)
    .map((r) => ({
      lat: Number(r.lat),
      long: Number(r.lon),
      parcel_number: r.parcel_id,
      address: [r.district, r.land_use].filter(Boolean).join(" • "),
      sale_price: r.sale_price ?? undefined,
      gower_distance: r.gower_distance ?? undefined,
      kind: "comp" as const,
    }));

  const points = subjectPoint ? [subjectPoint, ...compPoints] : compPoints;

  return (
    <div className="grid gap-4">
      {/* Controls */}
      <form
        className="grid gap-3 rounded-lg border p-3 md:grid-cols-3 lg:grid-cols-4"
        onSubmit={handleSubmit}
        aria-busy={isApplying}
      >
        {/* Distance */}
        <label className="flex items-center gap-2">
          <span className="w-40 text-sm">Max distance (mi)</span>
          <input
            type="number"
            step="0.1"
            min={0}
            className="w-full rounded-md border px-3 py-1 text-sm"
            value={form.md}
            onChange={(e) => handleChange("md", Number(e.target.value))}
            disabled={isApplying}
          />
        </label>

        {/* Living area band */}
        <label className="flex items-center gap-2">
          <span className="w-40 text-sm">Living area band (±sqft)</span>
          <input
            type="number"
            step="50"
            min={0}
            className="w-full rounded-md border px-3 py-1 text-sm"
            value={form.band}
            onChange={(e) => handleChange("band", Number(e.target.value))}
            disabled={isApplying}
          />
        </label>

        {/* Same land use */}
        <label className="flex items-center gap-2">
          <span className="w-40 text-sm">Require same land use</span>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={form.same_lu}
            onChange={(e) => handleChange("same_lu", e.target.checked)}
            disabled={isApplying}
          />
        </label>

        {/* Weights */}
        <div className="col-span-full grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          <label className="flex items-center gap-2">
            <span className="w-24 text-sm">w.land_use</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-3 py-1 text-sm"
              value={form.w_lu}
              onChange={(e) => handleChange("w_lu", Number(e.target.value))}
              disabled={isApplying}
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="w-24 text-sm">w.district</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-3 py-1 text-sm"
              value={form.w_dist}
              onChange={(e) => handleChange("w_dist", Number(e.target.value))}
              disabled={isApplying}
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="w-24 text-sm">w.lat</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-3 py-1 text-sm"
              value={form.w_lat}
              onChange={(e) => handleChange("w_lat", Number(e.target.value))}
              disabled={isApplying}
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="w-24 text-sm">w.lon</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-3 py-1 text-sm"
              value={form.w_lon}
              onChange={(e) => handleChange("w_lon", Number(e.target.value))}
              disabled={isApplying}
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="w-24 text-sm">w.condition</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-3 py-1 text-sm"
              value={form.w_cond}
              onChange={(e) => handleChange("w_cond", Number(e.target.value))}
              disabled={isApplying}
            />
          </label>
        </div>

        {/* Submit */}
        <div className="col-span-full flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={!isDirty || isApplying}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              !isDirty || isApplying
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {compsLoading || isApplying ? "Applying…" : "Apply"}
          </button>
        </div>
      </form>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between px-3 py-2">
          {(compsLoading || isApplying) && (
            <span
              aria-hidden
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              title="Loading…"
            />
          )}
        </div>

        {compsError ? (
          <div className="p-3 text-sm text-red-600">
            Error loading comps. Try adjusting your filters.
          </div>
        ) : (
          <div>
            {!compsLoading && !isApplying && (
              <CompsCardList rows={rows} className="mb-4" />
            )}
            {points.length > 0 && (
              <CompsMapClientWrapper
                points={points}
                className="w-full mb-24 relative"
                height={"80vh"}
                key={JSON.stringify(compPoints)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
