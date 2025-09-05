"use client";

import { useEffect, useMemo, useState } from "react";
import { useSalesSearchByAddress } from "@/lib/client-queries"; // adjust import path
import ParcelNumber from "../parcel-number-updated";

type SaleRow = {
  sale_id: number;
  sale_type: string | null;
  sale_date: string | null;
  sale_price: number | null;
  address_line1: string | null;
  postcode: string | null;
  parcel_id: number;
  block: number;
  lot: string;
  ext: number;
};

type Props = {
  initialValidOnly?: boolean;
  placeholder?: string;
  debounceMs?: number;
  ActionButton?: React.ComponentType<{ sale: SaleRow }>;
  className?: string;
};

export default function SalesAddressSearchCards({
  initialValidOnly = false,
  placeholder = "Search sales by address...",
  debounceMs = 300,
  ActionButton,
  className,
}: Props) {
  const [q, setQ] = useState("");
  const [validOnly, setValidOnly] = useState(initialValidOnly);
  const [debounced, setDebounced] = useState("");

  // debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [q, debounceMs]);

  const { data, isLoading, error } = useSalesSearchByAddress({
    address: debounced || undefined,
    valid_only: validOnly,
  });

  const rows: SaleRow[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const hasQuery = debounced.length > 0;

  return (
    <div className={`${className ?? ""}`}>
      {/* Controls (fixed height & reserved spinner space) */}
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full border px-4 py-2 rounded shadow-sm mb-6"
          aria-label="Search address"
        />

        <label className="flex items-center gap-2 text-sm px-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={validOnly}
            onChange={(e) => setValidOnly(e.target.checked)}
            className="h-4 w-4"
          />
          Valid only
        </label>

        {/* Reserve spinner space */}
        <span className="inline-flex items-center justify-center w-4 h-4">
          {isLoading && (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              title="Loading…"
            />
          )}
        </span>
      </div>

      {/* Results container */}
      <div className="relative">
        {error && (
          <div className="p-3 text-sm text-red-600">
            Error loading results. Try another search.
          </div>
        )}

        {!error && hasQuery && rows.length === 0 && (
          <div className="p-3 text-sm text-gray-500">
            {isLoading ? "Searching…" : "No matches found for this address."}
          </div>
        )}

        {rows.length > 0 && (
          <div className="grid gap-3 grid-cols-1">
            {rows.map((r) => (
              <div
                key={`${r.sale_id}-${r.parcel_id}`}
                className="rounded-lg border p-4 shadow-sm bg-white space-y-2 min-h-[150px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold break-words">
                    {r.address_line1 ?? "—"}
                  </h3>
                  {ActionButton && (
                    <div className="shrink-0">
                      <ActionButton sale={r} />
                    </div>
                  )}
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
                    block={r.block}
                    lot={Number(r.lot)}
                    ext={r.ext}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
