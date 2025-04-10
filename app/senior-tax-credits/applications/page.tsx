import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";
import { createClient } from "@/utils/supabase/server";
import ParcelNumber from "@/components/ui/parcel-number";
import { Grid, Card } from "@/components/ui/grid";

export default async function SeniorTaxCreditApplicationsPage() {
  const ITEMS_PER_PAGE = 6;
  const supabase = await createClient();

  const {
    data,
    count: remainingCount,
    error,
  } = await supabase
    .from("senior_tax_credits")
    .select(
      "*, parcel_reviews_2025(owner_name, owner_address2, owner_city, owner_state, owner_zip, site_street_number, prefix_directional, site_street_name, site_zip_code, appraised_total_2025)",
      {
        count: "exact",
        head: false,
      }
    )
    .limit(ITEMS_PER_PAGE);

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching applications</p>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log(data[0]);
  return (
    <div className="p-4">
      <div className="print:hidden">
        <h2 className="text-center text-xl my-4">
          Senior Tax Credit Applications 2025
        </h2>
      </div>
      <Grid>
        {data.map((item: any) => {
          const propertyAddress = `${item.parcel_reviews_2025.site_street_number} ${item.parcel_reviews_2025.prefix_directional || ""} ${item.parcel_reviews_2025.site_street_name} ${item.parcel_reviews_2025.site_zip_code || ""}`;
          return (
            <Card key={item.parcel_number}>
              <div className="flex justify-between">
                <ParcelNumber parcelNumber={item.parcel_number} />
                <div>{item.status}</div>
              </div>
              <p className="mt-2">{propertyAddress}</p>
              <div className="mt-2">
                <p>{item.parcel_reviews_2025.owner_name}</p>
                <div>
                  <div>{item.parcel_reviews_2025.owner_address2}</div>
                  <div>
                    {`${item.parcel_reviews_2025.owner_city} ${item.parcel_reviews_2025.owner_state} ${item.parcel_reviews_2025.owner_zip}`}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}
