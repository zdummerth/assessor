import { createClient } from "@/utils/supabase/server";
import graphql from "@/utils/supabase/graphql";
import DeleteListItemModal from "@/components/ui/lists/modal-delete";
import { Suspense } from "react";

export default async function ListItems(props: {
  listId: string | number;
  page: number;
}) {
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
    { id: props.listId },
    supabase
  );

  if (errors) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching list</p>
      </div>
    );
  }

  if (data.listCollection.edges.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No data found</p>
      </div>
    );
  }

  const list = data.listCollection.edges[0].node;
  const parcel_years = list.list_parcel_yearCollection.edges;

  return (
    <div className="w-full p-4">
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
                  list_id={props.listId.toString()}
                  parcel_number={parcel_year.parcel_number}
                  year={parcel_year.year}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
