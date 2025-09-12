// app/components/ServerParcelSnapshot.tsx
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/database-types";
import { SearchX } from "lucide-react";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import FormattedDate from "@/components/ui/formatted-date";

// Placeholder (or real) clients
// import ParcelBasicsClient from "./placeholders/ParcelBasicsClient";
import ParcelAddressClient from "./address-client";
import ParcelLandUsesClient from "./land-use-client";
// import ParcelLandUsesClient from "./placeholders/ParcelLandUsesClient";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelSnapshot({
  parcelId,
  className = "",
  title = "Parcel Snapshot",
}: {
  parcelId: number;
  className?: string;
  title?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcels")
    .select(
      `
      *,
      test_parcel_land_uses(*),
      test_parcel_addresses(*, test_geocoded_addresses(*))
    `
    )
    .eq("id", parcelId)
    .single();

  if (error) {
    console.error("ServerParcelSnapshot error:", error);
    return (
      <section className={`rounded-lg border bg-white p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <SearchX className="w-4 h-4" />
          <span>Failed to load parcel: {error.message}</span>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className={`rounded-lg border bg-white p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="mt-3 text-sm text-gray-600">Parcel not found.</div>
      </section>
    );
  }

  // Normalize land uses
  const landUses = Array.isArray((data as any).test_parcel_land_uses)
    ? (data as any).test_parcel_land_uses
    : [];

  // Flatten nested addresses -> array your ParcelAddressClient can sort/display
  type AnyAddress = {
    id?: number | string | null;
    housenumber?: string | number | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | number | null;
    full_address?: string | null;
    effective_date?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  };

  const addrRows: any[] = Array.isArray((data as any).test_parcel_addresses)
    ? (data as any).test_parcel_addresses
    : [];

  const addresses: AnyAddress[] = addrRows.flatMap((row) => {
    const geos = row?.test_geocoded_addresses;
    const geoList = Array.isArray(geos) ? geos : geos ? [geos] : [];

    // If we have geocoded addresses, map those; else fallback to raw address fields if present
    if (geoList.length > 0) {
      return geoList.map((ga: any) => ({
        id: ga?.id ?? row?.id,
        housenumber: ga?.housenumber ?? ga?.house_number ?? null,
        street: ga?.street ?? ga?.street_name ?? ga?.road ?? null,
        city: ga?.city ?? ga?.town ?? ga?.village ?? null,
        state: ga?.state ?? ga?.region ?? null,
        postcode: ga?.postcode ?? ga?.zip ?? null,
        full_address: ga?.formatted ?? ga?.full_address ?? null,
        effective_date: row?.effective_date ?? null,
        updated_at: ga?.updated_at ?? row?.updated_at ?? null,
        created_at: ga?.created_at ?? row?.created_at ?? null,
      }));
    }

    // Fallback (if geocoded not present)
    return [
      {
        id: row?.id,
        housenumber:
          row?.housenumber ??
          row?.house_number ??
          row?.addr_housenumber ??
          null,
        street: row?.street ?? row?.street_name ?? row?.addr_street ?? null,
        city: row?.city ?? null,
        state: row?.state ?? null,
        postcode: row?.postcode ?? row?.zip ?? null,
        full_address: row?.full_address ?? row?.address_text ?? null,
        effective_date: row?.effective_date ?? null,
        updated_at: row?.updated_at ?? null,
        created_at: row?.created_at ?? null,
      } as AnyAddress,
    ];
  });

  const parcel: Parcel = data;

  return (
    <section className={`rounded-lg border bg-white p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

      {/* Top grid: basics, address list, land uses */}
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col">
          <ParcelNumber
            id={parcel.id}
            block={parcel.block}
            lot={parcel.lot}
            ext={parcel.ext}
          />
          {parcel.retired_at && (
            <p className="mt-2 bg-red-100 text-red-800 p-2 rounded print:hidden">
              Retired: <FormattedDate date={parcel.retired_at} />
            </p>
          )}
        </div>

        <div className="">
          <ParcelAddressClient addresses={addresses} />
        </div>

        <div className="">
          <ParcelLandUsesClient landUses={landUses} />
        </div>
      </div>
    </section>
  );
}
