import Search from "@/components/ui/search";
import { YearSelectFilter } from "@/components/ui/filter-client";
import ParcelSearchResults from "@/components/ui/parcel-search-results";
// import SearchResults from "@/components/server/search-results";
import SearchResultsAll from "@/components/server/search-results-all";
import SearchResultsAttach from "@/components/server/search-results-attach";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";
import Notice from "@/components/ui/notices/fifteen/printable";
import { createClient } from "@/utils/supabase/server";
import { SearchX } from "lucide-react";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query;

  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("list")
    .select(
      `
      *, 
      list_parcel_year(*,
      parcel_year(
        appraised_total,
        year,
        parcel_number,
        owner_parcel_year(
         owner_name(*, owner_address(*))
        ),
        site_address_parcel_year (
          is_primary,
          site_address_master(*)
        )
      )
    )
    `
    )
    .eq("id", 1)
    .single();

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log({ data, error });

  return (
    <div className="flex">
      <div className="p-4 md:w-[300px] print:hidden">
        <div className="flex gap-4">
          <div className="w-full">
            <p className="text-sm mb-4">Search parcel number or site address</p>
            <Search placeholder="search..." />
          </div>
        </div>
        {query && (
          <Suspense fallback={<BinocularsSkeleton />} key={`${query}`}>
            {/* <SearchResults query={query} /> */}
            {/* <SearchResultsAttach query={query} /> */}
          </Suspense>
        )}
      </div>
      <div className="w-full flex flex-col gap-2 items-center justify-center m-2">
        {/* @ts-ignore */}
        {data.list_parcel_year.map((item: any) => {
          return <Notice data={item.parcel_year} key={item.parcel_number} />;
        })}
      </div>
    </div>
  );
}
