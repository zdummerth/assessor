"use client";

import React, { useMemo, useState } from "react";
import { Tables } from "@/database-types";
import ConditionsCRUDModal from "../structures/conditions-crud-modal";
import Modal from "@/components/ui/modal";

type Parcel = Tables<"test_parcels">;

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
    type: string; // floor | attic | basement | crawl | addition, etc.
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
  return new Date(d).toLocaleDateString();
}
function sumFinishedLiving(s: Structure) {
  const vals =
    s.test_structure_sections?.map((x) => x.finished_area || 0) ?? [];
  const total = vals.reduce((a, b) => a + b, 0);
  return total || null;
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

export default function ClientParcelStructures({
  data,
  parcel,
}: {
  data: Structure[];
  parcel: Parcel;
}) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No structure data found.</p>;
  }

  const [openId, setOpenId] = useState<number | null>(null);

  const cards = useMemo(
    () =>
      data.map((s) => {
        const lc = latestCondition(s);
        const living = sumFinishedLiving(s);
        return {
          key: s.id,
          id: s.id,
          year_built: s.year_built,
          material: s.material,
          bedrooms: s.bedrooms,
          full_bathrooms: s.full_bathrooms,
          half_bathrooms: s.half_bathrooms,
          condition: lc?.condition ?? "—",
          conditionDate: lc?.effective_date ? fmtDate(lc.effective_date) : "—",
          livingArea: living != null ? fmtNum(living) : "—",
          raw: s,
        };
      }),
    [data]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Cards */}
      <div
        className={`grid grid-cols-1
        ${cards.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-1"}
        ${cards.length === 3 ? "lg:grid-cols-3" : ""}
        ${cards.length >= 4 ? "lg:grid-cols-4" : ""}
        gap-4`}
      >
        {cards.map((c) => (
          <div
            key={c.key}
            className="rounded border overflow-hidden shadow-sm hover:shadow transition-shadow"
          >
            <div className="p-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Structure #{c.id}</div>
                {c.year_built && (
                  <span className="text-xs text-gray-500">
                    Built {c.year_built}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Condition</span>
                  <span className="font-medium">
                    {c.condition}
                    {c.conditionDate !== "—" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({c.conditionDate})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Material</span>
                  <span className="font-medium">{c.material ?? "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Bedrooms</span>
                  <span className="font-medium">{c.bedrooms ?? "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Baths (F/H)</span>
                  <span className="font-medium">
                    {c.full_bathrooms ?? 0}/{c.half_bathrooms ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Finished Living Area</span>
                  <span className="font-medium">{c.livingArea} ft²</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t">
                <ConditionsCRUDModal
                  structureId={c.id}
                  conditions={c.raw.test_conditions}
                  revalidatePath={`/test/parcels/${data[0].id}`}
                />
                <button
                  onClick={() => setOpenId(c.id)}
                  className="text-sm px-3 py-1.5 hover:bg-gray-50"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal(s): render once and hydrate with selected structure */}
      {openId != null && (
        <DetailModal
          structure={data.find((s) => s.id === openId)!}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function DetailModal({
  structure,
  onClose,
}: {
  structure: Structure;
  onClose: () => void;
}) {
  const lc = latestCondition(structure);
  const living = sumFinishedLiving(structure);
  const sections = structure.test_structure_sections ?? [];
  const conditions = structure.test_conditions ?? [];

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Structure #${structure.id} — Full Details`}
    >
      <div className="space-y-4">
        {/* Summary panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded border p-3 space-y-2">
            <h4 className="font-semibold">Attributes</h4>
            <dl className="grid grid-cols-2 gap-y-1">
              <dt className="text-gray-500">Year Built</dt>
              <dd className="font-medium">{structure.year_built ?? "—"}</dd>

              <dt className="text-gray-500">Material</dt>
              <dd className="font-medium">{structure.material ?? "—"}</dd>

              <dt className="text-gray-500">Bedrooms</dt>
              <dd className="font-medium">{structure.bedrooms ?? "—"}</dd>

              <dt className="text-gray-500">Full Baths</dt>
              <dd className="font-medium">{structure.full_bathrooms ?? "—"}</dd>

              <dt className="text-gray-500">Half Baths</dt>
              <dd className="font-medium">{structure.half_bathrooms ?? "—"}</dd>

              <dt className="text-gray-500">Finished Living</dt>
              <dd className="font-medium">
                {living != null ? `${fmtNum(living)} ft²` : "—"}
              </dd>

              <dt className="text-gray-500">Latest Condition</dt>
              <dd className="font-medium">
                {lc?.condition ?? "—"}
                {lc?.effective_date && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({fmtDate(lc.effective_date)})
                  </span>
                )}
              </dd>
            </dl>
          </div>
        </div>

        {/* Sections table */}
        <div className="rounded border overflow-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-2">Section</th>
                <th className="p-2">Finished (ft²)</th>
                <th className="p-2">Unfinished (ft²)</th>
                <th className="p-2">Total (ft²)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sections.length === 0 ? (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={4}>
                    No sections found.
                  </td>
                </tr>
              ) : (
                sections.map((s) => {
                  const fin = s.finished_area ?? 0;
                  const unfin = s.unfinished_area ?? 0;
                  return (
                    <tr key={s.id}>
                      <td className="p-2 font-medium">{s.type}</td>
                      <td className="p-2">{fmtNum(fin)}</td>
                      <td className="p-2">{fmtNum(unfin)}</td>
                      <td className="p-2">{fmtNum(fin + unfin)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Conditions history */}
        <div className="rounded border overflow-auto">
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
              {conditions.length === 0 ? (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={4}>
                    No condition records.
                  </td>
                </tr>
              ) : (
                [...conditions]
                  .sort((a, b) => {
                    const ad = new Date(a.effective_date).getTime();
                    const bd = new Date(b.effective_date).getTime();
                    if (bd !== ad) return bd - ad;
                    return (b.id ?? 0) - (a.id ?? 0);
                  })
                  .map((c) => (
                    <tr key={c.id}>
                      <td className="p-2 font-medium">{c.condition}</td>
                      <td className="p-2">{fmtDate(c.effective_date)}</td>
                      <td className="p-2">{fmtDate(c.created_at ?? null)}</td>
                      <td className="p-2">{c.id}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button className="px-4 py-2 rounded border" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
