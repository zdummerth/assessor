// /app/test/ratios/_components/RatioSidebar.tsx
"use client";

import type { TrimChoice } from "@/lib/ratio-stats";

type Props = {
  // data + loading
  landUseOptions: string[];
  luLoading: boolean;
  luError?: unknown;
  loading?: boolean;

  // state values
  selectedLandUses: string[];
  setSelectedLandUses: (v: string[]) => void;

  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  asOfDate: string;
  setAsOfDate: (v: string) => void;

  trim: TrimChoice;
  setTrim: (v: TrimChoice) => void;

  groupBy: string[];
  toggleGroup: (key: string) => void;
  groupables: { key: string; label: string }[];

  includeRaw: boolean;
  setIncludeRaw: (v: boolean) => void;

  // helpers
  resetToResidential: () => void;
  resetToOther: () => void;
  resetToLots: () => void;
  resetToAll: () => void;

  // actions
  onExportStats: () => void;
  onExportRaw: () => void;
};

export default function RatioSidebar({
  landUseOptions,
  luLoading,
  luError,
  loading,

  selectedLandUses,
  setSelectedLandUses,

  startDate,
  setStartDate,
  endDate,
  setEndDate,
  asOfDate,
  setAsOfDate,

  trim,
  setTrim,

  groupBy,
  toggleGroup,
  groupables,

  resetToResidential,
  resetToOther,
  resetToLots,
  resetToAll,

  onExportStats,
  onExportRaw,
}: Props) {
  return (
    <aside className="rounded-lg border p-3 h-fit lg:sticky lg:top-4 print:hidden">
      <div className="mb-3">
        <label className="flex items-center gap-2 mb-2">
          <span className="w-24 text-sm">Start date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2 mb-2">
          <span className="w-24 text-sm">End date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2 mb-3">
          <span className="w-24 text-sm">As-of date</span>
          <input
            type="date"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2 mb-3">
          <span className="w-24 text-sm">Trim Outliers</span>
          <select
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={trim}
            onChange={(e) => setTrim(e.target.value as TrimChoice)}
          >
            <option value="">None</option>
            <option value="1.5">1.5 × IQR</option>
            <option value="3">3 × IQR</option>
          </select>
        </label>

        <div className="mb-3">
          <div className="text-sm mb-1">Group by</div>
          <div className="flex flex-col gap-2">
            {groupables.map((g) => (
              <label
                key={g.key}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={groupBy.includes(g.key)}
                  onChange={() => toggleGroup(g.key)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={resetToResidential}
          >
            Set to Residential
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={resetToOther}
          >
            Set to Other
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={resetToLots}
          >
            Set to Lots
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={resetToAll}
          >
            Set to All
          </button>
        </div>

        {/* <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={includeRaw}
            onChange={(e) => setIncludeRaw(e.target.checked)}
          />
          <span className="text-sm">Include raw JSON</span>
        </label> */}

        {/* CSV buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportStats}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            title="Export grouped medians/min/max/avg"
          >
            Export Stats CSV
          </button>
          <button
            type="button"
            onClick={onExportRaw}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            title="Export raw rows"
          >
            Export Sales CSV
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-2">
          <span
            aria-hidden
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            title="Loading…"
          />
        </div>
      )}
    </aside>
  );
}
