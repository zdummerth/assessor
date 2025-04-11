import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import StructureModal from "@/components/ui/structures/modal";
import BuildingPermitModal from "@/components/ui/building-permits/modal";
import AppraisedValueModal from "@/components/ui/appraised-value-modal";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number";
import AppealModal from "@/components/ui/appeals/modal";
import SaleModal from "@/components/ui/sales/modal";
import { SearchX } from "lucide-react";

const applyFiltersToQuery = (
  query: any,
  year: string,
  neighborhood: string,
  appraiser: string,
  status: string
) => {
  query.eq("tax_status", "T");

  if (year !== "Any") {
    query = query.eq("parcel_review_sales.sale_year", year);
  }

  if (neighborhood !== "Any") {
    query = query.eq("neighborhood_int", neighborhood);
  }

  if (appraiser !== "Any") {
    query = query.eq("appraiser_id", appraiser);
  }
  if (status !== "Any") {
    if (status === "status_pending") {
      query = query.is("parcel_review_sales.sale_type", null);
    } else {
      query = query.eq("parcel_review_sales.sale_type", status);
    }
  }

  return query;
};

export default async function SalesGrid({
  page = 1,
  appraiser = "Any",
  status = "Any",
  year = "Any",
  neighborhood = "Any",
}: {
  page: number;
  appraiser: string;
  status: string;
  year: string;
  neighborhood: string;
}) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("parcel_reviews_2025")
    .select(
      "*, parcel_review_sales!inner(*), current_structures(*), bps(*), parcel_review_appeals(*)"
    );

  query = applyFiltersToQuery(query, year, neighborhood, appraiser, status);
  const { data, error, count } = await query
    .order("parcel_number", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching sales</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-8">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">No results found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((parcel: any) => {
          const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <Card key={parcel.parcel_number}>
              <div className="mt-2 flex flex-col items-center border-b border-foreground pb-3">
                <Address address={displayAddress} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>{parcel.occupancy}</span>
                <ParcelNumber parcelNumber={parcel.parcel_number} />
                <span>{parcel.neighborhood}</span>
              </div>
              <p className="text-sm">{parcel.prop_class}</p>
              <div className="mt-6">
                <AppraisedValueModal parcel={parcel} address={displayAddress} />
              </div>

              <div className="mt-2">
                <SaleModal
                  sales={parcel.parcel_review_sales}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>

              <div className="mt-2">
                <StructureModal
                  structures={parcel.current_structures}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>
              <div className="mt-2">
                <BuildingPermitModal
                  permits={parcel.bps}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>
              <div className="mt-2">
                <AppealModal
                  appeals={parcel.parcel_review_appeals}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}

export async function Count({
  appraiserId,
  year = "Any",
  neighborhood = "Any",
  status = "Any",
  appraiser = "Any",
}: {
  appraiserId: number;
  year: string;
  neighborhood: string;
  status: string;
  appraiser: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("parcel_reviews_2025")
    .select("*, parcel_review_sales!inner(*)", {
      count: "estimated",
      head: true,
    });

  query = applyFiltersToQuery(query, year, neighborhood, appraiser, status);
  const { error, count } = await query.limit(1); // I was getting timeout error without setting limit

  if (error && !count) {
    console.error("Error fetching count:", error);
    return <>Failed to fetch count</>;
  }
  return <>{count}</>;
}
