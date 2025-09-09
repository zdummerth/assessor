"use client";

import { useMemo, useState } from "react";
import {
  useRatiosFeatures,
  type RatiosFeaturesRow,
} from "@/lib/client-queries";
import ParcelNumber from "../parcel-number-updated";
import { AppendUrlParam } from "../filter-client";

// -------------------- Child: UI + filtering --------------------
function SearchSalesList({
  rows,
  isLoading,
  error,
  placeholder = "Search by address, parcel, district, land use…",
  ActionButton,
  className,
}: {
  rows: RatiosFeaturesRow[];
  isLoading: boolean;
  error: any;
  placeholder?: string;
  ActionButton?: React.ComponentType<{ sale: RatiosFeaturesRow }>;
  className?: string;
}) {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!term) return [] as RatiosFeaturesRow[];
    return rows.filter((r) =>
      [
        r.parcel_id,
        r.sale_id,
        `${r.house_number ?? ""} ${r.street ?? ""}`,
        r.postcode,
        r.district,
        r.land_use,
        r.sale_date,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .some((s) => s.includes(term))
    );
  }, [rows, term]);

  const hasQuery = term.length > 0;

  return (
    <div className={className ?? ""}>
      {/* Search */}
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isLoading ? "Loading sales…" : placeholder}
          disabled={isLoading}
          className="w-full border px-4 py-2 rounded shadow-sm mb-6"
          aria-label="Search address or parcel"
        />
      </div>

      {/* Results container */}
      <div className="relative">
        {error && (
          <div className="p-3 text-sm text-red-600">
            Error loading data. Try again later.
          </div>
        )}

        {!error && !hasQuery && (
          <div className="p-3 text-sm text-gray-500">
            Type to search sales by parcel, address, district, land use, or
            date.
          </div>
        )}

        {!error && hasQuery && isLoading && rows.length === 0 && (
          <div className="p-3 text-sm text-gray-500">Loading…</div>
        )}

        {!error && hasQuery && !isLoading && filtered.length === 0 && (
          <div className="p-3 text-sm text-gray-500">No matches found.</div>
        )}

        {filtered.length > 0 && (
          <div className="grid gap-3 grid-cols-1">
            {filtered.map((r) => {
              const address =
                `${r.house_number ?? ""} ${r.street ?? ""}`.trim() || "—";
              return (
                <div
                  key={`${r.sale_id}-${r.parcel_id}`}
                  className="rounded-lg border p-4 shadow-sm bg-white space-y-2 min-h-[150px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold break-words">
                      {address}
                    </h3>

                    {/* Optional custom action */}
                    {ActionButton && (
                      <div className="shrink-0">
                        <ActionButton sale={r} />
                      </div>
                    )}

                    {/* Append sale_id to ?saleIds=... */}
                    <AppendUrlParam
                      urlParam="saleIds"
                      value={{
                        id: String(r.sale_id),
                        label: "Compare",
                      }}
                    />
                  </div>

                  <div className="grid gap-1 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Sale Date: </span>
                      {r.sale_date ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">Sale Price: </span>
                      {r.sale_price != null
                        ? `$${r.sale_price.toLocaleString()}`
                        : "—"}
                    </div>
                    <div>
                      <span className="font-medium">Sale Type: </span>
                      {r.sale_type ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">Postcode: </span>
                      {r.postcode ?? "—"}
                    </div>
                  </div>

                  {/* Parcel info */}
                  <div className="pt-2 border-t">
                    <ParcelNumber
                      id={r.parcel_id}
                      block={r.block as number}
                      lot={Number(r.lot)}
                      ext={r.ext as number}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------- Parent: fetch + pass down --------------------
export default function SearchSalesClient({
  placeholder,
  ActionButton,
  className,
}: {
  placeholder?: string;
  ActionButton?: React.ComponentType<{ sale: RatiosFeaturesRow }>;
  className?: string;
}) {
  // Fetch all (valid + invalid); client-side search handles filtering
  const { data, isLoading, error } = useRatiosFeatures({
    valid_only: false,
  });

  const rows = useMemo<RatiosFeaturesRow[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  return (
    <SearchSalesList
      rows={rows}
      isLoading={isLoading}
      error={error}
      placeholder={placeholder}
      ActionButton={ActionButton}
      className={className}
    />
  );
}
