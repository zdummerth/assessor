"use client";

import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearch } from "@/lib/client-queries";
import Address from "@/components/ui/address";
import ParcelNumber from "./ui/parcel-number-updated";

export default function ParcelSearchClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useSearch(debouncedQuery);

  const toggleExpand = (parcel: string) => {
    setExpanded((prev) => ({
      ...prev,
      [parcel]: !prev[parcel],
    }));
  };

  console.log({ error });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search parcels..."
        className="w-full border px-4 py-2 rounded shadow-sm mb-6"
      />

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error fetching results</p>}
      {data && data.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <ul className="space-y-4">
        {data &&
          data.map((parcel: any) => {
            const isOpen = expanded[parcel.parcel] ?? false;
            const block = parseInt(parcel.parcel.slice(0, 4), 10);
            const lot = parcel.parcel.slice(7, 10);
            const ext = parseInt(parcel.parcel.slice(11, 14), 10);

            const idString = `${block}${lot}${ext}`;
            const numericId = Number(idString);
            return (
              <li
                key={parcel.parcel}
                className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                {/* Minimized View */}
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

                {/* Expanded View */}
                {isOpen && (
                  <>
                    {parcel.retired && (
                      <p className="text-sm text-red-600 font-medium mb-2">
                        Retired
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Neighborhood</p>
                        <p className="text-gray-800">{parcel.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Land Use</p>
                        <p className="text-gray-800">{parcel.land_use}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Class</p>
                        <p className="text-gray-800">{parcel.prop_class}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Appraised Value</p>
                        <p className="text-gray-800">
                          ${parcel.appraised_total?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="text-xs text-gray-500">Appraiser</p>
                      <p className="text-gray-800 font-medium">
                        {parcel.appraiser}
                      </p>
                      <p className="text-gray-600">
                        {parcel.appraiser_email} · {parcel.appraiser_phone}
                      </p>
                    </div>
                  </>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
