// app/components/ClientParcelStructures.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Plus } from "lucide-react";
import { Info } from "../ui/lib";
import FormattedDate from "../ui/formatted-date";

// Narrow types used below so we can rely on them without any/unknown
type Structure = {
  id: number;
  parcel_id?: number | null;
  year_built: number | null;
  material: string | null;
  bedrooms: number | null;
  rooms?: number | null;
  full_bathrooms: number | null;
  half_bathrooms: number | null;
  created_at?: string | null;
  // relations
  test_structure_sections: Array<{
    id: number;
    type: string; // floor | attic | basement | crawl space | addition, etc.
    floor_number?: number | null;
    finished_area: number | null;
    unfinished_area: number | null;
  }>;
  test_conditions: Array<{
    id: number;
    structure_id: number;
    condition: string;
    effective_date: string; // date
    created_at?: string | null;
  }>;
};

function fmtNum(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat().format(n);
}
function fmtDate(d?: string | null) {
  if (!d) return "—";
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? "—" : t.toLocaleDateString();
}
function sumFinishedLiving(s: Structure) {
  const vals =
    s.test_structure_sections?.map((x) => x.finished_area || 0) ?? [];
  const total = vals.reduce((a, b) => a + b, 0);
  return total || 0;
}
function latestCondition(s: Structure) {
  const list = [...(s.test_conditions ?? [])].sort((a, b) => {
    const ad = new Date(a.effective_date).getTime();
    const bd = new Date(b.effective_date).getTime();
    if (bd !== ad) return bd - ad;
    // tie-break by id
    return (b.id ?? 0) - (a.id ?? 0);
  });
  return list[0];
}
// "Stories" heuristic: count distinct floor sections; prefer unique floor_number when available.
function countStories(s: Structure) {
  const floors = (s.test_structure_sections ?? []).filter(
    (sec) => sec.type?.toLowerCase() === "floor"
  );
  const byNumber = floors
    .map((f) => (f.floor_number == null ? null : Number(f.floor_number)))
    .filter((n) => Number.isFinite(n)) as number[];
  if (byNumber.length) {
    return new Set(byNumber).size;
  }
  return floors.length;
}

