import Link from "next/link";
import { getAppraisers } from "@/lib/data";

export default async function ParcelsAdvancedSearchPage() {
  const { data, error } = await getAppraisers();

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appraisers</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 gap-4 p-4 max-w-3xl mx-auto md:grid-cols-2 lg:grid-cols-3">
      {data.map((appraiser) => (
        <Link key={appraiser.id} href={`/appraisers/${appraiser.id}`}>
          <div className="text-center border p-4 rounded shadow shadow-foreground shadow-sm hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-semibold">{appraiser.name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
