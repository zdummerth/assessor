// components/comparables/Comparables.tsx
import { createClient } from "@/utils/supabase/server";
import ComparablesTable from "@/components/ui/comparables/table";

export default async function Comparables({
  page = 1,
  parcel,
}: {
  page?: number;
  parcel: string;
}) {
  const limit = 40;
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  const { data, error } = await supabase
    // @ts-ignore
    .from("comparables")
    .select("*")
    .eq("subject_parcel", parcel)
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching comparables</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No comparables found</p>
      </div>
    );
  }

  //@ts-ignore
  return <ComparablesTable data={data} />;
}
