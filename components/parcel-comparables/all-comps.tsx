import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ComparablesTable from "./simplified";
import { Tables } from "@/database-types";

type Comparable = Tables<"test_comparables">;

export default async function ServerParcelComparables() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_comparables")
    .select(
      `*, 
      subject_parcel(*,
        test_parcel_image_primary(test_images(*)),
        test_parcel_images(test_images(*))
      ), 
      parcel_id(*, 
      test_parcel_image_primary(test_images(*)), 
      test_parcel_images(test_images(*))
      )`
    )
    .limit(500);

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcel values</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  // Group by subject_parcel_id
  const grouped = Object.values(
    data.reduce<Record<string, Comparable[]>>((acc, row) => {
      //@ts-ignore
      const key = row.subject_parcel.id?.toString() ?? "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {})
  );

  console.log("Grouped comparables:", grouped[0]);

  return (
    <div className="space-y-10 print:break-after-page">
      {grouped.map((group, idx) => (
        //@ts-ignore
        <div key={group[0]?.subject_parcel.id ?? idx}>
          <ComparablesTable values={group} />
        </div>
      ))}
    </div>
  );
}
