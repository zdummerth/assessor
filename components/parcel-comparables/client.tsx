import React from "react";
import { Tables } from "@/database-types";
import ParcelImagePrimary from "@/components/parcel-image-primary/server";

type Comparable = Tables<"test_comparables">;

export default function ComparablesTable({ values }: { values: Comparable[] }) {
  if (values.length === 0) return null;

  const subject = values[0];
  if (!subject?.subject_parcel) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No comparables found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Primary Image</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Neighborhood</th>
            <th className="px-4 py-2">Land Use</th>
            <th className="px-4 py-2">Sale Price</th>
            <th className="px-4 py-2">Adjusted Price</th>
            <th className="px-4 py-2">Date of Sale</th>
            <th className="px-4 py-2">CDU</th>
            <th className="px-4 py-2">GLA</th>
            <th className="px-4 py-2">Distance</th>
            <th className="px-4 py-2">Gower Dist</th>
          </tr>
        </thead>
        <tbody>
          {/* Subject Parcel */}
          <tr className="bg-yellow-50 font-medium">
            <td className="px-4 py-2">
              <div className="w-16 h-16 relative">
                {/* @ts-ignore */}
                <ParcelImagePrimary parcel_id={subject.subject_parcel.id} />
              </div>
            </td>
            <td className="px-4 py-2">Subject</td>
            <td className="px-4 py-2">{subject.subject_address}</td>
            <td className="px-4 py-2">
              {subject.subject_neighborhood_code} –{" "}
              {subject.subject_neighborhood_group}
            </td>
            <td className="px-4 py-2">{subject.subject_land_use}</td>
            <td className="px-4 py-2 text-gray-400">—</td>
            <td className="px-4 py-2 text-gray-400">—</td>
            <td className="px-4 py-2 text-gray-400">—</td>
            <td className="px-4 py-2">{subject.subject_cdu}</td>
            <td className="px-4 py-2">
              {subject.subject_total_living_area?.toLocaleString()}
            </td>
            <td className="px-4 py-2 text-gray-400">—</td>
            <td className="px-4 py-2 text-gray-400">—</td>
          </tr>

          {/* Comparable Sales */}
          {values.map((comp, i) => (
            <tr key={i}>
              <td className="px-4 py-2">
                <div className="w-16 h-16 relative">
                  {comp.parcel_id && (
                    <ParcelImagePrimary parcel_id={comp.parcel_id} />
                  )}
                </div>
              </td>
              <td className="px-4 py-2">Comp {i + 1}</td>
              <td className="px-4 py-2">{comp.address}</td>
              <td className="px-4 py-2">
                {comp.neighborhood_code} – {comp.neighborhood_group}
              </td>
              <td className="px-4 py-2">{comp.land_use}</td>
              <td className="px-4 py-2">
                ${Number(comp.net_selling_price || 0).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                ${Number(comp.adjusted_price || 0).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {comp.date_of_sale
                  ? new Date(comp.date_of_sale).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2">{comp.cdu}</td>
              <td className="px-4 py-2">
                {comp.total_living_area?.toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {comp.miles_distance?.toFixed(2)} mi
              </td>
              <td className="px-4 py-2">{comp.gower_dist?.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