export default function ClientParcelStructures({
  data,
  className = "",
}: {
  data: Structure[];
  className?: string;
}) {
  if (!data || data.length === 0) {
    return <p>No structure data found.</p>;
  }

  // ===== Parcel-level summary =====
  const parcelSummary = useMemo(() => {
    const totalStructures = data.length;
    const totalLivingArea = data.reduce(
      (acc, s) => acc + sumFinishedLiving(s),
      0
    );
    const totalStories = data.reduce((acc, s) => acc + countStories(s), 0);

    // Determine "current condition" for the parcel as the newest condition across all structures
    const allConds = data.flatMap((s) => s.test_conditions || []);
    const currentCond = [...allConds].sort((a, b) => {
      const ad = new Date(a.effective_date).getTime();
      const bd = new Date(b.effective_date).getTime();
      if (bd !== ad) return bd - ad;
      return (b.id ?? 0) - (a.id ?? 0);
    })[0];

    return {
      totalStructures,
      totalLivingArea,
      totalLivingAreaFmt: fmtNum(totalLivingArea),
      totalStories,
      currentCondition: currentCond?.condition ?? "—",
      currentConditionDate: currentCond?.effective_date
        ? fmtDate(currentCond.effective_date)
        : "—",
    };
  }, [data]);

  // ===== Dialog state =====
  const [structuresOpen, setStructuresOpen] = useState(false);
  const [activeStructureId, setActiveStructureId] = useState<number | null>(
    null
  );
  const activeStructure = useMemo(
    () => data.find((s) => s.id === activeStructureId) || null,
    [activeStructureId, data]
  );

  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const activeSection = useMemo(() => {
    if (!activeStructure || activeSectionId == null) return null;
    return (
      activeStructure.test_structure_sections?.find(
        (sec) => sec.id === activeSectionId
      ) || null
    );
  }, [activeStructure, activeSectionId]);

  return (
    <div className={className}>
      {/* Parcel summary strip */}
      <div className="flex justify-between items-start">
        <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            label="Total Structures"
            value={parcelSummary.totalStructures}
          />
          <Info
            label="Total Living Area"
            value={`${parcelSummary.totalLivingAreaFmt} ft²`}
          />
          <Info label="Total Stories" value={parcelSummary.totalStories} />
          <Info
            label="Current Condition"
            value={
              <>
                <div className="flex items-center gap-4">
                  <div>{parcelSummary.currentCondition}</div>
                  <FormattedDate date={parcelSummary.currentConditionDate} />
                </div>
              </>
            }
          />
        </div>
        <button
          type="button"
          onClick={() => setStructuresOpen(true)}
          className="hover:bg-gray-50"
          aria-label="View all land uses"
          title="View all land uses"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ===== Dialog: All structures (click to view one) ===== */}
      <Dialog
        open={structuresOpen}
        onClose={setStructuresOpen}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl rounded-xl border bg-white p-6">
            <DialogTitle className="text-sm font-semibold text-gray-800">
              Structures — Details
            </DialogTitle>

            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((s) => {
                const living = sumFinishedLiving(s);
                const cond = latestCondition(s);
                const stories = countStories(s);
                return (
                  <div
                    key={s.id}
                    className="rounded border bg-white p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Structure #{s.id}</div>
                      {s.year_built && (
                        <span className="text-xs text-gray-500">
                          Built {s.year_built}
                        </span>
                      )}
                    </div>

                    <dl className="mt-2 grid grid-cols-2 gap-y-1">
                      <dt className="text-gray-500">Material</dt>
                      <dd className="font-medium">{s.material ?? "—"}</dd>

                      <dt className="text-gray-500">Bedrooms</dt>
                      <dd className="font-medium">{s.bedrooms ?? "—"}</dd>

                      <dt className="text-gray-500">Baths (F/H)</dt>
                      <dd className="font-medium">
                        {s.full_bathrooms ?? 0}/{s.half_bathrooms ?? 0}
                      </dd>

                      <dt className="text-gray-500">Stories</dt>
                      <dd className="font-medium">{fmtNum(stories)}</dd>

                      <dt className="text-gray-500">Finished Living</dt>
                      <dd className="font-medium">{fmtNum(living)} ft²</dd>

                      <dt className="text-gray-500">Condition</dt>
                      <dd className="font-medium">
                        {cond?.condition ?? "—"}
                        {cond?.effective_date && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({fmtDate(cond.effective_date)})
                          </span>
                        )}
                      </dd>
                    </dl>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStructureId(s.id)}
                        className="px-3 py-1.5 rounded border hover:bg-gray-50"
                      >
                        Open
                      </button>
                      <span className="text-xs text-gray-500">
                        {s.test_structure_sections?.length ?? 0} section
                        {(s.test_structure_sections?.length ?? 0) === 1
                          ? ""
                          : "s"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStructuresOpen(false)}
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {/* ===== Nested Dialog: Single structure details ===== */}
            {activeStructure && (
              <Dialog
                open={activeStructure != null}
                onClose={() => {
                  setActiveSectionId(null);
                  setActiveStructureId(null);
                }}
                className="relative z-50"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-4xl rounded-xl border bg-white p-6">
                    <DialogTitle className="text-sm font-semibold text-gray-800">
                      Structure #{activeStructure.id} — Full Details
                    </DialogTitle>

                    {/* Summary panel */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="rounded border p-3 space-y-2">
                        <h4 className="font-semibold">Attributes</h4>
                        <dl className="grid grid-cols-2 gap-y-1">
                          <dt className="text-gray-500">Year Built</dt>
                          <dd className="font-medium">
                            {activeStructure.year_built ?? "—"}
                          </dd>

                          <dt className="text-gray-500">Material</dt>
                          <dd className="font-medium">
                            {activeStructure.material ?? "—"}
                          </dd>

                          <dt className="text-gray-500">Bedrooms</dt>
                          <dd className="font-medium">
                            {activeStructure.bedrooms ?? "—"}
                          </dd>

                          <dt className="text-gray-500">Full Baths</dt>
                          <dd className="font-medium">
                            {activeStructure.full_bathrooms ?? "—"}
                          </dd>

                          <dt className="text-gray-500">Half Baths</dt>
                          <dd className="font-medium">
                            {activeStructure.half_bathrooms ?? "—"}
                          </dd>

                          <dt className="text-gray-500">Finished Living</dt>
                          <dd className="font-medium">
                            {fmtNum(sumFinishedLiving(activeStructure))} ft²
                          </dd>

                          <dt className="text-gray-500">Latest Condition</dt>
                          <dd className="font-medium">
                            {latestCondition(activeStructure)?.condition ?? "—"}
                            {latestCondition(activeStructure)
                              ?.effective_date && (
                              <FormattedDate
                                date={
                                  latestCondition(activeStructure)
                                    ?.effective_date || ""
                                }
                              />
                            )}
                          </dd>
                        </dl>
                      </div>
                    </div>

                    {/* Sections table */}
                    <div className="mt-3 rounded border overflow-auto">
                      <table className="min-w-[720px] w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="p-2">Section</th>
                            <th className="p-2">Floor #</th>
                            <th className="p-2">Finished (ft²)</th>
                            <th className="p-2">Unfinished (ft²)</th>
                            <th className="p-2">Total (ft²)</th>
                            <th className="p-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(activeStructure.test_structure_sections ?? [])
                            .length === 0 ? (
                            <tr>
                              <td className="p-2 text-gray-500" colSpan={6}>
                                No sections found.
                              </td>
                            </tr>
                          ) : (
                            (activeStructure.test_structure_sections ?? []).map(
                              (sec) => {
                                const fin = sec.finished_area ?? 0;
                                const unfin = sec.unfinished_area ?? 0;
                                return (
                                  <tr key={sec.id}>
                                    <td className="p-2 font-medium">
                                      {sec.type}
                                    </td>
                                    <td className="p-2">
                                      {sec.floor_number ?? "—"}
                                    </td>
                                    <td className="p-2">{fmtNum(fin)}</td>
                                    <td className="p-2">{fmtNum(unfin)}</td>
                                    <td className="p-2">
                                      {fmtNum(fin + unfin)}
                                    </td>
                                    <td className="p-2 text-right">
                                      <button
                                        type="button"
                                        className="px-2 py-1 rounded border hover:bg-gray-50"
                                        onClick={() =>
                                          setActiveSectionId(sec.id)
                                        }
                                      >
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Conditions history */}
                    <div className="mt-3 rounded border overflow-auto">
                      <table className="min-w-[600px] w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="p-2">Condition</th>
                            <th className="p-2">Effective Date</th>
                            <th className="p-2">Created</th>
                            <th className="p-2">ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(activeStructure.test_conditions ?? []).length ===
                          0 ? (
                            <tr>
                              <td className="p-2 text-gray-500" colSpan={4}>
                                No condition records.
                              </td>
                            </tr>
                          ) : (
                            [...(activeStructure.test_conditions ?? [])]
                              .sort((a, b) => {
                                const ad = new Date(a.effective_date).getTime();
                                const bd = new Date(b.effective_date).getTime();
                                if (bd !== ad) return bd - ad;
                                return (b.id ?? 0) - (a.id ?? 0);
                              })
                              .map((c) => (
                                <tr key={c.id}>
                                  <td className="p-2 font-medium">
                                    {c.condition}
                                  </td>
                                  <td className="p-2">
                                    <FormattedDate date={c.effective_date} />
                                  </td>
                                  <td className="p-2">
                                    {fmtDate(c.created_at ?? null)}
                                  </td>
                                  <td className="p-2">{c.id}</td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
                        onClick={() => {
                          setActiveSectionId(null);
                          setActiveStructureId(null);
                        }}
                      >
                        Close
                      </button>
                    </div>

                    {/* ===== Nested Dialog: Single section details ===== */}
                    {activeSection && (
                      <Dialog
                        open={activeSection != null}
                        onClose={() => setActiveSectionId(null)}
                        className="relative z-50"
                      >
                        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                          <DialogPanel className="w-full max-w-md rounded-xl border bg-white p-6">
                            <DialogTitle className="text-sm font-semibold text-gray-800">
                              Section #{activeSection.id}
                            </DialogTitle>

                            <div className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                              <div className="text-gray-500">Type</div>
                              <div className="font-medium">
                                {activeSection.type}
                              </div>

                              <div className="text-gray-500">Floor #</div>
                              <div className="font-medium">
                                {activeSection.floor_number ?? "—"}
                              </div>

                              <div className="text-gray-500">Finished</div>
                              <div className="font-medium">
                                {fmtNum(activeSection.finished_area ?? 0)} ft²
                              </div>

                              <div className="text-gray-500">Unfinished</div>
                              <div className="font-medium">
                                {fmtNum(activeSection.unfinished_area ?? 0)} ft²
                              </div>

                              <div className="text-gray-500">Total</div>
                              <div className="font-medium">
                                {fmtNum(
                                  (activeSection.finished_area ?? 0) +
                                    (activeSection.unfinished_area ?? 0)
                                )}{" "}
                                ft²
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setActiveSectionId(null)}
                                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
                              >
                                Close
                              </button>
                            </div>
                          </DialogPanel>
                        </div>
                      </Dialog>
                    )}
                  </DialogPanel>
                </div>
              </Dialog>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
