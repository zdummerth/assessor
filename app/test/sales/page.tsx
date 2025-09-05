"use client";

import { useEffect, useMemo, useState } from "react";
import CompsMapClientWrapper from "@/components/ui/maps/comps-map-client-wrapper";
import { useSalesSearch } from "@/lib/client-queries"; // adjust path if needed

type Filters = {
  start_date: string | "";
  end_date: string | "";
  valid_only: boolean;
  address: string | "";
};

const DEFAULTS: Filters = {
  start_date: "",
  end_date: "",
  valid_only: true,
  address: "",
};

export default function SalesSearchControls() {
  // editing vs applied
  const [form, setForm] = useState<Filters>(DEFAULTS);
  const [applied, setApplied] = useState<Filters>(DEFAULTS);
  const [isApplying, setIsApplying] = useState(false);

  const {
    data: sales,
    isLoading,
    error,
  } = useSalesSearch({
    start_date: applied.start_date || undefined,
    end_date: applied.end_date || undefined,
    valid_only: applied.valid_only,
    address: applied.address || undefined,
  });

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(applied),
    [form, applied]
  );

  useEffect(() => {
    if (!isApplying) return;
    if (!isLoading) setIsApplying(false);
  }, [isApplying, isLoading]);

  function handleChange<K extends keyof Filters>(key: K, val: Filters[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty) return;
    setIsApplying(true);
    setApplied(form);
  }

  // normalize rows from RPC result
  const rows = useMemo(() => {
    if (!Array.isArray(sales)) return [];
    return sales.map((r: any) => {
      const finished = r.total_finished_area ?? null;
      return {
        sale_id: r.sale_id,
        sale_date: r.sale_date ?? null,
        sale_price: r.sale_price ?? null,
        sale_type: r.sale_type ?? null,
        parcel_id: r.parcel_id ?? null,
        address_line: [r.house_number, r.street].filter(Boolean).join(" "),
        district: r.district ?? null,
        postcode: r.postcode ?? null,
        land_use: r.land_use ?? null,
        total_finished_area: finished,
        price_per_sqft:
          finished && r.sale_price
            ? Math.round((r.sale_price / finished) * 100) / 100
            : null,
        avg_condition: r.avg_condition ?? null,
        lat: r.lat ?? null,
        lon: r.lon ?? null,
      };
    });
  }, [sales]);

  // map points (no subject marker for this search)
  const points = useMemo(
    () =>
      rows
        .filter((r) => r.lat != null && r.lon != null)
        .map((r) => ({
          lat: Number(r.lat),
          long: Number(r.lon),
          parcel_number: r.parcel_id,
          address: [r.address_line, r.district].filter(Boolean).join(" • "),
          sale_price: r.sale_price ?? undefined,
          kind: "comp" as const,
        })),
    [rows]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <form
        className="grid gap-3 rounded-lg border p-3 md:grid-cols-2 lg:grid-cols-4"
        onSubmit={handleSubmit}
        aria-busy={isApplying}
      >
        {/* Start date */}
        <label className="flex items-center gap-2">
          <span className="w-36 text-sm">Start date</span>
          <input
            type="date"
            className="w-full rounded-md border px-3 py-1 text-sm"
            value={form.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            disabled={isApplying}
          />
        </label>

        {/* End date */}
        <label className="flex items-center gap-2">
          <span className="w-36 text-sm">End date</span>
          <input
            type="date"
            className="w-full rounded-md border px-3 py-1 text-sm"
            value={form.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            disabled={isApplying}
          />
        </label>

        {/* Valid-only */}
        <label className="flex items-center gap-2">
          <span className="w-36 text-sm">Valid sales only</span>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={form.valid_only}
            onChange={(e) => handleChange("valid_only", e.target.checked)}
            disabled={isApplying}
          />
        </label>

        {/* Address contains */}
        <label className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
          <span className="w-36 text-sm">Address contains</span>
          <input
            type="text"
            placeholder="e.g., 123 Main"
            className="w-full rounded-md border px-3 py-1 text-sm"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={isApplying}
          />
        </label>

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
            {isLoading || isApplying ? "Applying…" : "Apply"}
          </button>
        </div>
      </form>

      {/* Results: table + map */}
      <div className="flex-1">
        <div className="flex items-center justify-between border-b px-3 py-2">
          {(isLoading || isApplying) && (
            <span
              aria-hidden
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              title="Loading…"
            />
          )}
        </div>

        {error ? (
          <div className="p-3 text-sm text-red-600">
            Error loading sales. Try adjusting your filters.
          </div>
        ) : (
          <div className="flex">
            {/* Table of sales */}
            <div className="overflow-auto rounded-md border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Sale Date</th>
                    <th className="px-3 py-2 font-medium">Price</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Parcel</th>
                    <th className="px-3 py-2 font-medium">Address</th>
                    <th className="px-3 py-2 font-medium">District</th>
                    <th className="px-3 py-2 font-medium">Postcode</th>
                    <th className="px-3 py-2 font-medium">Land Use</th>
                    <th className="px-3 py-2 font-medium">Finished (sf)</th>
                    <th className="px-3 py-2 font-medium">$/sf</th>
                    <th className="px-3 py-2 font-medium">Condition (avg)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td className="px-3 py-3 text-gray-500" colSpan={11}>
                        {isLoading || isApplying
                          ? "Loading…"
                          : "No results for the selected filters."}
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr
                        key={`${r.sale_id}-${r.parcel_id}`}
                        className="border-t"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {r.sale_date ?? "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {r.sale_price != null
                            ? r.sale_price.toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {r.sale_type ?? "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {r.parcel_id ?? "—"}
                        </td>
                        <td className="px-3 py-2">
                          {[r.address_line].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="px-3 py-2">{r.district ?? "—"}</td>
                        <td className="px-3 py-2">{r.postcode ?? "—"}</td>
                        <td className="px-3 py-2">{r.land_use ?? "—"}</td>
                        <td className="px-3 py-2 text-right">
                          {r.total_finished_area ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {r.price_per_sqft != null ? r.price_per_sqft : "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {r.avg_condition != null
                            ? Math.round(r.avg_condition * 100) / 100
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Map */}
            {points.length > 0 && (
              <CompsMapClientWrapper
                points={points}
                className="w-[25vw] relative z-10"
                height={"100%"}
                key={JSON.stringify(points)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
