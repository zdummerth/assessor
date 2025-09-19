"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useSearch } from "@/lib/client-queries";
import Address from "@/components/ui/address";
import ParcelNumber from "./ui/parcel-number-updated";

export default function ParcelSearchClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error } = useSearch(debouncedQuery);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const toggleExpand = (parcel: string) => {
    setExpanded((prev) => ({ ...prev, [parcel]: !prev[parcel] }));
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search parcels...(parcel numbers, addresses, owners)"
        className="w-full border px-4 py-2 rounded shadow-sm mb-6"
      />

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error fetching results</p>}
      {data && data.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <ul className="space-y-4">
        {data?.map((parcel: any) => {
          const isOpen = expanded[parcel.parcel_number] ?? false;
          const block = parseInt(parcel.parcel_number.slice(0, 4), 10);
          const lot = parcel.parcel_number.slice(7, 10);
          const ext = parseInt(parcel.parcel_number.slice(11, 14), 10);
          const idString = `${block}${lot}${ext}`;
          const numericId = Number(idString);

          return (
            <li
              key={parcel.parcel_number}
              className="border p-4 rounded shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-2">
                <ParcelNumber
                  block={block}
                  lot={lot}
                  ext={ext}
                  id={numericId}
                />
                <button
                  onClick={() => toggleExpand(parcel.parcel)}
                  className="text-blue-600 text-sm underline"
                >
                  {isOpen ? "Hide details" : "Show details"}
                </button>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-500">Owner(s)</p>
                <p className="font-semibold text-sm">
                  {parcel.names?.join(", ") || "Unknown"}
                </p>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-500">Site Address</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {parcel.addresses?.map((addr: any, i: number) => (
                    <li key={i}>
                      <Address
                        address={`${addr.house_number || ""} ${addr.street_name || ""} ${addr.street_suffix || ""} ${addr.site_zip_code || ""}`.trim()}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {isOpen && (
                <>
                  {parcel.retired_at && (
                    <p className="text-sm text-red-600 font-medium mb-2">
                      Retired
                    </p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
