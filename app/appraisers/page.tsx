import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function ParcelsAdvancedSearchPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appraisers")
    .select("*")
    .order("name")
    .neq("name", "DAVID DONALD")
    .neq("name", "CLASSIE BAINES");

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appraisers</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log("Appraisers data:", data[0].appraiser_appeal_stats);

  return (
    <div className="w-full grid grid-cols-1 gap-4 p-4 max-w-3xl mx-auto md:grid-cols-2 lg:grid-cols-3">
      {data.map((appraiser) => (
        <Link
          href={`/appraisers/${appraiser.id}`}
          key={appraiser.id}
          className="text-center border p-4 rounded shadow shadow-foreground shadow-sm hover:shadow-lg cursor-pointer"
        >
          {/* <Link href={`/appraisers/${appraiser.id}`}> */}
          <div>
            <h2 className="text-lg font-semibold">{appraiser.name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
