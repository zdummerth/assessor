import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import FormattedDate from "../ui/formatted-date";
import { Check, XCircle } from "lucide-react";
import Link from "next/link";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

export default async function Lists({ page = 1 }: { page: number }) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  //@ts-ignore
  let query = supabase.from("list").select("*, list_parcel_year(*)");

  const { data, error } = await query
    .order("name", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching lists</p>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log({ data, error });

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((item: any) => {
          // get sum of invoice_line_item.amount
          return (
            <Card key={item.id}>
              <div className="pb-3">
                <Link href={`/lists/${item.id}`} className="text-blue-500">
                  <h3 className="text-lg font-semibold">List Id: {item.id}</h3>
                </Link>
                <p className="text-sm">Name: {item.name}</p>
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}
