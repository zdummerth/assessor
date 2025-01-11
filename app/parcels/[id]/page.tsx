import { createClient } from "@/utils/supabase/server";
import ParcelCard from "@/components/cards/parcel-year";
import ParcelSales from "@/components/cards/parcel-sales";
import ParcelAppeals from "@/components/cards/parcel-appeals";
import ParcelPermits from "@/components/cards/parcel-bps";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("parcels")
      .select()
      .eq("parcel_number", id)
      .order("year", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch data");
    }

    // console.log({ data, error });

    if (Array.isArray(data) && data.length === 0) {
      return <div>Parcel not found</div>;
    }

    return (
      <div>
        <h1 className="text-2xl font-semibold">{id}</h1>
        <div className="flex flex-col space-y-4">
          {data.map((parcel: any) => (
            <ParcelCard
              key={`${parcel.parcel_number}-${parcel.year}`}
              data={parcel}
            />
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
            Sales
          </h2>

          <Suspense fallback={<div>loading sales...</div>}>
            <ParcelSales parcel_number={id} />
          </Suspense>
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
            Appeals
          </h2>

          <Suspense fallback={<div>loading appeals...</div>}>
            <ParcelAppeals parcel_number={id} />
          </Suspense>
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4 border-t pt-2">
            Permits
          </h2>

          <Suspense fallback={<div>loading permits...</div>}>
            <ParcelPermits parcel_number={id} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }
}
