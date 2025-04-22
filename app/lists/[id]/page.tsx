import { createClient } from "@/utils/supabase/server";
import graphql from "@/utils/supabase/graphql";
import type { Metadata, ResolvingMetadata } from "next";
import SearchResultsAttach from "@/components/server/search-results-attach";
import Search from "@/components/ui/search";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import { Suspense } from "react";
import DeleteListItemModal from "@/components/ui/lists/modal-delete";

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

  const { data, errors } = await graphql(
    `
      query GetListById($id: BigInt!) {
        listCollection(filter: { id: { eq: $id } }) {
          edges {
            node {
              id
              name
              list_parcel_yearCollection {
                edges {
                  node {
                    parcel_year {
                      parcel_number
                      year
                      owner_parcel_yearCollection {
                        edges {
                          node {
                            owner_name {
                              name
                              owner_addressCollection {
                                edges {
                                  node {
                                    address_1
                                    address_2
                                    city
                                    state
                                    zip
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      site_address_parcel_yearCollection(
                        filter: { is_primary: { eq: true } }
                      ) {
                        edges {
                          node {
                            site_address_master {
                              house_number
                              street_name
                              street_suffix
                              zip_code
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { id: 1 },
    supabase
  );

  if (errors) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching list</p>
        {/* <p>{error.message}</p> */}
      </div>
    );
  }

  const list = data.listCollection.edges[0].node;
  const parcel_years = list.list_parcel_yearCollection.edges;

  console.log(parcel_years);

  return (
    <div className="w-full p-4">
      <div className="flex gap-4 items-center mb-6">{list.name}</div>
      <div className="flex">
        <div className="p-4 md:w-[350px]">
          <div className="flex gap-4">
            {/* <div className="w-[85px] text-sm">
                <YearSelectFilter defaultValue={filters.year[0]} />
                </div> */}

            <div className="w-full">
              <p className="text-sm mb-4">
                Search parcel number or site address
              </p>
              <Search placeholder="search..." />
            </div>
          </div>
          {query && (
            <Suspense fallback={<BinocularsSkeleton />} key={`${query}`}>
              <SearchResultsAttach
                query={query}
                listId={parseInt(params.id)}
                year={2025}
              />
            </Suspense>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {parcel_years.map(({ node: { parcel_year } }: { node: any }) => {
            const site_address =
              parcel_year.site_address_parcel_yearCollection.edges[0]?.node;

            const site_address_master = site_address?.site_address_master;
            const display_address = site_address_master
              ? `${site_address_master.house_number} ${site_address_master.street_name} ${site_address_master.street_suffix} ${site_address_master.zip_code}`
              : "";
            return (
              <div
                className="flex flex-col w-full border rounded-md p-2"
                key={parcel_year.parcel_number}
              >
                <div className="flex justify-between items-center mb-2 gap-8">
                  <span>{parcel_year.parcel_number}</span>
                  <span>{parcel_year.year}</span>
                </div>
                <p className="text-sm mb-4">{display_address}</p>
                <p className="text-sm">
                  {
                    parcel_year.owner_parcel_yearCollection.edges[0].node
                      .owner_name.name
                  }
                </p>
                <div className="self-end">
                  <DeleteListItemModal
                    list_id={params.id.toString()}
                    parcel_number={parcel_year.parcel_number}
                    year={parcel_year.year}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
