// app/components/ParcelDetails.tsx
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/database-types";
import { SearchX } from "lucide-react";
import FormattedDate from "@/components/ui/formatted-date";
import ParcelDetailsCardClient from "./details-card-client";

type Parcel = Tables<"test_parcels">;

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

type AnyLandUse = {
  id?: number | string | null;
  land_use?: string | null;
  effective_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
};

type ParcelNeighborhoodRow = {
  id: number;
  parcel_id: number;
  neighborhood_id: number;
  effective_date: string;
  end_date: string | null;
  created_at: string | null;
  neighborhoods?: {
    id: number;
    name: string | null;
    neighborhood: number | null;
    set_id: number | null;
    neighborhood_sets?: {
      id: number;
      name: string;
    } | null;
  } | null;
};

export default async function ParcelDetails({
  parcelId,
  className = "",
  title,
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
      test_parcel_addresses(*, test_geocoded_addresses(*)),
      test_parcel_neighborhoods(
        *,
        neighborhoods(
          *,
          neighborhood_sets(*)
        )
      )
    `
    )
    .eq("id", parcelId)
    .single();

  if (error) {
    console.error("ParcelDetails error:", error);
    return (
      <section className={`rounded-lg border p-4 ${className}`}>
        {title && (
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        )}
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
        {title && (
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        )}
        <div className="mt-3 text-sm text-gray-600">Parcel not found.</div>
      </section>
    );
  }

  // Normalize land uses
  const landUses: AnyLandUse[] = Array.isArray(
    (data as any).test_parcel_land_uses
  )
    ? (data as any).test_parcel_land_uses
    : [];

  // Normalize neighborhoods
  const neighborhoods: ParcelNeighborhoodRow[] = Array.isArray(
    (data as any).test_parcel_neighborhoods
  )
    ? (data as any).test_parcel_neighborhoods
    : [];

  // Flatten/normalize addresses
  const addrRows: any[] = Array.isArray((data as any).test_parcel_addresses)
    ? (data as any).test_parcel_addresses
    : [];

  const addresses: AnyAddress[] = addrRows.flatMap((row) => {
    const geos = row?.test_geocoded_addresses;
    const geoList = Array.isArray(geos) ? geos : geos ? [geos] : [];
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
      } satisfies AnyAddress,
    ];
  });

  const parcel: Parcel = data;

  return (
    <section className={className}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}
      {parcel.retired_at && (
        <p className="mb-2 text-xs text-red-700">
          Retired: <FormattedDate date={parcel.retired_at} />
        </p>
      )}

      <ParcelDetailsCardClient
        parcelId={parcel.id}
        block={parcel.block}
        lot={parcel.lot}
        ext={parcel.ext}
        addresses={addresses}
        landUses={landUses}
        neighborhoods={neighborhoods}
      />
    </section>
  );
}
