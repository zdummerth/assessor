"use client";

import { useState, useMemo } from "react";

export default function UnscheduledAppeals({ data }: { data: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((appeal) => {
      return (
        appeal.appeal_number?.toLowerCase().includes(q) ||
        appeal.appellant_name?.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Unscheduled Appeals</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search appeals"
          className="border px-3 py-1 text-sm rounded w-64"
        />
      </div>
      <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm italic text-gray-500">No matching appeals</p>
        ) : (
          filtered.map((appeal) => (
            <div
              key={appeal.id}
              className="border rounded p-3 bg-white shadow-sm"
            >
              <p className="font-medium">
                Appeal #{appeal.appeal_number} – {appeal.appellant_name}
              </p>
              <p className="text-red-500 italic">Not Scheduled</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
