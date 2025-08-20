import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ClientParcelSales from "./client";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelSales({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  // Fetch sales for this parcel via the link table, and include sale-type history.
  // We join test_sales (fact) using the link table test_parcel_sales (inner),
  // and pull all types from test_sales_sale_types and test_sale_types.
  const { data, error } = await supabase
    //@ts-expect-error need updated types
    .from("test_sales")
    .select(
      `
      sale_id,
      date_of_sale,
      sale_year,
      net_selling_price,
      year,
      report_timestamp,
      test_parcel_sales!inner(
        parcel_id
      ),
      test_sales_sale_types(
        effective_date,
        test_sale_types(
          id,
          sale_type,
          is_valid
        )
      )
    `
    )
    .eq("test_parcel_sales.parcel_id", parcel.id)
    .order("date_of_sale", { ascending: false });

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching sales data</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  //@ts-expect-error need updated types
  return <ClientParcelSales parcel={parcel} data={data} />;
}
