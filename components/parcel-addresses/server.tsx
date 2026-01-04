import { SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ClientParcelAddress from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelAddress({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcel_addresses")
    .select("*, test_geocoded_addresses(*)")
    .eq("parcel_id", parcel.id);

  if (error || !data || data.length === 0) {
    console.error(error);
    return (
      <section className="">
        <h3 className="text-sm font-semibold text-gray-800">Address</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <SearchX className="w-4 h-4" />
          <span>Error fetching address</span>
        </div>
        {error?.message && (
          <div className="mt-1 text-xs text-red-700">{error.message}</div>
        )}
      </section>
    );
  }

  const address = data[0].test_geocoded_addresses;

  return (
    <section className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-gray-800">Address</h3>
      <div className="mt-3">
        <ClientParcelAddress address={address} />
      </div>
    </section>
  );
}
