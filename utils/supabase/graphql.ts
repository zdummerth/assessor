import { createClient } from "@/utils/supabase/server";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const graphql = async (operation: string, variables: any, supabase: any) => {
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

export default graphql;
