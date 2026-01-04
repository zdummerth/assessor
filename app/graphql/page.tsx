import { createClient } from "@/lib/supabase/server";
import graphql from "@/lib/supabase/graphql";

const SalesWithStructures: React.FC = async () => {
  const supabase = await createClient();

  const query = `
      query GetParcelSales($parcelId: BigInt!) {
  test_parcel_salesCollection(filter: { parcel_id: { eq: $parcelId } }) {
    edges {
      node {
        parcel_id
        test_sales {
          sale_id
          date_of_sale
          net_selling_price
          test_sales_sale_typesCollection {
            edges {
              node {
                effective_date
                test_sale_types {
                  id
                  is_valid
                  created_at
                  retired_at
                }
              }
            }
          }
        }
      }
    }
  }
  test_structuresCollection(filter: {
    id: {eq: $parcelId}
  }) {
    edges {
      node {
        year_built
        id
        full_bathrooms
        half_bathrooms
        test_conditionsCollection {
          edges {
            node {
              id
              condition
              effective_date
              created_at
            }
          }
        }
      }
    }
  }
}
  `;

  const res = await graphql(
    query,
    {
      parcelId: 58151900,
    },
    supabase
  );

  console.log("Fetched data:", res);
  // console.log("Fetched data:", session);
  return <div className="container mx-auto p-4">graphql testing</div>;
};

export default SalesWithStructures;
