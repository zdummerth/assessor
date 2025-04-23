import { createClient } from "@/utils/supabase/server";
import graphql from "@/utils/supabase/graphql";
import type { Metadata, ResolvingMetadata } from "next";
import SearchResultsAttach from "@/components/server/search-results-attach";
import Search from "@/components/ui/search";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";
import ListItems from "@/components/server/list-items";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    query?: string;
  }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return {
    title: id,
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const query = searchParams?.query;
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("list")
    .select("id, name")
    .eq("id", params.id);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching list</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No data found</p>
      </div>
    );
  }

  const list = data[0];

  return (
    <div className="w-full p-4">
      {/* @ts-ignore */}
      <div className="flex gap-4 items-center mb-6">{list.name}</div>
      <div className="flex">
        <div className="p-4 md:w-[350px]">
          <div className="flex gap-4">
            <div className="w-full">
              <p className="text-sm mb-4">
                Search parcel number, site address, or owner
              </p>
              <Search placeholder="search..." />
            </div>
          </div>
          {query && (
            <Suspense fallback={<BinocularsSkeleton />} key={query}>
              <SearchResultsAttach
                query={query}
                listId={parseInt(params.id)}
                year={2025}
              />
            </Suspense>
          )}
        </div>
        <Suspense fallback={<BinocularsSkeleton />} key={query}>
          <ListItems listId={params.id} page={1} />
        </Suspense>
      </div>
    </div>
  );
}
