import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "../ui/grid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DataItem {
  appeal_appraiser: string | null;
  status: string;
  count: number;
}

export default async function SaleStats({
  searchParams,
}: {
  searchParams?: {
    year?: string;
    sortColumn?: string;
    sortDirection?: string;
  };
}) {
  const year = searchParams?.year || "Any";
  const sortColumn = searchParams?.sortColumn || "avg_sale_price";
  const sortDirection = searchParams?.sortDirection || "desc";
  const supabase = await createClient();

  const query = supabase
    .from("parcel_review_sales")
    .select(
      `pn:parcel_number.count(), id_count:id.count(), number_of_sales:document_number.count(), avg_sale_price:net_selling_price.avg(), min_sale_price:net_selling_price.min(), max_sale_price:net_selling_price.max(), parcel_reviews_2025!inner(neighborhood)`
    )
    .in("sale_type", [
      "Improved, open market, arms length",
      "Sale after foreclosure",
      "Bldg. Rehabbed prior to sale",
    ])
    .in("sale_year", [2023, 2024])
    .eq("parcel_reviews_2025.prop_class", "Residential");

  if (year !== "Any") {
    query.eq("year", year);
  }

  // query.order("appeal_appraiser", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching stats</p>
        <p>Please refresh page</p>
      </div>
    );
  }

  console.log(data);
  const sorted = data?.sort((a: any, b: any) => {
    if (sortColumn === "avg_sale_price") {
      return sortDirection === "asc"
        ? a.avg_sale_price - b.avg_sale_price
        : b.avg_sale_price - a.avg_sale_price;
    }
    if (sortColumn === "min_sale_price") {
      return sortDirection === "asc"
        ? a.min_sale_price - b.min_sale_price
        : b.min_sale_price - a.min_sale_price;
    }
    if (sortColumn === "max_sale_price") {
      return sortDirection === "asc"
        ? a.max_sale_price - b.max_sale_price
        : b.max_sale_price - a.max_sale_price;
    }
    if (sortColumn === "number_of_sales") {
      return sortDirection === "asc"
        ? a.number_of_sales - b.number_of_sales
        : b.number_of_sales - a.number_of_sales;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <Grid>
        {sorted?.map((item: any) => {
          const neighborhood = item.parcel_reviews_2025.neighborhood;
          return (
            <Card key={neighborhood}>
              <h3 className="text-lg font-semibold">{neighborhood}</h3>
              <p className="text-sm text-gray-500">
                Total Sales: {item.number_of_sales}
              </p>
              <p className="text-sm text-gray-500">
                Avg Sale Price: ${item.avg_sale_price?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Min Sale Price: ${item.min_sale_price?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Max Sale Price: ${item.max_sale_price?.toLocaleString()}
              </p>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}
