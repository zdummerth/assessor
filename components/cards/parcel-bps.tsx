import { createClient } from "@/utils/supabase/server";
import PermitCard from "./permit";

export default async function ParcelPermits({
  parcel_number,
}: {
  parcel_number: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("bps")
      .select()
      .eq("parcel_number", parcel_number)
      .order("year", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch data");
    }

    console.log({ data, error });

    if (Array.isArray(data) && data.length === 0) {
      return <div>No Permits Found</div>;
    }

    return (
      <div>
        <div className="flex flex-col space-y-4">
          {data.map((permit: any) => (
            <PermitCard key={permit.id} permit={permit} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch sale</div>;
  }
}
