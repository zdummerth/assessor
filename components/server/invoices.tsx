import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import FormattedDate from "../ui/formatted-date";
import { Check, XCircle } from "lucide-react";
import Link from "next/link";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

export default async function Invoices({ page = 1 }: { page: number }) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase.from("invoices").select("*, invoice_line_item(*)");

  const { data, error } = await query
    .order("created_at", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching invoices</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((item: any) => {
          // get sum of invoice_line_item.amount
          const total = item.invoice_line_item.reduce(
            (acc: number, curr: any) => acc + curr.amount,
            0
          );
          return (
            <Card key={item.id}>
              <div className="pb-3">
                <Link href={`/invoices/${item.id}`} className="text-blue-500">
                  <h3 className="text-lg font-semibold">
                    Invoice Number: {item.id}
                  </h3>
                </Link>
                <span className="my-2">
                  Created: <FormattedDate date={item.created_at} />
                </span>
                <p className="text-sm">Customer: {item.customer_name}</p>
                <div className="flex gap-6 mt-2">
                  <p className="text-sm">Total: ${total.toFixed(2)}</p>
                  {item.paid_at ? (
                    <p className="text-sm text-green-500 flex items-center gap-1">
                      <Check size={16} /> Paid:{" "}
                      <FormattedDate date={item.paid_at} showTime />
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <XCircle size={16} /> Unpaid
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}
