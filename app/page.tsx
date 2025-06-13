import Search from "@/components/ui/search";
import SearchResultsAll from "@/components/server/search-results-all";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";
import ParcelSearchClient from "@/components/parcel-search-client";

export default async function ProtectedPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query;

  return (
    <div className="p-4">
      {/* <div className="flex gap-4">
        <div className=" w-full md:w-[400px]">
          <p className="text-sm mb-4">
            Search parcel number, situs, or owner name
          </p>
          <Search placeholder="search..." />
        </div>
      </div>
      {query && (
        <Suspense fallback={<BinocularsSkeleton />} key={`${query}`}>
          <SearchResultsAll query={query} />
        </Suspense>
      )} */}
      <ParcelSearchClient />
    </div>
  );
}
