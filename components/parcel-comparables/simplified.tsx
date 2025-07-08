"use client";

import Image from "next/image";
import { House } from "lucide-react";
import ParcelNumber from "../ui/parcel-number-updated";
import FormattedDate from "../ui/formatted-date";

const STORAGE_PREFIX =
  "https://ptaplfitlcnebqhoovrv.supabase.co/storage/v1/object/public/parcel-images/";

export default function ComparablesTableSimplified({
  values,
}: {
  values: any[];
}) {
  if (!values || values.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No comparables found
      </div>
    );
  }

  const subject = values[0];
  const comparables = values;

  const getImageUrl = (record: any) => {
    const imageName =
      record?.parcel_id?.test_parcel_image_primary?.test_images?.image_url ||
      record?.parcel_id?.test_parcel_images?.[0]?.test_images?.image_url ||
      null;
    return imageName ? STORAGE_PREFIX + imageName : null;
  };

  const subjectImageName =
    subject.subject_parcel?.test_parcel_image_primary?.test_images?.image_url ||
    subject.subject_parcel?.test_parcel_images?.[0]?.test_images?.image_url ||
    null;

  const subjectImageUrl = subjectImageName
    ? STORAGE_PREFIX + subjectImageName
    : null;

  const adjustedPrices = comparables
    .map((c) => Number(c.adjusted_sale_price || 0))
    .filter((n) => n > 0);
  const salePrices = comparables
    .map((c) => Number(c.net_selling_price || 0))
    .filter((n) => n > 0);

  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const average = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  const AdjustmentCell = ({ value }: { value: number }) => {
    if (value > 0)
      return (
        <div className="text-xs text-green-600 mt-1">
          +${Math.round(value).toLocaleString()}
        </div>
      );
    if (value < 0)
      return (
        <div className="text-xs text-red-600 mt-1">
          -${Math.abs(Math.round(value)).toLocaleString()}
        </div>
      );
    return <div className="text-xs text-gray-500 mt-1">$0</div>;
  };

  return (
    <div className="w-full p-1">
      {/* Subject Header */}
      <div className="mb-6 p-4 border rounded bg-yellow-50">
        <div className="flex flex-wrap gap-6 items-start justify-between">
          <div className="w-48 h-48 relative rounded overflow-hidden">
            {subjectImageUrl ? (
              <Image
                src={subjectImageUrl}
                alt="Subject Image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <House className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[300px]">
            <div className="text-lg font-semibold mb-1">
              Current Value: $
              {subject.subject_appraised_total?.toLocaleString()}
            </div>
            <ParcelNumber {...subject.subject_parcel} />
            <div>{subject.subject_address}</div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              <div>Year Built: {subject.subject_year_built}</div>
              <div>
                Garage Area: {subject.subject_garage_area?.toLocaleString()} sq
                ft
              </div>
              <div>GLA: {subject.subject_gla?.toLocaleString()} sq ft</div>
              <div>Stories: {subject.subject_story}</div>
              <div>CDU: {subject.subject_cdu}</div>
              <div>Year Built: {subject.subject_year_built}</div>
              <div>Land Use: {subject.subject_land_use}</div>
              <div>
                Neighborhood: {subject.subject_neighborhood} –{" "}
                {subject.subject_neighborhood_group}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="font-semibold mb-2">Price Summary</div>
            <table className="text-sm text-left border w-full max-w-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 border">Type</th>
                  <th className="px-2 py-1 border">Median</th>
                  <th className="px-2 py-1 border">Average</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Sale Price</td>
                  <td className="px-2 py-1 border">
                    ${Math.round(median(salePrices)).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 border">
                    ${Math.round(average(salePrices)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border font-semibold">Adj. Price</td>
                  <td className="px-2 py-1 border text-green-800 font-semibold">
                    ${Math.round(median(adjustedPrices)).toLocaleString()}{" "}
                    <br />
                    <span className="text-xs">Recommended</span>
                  </td>
                  <td className="px-2 py-1 border">
                    ${Math.round(average(adjustedPrices)).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comparables Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Sale</th>
              <th className="px-3 py-2">GLA</th>
              <th className="px-3 py-2">Garage</th>
              <th className="px-3 py-2">Story</th>
              <th className="px-3 py-2">CDU</th>
              <th className="px-3 py-2">Built</th>
              <th className="px-3 py-2">Use</th>
              <th className="px-3 py-2">Nbhd</th>
              <th className="px-3 py-2">Dist</th>
            </tr>
          </thead>
          <tbody>
            {comparables.map((row, i) => {
              const imageUrl = getImageUrl(row);
              return (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">
                    <div className="w-24 h-24 relative rounded overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Parcel Image"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <House className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <ParcelNumber {...row.parcel_id} />
                    <div>{row.address?.split(",")[0]}</div>
                  </td>
                  <td className="px-3 py-2">
                    <FormattedDate date={row.date_of_sale} month="short" />
                    <div>${Number(row.net_selling_price).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Adj: $
                      {Math.round(row.adjusted_sale_price).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.gla?.toLocaleString()}</div>
                    <AdjustmentCell value={row.gla_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.garage_area?.toLocaleString()}</div>
                    <AdjustmentCell value={row.garage_area_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.story}</div>
                    <AdjustmentCell value={row.story_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.cdu}</div>
                    <AdjustmentCell value={row.cdu_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.year_built}</div>
                    <AdjustmentCell value={row.year_built_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.land_use}</div>
                    <AdjustmentCell value={row.land_use_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    <div>{row.neighborhood_group}</div>
                    <AdjustmentCell value={row.neighborhood_group_adjustment} />
                  </td>
                  <td className="px-2 py-2">
                    {row.miles_distance?.toFixed(2)} mi
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
