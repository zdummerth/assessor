import { createClient } from "@/utils/supabase/server";

export default async function ParcelSales({
  parcel_number,
}: {
  parcel_number: string;
}) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("sales")
      .select()
      .eq("parcel_number", parcel_number)
      .order("date_of_sale", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch sales");
    }

    // console.log({ data, error });

    if (Array.isArray(data) && data.length === 0) {
      return <div>No Sales Found</div>;
    }

    return (
      <div>
        <div className="flex flex-col space-y-4">
          {data.map((sale: any) => (
            <div
              key={sale.id}
              className="flex flex-col space-y-2 border-t pt-2"
            >
              <div>
                <span className="font-semibold">Net Selling Price:</span> $
                {sale.net_selling_price.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {sale.date_of_sale}
              </div>
              <div>
                <span className="font-semibold">Type:</span>{" "}
                {sale.sale_type || "Pending Review"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch sales</div>;
  }
}
