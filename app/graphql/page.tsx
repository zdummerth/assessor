import { createClient } from "@/utils/supabase/server";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const fetchQuery = async (operation: string, variables: any, supabase: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(`${SUPABASE_URL}/graphql/v1`, {
    method: "POST",
    //@ts-ignore
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session?.access_token ?? SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      query: operation,
      variables,
    }),
  });

  return await response.json();
};
const WardsList: React.FC = async () => {
  const supabase = await createClient();

  const query = `
      query {
        parcel_reviews_2025Collection(first: 3) {
          edges {
            node {
              parcel_number,
              bpsCollection(first: 3) {
                edges {
                  node {
                    id,
                    permit_type,
                    issued_date
                  }
                }
              }
            }
          }
        }
      }
  `;

  const res = await fetchQuery(query, {}, supabase);

  console.log("Fetched data:", res);
  // console.log("Fetched data:", session);
  return <div className="container mx-auto p-4">graphql testing</div>;
};

export default WardsList;
