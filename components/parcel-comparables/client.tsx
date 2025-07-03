import React from "react";
import { Tables } from "@/database-types";
import ParcelNumber from "../ui/parcel-number-updated";
import { House } from "lucide-react";
import Image from "next/image";

type Comparable = Tables<"test_comparables">;

const STORAGE_PREFIX =
  "https://ptaplfitlcnebqhoovrv.supabase.co/storage/v1/object/public/parcel-images/";

export default function ComparablesTable({ values }: { values: any[] }) {
  if (values.length === 0) return null;

  const subject = values[0];
  if (!subject?.subject_parcel) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No comparables found</p>
      </div>
    );
  }

  console.log("Parcel comparables datsa:", subject);

  const subjectImageName =
    subject.parcel_id.test_parcel_image_primary?.test_images?.image_url ||
    subject.parcel_id.test_parcel_images[0].test_images?.image_url ||
    null;

  const subjectImageUrl = subjectImageName
    ? STORAGE_PREFIX + subjectImageName
    : null;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Primary Image</th>
            <th className="px-4 py-2">Parcel</th>
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
                {subjectImageUrl ? (
                  <Image
                    src={subjectImageUrl}
                    alt="Placeholder"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <House className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </td>
            <td className="px-4 py-2">
              <ParcelNumber
                block={subject.subject_parcel.block}
                lot={subject.subject_parcel.lot}
                ext={subject.subject_parcel.ext}
                id={subject.subject_parcel.id}
              />
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
          {values.map((comp, i) => {
            //@ts-ignore
            const imageName =
              comp.parcel_id.test_parcel_image_primary?.test_images
                ?.image_url ||
              comp.parcel_id.test_parcel_images[0]?.test_images?.image_url ||
              null;
            const imageUrl = imageName ? STORAGE_PREFIX + imageName : null;
            return (
              <tr key={i}>
                <td className="px-4 py-2">
                  <div className="w-16 h-16 relative">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Placeholder"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <House className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <ParcelNumber
                    block={comp.parcel_id?.block}
                    lot={comp.parcel_id?.lot}
                    ext={comp.parcel_id?.ext}
                    id={comp.parcel_id?.id}
                  />
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
