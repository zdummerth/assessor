import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "@/components/ui/parcel-number";
import FormattedDate from "@/components/ui/formatted-date";
import Address from "@/components/ui/address";

export default async function SearchResults({
  query = "",
  active = false,
}: {
  query?: string;
  active?: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    //@ts-ignore
    .rpc("search_parcels", { prefix: query, active })
    .order("retired", { nullsFirst: true })
    .order("parcel")
    .limit(9);

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16 space-y-2">
        <SearchX className="w-16 h-16 text-gray-300" />
        <p className="text-lg font-medium text-gray-600">
          Error fetching parcels
        </p>
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16 space-y-2">
        <SearchX className="w-16 h-16 text-gray-300" />
        <p className="text-lg text-gray-500">
          No parcels found for{" "}
          <span className="font-semibold text-gray-700">"{query}"</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {data.map((item: any) => (
        <div
          key={item.parcel}
          // fixed height on lg screens, hide overflow
          className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full lg:h-[300px] overflow-hidden"
        >
          {/* ─── TOP (always visible) ─────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <ParcelNumber parcelNumber={item.parcel} />
              {item.retired ? (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  Retired <FormattedDate date={item.retired} />
                </span>
              ) : (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-900 text-sm font-medium px-2 py-1 rounded">
                {item.neighborhood}
              </span>
              <span className="bg-teal-50 text-teal-900 text-sm font-medium px-2 py-1 rounded">
                {item.land_use}
              </span>
              <span className="bg-teal-50 text-teal-900 text-sm font-medium px-2 py-1 rounded">
                {item.prop_class}
              </span>
              <span className="text-sm font-semibold ml-auto">
                ${item.appraised_total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ─── BOTTOM (scrollable) ─────────────────────────────── */}
          <div className="mt-3 overflow-y-auto flex-1 space-y-4 text-sm pr-1">
            {/* Addresses */}
            <div className="space-y-1">
              {item.addresses.map((addr: any) => (
                <Address
                  key={`${addr.house_number}-${addr.street_name}-${addr.zip_code}-${addr.street_suffix}`}
                  address={`${addr.house_number} ${addr.street_name || ""} ${addr.street_suffix} ${addr.zip_code}`}
                />
              ))}
            </div>

            {/* Appraiser Info */}
            <div className="border-t border-gray-100 pt-3 space-y-1">
              <p className="font-medium">{item.appraiser}</p>
              <p>{item.appraiser_email}</p>
              <p>{item.appraiser_phone}</p>
            </div>

            {/* Owners */}
            {item.names.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="font-medium mb-1">Owners:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {item.names.map((owner: string, i: number) => (
                    <li key={owner + i}>{owner}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
